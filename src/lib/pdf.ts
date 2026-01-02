import jsPDF from 'jspdf';
import type { Incident } from '@/types';

export async function generateIncidentPDF(incident: Incident): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Add watermark to current page
    const addWatermark = () => {
        doc.saveGraphicsState();
        doc.setGState(new (doc as unknown as { GState: new (options: { opacity: number }) => object }).GState({ opacity: 0.08 }));
        doc.setFontSize(50);
        doc.setTextColor(59, 130, 246);
        doc.setFont('helvetica', 'bold');

        // Rotate and center the watermark
        const text = 'AEGIS INCIDENTS';
        const textWidth = doc.getTextWidth(text);
        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;

        doc.text(text, centerX - textWidth / 2, centerY, { angle: 45 });
        doc.restoreGraphicsState();
    };

    // Add watermark to first page
    addWatermark();

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color[0], color[1], color[2]);

        const lines = doc.splitTextToSize(text, contentWidth);

        // Check if we need a new page
        const lineHeight = fontSize * 0.5;
        if (y + (lines.length * lineHeight) > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            addWatermark();
            y = margin;
        }

        doc.text(lines, margin, y);
        y += lines.length * lineHeight + 4;
    };

    const addSpacer = (height: number = 8) => {
        y += height;
    };

    // Title
    addText(incident.title, 20, true, [30, 64, 175]);
    addSpacer(4);

    // Metadata bar
    doc.setFillColor(240, 240, 245);
    doc.rect(margin, y, contentWidth, 20, 'F');
    y += 14;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    const severityColors: Record<string, number[]> = {
        'CRITICAL': [220, 38, 38],
        'HIGH': [234, 88, 12],
        'MEDIUM': [202, 138, 4],
        'LOW': [22, 163, 74],
    };

    const metaText = `Type: ${incident.incident_type}  |  Severity: ${incident.severity}  |  Status: ${incident.status}`;
    doc.text(metaText, margin + 4, y);
    y += 16;

    // Date info
    const startDate = new Date(incident.start_time).toLocaleString();
    const endDate = incident.end_time ? new Date(incident.end_time).toLocaleString() : 'Ongoing';
    addText(`Start: ${startDate}  •  End: ${endDate}`, 10, false, [100, 100, 100]);
    addSpacer(8);

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Root Cause Section
    if (incident.root_cause) {
        addText('Root Cause', 14, true, [30, 30, 30]);
        addText(incident.root_cause, 11, false, [60, 60, 60]);
        addSpacer(6);
    }

    // Impact Section
    if (incident.impact) {
        addText('Impact', 14, true, [30, 30, 30]);
        addText(incident.impact, 11, false, [60, 60, 60]);
        addSpacer(6);
    }

    // Resolution Section
    if (incident.resolution) {
        addText('Resolution', 14, true, [30, 30, 30]);
        addText(incident.resolution, 11, false, [60, 60, 60]);
        addSpacer(6);
    }

    // Timeline Section
    if (incident.timeline && incident.timeline.length > 0) {
        addText('Timeline', 14, true, [30, 30, 30]);
        addSpacer(2);

        incident.timeline.forEach((entry) => {
            const timeText = `${entry.timestamp}`;
            const descText = entry.description;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 64, 175);
            doc.text(timeText, margin, y);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            const timeWidth = doc.getTextWidth(timeText);
            doc.text(' - ', margin + timeWidth, y);

            const descLines = doc.splitTextToSize(descText, contentWidth - timeWidth - 10);
            doc.text(descLines, margin + timeWidth + 8, y);
            y += (descLines.length * 5) + 4;

            // Check page break
            if (y > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                addWatermark();
                y = margin;
            }
        });
        addSpacer(6);
    }

    // Action Items Section
    if (incident.action_items && incident.action_items.length > 0) {
        addText('Action Items', 14, true, [30, 30, 30]);
        addSpacer(2);

        incident.action_items.forEach((item, index) => {
            const priorityColors: Record<string, number[]> = {
                'P0': [220, 38, 38],
                'P1': [234, 88, 12],
                'P2': [202, 138, 4],
            };
            const pColor = priorityColors[item.priority] || [100, 100, 100];

            // Priority badge
            doc.setFillColor(pColor[0], pColor[1], pColor[2]);
            doc.roundedRect(margin, y - 4, 15, 6, 1, 1, 'F');
            doc.setFontSize(7);
            doc.setTextColor(255, 255, 255);
            doc.text(item.priority, margin + 3, y);

            // Action text
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            const actionLines = doc.splitTextToSize(`${item.action} (Owner: ${item.owner})`, contentWidth - 20);
            doc.text(actionLines, margin + 20, y);
            y += (actionLines.length * 5) + 6;

            // Check page break
            if (y > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                addWatermark();
                y = margin;
            }
        });
    }

    // Footer
    doc.addPage();
    y = margin;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, doc.internal.pageSize.getHeight() - 20, pageWidth - margin, doc.internal.pageSize.getHeight() - 20);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by AEGIS INCIDENTS', margin, doc.internal.pageSize.getHeight() - 12);
    doc.text(new Date().toLocaleString(), pageWidth - margin - 40, doc.internal.pageSize.getHeight() - 12);

    // Download the PDF
    const filename = `${incident.title.toLowerCase().replace(/\s+/g, '-')}-postmortem.pdf`;
    doc.save(filename);
}
