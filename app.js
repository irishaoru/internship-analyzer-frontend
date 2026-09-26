'use strict';

const $ = (id) => document.getElementById(id);
const form = $('analyzer-form');
let controller = null;
let currentResult = null;
let exampleMode = false;
const example = {
  role: 'Software Engineering Intern', company: 'Example Company',
  description: 'Join our engineering team for a summer internship building thoughtful web experiences. You will develop responsive interfaces with HTML, CSS, and JavaScript, collaborate with designers, integrate REST APIs, and participate in code reviews. We are looking for a student pursuing computer science or a related degree, with experience using Git, strong problem-solving skills, and an interest in accessible design. Familiarity with React and automated testing is a plus.',
  resume: 'Computer Science student with experience building responsive websites using HTML, CSS, and JavaScript. Built a campus events application that fetches data from a REST API and supports mobile layouts. Collaborated with three classmates using Git and GitHub for version control and code reviews. Coursework includes data structures and software engineering. Interested in creating accessible, easy-to-use web experiences.',
};
const sampleResult = { summary: 'Your web development projects align with the core responsibilities of this example internship. Lead with your API integration experience and team project.', strengths: ['HTML, CSS, and JavaScript experience', 'REST API integration in a campus events application', 'Git collaboration and code reviews'], gaps: ['React experience is not mentioned in this resume.', 'Automated testing experience is not mentioned.'], recommendations: ['Explain your contribution to the campus events project and its impact.', 'Add a small React project to demonstrate familiarity.', 'Practice testing a key interaction in one of your projects.'] };

function status(message, error = false) { $('form-status').textContent = message; $('form-status').classList.toggle('error', error); }
function updateCount() { $('description-count').textContent = `${$('description').value.length.toLocaleString()} / 30,000`; }
function setBusy(busy) { $('analyze-button').disabled = busy; $('analyze-button').textContent = busy ? 'Analyzing…' : exampleMode ? 'Preview example ↗' : 'Analyze my fit ↗'; form.setAttribute('aria-busy', String(busy)); }
function clearResults() { currentResult = null; $('analysis-results').hidden = true; $('empty-results').hidden = false; }
function addSection(title, value) {
  if (value == null || value === '') return;
  const section = document.createElement('section'); section.className = 'result-section';
  const heading = document.createElement('h4'); heading.textContent = title; section.append(heading);
  if (Array.isArray(value)) { const list = document.createElement('ul'); value.forEach(item => { const li = document.createElement('li'); li.textContent = typeof item === 'string' ? item : JSON.stringify(item); list.append(li); }); section.append(list); }
  else { const p = document.createElement('p'); p.textContent = typeof value === 'string' ? value : JSON.stringify(value, null, 2); section.append(p); }
  $('result-content').append(section);
}
function renderResult(result, sample, context) {
  currentResult = { ...result, sample, role: context.role, company: context.company };
  $('empty-results').hidden = true; $('analysis-results').hidden = false; $('result-content').replaceChildren();
  $('result-badge').textContent = sample ? 'EXAMPLE · NOT A LIVE ANALYSIS' : 'ANALYSIS COMPLETE';
  $('result-role').textContent = [context.role, context.company].filter(Boolean).join(' at ') || 'Your internship analysis';
  if (typeof result.match_score === 'number' && result.match_score >= 0 && result.match_score <= 100) addSection('Match score', `${result.match_score}%`);
  addSection('The overview', result.summary); addSection('Your strengths', result.strengths); addSection('Room to grow', result.gaps); addSection('Your next steps', result.recommendations);
  if (!$('result-content').children.length) addSection('Backend response', result);
  $('analysis-results').focus({ preventScroll: true });
}
$('sample-button').addEventListener('click', () => { controller?.abort(); controller = null; Object.entries(example).forEach(([key, value]) => { $(key).value = value; }); exampleMode = true; clearResults(); updateCount(); setBusy(false); status('Example loaded. Preview an illustrative analysis without sending data.'); });
form.addEventListener('input', () => { controller?.abort(); controller = null; exampleMode = false; clearResults(); updateCount(); setBusy(false); status(''); });
$('reset-button').addEventListener('click', () => { controller?.abort(); controller = null; form.reset(); exampleMode = false; clearResults(); updateCount(); setBusy(false); status(''); $('role').focus(); });
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form)); Object.keys(values).forEach(key => { values[key] = values[key].trim(); });
  if (values.description.length < 50 || values.resume.length < 50) { status('Add at least 50 characters to both the description and your resume.', true); return; }
  if (exampleMode) { renderResult(sampleResult, true, values); status('Sample preview only. Edit the fields to prepare your own analysis.'); return; }
  const config = window.ANALYZER_CONFIG;
  if (!config?.endpoint) { status('Live analysis is not connected yet. Your text has not been sent. Use “Try an example” to explore a sample result.', true); return; }
  controller?.abort(); const request = new AbortController(); controller = request; setBusy(true); clearResults(); status('Analyzing your experience. The server may take a moment to wake up.');
  const timeout = setTimeout(() => request.abort(), 90000);
  try {
    const response = await fetch(new URL(config.endpoint, config.baseUrl), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config.buildRequest(values)), signal: request.signal });
    if (!response.ok) throw new Error(`The server returned an error (${response.status}). Please try again.`);
    const result = config.normalizeResponse(await response.json());
    if (controller !== request) return;
    if (!result || typeof result !== 'object' || Array.isArray(result) || !Object.keys(result).length) throw new Error('The server returned an unexpected response. Please check the API response mapping.');
    renderResult(result, false, values); status('Analysis complete.');
  } catch (error) {
    if (controller !== request) return;
    status(error.name === 'AbortError' ? 'The request timed out. Please try again.' : error instanceof TypeError ? 'Could not reach the analysis server. Check your connection and the backend’s CORS settings.' : error.message, true);
  } finally { clearTimeout(timeout); if (controller === request) { controller = null; setBusy(false); } }
});
$('download-button').addEventListener('click', () => { if (!currentResult) return; const url = URL.createObjectURL(new Blob([JSON.stringify(currentResult, null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = currentResult.sample ? 'example-analysis.json' : 'internship-analysis.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
$('help-button').addEventListener('click', () => $('help-dialog').showModal());
['close-help', 'help-done'].forEach(id => $(id).addEventListener('click', () => $('help-dialog').close()));
