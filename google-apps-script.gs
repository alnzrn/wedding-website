/**
 * RSVP -> Google Sheet  (Google Apps Script Web App)
 *
 * This receives the wedding-site RSVP form POSTs and appends one row per
 * submission to the bound spreadsheet. See SHEET-SETUP.md for deploy steps.
 *
 * Form fields sent by the site: name, email, attending, guests, diet
 */

var SHEET_NAME = 'RSVPs'; // tab to write to (created automatically if missing)

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // avoid two submissions writing the same row
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Write a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Attending', 'Guests', 'Notes']);
    }

    var p = (e && e.parameter) ? e.parameter : {};
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.email || '',
      p.attending || '',
      p.guests || '',
      p.diet || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to confirm it's deployed.
function doGet() {
  return ContentService.createTextOutput('RSVP endpoint is live.');
}
