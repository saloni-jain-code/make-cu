const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps.length) return admin;

  // Prefer explicit service account JSON via env var for local/dev
  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (saJson) {
    try {
      const credentials = JSON.parse(saJson);
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
      throw e;
    }
  } else {
    // Fallback to ADC (GOOGLE_APPLICATION_CREDENTIALS or environment default)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
  return admin;
}

const app = initFirebase();
const db = app.firestore();

module.exports = { admin: app, db };
