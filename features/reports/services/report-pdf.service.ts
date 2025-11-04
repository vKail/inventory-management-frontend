import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportRow } from '@/features/reports/data/interfaces/report.interface';

export interface PdfOptions {
    title?: string;
    subtitle?: string;
    filename?: string;
    createdBy?: string;
    locationName?: string;
}

async function fetchImageDataUrl(url: string): Promise<string | null> {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error('fetchImageDataUrl error', e);
        return null;
    }
}

export async function generateAreaReportPDF(rows: ReportRow[], options?: PdfOptions) {
    const title = options?.title ?? 'Reporte de Área';
    const createdBy = options?.createdBy ?? '';
    const locationName = options?.locationName ?? '';
    const subtitle = options?.subtitle ?? `Generado: ${new Date().toLocaleString()}`;
    const filename = options?.filename ?? `reporte-area-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Try to load logo from public and draw it in a smaller square box (preserve aspect ratio)
    const logoDataUrl = await fetchImageDataUrl('/UTA/UTA.png');
    if (logoDataUrl) {
        try {
            // draw logo on top-right inside a square box
            const boxSize = 80; // target square box (increased a bit for better visibility)
            // create an HTMLImageElement to read natural dimensions
            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const i = new Image();
                i.onload = () => resolve(i);
                i.onerror = reject;
                i.src = logoDataUrl;
            });

            const ratio = img.width / img.height;
            let drawW = boxSize;
            let drawH = boxSize;
            if (ratio > 1) {
                // wider than tall
                drawW = boxSize;
                drawH = Math.round(boxSize / ratio);
            } else if (ratio < 1) {
                // taller than wide
                drawH = boxSize;
                drawW = Math.round(boxSize * ratio);
            }

            const x = pageWidth - boxSize - 40 + (boxSize - drawW) / 2;
            const y = 30 + (boxSize - drawH) / 2;

            // optional subtle white background for the square to ensure contrast
            doc.setFillColor(255, 255, 255);
            doc.rect(pageWidth - boxSize - 40, 30, boxSize, boxSize, 'F');

            doc.addImage(logoDataUrl, 'PNG', x, y, drawW, drawH);
        } catch (e) {
            console.warn('Could not add logo to PDF', e);
        }
    }

    // Header
    doc.setFontSize(18);
    doc.setTextColor(178, 34, 34); // institutional red
    doc.text(title, 40, 50);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    let headerY = 70;
    if (locationName) {
        doc.setFontSize(12);
        doc.text(`Productos registrados en la Ubicación: ${locationName}`, 40, headerY);
        headerY += 16;
    }

    doc.setFontSize(10);
    doc.text(subtitle, 40, headerY);
    if (createdBy) {
        doc.text(`Creado por: ${createdBy}`, pageWidth - 200, headerY);
    }
    headerY += 18;

    // Summary (total items)
    doc.setFontSize(10);
    doc.text(`Total de items: ${rows.length}`, 40, headerY);

    // Table
    const tableColumnStyles = {
        0: { cellWidth: 90 }, // code
        1: { cellWidth: 300 }, // name
        2: { cellWidth: 150 }, // location
    } as any;

    const head = [['Código', 'Nombre', 'Ubicación']];
    const body = rows.map(r => [String(r.code), String(r.name), String(r.location ?? '')]);

    autoTable(doc as any, {
        startY: headerY + 12,
        head: head,
        body: body,
        styles: { fontSize: 10, textColor: 20 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        headStyles: { fillColor: [178, 34, 34], textColor: 255 },
        columnStyles: tableColumnStyles,
        margin: { left: 40, right: 40 },
        didDrawPage: (data: any) => {
            // Footer
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.getHeight();
            doc.setFontSize(9);
            doc.setTextColor(120);
            const footerText = `Página ${data.pageNumber}`;
            doc.text(footerText, pageWidth - 80, pageHeight - 30);
        },
    });

    // Save file
    doc.save(filename);
}

export default { generateAreaReportPDF };
