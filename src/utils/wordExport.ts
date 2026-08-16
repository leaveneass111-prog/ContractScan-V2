import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
} from 'docx';
import { ReportData } from '../types';

export async function generateDocxBlob(data: ReportData): Promise<Blob> {
  const fontName = 'TH SarabunPSK';

  const titleParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'บันทึกข้อความ',
        bold: true,
        size: 36, // 18pt
        font: fontName,
      }),
    ],
  });

  const subTitleParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'รายงานผลการปฏิบัติงานผู้ควบคุมงานประจำสัปดาห์',
        bold: true,
        size: 30, // 15pt
        font: fontName,
      }),
    ],
  });

  const createFieldRow = (label: string, value: string) => {
    return new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 24, font: fontName }),
        new TextRun({ text: value || '-', size: 24, font: fontName }),
      ],
      spacing: { after: 120 },
    });
  };

  // Build task table rows
  const taskHeaderRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'ลำดับ', bold: true, size: 22, font: fontName })], alignment: AlignmentType.CENTER })],
        width: { size: 8, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'รายการงาน', bold: true, size: 22, font: fontName })], alignment: AlignmentType.CENTER })],
        width: { size: 40, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'สัดส่วน (%)', bold: true, size: 22, font: fontName })], alignment: AlignmentType.CENTER })],
        width: { size: 13, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'สัปดาห์ก่อน (%)', bold: true, size: 22, font: fontName })], alignment: AlignmentType.CENTER })],
        width: { size: 13, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'สัปดาห์นี้ (%)', bold: true, size: 22, font: fontName })], alignment: AlignmentType.CENTER })],
        width: { size: 13, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'สะสม (%)', bold: true, size: 22, font: fontName })], alignment: AlignmentType.CENTER })],
        width: { size: 13, type: WidthType.PERCENTAGE },
      }),
    ],
  });

  const dailyWorkSummary = (data.dailyLogs || [])
    .filter((l) => l.details && l.details.trim() !== '')
    .map((l, i) => `${l.shortDateStr || l.dateStr || `วันที่ ${i + 1}`}: ${l.details.trim()}`)
    .join('\n');

  const mainTask = (data.tasks && data.tasks.length > 0) ? data.tasks[0] : {
    id: 'task-1',
    no: 1,
    description: dailyWorkSummary,
    weightPercent: 100,
    prevPercent: 0,
    thisWeekPercent: 0,
    accumulatedPercent: 0,
    totalPercent: 0,
  };

  const taskDescriptionText = dailyWorkSummary || mainTask.description || '-';

  const taskRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: String(data.weekNo || '1'), size: 22, font: fontName, bold: true })], alignment: AlignmentType.CENTER })],
        }),
        new TableCell({
          children: taskDescriptionText.split('\n').map((line) => new Paragraph({ children: [new TextRun({ text: line, size: 22, font: fontName })] })),
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: `${mainTask.weightPercent}%`, size: 22, font: fontName })], alignment: AlignmentType.RIGHT })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: `${mainTask.prevPercent}%`, size: 22, font: fontName })], alignment: AlignmentType.RIGHT })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: `${mainTask.thisWeekPercent}%`, size: 22, font: fontName })], alignment: AlignmentType.RIGHT })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: `${mainTask.accumulatedPercent}%`, size: 22, font: fontName })], alignment: AlignmentType.RIGHT })],
        }),
      ],
    }),
  ];

  const taskTable = new Table({
    rows: [taskHeaderRow, ...taskRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  // Daily log table
  const laborsList = data.customLabors ?? [
    { id: 'labor-1', name: 'หัวหน้าคนงาน/ช่าง', counts: (data.dailyLogs || []).map(l => l.foremenCount || 0) },
    { id: 'labor-2', name: 'กรรมกร', counts: (data.dailyLogs || []).map(l => l.workerCount || 0) },
    { id: 'labor-3', name: 'รถแบคโฮ', counts: (data.dailyLogs || []).map(l => l.backhoeCount || 0) },
  ];

  const dailyLogHeaderCells = [
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: 'ประเภทแรงงาน / วันที่', bold: true, size: 20, font: fontName })], alignment: AlignmentType.CENTER })],
      width: { size: 25, type: WidthType.PERCENTAGE },
    }),
    ...(data.dailyLogs || []).map((log) => {
      return new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: log.shortDateStr || log.dayKey, bold: true, size: 20, font: fontName })], alignment: AlignmentType.CENTER })],
      });
    }),
  ];

  const dailyLogHeaderRow = new TableRow({ children: dailyLogHeaderCells });

  const laborRows = laborsList.map((labor) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: labor.name || '-', size: 20, font: fontName })] })],
        }),
        ...(data.dailyLogs || []).map((_, idx) => {
          const val = labor.counts[idx] || 0;
          return new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: val > 0 ? String(val) : '-', size: 20, font: fontName })], alignment: AlignmentType.CENTER })],
          });
        }),
      ],
    });
  });

  // Total labor row
  const totalLaborRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'รวมทั้งหมด', bold: true, size: 20, font: fontName })] })],
      }),
      ...(data.dailyLogs || []).map((_, idx) => {
        const total = laborsList.reduce((sum, cl) => sum + (cl.counts[idx] || 0), 0);
        return new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: total > 0 ? String(total) : '-', bold: true, size: 20, font: fontName })], alignment: AlignmentType.CENTER })],
        });
      }),
    ],
  });

  const dailyLogTable = new Table({
    rows: laborsList.length > 0 ? [dailyLogHeaderRow, ...laborRows, totalLaborRow] : [dailyLogHeaderRow],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          titleParagraph,
          subTitleParagraph,
          new Paragraph({ text: '', spacing: { after: 200 } }),

          createFieldRow('รายงานสัปดาห์ที่', data.weekNo),
          createFieldRow('ประจำวันที่', `${data.startDate} ถึงวันที่ ${data.endDate}`),
          createFieldRow('ชื่อโครงการ', data.projectName),
          createFieldRow('สถานที่ก่อสร้าง', data.location),
          createFieldRow('ปริมาณงาน', data.quantity),
          createFieldRow('สัญญาเลขที่', data.contractNo),
          createFieldRow('ลงวันที่', data.contractDate),
          createFieldRow('ผู้รับจ้าง', data.contractorName),
          createFieldRow('วงเงินสัญญา', `${data.constructionCost} บาท`),
          createFieldRow('ผลงานปัจจุบัน', `${data.progressCurrent} (${data.progressStatus})`),

          new Paragraph({ text: '', spacing: { after: 200 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. ตารางสรุปผลการปฏิบัติงานตามสัญญา',
                bold: true,
                size: 26,
                font: fontName,
              }),
            ],
            spacing: { after: 120 },
          }),
          taskTable,

          new Paragraph({ text: '', spacing: { after: 200 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2. บัญชีแสดงจำนวนแรงงานและเครื่องจักรประจำวัน',
                bold: true,
                size: 26,
                font: fontName,
              }),
            ],
            spacing: { after: 120 },
          }),
          dailyLogTable,

          new Paragraph({ text: '', spacing: { after: 300 } }),

          // Signatures
          new Paragraph({
            children: [
              new TextRun({ text: 'ลงชื่อ...................................................... ผู้ควบคุมงาน', size: 24, font: fontName }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `      ( ${data.supervisorName || '......................................................'} )`, size: 24, font: fontName }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `      ตำแหน่ง ${data.supervisorPos || '......................................................'}`, size: 24, font: fontName }),
            ],
            spacing: { after: 240 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'คณะกรรมการตรวจรับพัสดุ', bold: true, size: 24, font: fontName }),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `1. ( ${data.committeeChairName || '......................................................'} )  ประธานกรรมการ`, size: 24, font: fontName }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `2. ( ${data.committee1Name || '......................................................'} )  กรรมการ`, size: 24, font: fontName }),
            ],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `3. ( ${data.committee2Name || '......................................................'} )  กรรมการ`, size: 24, font: fontName }),
            ],
            spacing: { after: 120 },
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function generateDocHtmlBlob(data: ReportData): Blob {
  const dailyWorkSummary = (data.dailyLogs || [])
    .filter((l) => l.details && l.details.trim() !== '')
    .map((l, i) => `${l.shortDateStr || l.dateStr || `วันที่ ${i + 1}`}: ${l.details.trim()}`)
    .join('<br/>');

  const mainTask = (data.tasks && data.tasks.length > 0) ? data.tasks[0] : {
    id: 'task-1',
    no: 1,
    description: '',
    weightPercent: 100,
    prevPercent: 0,
    thisWeekPercent: 0,
    accumulatedPercent: 0,
    totalPercent: 0,
  };

  const taskDescriptionHtml = dailyWorkSummary || mainTask.description || '-';

  const taskRowsHtml = `
    <tr>
      <td style="text-align: center; font-weight: bold;">${data.weekNo || '1'}</td>
      <td style="text-align: left;">${taskDescriptionHtml}</td>
      <td style="text-align: right;">${mainTask.weightPercent}%</td>
      <td style="text-align: right;">${mainTask.prevPercent}%</td>
      <td style="text-align: right;">${mainTask.thisWeekPercent}%</td>
      <td style="text-align: right;">${mainTask.accumulatedPercent}%</td>
    </tr>`;

  const dailyLogHeaders = (data.dailyLogs || [])
    .map((log) => `<th style="text-align: center; border: 1px solid #999; padding: 6px;">${log.shortDateStr || log.dayKey}</th>`)
    .join('');

  const renderLaborRow = (label: string, key: string) => {
    const cells = (data.dailyLogs || [])
      .map((log) => {
        const val = (log as any)[key] || 0;
        return `<td style="text-align: center; border: 1px solid #999; padding: 6px;">${val > 0 ? val : '-'}</td>`;
      })
      .join('');
    return `<tr><td style="border: 1px solid #999; padding: 6px; font-weight: bold;">${label}</td>${cells}</tr>`;
  };

  const customLaborRows = (data.customLabors || [])
    .map((cl) => {
      const cells = (data.dailyLogs || [])
        .map((_, idx) => `<td style="text-align: center; border: 1px solid #999; padding: 6px;">${cl.counts[idx] || '-'}</td>`)
        .join('');
      return `<tr><td style="border: 1px solid #999; padding: 6px; font-weight: bold;">${cl.name || 'แรงงานอื่นๆ'}</td>${cells}</tr>`;
    })
    .join('');

  const totalCells = (data.dailyLogs || [])
    .map((log, idx) => {
      const fixedSum = (log.foremenCount || 0) + (log.workerCount || 0) + (log.backhoeCount || 0);
      const customSum = (data.customLabors || []).reduce((sum, cl) => sum + (cl.counts[idx] || 0), 0);
      const total = fixedSum + customSum;
      return `<td style="text-align: center; border: 1px solid #999; padding: 6px; font-weight: bold; color: #d97706;">${total > 0 ? total : '-'}</td>`;
    })
    .join('');

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>รายงานผลการปฏิบัติงานประจำสัปดาห์</title>
      <style>
        body { font-family: 'TH SarabunPSK', 'Angsana New', 'Calibri', sans-serif; font-size: 16pt; line-height: 1.4; color: #000; }
        h1 { font-size: 20pt; text-align: center; margin-bottom: 5px; }
        h2 { font-size: 18pt; text-align: center; margin-top: 0; margin-bottom: 20px; }
        h3 { font-size: 16pt; margin-top: 20px; margin-bottom: 10px; color: #1e293b; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #666; padding: 6px 8px; font-size: 14pt; }
        th { background-color: #f1f5f9; }
        .meta-table td { border: none; padding: 4px 0; }
        .signature-box { margin-top: 30px; }
      </style>
    </head>
    <body>
      <h1>บันทึกข้อความ</h1>
      <h2>รายงานผลการปฏิบัติงานผู้ควบคุมงานประจำสัปดาห์</h2>

      <table class="meta-table">
        <tr><td style="width: 25%; font-weight: bold;">รายงานสัปดาห์ที่:</td><td>${data.weekNo}</td></tr>
        <tr><td style="font-weight: bold;">ประจำวันที่:</td><td>${data.startDate} ถึงวันที่ ${data.endDate}</td></tr>
        <tr><td style="font-weight: bold;">ชื่อโครงการ:</td><td>${data.projectName}</td></tr>
        <tr><td style="font-weight: bold;">สถานที่ก่อสร้าง:</td><td>${data.location}</td></tr>
        <tr><td style="font-weight: bold;">ปริมาณงาน:</td><td>${data.quantity}</td></tr>
        <tr><td style="font-weight: bold;">สัญญาเลขที่:</td><td>${data.contractNo} ลงวันที่ ${data.contractDate}</td></tr>
        <tr><td style="font-weight: bold;">ผู้รับจ้าง:</td><td>${data.contractorName}</td></tr>
        <tr><td style="font-weight: bold;">วงเงินสัญญา:</td><td>${data.constructionCost} บาท</td></tr>
        <tr><td style="font-weight: bold;">ผลงานปัจจุบัน:</td><td>${data.progressCurrent} (${data.progressStatus})</td></tr>
      </table>

      <h3>1. ตารางสรุปผลการปฏิบัติงานตามสัญญา</h3>
      <table>
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>รายการงาน</th>
            <th>สัดส่วน (%)</th>
            <th>สัปดาห์ก่อน (%)</th>
            <th>สัปดาห์นี้ (%)</th>
            <th>สะสม (%)</th>
          </tr>
        </thead>
        <tbody>
          ${taskRowsHtml}
        </tbody>
      </table>

      <h3>2. บัญชีแสดงจำนวนแรงงานและเครื่องจักรประจำวัน</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 30%;">ประเภทแรงงาน</th>
            ${dailyLogHeaders}
          </tr>
        </thead>
        <tbody>
          ${renderLaborRow('วิศวกร / โฟร์แมน', 'foremenCount')}
          ${renderLaborRow('คนงาน', 'workerCount')}
          ${renderLaborRow('รถขุด / เครื่องจักร', 'backhoeCount')}
          ${customLaborRows}
          <tr>
            <td style="border: 1px solid #999; padding: 6px; font-weight: bold; color: #d97706;">รวมทั้งหมด</td>
            ${totalCells}
          </tr>
        </tbody>
      </table>

      <div class="signature-box">
        <p>ลงชื่อ...................................................... ผู้ควบคุมงาน</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;( ${data.supervisorName || '......................................................'} )</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ตำแหน่ง ${data.supervisorPos || '......................................................'}</p>
        <br>
        <p><b>คณะกรรมการตรวจรับพัสดุ</b></p>
        <p>1. ( ${data.committeeChairName || '......................................................'} )  ประธานกรรมการ</p>
        <p>2. ( ${data.committee1Name || '......................................................'} )  กรรมการ</p>
        <p>3. ( ${data.committee2Name || '......................................................'} )  กรรมการ</p>
      </div>
    </body>
    </html>
  `;

  return new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
