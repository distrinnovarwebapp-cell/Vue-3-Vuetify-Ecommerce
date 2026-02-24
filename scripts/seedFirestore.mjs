import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { categories, products } from './seedData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const loadEnv = () => {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return;
  const contents = fs.readFileSync(envPath, 'utf8');
  contents.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^"(.*)"$/, '$1');
    }
  });
};

loadEnv();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys = Object.entries(firebaseConfig).filter(([, value]) => !value);
if (requiredKeys.length > 0) {
  console.error(
    'Faltan variables de entorno de Firebase. Verifica tu .env: ',
    requiredKeys.map(([key]) => key).join(', ')
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const shouldClear = process.argv.includes('--clear');

const clearCollection = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref)));
};

const seedCategories = async () => {
  await Promise.all(
    categories.map((category) =>
      setDoc(doc(db, 'categories', category.id), {
        name: category.name,
        icon: category.icon,
      })
    )
  );
};

const seedProducts = async () => {
  for (const product of products) {
    await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

const main = async () => {
  if (shouldClear) {
    console.log('Limpiando colecciones: categories, products...');
    await clearCollection('products');
    await clearCollection('categories');
  }

  console.log('Cargando categorías...');
  await seedCategories();

  console.log('Cargando productos...');
  await seedProducts();

  console.log('Seed completado.');
};

main().catch((err) => {
  console.error('Error en el seed:', err);
  process.exit(1);
});
