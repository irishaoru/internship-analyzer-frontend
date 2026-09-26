// Public backend address only. Never add an OpenAI API key here.
window.ANALYZER_CONFIG = {
  baseUrl: 'https://internship-analyzer.onrender.com',
  endpoint: '/api/analyze',
  // Role and company are display labels; the backend rejects unknown fields.
  buildRequest: ({ description, resume, cover_letter }) => ({
    job_description: description, resume, cover_letter: cover_letter || null,
  }),
  normalizeResponse: (data) => {
    if (!data || !['strong', 'moderate', 'weak'].includes(data.overall_score) ||
        typeof data.summary !== 'string' || !data.resume_feedback ||
        !Array.isArray(data.requirement_matches) || !Array.isArray(data.next_steps)) {
      throw new Error('The server returned an incomplete analysis. Please try again.');
    }
    return {
      summary: data.summary,
      rating: data.overall_score,
      reasoning: data.score_reasoning,
      strengths: data.resume_feedback.strengths,
      gaps: data.requirement_matches.filter(item => item.gap).map(item => `${item.requirement}: ${item.gap}`),
      requirements: data.requirement_matches.map(item => `${item.requirement} (${item.importance}; ${item.match.replaceAll('_', ' ')}): ${item.evidence}`),
      resume_feedback: data.resume_feedback,
      cover_letter_feedback: data.cover_letter_feedback,
      recommendations: data.next_steps,
    };
  },
};
