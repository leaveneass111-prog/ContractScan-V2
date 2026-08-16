import React from 'react';
import { ReportData } from '../types';
import {
  Building,
  ScrollText,
  UserCheck,
  TrendingUp,
  FileText,
  Calendar,
  Sparkles,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { GarudaEmblem } from './GarudaEmblem';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
}

export const DocumentPage1: React.FC<Props> = ({ data, onChange }) => {
  const updateField = (field: keyof ReportData, value: any) => {
    if (onChange) {
      onChange({ ...data, [field]: value });
    }
  };

  return (
    <div>
      {/* Screen View: Dark Neumorphism Bento Cards Form Input */}
      <div className="print:hidden space-y-6">
        {/* Bento Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bento Card 1: โครงการ (Project Card) */}
          <div className="neu-flat p-6 rounded-3xl border border-white/5 space-y-5 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-3.5 mb-4">
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-orange-400 tracking-wide">
                    Card โครงการ
                  </h3>
                  <p className="text-[11px] text-gray-400">ข้อมูลหนังสือ โครงการ และสถานที่</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                {/* Row 1: Short Fields (DOC_NO, R_DATE, WEEK) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      เลขที่หนังสือ (ที่)
                    </label>
                    <input
                      type="text"
                      value={data.docNo}
                      onChange={(e) => updateField('docNo', e.target.value)}
                      placeholder="เช่น 01/2569"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      วันที่รายงาน
                    </label>
                    <input
                      type="text"
                      value={data.reportDate}
                      onChange={(e) => updateField('reportDate', e.target.value)}
                      placeholder="เช่น 15 มกราคม 2569"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      รายงานครั้งที่
                    </label>
                    <input
                      type="text"
                      value={data.weekNo}
                      onChange={(e) => updateField('weekNo', e.target.value)}
                      placeholder="เช่น 2"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Short Date Range Fields (START, END) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      ระหว่างวันที่
                    </label>
                    <input
                      type="text"
                      value={data.startDate}
                      onChange={(e) => updateField('startDate', e.target.value)}
                      placeholder="เช่น 8 ม.ค. 2569"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      ถึงวันที่
                    </label>
                    <input
                      type="text"
                      value={data.endDate}
                      onChange={(e) => updateField('endDate', e.target.value)}
                      placeholder="เช่น 14 ม.ค. 2569"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* PROJECT */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5">
                    งานก่อสร้าง / ชื่อโครงการ
                  </label>
                  <textarea
                    rows={2}
                    value={data.projectName}
                    onChange={(e) => updateField('projectName', e.target.value)}
                    placeholder="ระบุชื่อโครงการก่อสร้าง..."
                    className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none transition-colors"
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5">
                    สถานที่ก่อสร้าง
                  </label>
                  <textarea
                    rows={2}
                    value={data.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="ระบุสถานที่ก่อสร้าง..."
                    className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none transition-colors"
                  />
                </div>

                {/* QTY */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5">
                    ปริมาณงาน
                  </label>
                  <textarea
                    rows={2}
                    value={data.quantity}
                    onChange={(e) => updateField('quantity', e.target.value)}
                    placeholder="ระบุปริมาณงาน เช่น กว้าง 4.00 ม. ยาว 250 ม. หนา 0.15 ม."
                    className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 resize-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: สัญญา (Contract Card) */}
          <div className="neu-flat p-6 rounded-3xl border border-white/5 space-y-5 flex flex-col justify-between">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-3.5 mb-4">
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20">
                  <ScrollText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-orange-400 tracking-wide">
                    Card สัญญา & ผลงาน
                  </h3>
                  <p className="text-[11px] text-gray-400">สัญญาจ้าง ระยะเวลา ค่าก่อสร้าง ผู้รับจ้าง และสถานะผลงาน</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                {/* Row 1: Short contract date/no fields (C_NO, C_DATE, C_END) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      สัญญาจ้างเลขที่
                    </label>
                    <input
                      type="text"
                      value={data.contractNo}
                      onChange={(e) => updateField('contractNo', e.target.value)}
                      placeholder="เช่น 12/2569"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      ลงวันที่สัญญา
                    </label>
                    <input
                      type="text"
                      value={data.contractDate}
                      onChange={(e) => updateField('contractDate', e.target.value)}
                      placeholder="เช่น 1 ธันวาคม 2568"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      แล้วเสร็จวันที่
                    </label>
                    <input
                      type="text"
                      value={data.contractEndDate}
                      onChange={(e) => updateField('contractEndDate', e.target.value)}
                      placeholder="เช่น 28 กุมภาพันธ์ 2569"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Short metrics (DAYS, COST, FINE) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      รวมระยะเวลา (วัน)
                    </label>
                    <input
                      type="text"
                      value={data.totalDays}
                      onChange={(e) => updateField('totalDays', e.target.value)}
                      placeholder="เช่น 90"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      ค่าก่อสร้าง (บาท)
                    </label>
                    <input
                      type="text"
                      value={data.constructionCost}
                      onChange={(e) => updateField('constructionCost', e.target.value)}
                      placeholder="เช่น 450,000"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1.5">
                      ค่าปรับวันละ (บาท)
                    </label>
                    <input
                      type="text"
                      value={data.finePerDay}
                      onChange={(e) => updateField('finePerDay', e.target.value)}
                      placeholder="เช่น 450"
                      className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors font-semibold"
                    />
                  </div>
                </div>

                {/* CONTRACTOR */}
                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5">
                    ชื่อผู้รับจ้าง
                  </label>
                  <input
                    type="text"
                    value={data.contractorName}
                    onChange={(e) => updateField('contractorName', e.target.value)}
                    placeholder="เช่น ห้างหุ้นส่วนจำกัด โชคชัยการช่าง (2565)"
                    className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>

                {/* Section Divider: Progress */}
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold text-xs">
                    <TrendingUp className="w-4 h-4" />
                    <span>ข้อมูลผลงานและความก้าวหน้า</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* CURRENT_PCT */}
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        %ผลงานปัจจุบัน
                      </label>
                      <input
                        type="text"
                        value={data.progressCurrent}
                        onChange={(e) => updateField('progressCurrent', e.target.value)}
                        placeholder="เช่น 35.50%"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-orange-400 font-extrabold focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>

                    {/* STATUS */}
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        สถานะ เร็ว/ช้า
                      </label>
                      <input
                        type="text"
                        value={data.progressStatus}
                        onChange={(e) => updateField('progressStatus', e.target.value)}
                        placeholder="เช่น เร็วกว่าแผน +2.00%"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors font-medium"
                      />
                    </div>

                    {/* REMAIN */}
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ระยะเวลาคงเหลือ (วัน)
                      </label>
                      <input
                        type="text"
                        value={data.remainingDays}
                        onChange={(e) => updateField('remainingDays', e.target.value)}
                        placeholder="เช่น 45"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 3: บุคลากร (Staff Card) */}
          <div className="neu-flat p-6 rounded-3xl border border-white/5 space-y-5 flex flex-col justify-between lg:col-span-2">
            <div>
              {/* Card Header */}
              <div className="flex items-center gap-2.5 border-b border-white/5 pb-3.5 mb-4">
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-orange-400 tracking-wide">
                    Card บุคลากร
                  </h3>
                  <p className="text-[11px] text-gray-400">ผู้ควบคุมงาน และ คณะกรรมการตรวจรับพัสดุ</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Supervisor */}
                <div className="space-y-3 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-white/5 md:pr-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <UserCheck className="w-4 h-4" />
                    <span>ผู้ควบคุมงาน</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        value={data.supervisorName}
                        onChange={(e) => updateField('supervisorName', e.target.value)}
                        placeholder="เช่น นายสมชาย ช่างดี"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        value={data.supervisorPos}
                        onChange={(e) => updateField('supervisorPos', e.target.value)}
                        placeholder="เช่น นายช่างโยธาชำนาญงาน"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Chair Committee */}
                <div className="space-y-3 pb-4 md:pb-0 border-b md:border-b-0 border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <UserCheck className="w-4 h-4" />
                    <span>ประธานกรรมการตรวจรับพัสดุ</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        value={data.committeeChairName}
                        onChange={(e) => updateField('committeeChairName', e.target.value)}
                        placeholder="เช่น นายวิชัย ใจตรง"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        value={data.committeeChairPos}
                        onChange={(e) => updateField('committeeChairPos', e.target.value)}
                        placeholder="เช่น ผู้อำนวยการกองช่าง"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Committee 1 */}
                <div className="space-y-3 pt-4 border-t border-white/5 md:border-r md:pr-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <UserCheck className="w-4 h-4" />
                    <span>กรรมการ คนที่ 1</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        value={data.committee1Name}
                        onChange={(e) => updateField('committee1Name', e.target.value)}
                        placeholder="เช่น นายประเสริฐ ดีเยี่ยม"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        value={data.committee1Pos}
                        onChange={(e) => updateField('committee1Pos', e.target.value)}
                        placeholder="เช่น นักจัดการงานทั่วไปชำนาญการ"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Committee 2 */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <UserCheck className="w-4 h-4" />
                    <span>กรรมการ คนที่ 2</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        value={data.committee2Name}
                        onChange={(e) => updateField('committee2Name', e.target.value)}
                        placeholder="เช่น นางสาวอารียา รักชาติ"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1.5">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        value={data.committee2Pos}
                        onChange={(e) => updateField('committee2Pos', e.target.value)}
                        placeholder="เช่น เจ้าพนักงานพัสดุชำนาญงาน"
                        className="w-full neu-pressed border border-white/5 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print View: Printable Standard Government Memorandum A4 Document */}
      <div className="hidden print:block bg-white text-black p-8 sm:p-12 font-sarabun max-w-[210mm] min-h-[297mm] mx-auto text-[15px] leading-relaxed relative flex-col justify-between">
        <div>
          {/* Header Area */}
          <div className="flex flex-col items-center mb-2">
            <GarudaEmblem width={68} height={72} />
            <h1 className="text-2xl font-bold mt-1 tracking-tight">บันทึกข้อความ</h1>
          </div>

          {/* Form Fields Header */}
          <div className="space-y-1.5 mt-2 text-[15px]">
            <div className="flex items-baseline">
              <span className="font-bold shrink-0 mr-2">ส่วนราชการ</span>
              <span className="border-b border-dotted border-gray-400 grow font-medium">
                องค์การบริหารส่วนตำบลใหม่พัฒนา อำเภอเกาะคา จังหวัดลำปาง
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-baseline grow">
                <span className="font-bold shrink-0 mr-2">ที่</span>
                <span className="border-b border-dotted border-gray-400 grow font-medium">
                  ลป.๗๙๖๐๓/{data.docNo}
                </span>
              </div>
              <div className="flex items-baseline grow">
                <span className="font-bold shrink-0 mr-2">วันที่</span>
                <span className="border-b border-dotted border-gray-400 grow font-medium text-center">
                  {data.reportDate}
                </span>
              </div>
            </div>

            <div className="flex items-baseline">
              <span className="font-bold shrink-0 mr-2">เรื่อง</span>
              <span className="border-b border-dotted border-gray-400 grow font-medium">
                รายงานผลการปฏิบัติงาน
              </span>
            </div>
          </div>

          {/* Divider line */}
          <div className="border-b-2 border-black my-2" />

          {/* Content Paragraphs */}
          <div className="space-y-1.5 text-[15px] mt-3">
            <div className="flex items-baseline">
              <span className="font-bold shrink-0 mr-2">เรียน</span>
              <span className="font-medium">ประธานคณะกรรมการตรวจรับพัสดุ</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 pl-6">
              <span className="font-bold">รายงานครั้งที่</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.weekNo}</span>
              <span className="font-bold">ระหว่างวันที่</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.startDate}</span>
              <span className="font-bold">ถึงวันที่</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.endDate}</span>
            </div>

            <div className="flex items-baseline">
              <span className="font-bold shrink-0 mr-2">งานก่อสร้าง</span>
              <span className="border-b border-dotted border-gray-500 grow font-medium">
                {data.projectName}
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="font-bold shrink-0 mr-2">สถานที่ก่อสร้าง</span>
              <span className="border-b border-dotted border-gray-500 grow font-medium">
                {data.location}
              </span>
            </div>

            <div className="flex items-baseline">
              <span className="font-bold shrink-0 mr-2">ปริมาณงาน</span>
              <span className="border-b border-dotted border-gray-500 grow font-medium">
                {data.quantity} รายละเอียดตามแบบแปลนขององค์การบริหารส่วนตำบลใหม่พัฒนา
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span className="font-bold">สัญญาจ้างเลขที่</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.contractNo}</span>
              <span className="font-bold">ลงวันที่</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.contractDate}</span>
              <span className="font-bold">แล้วเสร็จวันที่</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.contractEndDate}</span>
              <span className="font-bold">รวม</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.totalDays}</span>
              <span className="font-bold">วัน</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span className="font-bold">ต่อสัญญาจ้างถึงวันที่</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.extendedEndDate || '-'}</span>
              <span className="font-bold">รวม</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.extendedDays || '-'}</span>
              <span className="font-bold">วัน</span>
              <span className="font-bold ml-2">ค่าก่อสร้าง</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.constructionCost}</span>
              <span className="font-bold">บาท</span>
              <span className="font-bold ml-2">ค่าปรับวันละ</span>
              <span className="border-b border-dotted border-gray-500 px-2 font-medium">{data.finePerDay}</span>
              <span className="font-bold">บาท</span>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-baseline grow">
                <span className="font-bold shrink-0 mr-2">ผู้ว่าจ้าง</span>
                <span className="border-b border-dotted border-gray-500 grow font-medium">
                  องค์การบริหารส่วนตำบลใหม่พัฒนา
                </span>
              </div>
              <div className="flex items-baseline grow">
                <span className="font-bold shrink-0 mr-2">ผู้รับจ้าง</span>
                <span className="border-b border-dotted border-gray-500 grow font-medium">
                  {data.contractorName}
                </span>
              </div>
            </div>

            <div className="flex items-baseline">
              <span className="font-bold shrink-0 mr-2">ผู้ออกแบบ</span>
              <span className="border-b border-dotted border-gray-500 grow font-medium">
                กองช่างองค์การบริหารส่วนตำบลใหม่พัฒนา
              </span>
            </div>
          </div>

          {/* Summary Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse border border-black text-center text-[13px] leading-tight">
              <thead>
                <tr className="bg-gray-50">
                  <th colSpan={3} className="border border-black p-1.5 font-bold">
                    การปฏิบัติงาน
                  </th>
                  <th colSpan={4} className="border border-black p-1.5 font-bold">
                    เงินงบประมาณ และ การเบิกจ่าย
                  </th>
                </tr>
                <tr className="bg-gray-50 text-[12px]">
                  <th colSpan={2} className="border border-black p-1 font-bold">
                    %ผลงาน
                  </th>
                  <th rowSpan={2} className="border border-black p-1 font-bold w-[18%]">
                    ระยะเวลาก่อสร้างคงเหลือ
                  </th>
                  <th colSpan={2} className="border border-black p-1 font-bold">
                    จำนวนงวดงาน
                  </th>
                  <th rowSpan={2} className="border border-black p-1 font-bold w-[14%]">
                    ปีงบประมาณ
                  </th>
                  <th rowSpan={2} className="border border-black p-1 font-bold w-[16%]">
                    จำนวน
                  </th>
                  <th rowSpan={2} className="border border-black p-1 font-bold w-[14%]">
                    เบิกจ่ายแล้ว
                  </th>
                </tr>
                <tr className="bg-gray-50 text-[11px]">
                  <th className="border border-black p-1 font-bold w-[12%]">ปัจจุบัน</th>
                  <th className="border border-black p-1 font-bold w-[12%]">เร็ว/ช้า</th>
                  <th className="border border-black p-1 font-bold w-[10%]">ทั้งหมด</th>
                  <th className="border border-black p-1 font-bold w-[12%]">ตรวจรับแล้ว</th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-10">
                  <td className="border border-black p-1 font-medium">{data.progressCurrent}</td>
                  <td className="border border-black p-1 font-medium">{data.progressStatus}</td>
                  <td className="border border-black p-1 font-medium">{data.remainingDays}</td>
                  <td className="border border-black p-1 font-medium">1</td>
                  <td className="border border-black p-1 font-medium">-</td>
                  <td className="border border-black p-1 font-medium">{data.budgetYear || '2569'}</td>
                  <td className="border border-black p-1 font-medium">{data.budgetAmount || data.constructionCost}</td>
                  <td className="border border-black p-1 font-medium"></td>
                </tr>
                <tr className="h-7 font-bold">
                  <td colSpan={5} className="border border-black p-1"></td>
                  <td className="border border-black p-1 bg-gray-50">รวม</td>
                  <td className="border border-black p-1">{data.budgetAmount || data.constructionCost}</td>
                  <td className="border border-black p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Formal Closing */}
          <div className="mt-4 text-[15px] font-bold">
            จึงเรียนมาเพื่อโปรดทราบ
          </div>
        </div>

        {/* Signature Section at Bottom */}
        <div className="mt-6 space-y-4 text-[14px]">
          {/* Supervisor Signature */}
          <div className="flex justify-end">
            <div className="text-center space-y-1 min-w-[280px]">
              <div>
                ลงชื่อ (.......................................................) ผู้ควบคุมงาน
              </div>
              <div className="font-medium">({data.supervisorName})</div>
              <div className="text-gray-700">{data.supervisorPos}</div>
            </div>
          </div>

          {/* Committee Section Header */}
          <div className="text-center font-bold text-[15px] pt-1">
            คณะกรรมการตรวจรับพัสดุ
          </div>

          {/* Chair Signature */}
          <div className="flex justify-center">
            <div className="text-center space-y-1 min-w-[280px]">
              <div>
                ลงชื่อ (.......................................................) ประธานกรรมการ
              </div>
              <div className="font-medium">({data.committeeChairName})</div>
              <div className="text-gray-700">{data.committeeChairPos}</div>
            </div>
          </div>

          {/* Member 1 & Member 2 Signatures Side by Side */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="text-center space-y-1">
              <div>
                ลงชื่อ (.......................................................) กรรมการ
              </div>
              <div className="font-medium">({data.committee1Name})</div>
              <div className="text-gray-700">{data.committee1Pos}</div>
            </div>

            <div className="text-center space-y-1">
              <div>
                ลงชื่อ (.......................................................) กรรมการ
              </div>
              <div className="font-medium">({data.committee2Name})</div>
              <div className="text-gray-700">{data.committee2Pos}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

