import React from 'react';
import { CVData, WorkExperience, Education } from '../types';
import { Plus, Trash2, Wand2 } from 'lucide-react';

interface EditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
  onAIAssist: (type: 'summary' | 'improve_work' | 'suggest_skills', context: string, currentText?: string, targetId?: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange, onAIAssist }) => {
  const handleChange = (section: keyof CVData, field: string, value: any) => {
    onChange({
      ...data,
      [section]: { ...data[section] as any, [field]: value }
    });
  };

  const handleArrayChange = (section: 'work' | 'education', index: number, field: string, value: any) => {
    const newArray = [...data[section]];
    (newArray[index] as any)[field] = value;
    onChange({ ...data, [section]: newArray });
  };

  const addWork = () => {
    onChange({
      ...data,
      work: [...data.work, {
        id: Date.now().toString(),
        title: '', company: '', city: '', startDate: '', endDate: '', current: false, description: ''
      }]
    });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, {
        id: Date.now().toString(),
        degree: '', institution: '', city: '', startDate: '', endDate: '', description: ''
      }]
    });
  };

  const removeItem = (section: 'work' | 'education', index: number) => {
    const newArray = [...data[section]];
    newArray.splice(index, 1);
    onChange({ ...data, [section]: newArray });
  };

  const handleSkillsChange = (val: string) => {
    const skills = val.split(',').map(s => s.trim());
    onChange({ ...data, skills });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Personal Info */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-europass-dark mb-4 flex items-center">
          <span className="w-8 h-8 bg-europass-blue text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="input-field"
            value={data.personal.firstName}
            onChange={(e) => handleChange('personal', 'firstName', e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input-field"
            value={data.personal.lastName}
            onChange={(e) => handleChange('personal', 'lastName', e.target.value)}
          />
          <input
            type="text"
            placeholder="Job Title / Profession"
            className="input-field md:col-span-2"
            value={data.personal.jobTitle}
            onChange={(e) => handleChange('personal', 'jobTitle', e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={data.personal.email}
            onChange={(e) => handleChange('personal', 'email', e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="input-field"
            value={data.personal.phone}
            onChange={(e) => handleChange('personal', 'phone', e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="input-field md:col-span-2"
            value={data.personal.address}
            onChange={(e) => handleChange('personal', 'address', e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            className="input-field"
            value={data.personal.city}
            onChange={(e) => handleChange('personal', 'city', e.target.value)}
          />
          <input
            type="text"
            placeholder="Country"
            className="input-field"
            value={data.personal.country}
            onChange={(e) => handleChange('personal', 'country', e.target.value)}
          />
        </div>

        <div className="mt-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
          <div className="relative">
            <textarea
              rows={4}
              className="input-field w-full"
              value={data.personal.summary}
              onChange={(e) => handleChange('personal', 'summary', e.target.value)}
            />
            <button
              onClick={() => onAIAssist('summary', `${data.personal.jobTitle} with skills in ${data.skills.join(', ')}`, '', 'summary')}
              className="absolute bottom-2 right-2 bg-europass-yellow hover:bg-yellow-500 text-europass-dark text-xs px-2 py-1 rounded flex items-center gap-1 font-semibold transition-colors"
            >
              <Wand2 size={12} /> Auto-Write
            </button>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-europass-dark mb-4 flex items-center">
          <span className="w-8 h-8 bg-europass-blue text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
          Work Experience
        </h2>
        
        {data.work.map((job, index) => (
          <div key={job.id} className="mb-6 p-4 bg-gray-50 rounded border border-gray-200 relative group">
            <button
              onClick={() => removeItem('work', index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Job Title"
                className="input-field"
                value={job.title}
                onChange={(e) => handleArrayChange('work', index, 'title', e.target.value)}
              />
              <input
                type="text"
                placeholder="Company"
                className="input-field"
                value={job.company}
                onChange={(e) => handleArrayChange('work', index, 'company', e.target.value)}
              />
              <div className="flex gap-2">
                 <input
                  type="date"
                  className="input-field w-full"
                  value={job.startDate}
                  onChange={(e) => handleArrayChange('work', index, 'startDate', e.target.value)}
                />
                 <input
                  type="date"
                  className="input-field w-full"
                  value={job.endDate}
                  disabled={job.current}
                  onChange={(e) => handleArrayChange('work', index, 'endDate', e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`current-${job.id}`}
                  checked={job.current}
                  onChange={(e) => handleArrayChange('work', index, 'current', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`current-${job.id}`}>Current Role</label>
              </div>
              <div className="md:col-span-2 relative">
                 <textarea
                  placeholder="Describe your main tasks and achievements..."
                  rows={3}
                  className="input-field w-full"
                  value={job.description}
                  onChange={(e) => handleArrayChange('work', index, 'description', e.target.value)}
                />
                 <button
                  onClick={() => onAIAssist('improve_work', `Role: ${job.title}`, job.description, `work-${index}`)}
                  className="absolute bottom-2 right-2 bg-blue-100 hover:bg-blue-200 text-europass-blue text-xs px-2 py-1 rounded flex items-center gap-1 font-semibold transition-colors"
                >
                  <Wand2 size={12} /> Improve
                </button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addWork} className="btn-secondary w-full flex items-center justify-center gap-2">
          <Plus size={16} /> Add Position
        </button>
      </section>

      {/* Education */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-europass-dark mb-4 flex items-center">
          <span className="w-8 h-8 bg-europass-blue text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={edu.id} className="mb-6 p-4 bg-gray-50 rounded border border-gray-200 relative">
             <button
              onClick={() => removeItem('education', index)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Degree / Qualification"
                className="input-field"
                value={edu.degree}
                onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
              />
              <input
                type="text"
                placeholder="Institution / School"
                className="input-field"
                value={edu.institution}
                onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
              />
               <div className="flex gap-2">
                 <input
                  type="date"
                  className="input-field w-full"
                  value={edu.startDate}
                  onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                />
                 <input
                  type="date"
                  className="input-field w-full"
                  value={edu.endDate}
                  onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
         <button onClick={addEducation} className="btn-secondary w-full flex items-center justify-center gap-2">
          <Plus size={16} /> Add Education
        </button>
      </section>

      {/* Skills */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-europass-dark mb-4 flex items-center">
          <span className="w-8 h-8 bg-europass-blue text-white rounded-full flex items-center justify-center text-sm mr-3">4</span>
          Skills & Competences
        </h2>
        <div className="relative">
           <label className="block text-sm font-medium text-gray-700 mb-1">List skills separated by commas</label>
           <textarea
            rows={3}
            className="input-field w-full"
            value={data.skills.join(', ')}
            onChange={(e) => handleSkillsChange(e.target.value)}
            placeholder="e.g. Project Management, React, Leadership, Python"
           />
           <button
            onClick={() => onAIAssist('suggest_skills', data.personal.jobTitle, '', 'skills')}
            className="absolute bottom-2 right-2 bg-europass-yellow hover:bg-yellow-500 text-europass-dark text-xs px-2 py-1 rounded flex items-center gap-1 font-semibold transition-colors"
          >
            <Wand2 size={12} /> Suggest Skills
          </button>
        </div>
      </section>
    </div>
  );
};