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

const DARK_RED: [number, number, number] = [140, 20, 20];
const DARK_GREEN: [number, number, number] = [0, 102, 51];

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
    doc.setTextColor(DARK_RED[0], DARK_RED[1], DARK_RED[2]);
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
    // move createdBy below subtitle and left-aligned with a nicer label
    headerY += 14;
    if (createdBy) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Reporte generado por: ${createdBy}`, 40, headerY);
        headerY += 16;
    } else {
        headerY += 4;
    }

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
        headStyles: { fillColor: DARK_RED, textColor: 255 },
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

export async function generateCustodianHandoverPDF(rows: ReportRow[], options?: PdfOptions) {
    const title = options?.title ?? 'Reporte de Entrega de Custodio';
    const createdBy = options?.createdBy ?? '';
    const subtitle = options?.subtitle ?? `Generado: ${new Date().toLocaleString()}`;
    const filename = options?.filename ?? `reporte-entrega-custodio-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Try to load logo
    const logoDataUrl = await fetchImageDataUrl('/UTA/UTA.png');
    if (logoDataUrl) {
        try {
            const boxSize = 80;
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
                drawW = boxSize;
                drawH = Math.round(boxSize / ratio);
            } else if (ratio < 1) {
                drawH = boxSize;
                drawW = Math.round(boxSize * ratio);
            }

            const x = pageWidth - boxSize - 40 + (boxSize - drawW) / 2;
            const y = 30 + (boxSize - drawH) / 2;

            doc.setFillColor(255, 255, 255);
            doc.rect(pageWidth - boxSize - 40, 30, boxSize, boxSize, 'F');
            doc.addImage(logoDataUrl, 'PNG', x, y, drawW, drawH);
        } catch (e) {
            console.warn('Could not add logo to PDF', e);
        }
    }

    // Header
    doc.setFontSize(18);
    doc.setTextColor(DARK_RED[0], DARK_RED[1], DARK_RED[2]);
    doc.text(title, 40, 50);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let headerY = 70;

    doc.text(subtitle, 40, headerY);
    // move createdBy below subtitle and left-aligned
    headerY += 14;
    if (createdBy) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Reporte generado por: ${createdBy}`, 40, headerY);
        headerY += 16;
    } else {
        headerY += 4;
    }

    // Summary
    doc.setFontSize(10);
    doc.text(`Total de items transferidos: ${rows.length}`, 40, headerY);
    headerY += 16;

    // Add signature section info
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text('Este documento certifica la transferencia de responsabilidad de los siguientes bienes.', 40, headerY);

    // Table with custodian information
    const tableColumnStyles = {
        0: { cellWidth: 80 },  // code
        1: { cellWidth: 200 }, // name
        2: { cellWidth: 120 }, // current custodian
        3: { cellWidth: 120 }, // new custodian
    } as any;

    const head = [['Código', 'Nombre', 'Custodio Actual', 'Nuevo Custodio']];
    const body = rows.map(r => [
        String(r.code),
        String(r.name),
        String(r.currentCustodian ?? 'N/A'),
        String(r.newCustodian ?? 'N/A')
    ]);

    autoTable(doc as any, {
        startY: headerY + 12,
        head: head,
        body: body,
        styles: { fontSize: 9, textColor: 20 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        headStyles: { fillColor: DARK_RED, textColor: 255 },
        columnStyles: tableColumnStyles,
        margin: { left: 40, right: 40 },
    });

    // Get the final Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY + 40;

    // Signature section
    const sigY = Math.max(finalY, 600);
    doc.setFontSize(10);
    doc.setTextColor(0);

    // Previous custodian signature
    doc.line(60, sigY, 240, sigY);
    doc.text('Custodio Anterior', 100, sigY + 15);
    doc.setFontSize(8);
    doc.text('Firma y Fecha', 110, sigY + 28);

    // New custodian signature
    doc.line(pageWidth - 240, sigY, pageWidth - 60, sigY);
    doc.setFontSize(10);
    doc.text('Nuevo Custodio', pageWidth - 200, sigY + 15);
    doc.setFontSize(8);
    doc.text('Firma y Fecha', pageWidth - 190, sigY + 28);

    // Footer on each page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 80, pageHeight - 30);
    }

    // Save file
    doc.save(filename);
}

export async function generateReconciliationPDF(rows: ReportRow[], options?: PdfOptions) {
    const title = options?.title ?? 'Reporte de Reconciliación';
    const createdBy = options?.createdBy ?? '';
    const subtitle = options?.subtitle ?? `Generado: ${new Date().toLocaleString()}`;
    const filename = options?.filename ?? `reporte-reconciliacion-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Try to load logo
    const logoDataUrl = await fetchImageDataUrl('/UTA/UTA.png');
    if (logoDataUrl) {
        try {
            const boxSize = 80;
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
                drawW = boxSize;
                drawH = Math.round(boxSize / ratio);
            } else if (ratio < 1) {
                drawH = boxSize;
                drawW = Math.round(boxSize * ratio);
            }

            const x = pageWidth - boxSize - 40 + (boxSize - drawW) / 2;
            const y = 30 + (boxSize - drawH) / 2;

            doc.setFillColor(255, 255, 255);
            doc.rect(pageWidth - boxSize - 40, 30, boxSize, boxSize, 'F');
            doc.addImage(logoDataUrl, 'PNG', x, y, drawW, drawH);
        } catch (e) {
            console.warn('Could not add logo to PDF', e);
        }
    }

    // Header
    doc.setFontSize(18);
    doc.setTextColor(DARK_RED[0], DARK_RED[1], DARK_RED[2]);
    doc.text(title, 40, 50);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    let headerY = 70;

    doc.text(subtitle, 40, headerY);
    // move createdBy below subtitle and left-aligned
    headerY += 14;
    if (createdBy) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Reporte generado por: ${createdBy}`, 40, headerY);
        headerY += 16;
    } else {
        headerY += 4;
    }

    // Summary statistics
    const verifiedItems = rows.filter(r => r.status === 'verified').length;
    const unknownItems = rows.filter(r => r.status === 'unknown' || r.isUnknown).length;
    const totalScanned = rows.length;

    doc.setFontSize(10);
    doc.text(`Total de items escaneados: ${totalScanned}`, 40, headerY);
    headerY += 14;
    doc.setTextColor(DARK_GREEN[0], DARK_GREEN[1], DARK_GREEN[2]);
    doc.text(`Items verificados (en BD): ${verifiedItems}`, 40, headerY);
    headerY += 14;
    doc.setTextColor(DARK_RED[0], DARK_RED[1], DARK_RED[2]);
    doc.text(`Items desconocidos (NO en BD): ${unknownItems}`, 40, headerY);
    headerY += 20;

    doc.setTextColor(0, 0, 0);

    // Separate tables for verified and unknown items
    if (verifiedItems > 0) {
        doc.setFontSize(12);
        doc.setTextColor(DARK_GREEN[0], DARK_GREEN[1], DARK_GREEN[2]);
        doc.text('Items Verificados', 40, headerY);
        headerY += 16;

        const verifiedRows = rows.filter(r => r.status === 'verified');
        const verifiedBody = verifiedRows.map(r => [
            String(r.code),
            String(r.name),
            String(r.location ?? 'N/A'),
            String(r.condition ?? 'N/A'),
            String(r.stock ?? 0)
        ]);

        autoTable(doc as any, {
            startY: headerY,
            head: [['Código', 'Nombre', 'Ubicación', 'Condición', 'Stock']],
            body: verifiedBody,
            styles: { fontSize: 9, textColor: 20 },
            alternateRowStyles: { fillColor: [240, 255, 240] },
            headStyles: { fillColor: DARK_GREEN, textColor: 255 },
            columnStyles: {
                0: { cellWidth: 70 },  // Código
                1: { cellWidth: 200 }, // Nombre
                2: { cellWidth: 110 }, // Ubicación
                3: { cellWidth: 80 },  // Condición
                4: { cellWidth: 40 },  // Stock
            },
            margin: { left: 40, right: 40 },
        });

        headerY = (doc as any).lastAutoTable.finalY + 20;
    }

    if (unknownItems > 0) {
        doc.setFontSize(12);
        doc.setTextColor(DARK_RED[0], DARK_RED[1], DARK_RED[2]);
        doc.text('Items Desconocidos (NO en Base de Datos)', 40, headerY);
        headerY += 16;

        const unknownRows = rows.filter(r => r.status === 'unknown' || r.isUnknown);
        const unknownBody = unknownRows.map(r => [
            String(r.code),
            'CÓDIGO NO ENCONTRADO',
            new Date(r.scannedAt || '').toLocaleString()
        ]);

        autoTable(doc as any, {
            startY: headerY,
            head: [['Código Escaneado', 'Estado', 'Fecha de Escaneo']],
            body: unknownBody,
            styles: { fontSize: 9, textColor: 20 },
            alternateRowStyles: { fillColor: [255, 245, 245] },
            headStyles: { fillColor: DARK_RED, textColor: 255 },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 220 },
                2: { cellWidth: 160 },
            },
            margin: { left: 40, right: 40 },
        });
    }

    // Footer on each page
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`Página ${i} de ${pageCount}`, pageWidth - 80, pageHeight - 30);
    }

    // Save file
    doc.save(filename);
}

export default { generateAreaReportPDF, generateCustodianHandoverPDF, generateReconciliationPDF };
