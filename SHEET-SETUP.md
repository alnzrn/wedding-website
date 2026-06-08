# Save RSVPs to a Google Sheet

The RSVP form posts to a **Google Apps Script web app**, which appends each
submission as a row in a Google Sheet. One-time setup, ~5 minutes.

## 1. Create the sheet
1. Go to <https://sheets.new> and create a blank spreadsheet (e.g. "Wedding RSVPs").

## 2. Add the script
1. In the sheet: **Extensions → Apps Script**.
2. Delete any starter code, then paste the entire contents of
   [`google-apps-script.gs`](google-apps-script.gs).
3. Click the **Save** icon.

## 3. Deploy as a web app
1. Click **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" → **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** **Anyone**   ← required so guests can submit
4. Click **Deploy**, then **Authorize access** and allow the permissions
   (Google may warn it's unverified — that's expected for your own script;
   choose *Advanced → Go to project → Allow*).
5. Copy the **Web app URL** (it ends in `/exec`).

## 4. Connect the website
1. Open [`index.html`](index.html) and find this line (in the `<script>` near the bottom):
   ```js
   var SHEET_ENDPOINT = "";
   ```
2. Paste your URL between the quotes:
   ```js
   var SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
   ```
3. Commit and push:
   ```bash
   git add index.html && git commit -m "Connect RSVP form to Google Sheet" && git push
   ```

## 5. Test
Submit a test RSVP on the live site — a new row should appear in the sheet
(columns: Timestamp, Name, Email, Attending, Guests, Notes).

### Notes
- Until `SHEET_ENDPOINT` is set, the form just shows a thank-you message and
  saves nothing — so the site is never broken while you set this up.
- To change the script later, edit it in Apps Script and **Deploy → Manage
  deployments → Edit → Version: New version**. The `/exec` URL stays the same.
- The browser can't read the response (Apps Script doesn't send CORS headers),
  so the site shows the thank-you optimistically after posting. Check the sheet
  to confirm rows are landing.
