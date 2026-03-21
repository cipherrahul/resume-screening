export interface ParsedResume {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
}

export interface EvaluationResult {
  score: number;
  strengths: string[];
  gaps: string[];
  recommendation: 'Strong Fit' | 'Moderate Fit' | 'Not Fit';
}
