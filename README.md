# Internship Analyzer frontend

A responsive, dependency-free HTML, CSS, and JavaScript frontend. Includes validated internship and resume fields, a labeled sample preview, analysis rendering, JSON download, help dialog, and Start Over (including request cancellation). Input is held in page memory and is not persisted by this frontend.

## Run locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Static hosting can serve these files directly without a build step. Fonts use Google Fonts with local sans-serif fallbacks.

## Connect the backend

The Render API could not be inspected during development. No route or response schema has been verified, so live requests are disabled until configured. The sample uses illustrative data and never calls the backend.

In `config.js`:

1. Set `endpoint` to the verified analysis route.
2. Adjust `buildRequest` to the backend’s expected JSON fields. The supplied field names are placeholders, not a verified contract.
3. Adjust `normalizeResponse` to return `{ summary, match_score, strengths, gaps, recommendations }`. `match_score` is an optional number from 0 to 100; the lists should contain strings. Unmapped nonempty JSON objects appear as a backend response for debugging.
4. Enable CORS on the backend for the deployed frontend origin (and http://localhost:8000 during development), including POST, OPTIONS, and Content-Type.

The client sends a POST with JSON and waits up to 90 seconds for Render startup. If the backend uses file uploads, authentication, or a different method, update the request implementation in `app.js` after confirming the contract. Never put a secret API key into client-side files.

## Manual checks

- Try submitting empty fields and short or whitespace-only text.
- Choose **Try an example**, then **Preview example**; check the sample label and download.
- Edit an example field; confirm sample mode clears.
- Choose **Start Over**; confirm inputs and results clear.
- Open and close **How it works**, including Escape.
- Check narrow mobile and wide desktop layouts and keyboard focus.
- Once connected, verify successful responses, HTTP errors, unreachable backend, timeouts, and resetting during an active request.

API integration and browser interaction checks require the backend contract and a browser runtime; they have not yet been verified.
