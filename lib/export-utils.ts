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
  columns?: { header: string; dataKey: string }[]
) {
  if (!data || data.length === 0) {
    alert("Ma jiro xog la dhoofin karo")
    return
  }

  const doc = new jsPDF({ orientation: "landscape" })

  // ============================================
  // HEADER — Logo + Cinwaanka Shirkadda
  // ============================================
  doc.setFillColor(62, 39, 35)  // Chocolate brown
  doc.rect(0, 0, 297, 35, "F")  // Full-width header background

  // Logo letter (M)
  doc.setFillColor(212, 165, 116)  // Accent color
  doc.circle(20, 17.5, 8, "F")     // Circle for M
  doc.setFontSize(16)
  doc.setTextColor(62, 39, 35)     // Dark brown M
  doc.setFont("helvetica", "bold")
  doc.text("M", 17, 21)

  // Company name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("MireChocolate", 35, 15)

  // Company tagline
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(245, 235, 225)
  doc.text("Handcrafted Cakes & Pastries", 35, 22)

  // Contact info
  doc.setFontSize(8)
  doc.text("123 Banadir, Mogadishu, Somalia", 35, 28)

  // ============================================
  // RIGHT SIDE — Taariikhda & Title
  // ============================================
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(title, 280, 12, { align: "right" })

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(
    `La sameeyay: ${new Date().toLocaleString("so-SO")}`,
    280,
    19,
    { align: "right" }
  )
  doc.text(`Wadarta: ${data.length}`, 280, 25, { align: "right" })

  // ============================================
  // TABLE — Column Widths Fiican
  // ============================================
  const tableColumns =
    columns ||
    Object.keys(data[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      dataKey: key,
    }))

  // Column widths — qoraalka wuu buuxiyaa
  const columnStyles: { [key: string]: any } = {}
  tableColumns.forEach((col, index) => {
    if (col.dataKey === "Order ID") columnStyles[index] = { cellWidth: 32 }
    else if (col.dataKey === "Magaca Macmiilka") columnStyles[index] = { cellWidth: 32 }
    else if (col.dataKey === "Email") columnStyles[index] = { cellWidth: 42 }
    else if (col.dataKey === "Telefoon") columnStyles[index] = { cellWidth: 24 }
    else if (col.dataKey === "Nooca Gaarsiinta") columnStyles[index] = { cellWidth: 26 }
    else if (col.dataKey === "Cinwaanka") columnStyles[index] = { cellWidth: 30 }
    else if (col.dataKey === "Magaalada") columnStyles[index] = { cellWidth: 22 }
    else if (col.dataKey === "Lacagta ($)") columnStyles[index] = { cellWidth: 22 }
    else if (col.dataKey === "Xaalada") columnStyles[index] = { cellWidth: 22 }
    else if (col.dataKey === "Taariikhda") columnStyles[index] = { cellWidth: 40 }
  })

  autoTable(doc, {
    head: [tableColumns.map((c) => c.header)],
    body: data.map((row) =>
      tableColumns.map((c) => String(row[c.dataKey] ?? ""))
    ),
    startY: 42,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [62, 39, 35],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [250, 240, 235],
    },
    columnStyles,
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages()
      const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber

      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text(
        `Bogga ${currentPage} / ${pageCount}`,
        14,
        doc.internal.pageSize.height - 8
      )
      doc.text(
        "© MireChocolate 2026",
        283,
        doc.internal.pageSize.height - 8,
        { align: "right" }
      )
    },
  })

  const date = new Date().toISOString().split("T")[0]
  doc.save(`${filename}-${date}.pdf`)
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
