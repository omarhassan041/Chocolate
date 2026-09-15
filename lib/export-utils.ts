import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ========================================
// 1. EXPORT TO EXCEL (.xlsx)
// ========================================
export function exportToExcel(
  data: any[],
  filename: string,
  sheetName = "Sheet1",
) {
  if (!data || data.length === 0) {
    alert("Ma jiro xog la dhoofin karo");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  const colWidths = Object.keys(data[0]).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((row) => String(row[key] || "").length),
    );
    return { wch: Math.min(maxLength + 2, 50) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `${filename}-${date}.xlsx`);
}

// ========================================
// 2. EXPORT TO CSV
// ========================================
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    alert("Ma jiro xog la dhoofin karo");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  csvRows.push(headers.map((h) => `"${h}"`).join(","));

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      const escaped = String(value ?? "").replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  });

  const csvContent = csvRows.join("\n");
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  const date = new Date().toISOString().split("T")[0];
  link.setAttribute("download", `${filename}-${date}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ========================================
// 3. EXPORT TO PDF
// ========================================
export function exportToPDF(
  data: any[],
  filename: string,
  title: string,
  columns?: { header: string; dataKey: string }[],
) {
  if (!data || data.length === 0) {
    alert("Ma jiro xog la dhoofin karo");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(62, 39, 35);
  doc.text(title, 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`La sameeyay: ${new Date().toLocaleString("so-SO")}`, 14, 28);
  doc.text(`Wadarta: ${data.length}`, 14, 34);

  const tableColumns =
    columns ||
    Object.keys(data[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      dataKey: key,
    }));

  autoTable(doc, {
    head: [tableColumns.map((c) => c.header)],
    body: data.map((row) =>
      tableColumns.map((c) => String(row[c.dataKey] ?? "")),
    ),
    startY: 40,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: [62, 39, 35],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [250, 240, 235] },
  });

  const date = new Date().toISOString().split("T")[0];
  doc.save(`${filename}-${date}.pdf`);
}

// ========================================
// FORMAT FUNCTIONS
// ========================================
export function formatOrdersForExport(orders: any[]) {
  return orders.map((o) => ({
    "Order ID": o.id,
    "Magaca Macmiilka": o.customer?.name || o.customer_name || "",
    Email: o.customer?.email || o.customer_email || "",
    Telefoon: o.customer?.phone || o.customer_phone || "",
    "Nooca Gaarsiinta":
      o.delivery?.type === "delivery" ? "Gaarsiin" : "Soo qaadasho",
    Cinwaanka: o.delivery?.address || "",
    Magaalada: o.delivery?.city || "",
    "Lacagta ($)": o.total,
    Xaalada: o.status,
    Taariikhda: o.createdAt
      ? new Date(o.createdAt).toLocaleString("so-SO")
      : "",
  }));
}

export function formatMessagesForExport(messages: any[]) {
  return messages.map((m) => ({
    "Message ID": m.id,
    Magaca: m.name,
    Email: m.email,
    Mawduuca: m.subject,
    Fariinta: m.message,
    "La Akhriyay": m.read ? "Haa" : "Maya",
    Taariikhda: m.createdAt
      ? new Date(m.createdAt).toLocaleString("so-SO")
      : "",
  }));
}
