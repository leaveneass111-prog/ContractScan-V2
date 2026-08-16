import React, { useState } from 'react';
import { Sparkles, Send, Bot, Check, Loader2, Wand2, RefreshCw, X, HelpCircle, FileCheck } from 'lucide-react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
  onApplyReport: (updatedData: ReportData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiAssistantModal: React.FC<Props> = ({
  data,
  onApplyReport,
  isOpen,
  onClose,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'gemini'; text: string; actionData?: Partial<ReportData> }[]
  >([
    {
      role: 'gemini',
      text: 'สวัสดีครับผมคือ Gemini ผู้ช่วยสรุปและจัดทำรายงานผลการปฏิบัติงานผู้ควบคุมงานก่อสร้าง (อบต.ใหม่พัฒนา)\n\nคุณสามารถบอกข้อมูลงานในสัปดาห์นี้สั้นๆ เช่น *"สัปดาห์นี้ผู้รับจ้างลงหินคลุกเสร็จแล้ว เริ่มตั้งแบบเหล็กเตรียมเทคอนกรีต อากาศแจ่มใส"* แล้วผมจะช่วยสร้างรายละเอียดงาน 3 หน้าให้โดยอัตโนมัติครับ!',
    },
  ]);

  const handleSendPrompt = async (customPrompt?: string) => {
    const textToSend = customPrompt || promptInput;
    if (!textToSend.trim() || loading) return;

    const newHistory = [...chatHistory, { role: 'user' as const, text: textToSend }];
    setChatHistory(newHistory);
    if (!customPrompt) setPromptInput('');
    setLoading(true);

    try {
      const systemInstruction = `คุณเป็น AI ผู้ช่วยนายช่างโยธา และผู้ควบคุมงานก่อสร้างของหน่วยงานราชการไทย (องค์การบริหารส่วนตำบลใหม่พัฒนา) 
มีหน้าที่วิเคราะห์และสร้างข้อมูลรายงานผลการปฏิบัติงานผู้ควบคุมงานก่อสร้าง ตามระเบียบกระทรวงมหาดไทยว่าด้วยการพัสดุ/การจัดซื้อจัดจ้าง

ถ้าผู้ใช้ขอให้สร้างหรืออัปเดตรายงาน ให้ส่งคืนผลลัพธ์ในรูปแบบ JSON โครงสร้างนี้ในบล็อก \`\`\`json:
{
  "progressCurrent": "35.00%",
  "progressStatus": "เร็วกว่าแผนงาน 2.00%",
  "tasks": [
    {
      "description": "งาน...",
      "weightPercent": 25,
      "prevPercent": 10,
      "thisWeekPercent": 15
    }
  ],
  "dailyLogs": [
    {
      "details": "...",
      "weatherMorning": "แจ่มใส",
      "weatherAfternoon": "แจ่มใส",
      "foremenCount": 1,
      "workerCount": 5,
      "backhoeCount": 1
    }
  ],
  "hasObstacles": false,
  "obstacleDetails": ""
}
\`\`\`
และเขียนข้อความอธิบายเป็นภาษาไทยทางการที่สุภาพ สรุปผลให้ผู้ใช้ฟัง`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `โครงการปัจจุบัน: ${data.projectName}\nข้อมูลเดิม: ผลงานปัจจุบัน ${data.progressCurrent}\n\nคำสั่งจากผู้ใช้: ${textToSend}`,
          systemInstruction,
        }),
      });

      const resData = await response.json();
      if (resData.error) {
        throw new Error(resData.error);
      }

      const replyText = resData.text || 'ไม่สามารถประมวลผลคำตอบได้';

      // Parse JSON inside response if available
      let actionData: Partial<ReportData> | undefined = undefined;
      const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.tasks) {
            const formattedTasks = parsed.tasks.map((t: any, i: number) => ({
              id: `task-ai-${Date.now()}-${i}`,
              no: i + 1,
              description: t.description || 'งานกิจกรรม',
              weightPercent: Number(t.weightPercent) || 0,
              prevPercent: Number(t.prevPercent) || 0,
              thisWeekPercent: Number(t.thisWeekPercent) || 0,
              accumulatedPercent: (Number(t.prevPercent) || 0) + (Number(t.thisWeekPercent) || 0),
              totalPercent: (Number(t.prevPercent) || 0) + (Number(t.thisWeekPercent) || 0),
            }));

            const formattedLogs = (parsed.dailyLogs || []).map((l: any, i: number) => {
              const existing = data.dailyLogs[i] || {};
              return {
                ...existing,
                id: `log-ai-${Date.now()}-${i}`,
                details: l.details || 'ปฏิบัติงานประจำวัน',
                weatherMorning: l.weatherMorning || 'แจ่มใส',
                weatherAfternoon: l.weatherAfternoon || 'แจ่มใส',
                foremenCount: Number(l.foremenCount) || 1,
                workerCount: Number(l.workerCount) || 4,
                backhoeCount: Number(l.backhoeCount) || 1,
              };
            });

            actionData = {
              progressCurrent: parsed.progressCurrent || data.progressCurrent,
              progressStatus: parsed.progressStatus || data.progressStatus,
              tasks: formattedTasks,
              dailyLogs: formattedLogs.length > 0 ? formattedLogs : data.dailyLogs,
              hasObstacles: Boolean(parsed.hasObstacles),
              obstacleDetails: parsed.obstacleDetails || '',
            };
          }
        } catch (e) {
          console.error('Failed to parse AI JSON', e);
        }
      }

      // Clean text output for chat
      const cleanReply = replyText.replace(/```json\n[\s\S]*?\n```/g, '').trim();

      setChatHistory([
        ...newHistory,
        {
          role: 'gemini',
          text: cleanReply || 'ผมได้ประมวลผลข้อมูลและเตรียมตารางกิจกรรมใหม่ให้คุณเรียบร้อยแล้วครับ!',
          actionData,
        },
      ]);
    } catch (err: any) {
      setChatHistory([
        ...newHistory,
        {
          role: 'gemini',
          text: `เกิดข้อผิดพลาดในการเชื่อมต่อ Gemini API: ${err?.message || 'โปรดลองใหม่อีกครั้ง'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const applyAiData = (actionData: Partial<ReportData>) => {
    onApplyReport({
      ...data,
      ...actionData,
      isPlaceholderMode: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#181818] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#141414] p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                ผู้ช่วย AI Gemini
                <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-500/20 font-semibold">
                  gemini-3.6-flash
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                ระบบช่วยกรอกและยกร่างบันทึกข้อความตรวจรับและรายงานประจำสัปดาห์
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-xl neu-button transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Prompts */}
        <div className="bg-[#161616] border-b border-white/5 p-3 px-4 flex gap-2.5 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() =>
              handleSendPrompt(
                'ร่างตารางผลงานสัปดาห์นี้: เทคอนกรีตผิวจราจรได้ 150 เมตร คิดเป็น 30% ของโครงการ อากาศแจ่มใส ไม่มีอุปสรรค'
              )
            }
            className="neu-button text-orange-300 border border-orange-500/20 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 font-medium hover:text-orange-200"
          >
            <Wand2 className="w-3.5 h-3.5 text-orange-400" />
            สร้างรายงานเทคอนกรีต 30%
          </button>
          <button
            onClick={() =>
              handleSendPrompt(
                'ร่างรายงานสัปดาห์ฝนตกหนัก: ทำงานหินคลุกได้ 10% แต่ติดฝนตกหนักช่วงบ่าย 3 วัน ผู้รับจ้างขอแจ้งอุปสรรค'
              )
            }
            className="neu-button text-gray-300 border border-white/10 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 font-medium hover:text-white"
          >
            <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
            รายงานสัปดาห์ที่มีฝนตก
          </button>
        </div>

        {/* Chat Stream Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-[#121212]">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'gemini' && (
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center shrink-0 text-orange-400 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-gray-100 ${
                  msg.role === 'user'
                    ? 'neu-orange-btn text-white rounded-br-xs'
                    : 'neu-flat border border-white/5 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">{msg.text}</div>

                {/* Apply Data Action Button if Gemini generated report data */}
                {msg.actionData && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-xs text-orange-300 font-medium">
                      ✨ ข้อมูลตารางพร้อมอัปเดตลงแบบฟอร์ม 3 หน้า
                    </span>
                    <button
                      onClick={() => applyAiData(msg.actionData!)}
                      className="neu-orange-btn text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      นำข้อมูลเข้าเอกสาร
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="text-xs text-orange-300 italic font-medium">
                Gemini กำลังวิเคราะห์และร่างข้อความรายงาน...
              </span>
            </div>
          )}
        </div>

        {/* Input Footer Bar */}
        <div className="p-3.5 bg-[#141414] border-t border-white/5 flex gap-2.5 items-center">
          <input
            type="text"
            placeholder="พิมพ์คำสั่งหรือความคืบหน้างาน เช่น 'บดอัดหินคลุกเสร็จแล้ว 50%..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            className="flex-1 neu-pressed border border-white/5 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={loading || !promptInput.trim()}
            className="neu-orange-btn disabled:opacity-40 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-all font-medium flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
