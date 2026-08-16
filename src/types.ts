export interface TaskItem {
  id: string;
  no: number;
  description: string;
  weightPercent: number; // สัดส่วนของงาน%
  prevPercent: number;   // ถึงสัปดาห์ก่อน%
  thisWeekPercent: number; // ในสัปดาห์%
  accumulatedPercent: number; // สะสม%
  totalPercent: number; // ผลงานรวม%
}

export interface DailyLogItem {
  id: string;
  dayKey: string; // e.g. D1, D2...
  dateStr: string; // e.g. 8 ม.ค. 2569
  shortDateStr: string; // e.g. 8/1
  details: string;
  weatherMorning: string; // e.g. แจ่มใส, มีฝนเล็กน้อย
  weatherAfternoon: string; // e.g. ครึ้มฟ้าครึ้มฝน, แจ่มใส
  foremenCount: number;
  workerCount: number;
  backhoeCount: number;
}

export interface LaborItem {
  id: string;
  name: string;
  counts: number[]; // จำนวนแรงงานแต่ละวันในสัปดาห์
}

export interface ReportData {
  // Mode: true = placeholder mode like {{DOC_NO}}, false = filled real values
  isPlaceholderMode: boolean;

  // Cover Memo (Page 1)
  docNo: string;           // {{DOC_NO}} e.g. 01/2569
  reportDate: string;      // {{R_DATE}} e.g. 15 มกราคม 2569
  weekNo: string;          // {{WEEK}} e.g. 2
  startDate: string;       // {{START}} e.g. 8 มกราคม 2569
  endDate: string;         // {{END}} e.g. 14 มกราคม 2569
  projectName: string;     // {{PROJECT}} e.g. โครงการก่อสร้างถนนคอนกรีตเสริมเหล็ก สายบ้านใหม่-ห้วยทราย
  location: string;        // {{LOCATION}} e.g. หมู่ที่ 3 ตำบลใหม่พัฒนา อำเภอเกาะคา จังหวัดลำปาง
  quantity: string;        // {{QTY}} e.g. กว้าง 4.00 เมตร ยาว 250.00 เมตร หนา 0.15 เมตร
  contractNo: string;      // {{C_NO}} e.g. 12/2569
  contractDate: string;    // {{C_DATE}} e.g. 1 ธันวาคม 2568
  contractEndDate: string; // {{C_END}} e.g. 28 กุมภาพันธ์ 2569
  totalDays: string;       // {{DAYS}} e.g. 90
  extendedEndDate: string; // ต่อสัญญาจ้างถึงวันที่ e.g. -
  extendedDays: string;    // รวมต่อสัญญา e.g. -
  constructionCost: string;// {{COST}} e.g. 450,000
  finePerDay: string;      // {{FINE}} e.g. 450
  contractorName: string;  // {{CONTRACTOR}} e.g. ห้างหุ้นส่วนจำกัด โชคชัยการช่าง (2565)
  remainingDays: string;   // {{REMAIN}} e.g. 45
  budgetYear: string;      // e.g. 2569
  budgetAmount: string;    // {{BUDGET}} e.g. 450,000
  progressCurrent: string; // %ผลงานปัจจุบัน e.g. 35.50%
  progressStatus: string;  // เร็ว/ช้า e.g. เร็วกว่าแผน +2.00%

  // Signatures
  supervisorName: string;  // {{SUP_NAME}} e.g. นายสมชาย ช่างดี
  supervisorPos: string;   // {{SUP_POS}} e.g. นายช่างโยธาชำนาญงาน
  committeeChairName: string; // {{COM_P_NAME}} e.g. นายวิชัย ใจตรง
  committeeChairPos: string;  // {{COM_P_POS}} e.g. ผู้อำนวยการกองช่าง
  committee1Name: string;  // {{COM_1_NAME}} e.g. นายประเสริฐ ดีเยี่ยม
  committee1Pos: string;   // {{COM_1_POS}} e.g. นักจัดการงานทั่วไปชำนาญการ
  committee2Name: string;  // {{COM_2_NAME}} e.g. นางสาวอารียา รักชาติ
  committee2Pos: string;   // {{COM_2_POS}} e.g. เจ้าพนักงานพัสดุชำนาญงาน

  // Page 2: Tasks & Obstacles
  tasks: TaskItem[];
  hasObstacles: boolean;   // true = มี ดังนี้, false = ไม่มี
  obstacleDetails: string; // ข้อความปัญหา-อุปสรรค

  // Page 3: Daily Logs & Attendance
  dailyLogs: DailyLogItem[];
  logSupervisorName: string; // {{SUPERVISOR_NAME}} e.g. นายสมชาย ช่างดี
  logContractorName: string; // {{CONTRACTOR_NAME}} e.g. นายโชคชัย มีทรัพย์ (ผู้แทนผู้รับจ้าง)
  
  // Labor categories (all editable & deletable)
  customLabors?: LaborItem[];
}

export interface Project {
  id: string;
  name: string;
  updatedAt: string;
  data: ReportData;
}

