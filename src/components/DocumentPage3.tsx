import React, { useState } from 'react';
import { ReportData, DailyLogItem, LaborItem } from '../types';
import { Calendar, Users, Plus, Trash2, Edit3, Settings } from 'lucide-react';
import { WeatherSelector } from './WeatherSelector';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
}

export const DocumentPage3: React.FC<Props> = ({ data, onChange }) => {
  const updateField = (field: keyof ReportData, value: any) => {
    if (onChange) {
      onChange({ ...data, [field]: value });
    }
  };

  // Resolve labors list (defaulting to the 3 standard presets if not yet initialized)
  const labors: LaborItem[] = data.customLabors ?? [
    { id: 'labor-1', name: 'หัวหน้าคนงาน/ช่าง', counts: data.dailyLogs.map(l => l.foremenCount ?? 0) },
    { id: 'labor-2', name: 'กรรมกร', counts: data.dailyLogs.map(l => l.workerCount ?? 0) },
    { id: 'labor-3', name: 'รถแบคโฮ', counts: data.dailyLogs.map(l => l.backhoeCount ?? 0) },
  ];

  const handleAddDailyLog = () => {
    if (!onChange) return;
    const newLog: DailyLogItem = {
      id: Date.now().toString(),
      dayKey: `D${data.dailyLogs.length + 1}`,
      dateStr: '',
      shortDateStr: '',
      details: '',
      weatherMorning: 'แจ่มใส',
      weatherAfternoon: 'แจ่มใส',
      foremenCount: 0,
      workerCount: 0,
      backhoeCount: 0,
    };
    
    // add empty count to all labor categories
    const updatedLabors = labors.map(labor => ({
      ...labor,
      counts: [...labor.counts, 0]
    }));

    const newTask = {
      id: Date.now().toString() + '-task',
      no: data.tasks.length + 1,
      description: '',
      weightPercent: 0,
      prevPercent: 0,
      thisWeekPercent: 0,
      accumulatedPercent: 0,
      totalPercent: 0,
    };

    onChange({
      ...data,
      dailyLogs: [...data.dailyLogs, newLog],
      customLabors: updatedLabors,
      tasks: [...data.tasks, newTask]
    });
  };

  const handleDeleteDailyLog = (index: number) => {
    if (!onChange) return;
    
    const newLogs = data.dailyLogs.filter((_, i) => i !== index);
    
    const updatedLabors = labors.map(labor => ({
      ...labor,
      counts: labor.counts.filter((_, i) => i !== index)
    }));

    const updatedTasks = data.tasks.filter((_, i) => i !== index).map((t, i) => ({ ...t, no: i + 1 }));

    onChange({
      ...data,
      dailyLogs: newLogs,
      customLabors: updatedLabors,
      tasks: updatedTasks
    });
  };

  const updateDailyLog = (index: number, field: keyof DailyLogItem, value: any) => {
    if (!onChange) return;
    const newLogs = [...data.dailyLogs];
    newLogs[index] = { ...newLogs[index], [field]: value };
    
    let updatedTasks = [...data.tasks];
    if (field === 'details') {
      if (updatedTasks[index]) {
        updatedTasks[index] = { ...updatedTasks[index], description: value };
      } else {
        while (updatedTasks.length <= index) {
          updatedTasks.push({
            id: Date.now().toString() + Math.random(),
            no: updatedTasks.length + 1,
            description: updatedTasks.length === index ? value : '',
            weightPercent: 0,
            prevPercent: 0,
            thisWeekPercent: 0,
            accumulatedPercent: 0,
            totalPercent: 0,
          });
        }
      }
    }

    onChange({ ...data, dailyLogs: newLogs, tasks: updatedTasks });
  };

  const handleAddCustomLabor = () => {
    if (!onChange) return;
    const newLabor: LaborItem = {
      id: `labor-${Date.now()}`,
      name: '',
      counts: new Array(data.dailyLogs.length).fill(0)
    };
    onChange({ ...data, customLabors: [...labors, newLabor] });
  };

  const handleUpdateCustomLabor = (id: string, field: 'name' | 'counts', value: any, dayIndex?: number) => {
    if (!onChange) return;
    const updated = labors.map(labor => {
      if (labor.id === id) {
        if (field === 'counts' && typeof dayIndex === 'number') {
          const newCounts = [...labor.counts];
          newCounts[dayIndex] = value;
          return { ...labor, counts: newCounts };
        }
        return { ...labor, [field]: value };
      }
      return labor;
    });
    onChange({ ...data, customLabors: updated });
  };

  const handleDeleteCustomLabor = (id: string) => {
    if (!onChange) return;
    const updated = labors.filter(labor => labor.id !== id);
    onChange({ ...data, customLabors: updated });
  };

  const handleClearAllLabors = () => {
    if (!onChange) return;
    const updated = labors.map(labor => ({
      ...labor,
      counts: new Array(data.dailyLogs.length).fill(0)
    }));
    onChange({ ...data, customLabors: updated });
  };

  return (
    <div>
      {/* Screen View: Dark Neumorphism Form */}
      <div className="print:hidden space-y-6">
        
        {/* Table 1 Card: Daily Log Details & Weather */}
        <div className="neu-flat p-6 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-orange-400 tracking-wide">
                บันทึกรายวัน (รายละเอียด & สภาพอากาศ)
              </h2>
            </div>
            <button
              onClick={handleAddDailyLog}
              className="neu-button px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2 border border-white/5 transition-all"
            >
              <Plus className="w-4 h-4" /> เพิ่มบันทึกรายวัน
            </button>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[700px]">
              {/* Header */}
              <div className="flex text-xs font-bold text-gray-400 text-center gap-2 mb-2 items-end">
                <div className="w-48 py-2 neu-pressed rounded-xl border border-white/5 flex-shrink-0">วัน/เดือน/ปี</div>
                <div className="flex-1 py-2 neu-pressed rounded-xl border border-white/5 min-w-0">รายละเอียดการดำเนินงาน</div>
                <div className="w-32 py-2 neu-pressed rounded-xl border border-white/5 flex-shrink-0">สภาพอากาศ<br/>(เช้า)</div>
                <div className="w-32 py-2 neu-pressed rounded-xl border border-white/5 flex-shrink-0">สภาพอากาศ<br/>(บ่าย)</div>
                <div className="w-10 flex-shrink-0"></div>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {data.dailyLogs.map((log, idx) => (
                  <div key={log.id} className="flex gap-2 items-center text-sm">
                    <div className="w-48 flex-shrink-0 flex items-center gap-2">
                      <input
                        type="text"
                        value={data.isPlaceholderMode ? log.dayKey : log.dateStr}
                        onChange={(e) => updateDailyLog(idx, data.isPlaceholderMode ? 'dayKey' : 'dateStr', e.target.value)}
                        placeholder="วัน/เดือน/ปี"
                        className="w-full neu-pressed border border-white/5 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                    <div className="flex-1 flex min-w-0">
                      <input
                        type="text"
                        value={log.details}
                        onChange={(e) => updateDailyLog(idx, 'details', e.target.value)}
                        placeholder="ไม่ปฏิบัติงาน"
                        className="w-full neu-pressed border border-white/5 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                      />
                    </div>
                    <div className="w-32 flex-shrink-0">
                      <WeatherSelector
                        value={log.weatherMorning}
                        onChange={(val) => updateDailyLog(idx, 'weatherMorning', val)}
                      />
                    </div>
                    <div className="w-32 flex-shrink-0">
                      <WeatherSelector
                        value={log.weatherAfternoon}
                        onChange={(val) => updateDailyLog(idx, 'weatherAfternoon', val)}
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteDailyLog(idx)}
                      className="w-10 h-10 flex items-center justify-center text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table 2 Card: Labor Account */}
        <div className="neu-flat p-6 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-orange-400 tracking-wide">
                บัญชีแสดงจำนวนแรงงาน
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearAllLabors}
                className="neu-button px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1.5 border border-red-500/20 transition-all cursor-pointer"
                title="ล้างข้อมูลจำนวนแรงงานทั้งหมด"
              >
                <Trash2 className="w-3.5 h-3.5" /> ล้างข้อมูลแรงงานทั้งหมด
              </button>
              <button
                onClick={handleAddCustomLabor}
                className="neu-button px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-2 border border-white/5 transition-all"
              >
                <Plus className="w-4 h-4" /> เพิ่มรายการแรงงาน
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="flex text-xs font-bold gap-2 mb-3 items-center">
                <div className="w-52 py-2.5 px-3 neu-pressed rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 font-bold text-center flex-shrink-0">
                  ประเภทแรงงาน
                </div>
                {data.dailyLogs.map((log, idx) => (
                  <div key={`header-${log.id}`} className="flex-1 min-w-[90px]">
                    <input
                      type="text"
                      value={data.isPlaceholderMode ? `{{S${log.dayKey.replace(/[{}]/g, '')}}}` : log.shortDateStr}
                      onChange={(e) => {
                        if (!data.isPlaceholderMode) {
                          updateDailyLog(idx, 'shortDateStr', e.target.value);
                        }
                      }}
                      disabled={data.isPlaceholderMode}
                      placeholder="วันที่"
                      className="w-full text-center py-2.5 px-1 neu-pressed rounded-xl border border-white/10 focus:outline-none focus:border-orange-500/50 font-bold text-orange-300 bg-orange-500/5 text-xs"
                    />
                  </div>
                ))}
                <div className="w-10 flex-shrink-0"></div>
              </div>

              <div className="space-y-2.5">
                {labors.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs neu-pressed rounded-2xl border border-white/5">
                    ยังไม่มีรายการแรงงาน (กดปุ่ม "+ เพิ่มรายการแรงงาน" ด้านบนเพื่อเพิ่มรายการ หรือปล่อยว่างไว้หากไม่ระบุ)
                  </div>
                ) : (
                  labors.map((labor) => (
                    <div key={labor.id} className="flex gap-2 items-center text-xs">
                      <input
                        type="text"
                        value={labor.name}
                        onChange={(e) => handleUpdateCustomLabor(labor.id, 'name', e.target.value)}
                        placeholder="ระบุประเภทแรงงาน..."
                        className="w-52 flex-shrink-0 h-10 neu-pressed border border-white/5 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-500"
                      />
                      {data.dailyLogs.map((log, idx) => (
                        <input
                          key={`labor-${labor.id}-${log.id}`}
                          type="number"
                          value={labor.counts[idx] !== undefined && labor.counts[idx] !== 0 ? labor.counts[idx] : (labor.counts[idx] === 0 ? '' : '')}
                          onChange={(e) => handleUpdateCustomLabor(labor.id, 'counts', parseInt(e.target.value) || 0, idx)}
                          placeholder="-"
                          className="flex-1 min-w-[90px] h-10 text-center neu-pressed border border-white/5 rounded-xl px-1 py-2 text-white font-semibold focus:outline-none focus:border-orange-500/50 transition-colors"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomLabor(labor.id)}
                        className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 neu-pressed rounded-xl border border-red-500/20 transition-all flex-shrink-0 cursor-pointer"
                        title="ลบรายการแรงงานนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}

                {/* Total Row */}
                {labors.length > 0 && (
                  <div className="flex gap-2 items-center text-xs pt-3 border-t border-white/10 mt-3">
                    <div className="w-52 flex-shrink-0 h-10 text-center font-bold text-gray-300 neu-pressed py-2 px-3 rounded-xl border border-white/5 flex items-center justify-center">
                      รวมทั้งหมด
                    </div>
                    {data.dailyLogs.map((log, idx) => {
                      const total = labors.reduce((sum, cl) => sum + (cl.counts[idx] || 0), 0);
                      return (
                        <div key={`total-${log.id}`} className="flex-1 min-w-[90px] h-10 text-center text-gray-300 font-bold neu-pressed py-2 px-1 rounded-xl border border-white/5 flex items-center justify-center">
                          {total > 0 ? total : '-'}
                        </div>
                      );
                    })}
                    <div className="w-10 flex-shrink-0"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Signatures Card */}
        <div className="neu-flat p-6 rounded-3xl border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto text-center">
            <div className="space-y-4">
              <div className="border-b-2 border-dashed border-white/10 mx-8"></div>
              <div className="flex flex-col items-center gap-2">
                <input
                  type="text"
                  value={data.logSupervisorName || ''}
                  onChange={(e) => updateField('logSupervisorName', e.target.value)}
                  placeholder="ระบุชื่อผู้ควบคุมงาน..."
                  className="w-64 text-center neu-pressed border border-white/5 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
                />
                <div className="text-gray-400 text-sm font-medium">ผู้ควบคุมงาน</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b-2 border-dashed border-white/10 mx-8"></div>
              <div className="flex flex-col items-center gap-2">
                <input
                  type="text"
                  value={data.logContractorName || ''}
                  onChange={(e) => updateField('logContractorName', e.target.value)}
                  placeholder="ระบุชื่อผู้รับจ้าง..."
                  className="w-64 text-center neu-pressed border border-white/5 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
                />
                <div className="text-gray-400 text-sm font-medium">ผู้รับจ้าง</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Print View */}
      <div className="hidden print:flex bg-white text-black p-8 sm:p-12 shadow-none font-sarabun max-w-[210mm] min-h-[297mm] mx-auto text-[15px] leading-relaxed relative flex-col justify-between select-text">
        <div>
          {/* Title */}
          <h2 className="text-base font-bold mb-3">บันทึกการปฏิบัติงานของผู้รับจ้าง</h2>

          {/* Table 1: Daily Work Log & Weather */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse border border-black text-center text-[13px] leading-tight">
              <thead>
                <tr className="bg-gray-50">
                  <th rowSpan={2} className="border border-black p-2 font-bold w-[18%]">
                    วัน/เดือน/ปี
                  </th>
                  <th rowSpan={2} className="border border-black p-2 font-bold w-[60%] text-center">
                    รายละเอียด
                  </th>
                  <th colSpan={2} className="border border-black p-1.5 font-bold w-[22%]">
                    สภาพอากาศ
                  </th>
                </tr>
                <tr className="bg-gray-50 text-[12px]">
                  <th className="border border-black p-1 font-bold w-[11%]">เช้า</th>
                  <th className="border border-black p-1 font-bold w-[11%]">บ่าย</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyLogs.map((log) => (
                  <tr key={log.id} className="min-h-[42px]">
                    <td className="border border-black p-2 font-medium align-middle">
                      {data.isPlaceholderMode ? log.dayKey : log.dateStr}
                    </td>
                    <td className="border border-black p-2 text-left font-medium align-middle leading-normal">
                      {log.details || 'ไม่ปฏิบัติงาน'}
                    </td>
                    <td className="border border-black p-1 font-medium align-middle text-[12px]">
                      {log.weatherMorning || 'แจ่มใส'}
                    </td>
                    <td className="border border-black p-1 font-medium align-middle text-[12px]">
                      {log.weatherAfternoon || 'แจ่มใส'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table 2: Labor and Machinery Count */}
          <div className="space-y-2 mt-6">
            <h3 className="font-bold text-[14px]">
              บัญชีแสดงจำนวนแรงงาน/บัญชีแสดงจำนวนเครื่องจักร
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-center text-[13px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-black p-1.5 font-bold text-left pl-3 w-[28%]">
                      วันที่
                    </th>
                    {data.dailyLogs.map((log) => (
                      <th key={log.id} className="border border-black p-1.5 font-bold w-[10%]">
                        {data.isPlaceholderMode ? `{{S${log.dayKey.replace(/[{}]/g, '')}}}` : log.shortDateStr}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {labors.map((labor) => (
                    <tr key={labor.id}>
                      <td className="border border-black p-1.5 text-left pl-3 font-medium">
                        {labor.name || '-'}
                      </td>
                      {data.dailyLogs.map((log, idx) => (
                        <td key={log.id} className="border border-black p-1.5 font-medium">
                          {labor.counts[idx] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {labors.length > 0 && (
                    <tr className="font-bold bg-gray-50">
                      <td className="border border-black p-1.5 text-left pl-3">รวม</td>
                      {data.dailyLogs.map((log, idx) => {
                        const total = labors.reduce((sum, cl) => sum + (cl.counts[idx] || 0), 0);
                        return (
                          <td key={log.id} className="border border-black p-1.5">
                            {total > 0 ? total : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Signature Section at Bottom */}
        <div className="mt-12 mb-4 grid grid-cols-2 gap-8 text-[14px]">
          {/* Supervisor Signature */}
          <div className="text-center space-y-2">
            <div className="border-b border-dotted border-gray-400 w-3/4 mx-auto pb-1"></div>
            <div className="font-medium">({data.logSupervisorName})</div>
            <div className="font-bold text-[14px]">ผู้ควบคุมงาน</div>
          </div>

          {/* Contractor Signature */}
          <div className="text-center space-y-2">
            <div className="border-b border-dotted border-gray-400 w-3/4 mx-auto pb-1"></div>
            <div className="font-medium">({data.logContractorName})</div>
            <div className="font-bold text-[14px]">ผู้รับจ้าง</div>
          </div>
        </div>
      </div>
    </div>
  );
};
