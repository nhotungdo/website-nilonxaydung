import { adminDb } from '../lib/firebase-admin';
import { PRODUCTS } from '../data/products';
import { FieldValue } from 'firebase-admin/firestore';

async function seedFirestore() {
  console.log(`[Seed Firestore] Starting seed for ${PRODUCTS.length} products...`);

  const batchSize = 400; // Firestore batch limit is 500
  let batch = adminDb.batch();
  let count = 0;
  let totalBatches = 0;

  for (const p of PRODUCTS) {
    const docRef = adminDb.collection('products').doc(p.slug || p.id);
    batch.set(
      docRef,
      {
        name: p.name,
        sku: p.id,
        slug: p.slug,
        description: p.description || '',
        image: p.image,
        images: p.images || [p.image],
        price: p.price,
        stock: 100,
        unit: p.unit || 'Cái',
        category: p.category,
        categorySlug: p.categorySlug,
        subCategory: p.subCategory,
        isBestSeller: p.isBestSeller || false,
        isNew: p.isNew || false,
        specs: p.specs || [],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    count++;
    if (count % batchSize === 0) {
      await batch.commit();
      totalBatches++;
      console.log(`[Seed Firestore] Committed batch ${totalBatches} (${count} products)...`);
      batch = adminDb.batch();
    }
  }

  if (count % batchSize !== 0) {
    await batch.commit();
    totalBatches++;
    console.log(`[Seed Firestore] Committed final batch ${totalBatches} (${count} products).`);
  }

  // Seed default app settings
  console.log('[Seed Firestore] Seeding default app_settings...');
  await adminDb.collection('app_settings').doc('default').set(
    {
      apiUrl: 'http://localhost:5000/api/print-orders',
      socketUrl: 'http://localhost:5000',
      apiToken: 'nilon-secret-key-2024',
      autoStartup: true,
      notificationSound: true,
      darkMode: true,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Seed default printer
  console.log('[Seed Firestore] Seeding default printer...');
  await adminDb.collection('printers').doc('default-k80').set(
    {
      name: 'Máy in nhiệt K80 (Mặc định)',
      paperSize: 'K80',
      connectionType: 'USB',
      ipAddress: '',
      isDefault: true,
      isActive: true,
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log('[Seed Firestore] ✅ Seeding completed successfully!');
  process.exit(0);
}

seedFirestore().catch((err) => {
  console.error('[Seed Firestore] ❌ Seeding failed:', err);
  process.exit(1);
});

