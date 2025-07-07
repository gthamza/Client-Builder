// /lib/generateInvoicePdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Base64 logo or direct image URL (optional)
const LOGO_URL = "./src/public/images/logo.jpg"; // or import logo from "../assets/logo.png";

export async function generateInvoicePdf(invoice: any) {
  const doc = new jsPDF();

  // Optional: Add Logo
  try {
    const image = await loadImageAsBase64(LOGO_URL);
    doc.addImage(image, "PNG", 150, 10, 40, 20);
  } catch (e) {
    console.warn("Logo not found or failed to load.");
  }

  // Company Info
  doc.setFontSize(12);
  doc.text("Your Company Name", 14, 20);
  doc.text("123 Business Street", 14, 26);
  doc.text("City, Country", 14, 32);
  doc.text("Email: contact@yourcompany.com", 14, 38);
  doc.text("Phone: +123-456-7890", 14, 44);

  // Invoice Info
  doc.setFontSize(16);
  doc.text("INVOICE", 14, 55);

  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoice.invoice_number}`, 14, 65);
  doc.text(
    `Date: ${new Date(invoice.issue_date).toLocaleDateString()}`,
    14,
    70
  );
  doc.text(`Due: ${new Date(invoice.due_date).toLocaleDateString()}`, 14, 75);

  // Client Info
  doc.setFontSize(12);
  doc.text("Bill To:", 14, 85);
  doc.text(`${invoice.client?.name || "N/A"}`, 14, 90);
  doc.text(`${invoice.client?.email || ""}`, 14, 95);

  // Table of Items
  autoTable(doc, {
    startY: 105,
    head: [["Item", "Qty", "Rate", "Amount"]],
    body: invoice.items.map((item: any) => [
      item.description,
      item.quantity.toString(),
      `$${item.rate.toFixed(2)}`,
      `$${(item.quantity * item.rate).toFixed(2)}`,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [40, 40, 40] },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY;

  const subtotal = invoice.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.rate,
    0
  );
  const taxRate = 0.13; // 13% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  doc.setFontSize(12);
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY + 10);
  doc.text(`Tax (13%): $${tax.toFixed(2)}`, 150, finalY + 16);
  doc.setFontSize(14);
  doc.text(`Total: $${total.toFixed(2)}`, 150, finalY + 26);

  // Footer
  doc.setFontSize(10);
  doc.text("Thank you for shopping with us!", 14, finalY + 40);
  doc.text("This is a system-generated invoice.", 14, finalY + 45);

  // Save
  doc.save(`${invoice.invoice_number}.pdf`);
}

// Utility to convert image to base64 for logo
function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context not found.");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}
