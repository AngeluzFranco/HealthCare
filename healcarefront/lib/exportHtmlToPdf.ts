// Utilidad para exportar un nodo HTML a PDF usando jsPDF + html2canvas
// Instala primero: npm install jspdf html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportHtmlToPdf(elementId: string, fileName = "reporte-healthcare.pdf") {
  const input = document.getElementById(elementId);
  if (!input) throw new Error("No se encontró el elemento para exportar");
  // Scroll al top para evitar recortes
  window.scrollTo(0, 0);
  // Renderizar el nodo a canvas
  const canvas = await html2canvas(input, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();

  const img = new window.Image();
  img.src = imgData;
  img.onload = function () {
    const imgWidth = pageWidth;
    const imgHeight = (img.height * imgWidth) / img.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
  };
}
