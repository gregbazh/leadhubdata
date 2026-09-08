export function toCsv(rows, columns) {
  const escape = value => {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [columns.join(","), ...rows.map(row => columns.map(column => escape(row[column])).join(","))].join("\n") + "\n";
}

export function csvStream(rows, columns) {
  const encoder = new TextEncoder();
  const header = columns.join(",") + "\n";
  let offset = 0;
  return new ReadableStream({
    start(controller) { controller.enqueue(encoder.encode(header)); },
    pull(controller) {
      if (offset >= rows.length) { controller.close(); return; }
      controller.enqueue(encoder.encode(toCsv(rows.slice(offset, offset + 256), columns).slice(header.length)));
      offset += 256;
    },
  });
}
