import { ParsedResume } from '@/types/resume';

/**
 * Step 14: Keyword Matching Algorithm
 * Calculates the percentage of required skills found in the resume.
 */
export function calculateKeywordScore(resumeSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 100;
  
  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());
  const matches = jobSkills.filter(skill => 
    resumeSkillsLower.includes(skill.toLowerCase())
  );

  return Math.round((matches.length / jobSkills.length) * 100);
}

/**
 * Step 15: Semantic Matching (Cosine Similarity)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(mA) * Math.sqrt(mB));
}

/**
 * Step 16: Final Hybrid Scoring Logic
 */
export function calculateFinalScore(keywordScore: number, semanticSimilarity: number): number {
  // Convert similarity (-1 to 1) to a 0-100 score
  const semanticScore = Math.max(0, Math.round(semanticSimilarity * 100));
  
  // 40% Keyword + 60% Semantic
  const finalScore = (keywordScore * 0.4) + (semanticScore * 0.6);
  
  return Math.round(finalScore);
}
