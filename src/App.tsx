import React, { useState, useEffect } from 'react';
import { placeholderReportData, filledSampleReportData } from './data/presets';
import { ReportData, Project } from './types';
import { TopBar, ViewState } from './components/TopBar';
import { ProjectDrawer } from './components/ProjectDrawer';
import { DocumentPage1 } from './components/DocumentPage1';
import { DocumentPage2 } from './components/DocumentPage2';
import { DocumentPage3 } from './components/DocumentPage3';
import { ExportView } from './components/ExportView';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { UploadCloud, FileText } from 'lucide-react';

const STORAGE_KEY = 'contractscan_projects_v2';

function fixProjectDates(projectList: Project[]): Project[] {
  return projectList.map((p) => {
    if (!p.data || !Array.isArray(p.data.dailyLogs)) return p;
    const updatedLogs = p.data.dailyLogs.map((log) => {
      if (log.shortDateStr && !/\d{2,4}/.test(log.shortDateStr) && !log.shortDateStr.includes('{{')) {
        const yearMatch = log.dateStr ? log.dateStr.match(/\d{4}/) : null;
        const year = yearMatch ? yearMatch[0] : '2569';
        return { ...log, shortDateStr: `${log.shortDateStr} ${year}` };
      }
      return log;
    });
    return {
      ...p,
      data: {
        ...p.data,
        dailyLogs: updatedLogs,
      },
    };
  });
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return fixProjectDates(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    // Default initial project
    return fixProjectDates([
      {
        id: 'proj-1',
        name: filledSampleReportData.projectName || 'โครงการก่อสร้างถนนคอนกรีตเสริมเหล็ก',
        updatedAt: '15 ม.ค. 2569',
        data: filledSampleReportData,
      },
    ]);
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => projects[0]?.id || 'proj-1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('upload');
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);

  // Active report data derives from active project or fallback
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const reportData = activeProject?.data || placeholderReportData;

  // Sync projects to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  const handleUpdateReportData = (newData: ReportData) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === activeProjectId) {
          const formattedDate = new Date().toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          return {
            ...p,
            name: newData.projectName || p.name || 'โครงการใหม่',
            updatedAt: formattedDate,
            data: newData,
          };
        }
        return p;
      })
    );
  };

  const togglePreset = () => {
    const updated = reportData.isPlaceholderMode ? filledSampleReportData : placeholderReportData;
    handleUpdateReportData(updated);
  };

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
  };

  const handleAddProject = () => {
    const newId = `proj-${Date.now()}`;
    const newCount = projects.length + 1;
    const newProjectData: ReportData = {
      ...placeholderReportData,
      projectName: `โครงการใหม่ที่ ${newCount}`,
      docNo: `${String(newCount).padStart(2, '0')}/2569`,
    };

    const newProject: Project = {
      id: newId,
      name: newProjectData.projectName,
      updatedAt: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      data: newProjectData,
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newId);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) {
        const fresh: Project = {
          id: `proj-${Date.now()}`,
          name: 'โครงการใหม่',
          updatedAt: new Date().toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          data: placeholderReportData,
        };
        setActiveProjectId(fresh.id);
        return [fresh];
      }
      if (activeProjectId === id) {
        setActiveProjectId(filtered[0].id);
      }
      return filtered;
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col font-sarabun selection:bg-orange-500 selection:text-white relative">
      {/* Top Header Bar */}
      <TopBar
        activeView={activeView}
        onViewChange={setActiveView}
        isPlaceholderMode={reportData.isPlaceholderMode}
        onTogglePreset={togglePreset}
        onOpenGemini={() => setIsGeminiOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        activeProjectName={reportData.projectName}
      />

      {/* Slide-out Left Drawer for Project Management */}
      <ProjectDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Upload View Placeholder */}
          {activeView === 'upload' && (
            <div className="neu-flat p-8 rounded-3xl border border-white/5 text-center flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-20 h-20 rounded-full neu-pressed flex items-center justify-center text-orange-400 mb-6">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">อัปโหลด & สแกนวิเคราะห์สัญญาจ้าง</h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                อัปโหลดไฟล์เอกสารสัญญาจ้าง (PDF หรือ รูปภาพ) เพื่อให้ระบบทำการสแกนและดึงข้อมูลออกมาให้อัตโนมัติด้วยเทคโนโลยี AI
              </p>
              <button className="neu-orange-btn px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5" />
                เลือกไฟล์เพื่อสแกน
              </button>
            </div>
          )}

          {/* Contract Info View (Page 1) */}
          {activeView === 'contract-info' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  ข้อมูลสัญญา (Contract Info)
                </span>
                <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
              </div>
              <DocumentPage1 data={reportData} onChange={handleUpdateReportData} />
            </div>
          )}

          {/* Weekly Log View (Page 2) */}
          {activeView === 'weekly-log' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  บันทึกประจำสัปดาห์ (Weekly Log)
                </span>
                <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
              </div>
              <DocumentPage2 data={reportData} onChange={handleUpdateReportData} />
            </div>
          )}

          {/* Daily Log View (Page 3) */}
          {activeView === 'daily-log' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  บันทึกรายวัน (Daily Log)
                </span>
                <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
              </div>
              <DocumentPage3 data={reportData} onChange={handleUpdateReportData} />
            </div>
          )}

          {/* Export View */}
          {activeView === 'export' && <ExportView data={reportData} />}

        </div>
      </main>

      {/* Gemini AI Assistant Modal */}
      <GeminiAssistantModal
        data={reportData}
        onApplyReport={(updated) => handleUpdateReportData(updated)}
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
      />
    </div>
  );
}
