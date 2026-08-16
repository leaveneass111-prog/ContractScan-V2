import React, { useState } from 'react';
import { FileText, Printer, Download, CheckCircle2, FileType, Sparkles } from 'lucide-react';
import { ReportData } from '../types';
import { generateDocxBlob, generateDocHtmlBlob, downloadFile } from '../utils/wordExport';

interface Props {
  data: ReportData;
}

export const ExportView: React.FC<Props> = ({ data }) => {
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingDoc, setIsExportingDoc] = useState(false);
  const [docxSuccess, setDocxSuccess] = useState(false);
  const [docSuccess, setDocSuccess] = useState(false);

  const getSafeFileName = (ext: string) => {
    const rawName = data.projectName || 'รายงานผลการปฏิบัติงาน';
    const cleanName = rawName.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 30);
    const week = data.weekNo ? `_สัปดาห์ที่_${data.weekNo}` : '';
    return `${cleanName}${week}.${ext}`;
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      setDocxSuccess(false);
      const blob = await generateDocxBlob(data);
      const filename = getSafeFileName('docx');
      downloadFile(blob, filename);
      setDocxSuccess(true);
      setTimeout(() => setDocxSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to export .docx', err);
      alert('เกิดข้อผิดพลาดในการสร้างไฟล์ Word (.docx) กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportDoc = () => {
    try {
      setIsExportingDoc(true);
      setDocSuccess(false);
      const blob = generateDocHtmlBlob(data);
      const filename = getSafeFileName('doc');
      downloadFile(blob, filename);
      setDocSuccess(true);
      setTimeout(() => setDocSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to export .doc', err);
      alert('เกิดข้อผิดพลาดในการสร้างไฟล์ Word (.doc) กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExportingDoc(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-pressed text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ศูนย์ดาวน์โหลดเอกสาร</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">ดาวน์โหลดเอกสาร (Export)</h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">
          เลือกรูปแบบไฟล์เอกสารที่ต้องการ เช่น Microsoft Word (.docx, .doc) หรือสั่งพิมพ์เป็น PDF
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Word (.docx) */}
        <div className="neu-flat p-6 rounded-3xl border border-white/5 flex flex-col justify-between items-center text-center group hover:border-blue-500/40 transition-all">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl neu-pressed flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform bg-blue-500/10 border border-blue-500/20">
              <FileType className="w-8 h-8" />
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30 mb-2">
              .DOCX
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Microsoft Word (.docx)</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              ไฟล์ Word สมัยใหม่ สามารถนำไปแก้ไขข้อความ จัดสไตล์ ตาราง และส่งต่อร่วมกับทีมงานได้ทันที
            </p>
          </div>

          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              docxSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'neu-button border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 active:scale-95'
            }`}
          >
            {isExportingDocx ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">กำลังสร้างไฟล์ .docx...</span>
              </>
            ) : docxSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs">ดาวน์โหลดสำเร็จ!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="text-xs">ดาวน์โหลด .docx</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Word (.doc) */}
        <div className="neu-flat p-6 rounded-3xl border border-white/5 flex flex-col justify-between items-center text-center group hover:border-cyan-500/40 transition-all">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl neu-pressed flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform bg-cyan-500/10 border border-cyan-500/20">
              <FileText className="w-8 h-8" />
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 mb-2">
              .DOC
            </span>
            <h3 className="text-lg font-bold text-white mb-2">Microsoft Word (.doc)</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              ไฟล์ Word รุ่นคลาสสิก รองรับ MS Word ทุกเวอร์ชัน แสดงผลรูปแบบตารางและข้อความถูกต้องสมบูรณ์
            </p>
          </div>

          <button
            onClick={handleExportDoc}
            disabled={isExportingDoc}
            className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              docSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'neu-button border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 active:scale-95'
            }`}
          >
            {isExportingDoc ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">กำลังสร้างไฟล์ .doc...</span>
              </>
            ) : docSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs">ดาวน์โหลดสำเร็จ!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="text-xs">ดาวน์โหลด .doc</span>
              </>
            )}
          </button>
        </div>

        {/* Card 3: PDF / Print */}
        <div className="neu-flat p-6 rounded-3xl border border-white/5 flex flex-col justify-between items-center text-center group hover:border-emerald-500/40 transition-all">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl neu-pressed flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform bg-emerald-500/10 border border-emerald-500/20">
              <Printer className="w-8 h-8" />
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 mb-2">
              PDF / PRINT
            </span>
            <h3 className="text-lg font-bold text-white mb-2">พิมพ์ / บันทึกเป็น PDF</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              สั่งพิมพ์หรือบันทึกเป็นไฟล์ PDF ขนาด A4 มาตรฐานราชการทันทีด้วยระบบพิมพ์ตรงจากเบราว์เซอร์
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 px-4 rounded-xl font-bold neu-button border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 active:scale-95 flex items-center justify-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span className="text-xs">พิมพ์เป็น PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
