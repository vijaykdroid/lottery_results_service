import admin from "firebase-admin";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(
  __dirname,
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    "./firebase-service-account.json"
);

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

if (admin.getApps().length === 0) {
  admin.initializeApp({
    credential: admin.cert(serviceAccount),
  });
}

export default admin;