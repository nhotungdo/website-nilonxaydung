import { initializeApp, getApps, getApp, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';

let app: App;

function getServiceAccountCredential(): ServiceAccount | null {
  // 1. Direct environment variable with raw JSON or base64 JSON
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim();
      const jsonStr = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
      return JSON.parse(jsonStr);
    } catch (err: any) {
      console.warn('[FirebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  }

  // 2. Explicit file path from env
  const candidatePaths: string[] = [];
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    candidatePaths.push(path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_KEY));
  }

  // 3. Common convention paths in workspace
  candidatePaths.push(
    path.resolve(process.cwd(), 'firebase-service-account.json'),
    path.resolve(process.cwd(), 'service-account.json'),
    path.resolve(process.cwd(), '..', 'firebase-service-account.json'),
    path.resolve(process.cwd(), '..', 'service-account.json')
  );

  for (const filePath of candidatePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      } catch (err: any) {
        console.warn(`[FirebaseAdmin] Error reading credentials at ${filePath}:`, err.message);
      }
    }
  }

  return null;
}

if (!getApps().length) {
  const serviceAccount = getServiceAccountCredential();
  const projectId = process.env.FIREBASE_PROJECT_ID || (serviceAccount as any)?.project_id || (serviceAccount as any)?.projectId || 'nilon-web-app';

  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
    console.log(`[FirebaseAdmin] ✅ Initialized with Service Account for project: ${projectId}`);
  } else {
    app = initializeApp({
      projectId,
    });
    console.log(`[FirebaseAdmin] ⚠️ Initialized without Service Account file (Project ID: ${projectId})`);
  }
} else {
  app = getApp();
}

export const adminDb: Firestore = getFirestore(app);
export const adminAuth: Auth = getAuth(app);
export const adminStorage: Storage = getStorage(app);
export { app };
