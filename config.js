// Set the verified route and adapters when your backend API contract is available.
window.ANALYZER_CONFIG = {
  baseUrl: 'https://internship-analyzer.onrender.com',
  endpoint: '',
  // Customize this to match the backend's request schema.
  buildRequest: ({ description, resume, role, company }) => ({
    job_description: description, resume_text: resume, role, company,
  }),
  // Normalize the response to { summary, match_score, strengths, gaps, recommendations }.
  normalizeResponse: (data) => data,
};
