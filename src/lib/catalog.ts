import { cache } from "react";
import { getSql } from "@/lib/db";
import { oneTimeProducts, type OneTimeProduct } from "@/lib/products";

export const getCatalog = cache(async (): Promise<OneTimeProduct[]> => {
  const sql = getSql();
  const [refreshes, mix, ...counts] = await Promise.all([
    sql.query("SELECT dataset, checked_at FROM data_refreshes"),
    sql.query("SELECT facility_type AS label, count(*)::int AS count FROM fl_food_available GROUP BY 1 ORDER BY 2 DESC"),
    ...oneTimeProducts.map(p => sql.query(`SELECT count(*)::int AS total,
      count(*) FILTER (WHERE coalesce(email,'') <> '')::int AS emails,
      count(*) FILTER (WHERE coalesce(phone,'') <> '')::int AS phones,
      count(*) FILTER (WHERE coalesce(email,'') <> '' OR coalesce(phone,'') <> '')::int AS reachable,
      count(DISTINCT nullif(lower(trim(email)),''))::int AS unique_emails
      ${p.id !== "fl-contractors" ? ", count(DISTINCT nullif(county,''))::int AS counties, max(to_date(application_date,'MM/DD/YYYY'))::text AS latest_application" : ""}
      FROM ${p.table}`)),
  ]);
  return oneTimeProducts.map((p, i) => {
    const stat = counts[i][0];
    const refreshed = refreshes.find(r => r.dataset === (p.id === "fl-contractors" ? "contractors" : "food"));
    const date = refreshed ? new Date(refreshed.checked_at).toISOString() : undefined;
    return {
      ...p, leadCount: stat.total, verifiedContactCount: stat.reachable, reachableCount: stat.reachable,
      phoneCount: stat.phones, emailCount: stat.emails, uniqueEmailCount: stat.unique_emails,
      countyCount: stat.counties, latestApplication: stat.latest_application, updatedAt: date,
      mix: p.id === "fl-restaurants" ? mix.map(r => ({ label: r.label || "Not specified on filing", count: r.count })) : undefined,
    };
  });
});

export async function getCatalogProduct(id: string) {
  return (await getCatalog()).find(p => p.id === id)!;
}
