import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BaseResponse, Finding, Recommendation, Action } from './api';
import { analytics } from './monitoring';

interface ExportData {
  climate?: BaseResponse | null;
  business?: BaseResponse | null;
  cyber?: BaseResponse | null;
  globalScore?: number;
}

type ModuleKey = 'climate' | 'business' | 'cyber';

interface AutoTableDoc extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

const isFinding = (value: unknown): value is Finding => {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'title' in value &&
    'evidence' in value &&
    'confidence' in value
  );
};

const isRecommendation = (value: unknown): value is Recommendation => {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'action' in value &&
    'impact' in value
  );
};

const formatConfidence = (confidence?: number): number | undefined => {
  if (confidence === undefined) {
    return undefined;
  }

  const value = confidence > 1 ? confidence : Math.round(confidence * 100);
  return Number.isFinite(value) ? value : undefined;
};

const extractFindingText = (finding: Finding | string): string => {
  if (typeof finding === 'string') {
    return finding;
  }
  return finding.title || finding.evidence || 'N/A';
};

const extractRecommendationText = (recommendation: Recommendation | string, index: number): string => {
  const prefix = `${index + 1}. `;
  if (typeof recommendation === 'string') {
    return `${prefix}${recommendation}`;
  }
  return `${prefix}${recommendation.action}`;
};

export function generatePDFReport(data: ExportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Track PDF export
  const modules = (['climate', 'business', 'cyber'] as ModuleKey[]).filter(
    (key) => Boolean(data[key])
  );
  analytics.trackPDFExport(modules);

  // Header
  doc.setFontSize(24);
  doc.setTextColor(34, 139, 34);
  doc.text('GaiaShield', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Rapport de Résilience d\'Entreprise', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  doc.setFontSize(10);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;

  // Global Score Section
  if (data.globalScore !== undefined) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Score Global de Résilience', 20, yPosition);
    yPosition += 10;

    const scoreColor = data.globalScore >= 70 ? [34, 197, 94] : data.globalScore >= 40 ? [234, 179, 8] : [239, 68, 68];
    doc.setFontSize(36);
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${data.globalScore}/100`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const scoreLabel = data.globalScore >= 70 ? 'Excellent' : data.globalScore >= 40 ? 'Moyen' : 'Faible';
    doc.text(`Niveau: ${scoreLabel}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
  }

  // Climate Guard Section
  if (data.climate) {
    yPosition = addModuleSection(doc, 'Climate Guard 🌍', data.climate, yPosition);
  }

  // Business Shield Section
  if (data.business) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    yPosition = addModuleSection(doc, 'Business Shield 💼', data.business, yPosition);
  }

  // CyberProtect Section
  if (data.cyber) {
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }
    yPosition = addModuleSection(doc, 'CyberProtect 🔒', data.cyber, yPosition);
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} sur ${pageCount} - GaiaShield © ${new Date().getFullYear()}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `GaiaShield_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

function addModuleSection(doc: jsPDF, title: string, data: BaseResponse, startY: number): number {
  let yPosition = startY;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Section Title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 20, yPosition);
  yPosition += 8;

  // Risk Level Badge
  const riskLevel = data.risk_level || 'unknown';
  const riskColor = getRiskColor(riskLevel);
  doc.setFillColor(...riskColor);
  doc.roundedRect(20, yPosition - 5, 30, 7, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(riskLevel.toUpperCase(), 35, yPosition, { align: 'center' });
  
  // Confidence - check if findings have confidence
  const firstFinding = data.findings?.[0];
  const confidenceFromFinding = firstFinding && typeof firstFinding !== 'string' && isFinding(firstFinding)
    ? formatConfidence(firstFinding.confidence)
    : undefined;
  const confidence = formatConfidence(data.confidence) ?? confidenceFromFinding;

  if (confidence !== undefined) {
    doc.setTextColor(100, 100, 100);
    doc.text(`Confiance: ${confidence}%`, 60, yPosition);
  }

  yPosition += 12;

  // Findings
  if (data.findings && data.findings.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Constats:', 20, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    data.findings.forEach((finding) => {
      const findingText = extractFindingText(finding as Finding | string);
      const lines = doc.splitTextToSize(`• ${findingText}`, pageWidth - 40);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 25, yPosition);
        yPosition += 5;
      });
    });
    yPosition += 5;
  }

  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Recommandations:', 20, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    data.recommendations.forEach((rec, index) => {
      const recText = typeof rec === 'string' || isRecommendation(rec)
        ? extractRecommendationText(rec as Recommendation | string, index)
        : `${index + 1}. Analyse effectuée`;
      const lines = doc.splitTextToSize(recText, pageWidth - 40);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 25, yPosition);
        yPosition += 5;
      });
    });
    yPosition += 5;
  }

  // Actions (for cyber module)
  if (data.actions && data.actions.length > 0) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Actions Détectées:', 20, yPosition);
    yPosition += 8;

    const tableData = data.actions.map((action: Action) => [
      action.type.toUpperCase(),
      action.classification || 'N/A',
      action.reason,
      action.event_id || 'N/A',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Type', 'Classification', 'Raison', 'Événement']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [34, 139, 34], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 'auto' }
      },
      margin: { left: 20, right: 20 }
    });

    const docWithTable = doc as AutoTableDoc;
    yPosition = (docWithTable.lastAutoTable?.finalY ?? yPosition) + 10;
  }

  // Score (for business module)
  if (data.score !== undefined) {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Score: ${data.score}/100`, 20, yPosition);
    yPosition += 8;
  }

  yPosition += 10;
  return yPosition;
}

function getRiskColor(riskLevel: string): [number, number, number] {
  switch (riskLevel.toLowerCase()) {
    case 'critical':
      return [220, 38, 38];
    case 'high':
      return [249, 115, 22];
    case 'medium':
      return [234, 179, 8];
    case 'low':
      return [34, 197, 94];
    default:
      return [156, 163, 175];
  }
}
