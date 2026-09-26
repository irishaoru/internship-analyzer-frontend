# Internship Analyzer frontend

A responsive, dependency-free HTML, CSS, and JavaScript frontend. Includes validated internship and resume fields, a labeled sample preview, analysis rendering, JSON download, help dialog, and Start Over (including request cancellation). Input is held in page memory and is not persisted by this frontend.

## Run locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Static hosting can serve these files directly without a build step. Fonts use Google Fonts with local sans-serif fallbacks.

## Connect the backend

The frontend sends POST requests to `https://internship-analyzer.onrender.com/api/analyze`.
`config.js` maps form values to `resume`, `job_description`, and optional `cover_letter`.
It maps the backend response to the categorical rating, evidence, document feedback, and next steps.
Role and company are used as display labels only.

Set `CORS_ORIGINS=https://irishaoru.github.io` in Render for GitHub Pages hosting.
For local testing, add `http://localhost:8000` as a comma-separated origin.
Requests time out after 150 seconds to allow for service startup. No API key belongs in frontend code.
The example preview does not call the backend. Edit a field after loading an example to use live analysis.

## Manual checks

- Try submitting empty fields and short or whitespace-only text.
- Choose **Try an example**, then **Preview example**; check the sample label and download.
- Edit an example field; confirm sample mode clears.
- Choose **Start Over**; confirm inputs and results clear.
- Open and close **How it works**, including Escape.
- Check narrow mobile and wide desktop layouts and keyboard focus.
- Once connected, verify successful responses, HTTP errors, unreachable backend, timeouts, and resetting during an active request.

The request/response mapping follows the Flask backend schema. A live browser analysis is still needed to verify the deployed service and CORS configuration.
