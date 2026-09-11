import { FOOD_COLUMNS, CONTRACTOR_COLUMNS, parseFood, parseContractors, fetchSource } from "./source-records.mjs";

export async function syncFood(sql) {
  const source = await fetchSource("HR_plan_review.csv");
  const rows = parseFood(source.csv);
  if (rows.length < 1000) throw new Error(`Food extract yielded only ${rows.length} usable rows; archive was not changed`);
  const result = await sql.transaction([
    sql.query("SELECT pg_advisory_xact_lock(70101)"),
    sql.query(`WITH incoming AS (
      SELECT * FROM jsonb_to_recordset($1::jsonb) AS x(record_key text, ${FOOD_COLUMNS.map(c => `${c} text`).join(",")})
    ), saved AS (
      INSERT INTO fl_food_filings (record_key, ${FOOD_COLUMNS.join(",")}, first_seen, source_checked_at)
      SELECT record_key, ${FOOD_COLUMNS.join(",")}, statement_timestamp(), statement_timestamp() FROM incoming
      ON CONFLICT (record_key) DO UPDATE SET ${FOOD_COLUMNS.map(c => `${c}=EXCLUDED.${c}`).join(",")}, source_checked_at=statement_timestamp()
      RETURNING (xmax = 0) AS added
    ) SELECT count(*)::int AS processed, count(*) FILTER (WHERE added)::int AS added FROM saved`, [JSON.stringify(rows)]),
    sql.query(`INSERT INTO data_refreshes (dataset, checked_at, source_modified_at, source_rows) VALUES ('food',now(),$1,$2)
      ON CONFLICT (dataset) DO UPDATE SET checked_at=EXCLUDED.checked_at, source_modified_at=EXCLUDED.source_modified_at, source_rows=EXCLUDED.source_rows`, [source.modified, rows.length]),
  ]);
  return result[1][0];
}

export async function syncContractors(sql) {
  const source = await fetchSource("CONSTRUCTIONLICENSE_1.csv");
  const rows = parseContractors(source.csv);
  if (rows.length < 20000) throw new Error(`Contractor extract yielded only ${rows.length} active licenses; previous inventory was not changed`);
  // Both replacement statements commit together, so downloads never see an empty or partial list.
  await sql.transaction([
    sql.query("SELECT pg_advisory_xact_lock(70102)"),
    sql.query("DELETE FROM fl_contractors_current"),
    sql.query(`INSERT INTO fl_contractors_current (${CONTRACTOR_COLUMNS.join(",")}, website, email, phone, contact_form_url, contact_source_url, contact_checked_at, source_checked_at)
      SELECT ${CONTRACTOR_COLUMNS.map(c => `x.${c}`).join(",")}, coalesce(c.website,''), coalesce(c.email,''), coalesce(c.phone,''), coalesce(c.contact_form_url,''), coalesce(c.contact_source_url,''), c.contact_checked_at, now()
      FROM jsonb_to_recordset($1::jsonb) AS x(${CONTRACTOR_COLUMNS.map(c => `${c} text`).join(",")})
      LEFT JOIN contractor_contacts c ON c.license_number=x.license_number
        AND regexp_replace(upper(c.business_name),'[^A-Z0-9]','','g') = regexp_replace(upper(coalesce(nullif(trim(x.dba_name),''),x.licensee_name)),'[^A-Z0-9]','','g')`, [JSON.stringify(rows)]),
    sql.query(`INSERT INTO data_refreshes (dataset, checked_at, source_modified_at, source_rows) VALUES ('contractors',now(),$1,$2)
      ON CONFLICT (dataset) DO UPDATE SET checked_at=EXCLUDED.checked_at, source_modified_at=EXCLUDED.source_modified_at, source_rows=EXCLUDED.source_rows`, [source.modified, rows.length]),
  ]);
  return { processed: rows.length };
}
