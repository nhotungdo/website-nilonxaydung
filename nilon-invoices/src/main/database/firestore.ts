import { initializeApp, getApps, getApp, cert, type App, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';
import { logger } from '../utils/logger';

let app: App | null = null;
let firestoreDb: Firestore | null = null;

function getCredentials(): ServiceAccount | null {
  const candidatePaths = [
    path.resolve(process.cwd(), 'firebase-service-account.json'),
    path.resolve(__dirname, '../../firebase-service-account.json'),
    path.resolve(__dirname, '../../../firebase-service-account.json'),
    path.resolve(__dirname, '../../../../firebase-service-account.json'),
    path.resolve(process.cwd(), '..', 'firebase-service-account.json'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8');
        logger.info(`[Firestore] Found credentials file at: ${p}`);
        return JSON.parse(content);
      } catch (err: any) {
        logger.warn(`[Firestore] Error reading ${p}: ${err.message}`);
      }
    }
  }

  return null;
}

export function initFirestore(): Firestore {
  if (firestoreDb) return firestoreDb;

  const creds = getCredentials();
  const projectId = (creds as any)?.project_id || (creds as any)?.projectId || 'nilon-web-app';

  if (!getApps().length) {
    if (creds) {
      app = initializeApp({
        credential: cert(creds),
        projectId,
      });
      logger.info(`[Firestore] ✅ Initialized Firebase Admin for project: ${projectId}`);
    } else {
      app = initializeApp({
        projectId,
      });
      logger.warn(`[Firestore] ⚠️ Initialized without Service Account credentials file (Project ID: ${projectId})`);
    }
  } else {
    app = getApp();
  }

  firestoreDb = getFirestore(app);
  return firestoreDb;
}

export function getFirestoreDb(): Firestore {
  return firestoreDb || initFirestore();
}
