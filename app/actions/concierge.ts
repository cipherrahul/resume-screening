'use server';

import { createClient } from '@/lib/supabase/server';

export async function askConcierge(message: string, context?: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // For now, we simulate AI response. In a real app, we'd call Gemini/OpenAI here.
  // We can use the context (applications, jobs) to make the response smarter.
  
  const lowerMsg = message.toLowerCase();
  let response = "I'm analyzing your career trajectory. How else can I assist your elevation today?";

  if (lowerMsg.includes('status') || lowerMsg.includes('application')) {
    response = "Your applications are currently being synchronized with our Neural Matching engine. Most recruiters respond within 48-72 hours. Is there a specific role you're concerned about?";
  } else if (lowerMsg.includes('roadmap') || lowerMsg.includes('improve')) {
    response = "I've generated a personalized Strength Roadmap on your dashboard. Focus on the 'Neural Gaps' identified to increase your match score by up to 40%.";
  } else if (lowerMsg.includes('resume') || lowerMsg.includes('upload')) {
    response = "You can update your primary resume at any time in the 'Profile' section. Our AI will automatically re-score all active applications based on your new data.";
  } else if (lowerMsg.includes('reject')) {
    response = "Rejection is simply redirected energy. Use the 'Career Elevation Protocol' on your dashboard to see exactly what skills to acquire for your next Elite-level role.";
  }

  return { 
    id: Date.now().toString(),
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString()
  };
}
