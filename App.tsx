import React, { useState, useRef } from 'react';
import { CVData, TemplateType } from './types';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { generateCVSuggestion } from './services/aiService';
import { FileText, Download, LayoutTemplate, Loader2, Sparkles, X } from 'lucide-react';

const initialData: CVData = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    website: '',
    linkedin: '',
    jobTitle: '',
    summary: ''
  },
  work: [],
  education: [],
  skills: [],
  languages: []
};

const App: React.FC = () => {
  const [data, setData] = useState<CVData>(initialData);
  const [template, setTemplate] = useState<TemplateType>(TemplateType.EUROPASS);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [targetFieldId, setTargetFieldId] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleAIAssist = async (type: 'summary' | 'improve_work' | 'suggest_skills', context: string, currentText?: string, targetId?: string) => {
    setIsGenerating(true);
    setAiModalOpen(true);
    setAiResult('');
    setTargetFieldId(targetId || null);
    
    const result = await generateCVSuggestion({ type, context, currentText });
    setAiResult(result);
    setIsGenerating(false);
  };

  const applyAISuggestion = () => {
    if (!targetFieldId) return;

    if (targetFieldId === 'summary') {
      setData({ ...data, personal: { ...data.personal, summary: aiResult } });
    } else if (targetFieldId === 'skills') {
       // Only add unique skills
       const newSkills = aiResult.split(',').map(s => s.trim()).filter(s => s.length > 0);
       const combined = Array.from(new Set([...data.skills, ...newSkills]));
       setData({...data, skills: combined});
    } else if (targetFieldId.startsWith('work-')) {
      const index = parseInt(targetFieldId.split('-')[1]);
      if (!isNaN(index) && data.work[index]) {
        const newWork = [...data.work];
        newWork[index].description = aiResult;
        setData({ ...data, work: newWork });
      }
    }

    setAiModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-europass-blue text-white shadow-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-europass-yellow"><Sparkles size={24} /></span>
            <span>EuroCV</span>
            <span className="font-light opacity-80 text-sm ml-2 hidden sm:inline-block">AI-Powered Editor</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 mr-4 bg-europass-dark px-3 py-1 rounded-full text-sm">
                <LayoutTemplate size={16} className="text-europass-yellow" />
                <select 
                  className="bg-transparent border-none text-white focus:ring-0 cursor-pointer outline-none"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as TemplateType)}
                >
                  <option className="text-gray-900" value={TemplateType.EUROPASS}>Europass Classic</option>
                  <option className="text-gray-900" value={TemplateType.MODERN}>Modern Professional</option>
                  <option className="text-gray-900" value={TemplateType.MINIMAL}>Elegant Minimalist</option>
                </select>
             </div>
            <button 
              onClick={handlePrint}
              className="bg-europass-yellow text-europass-dark px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Editor Side (Scrollable) */}
        <div className="w-full md:w-1/2 lg:w-5/12 h-full overflow-y-auto bg-gray-50 p-4 md:p-8 no-print border-r border-gray-200">
           <div className="max-w-2xl mx-auto">
             <div className="mb-6">
               <h1 className="text-2xl font-bold text-gray-800">Create your profile</h1>
               <p className="text-gray-500 text-sm">Fill in your details. Use the AI wand to auto-complete sections.</p>
             </div>
             <Editor 
                data={data} 
                onChange={setData} 
                onAIAssist={handleAIAssist}
             />
           </div>
        </div>

        {/* Preview Side (Scrollable or Sticky) */}
        <div className="w-full md:w-1/2 lg:w-7/12 h-full overflow-y-auto bg-gray-200 p-4 md:p-8 flex justify-center print:w-full print:p-0 print:overflow-visible">
           <div className="w-full max-w-[210mm] print:max-w-none print:w-full bg-white shadow-2xl print:shadow-none min-h-[297mm]">
             <Preview data={data} template={template} />
           </div>
        </div>
      </div>

      {/* AI Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-europass-blue p-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-europass-yellow" />
                AI Assistant
              </h3>
              <button onClick={() => setAiModalOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Loader2 size={40} className="animate-spin text-europass-blue mb-4" />
                  <p>Thinking... Gemini is generating ideas.</p>
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suggestion Result:</label>
                  <textarea 
                    className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-europass-blue focus:border-transparent resize-none text-sm"
                    value={aiResult}
                    onChange={(e) => setAiResult(e.target.value)}
                  />
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button 
                      onClick={() => setAiModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                      Discard
                    </button>
                    <button 
                      onClick={applyAISuggestion}
                      className="px-4 py-2 bg-europass-blue text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center gap-2"
                    >
                      Apply Suggestion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input-field {
          @apply w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow;
        }
        .btn-secondary {
          @apply bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50 transition-colors;
        }
      `}</style>
    </div>
  );
};

export default App;