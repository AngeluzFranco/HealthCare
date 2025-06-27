import { NextRequest, NextResponse } from "next/server"

// Este endpoint no funcionará en /app/api porque pdfkit/pdf-lib no es compatible con Edge Runtime.
// Solución: Generar el PDF en el frontend usando pdf-lib y descargarlo directamente.

// Puedes eliminar este archivo y usar el siguiente ejemplo en tu componente React:
/*
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function handleGeneratePDF(reportData, statisticsData, period) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const drawText = (text, x, y, size = 12) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  let y = 800;
  drawText('Reporte de Progreso - HealthCare', 50, y, 20); y -= 30;
  drawText(`Período: ${period}`, 50, y); y -= 20;
  drawText(`Total de hábitos registrados: ${reportData.totalHabits}`, 50, y); y -= 20;
  drawText(`Metas alcanzadas: ${reportData.goalsAchieved} de ${reportData.totalGoals}`, 50, y); y -= 30;
  drawText('Promedios diarios:', 50, y); y -= 20;
  drawText(`- Agua: ${reportData.averageDaily.water} ml`, 60, y); y -= 20;
  drawText(`- Ejercicio: ${reportData.averageDaily.exercise} min`, 60, y); y -= 20;
  drawText(`- Sueño: ${reportData.averageDaily.sleep} hrs`, 60, y); y -= 30;
  drawText('Rachas actuales:', 50, y); y -= 20;
  drawText(`- Agua: ${reportData.streaks.water} días`, 60, y); y -= 20;
  drawText(`- Ejercicio: ${reportData.streaks.exercise} días`, 60, y); y -= 20;
  drawText(`- Sueño: ${reportData.streaks.sleep} días`, 60, y); y -= 30;
  drawText('💡 Perspectivas:', 50, y); y -= 20;
  reportData.insights.forEach((insight, i) => {
    drawText(`• ${insight}`, 60, y - i * 20);
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reporte-healthcare.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
*/
export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Este endpoint no está disponible." }, { status: 404 })
}
