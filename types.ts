export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  website: string;
  linkedin: string;
  jobTitle: string;
  summary: string;
}

export interface CVData {
  personal: PersonalInfo;
  work: WorkExperience[];
  education: Education[];
  skills: string[];
  languages: string[];
}

export enum TemplateType {
  EUROPASS = 'EUROPASS',
  MODERN = 'MODERN',
  MINIMAL = 'MINIMAL',
}

export interface AIRequestParams {
  type: 'summary' | 'improve_work' | 'suggest_skills';
  context: string;
  currentText?: string;
}