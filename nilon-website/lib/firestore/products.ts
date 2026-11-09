import { adminDb } from '../firebase-admin';
import { PRODUCTS, type Product } from '../../data/products';

export async function getAllProducts(): Promise<Product[]> {
  try {
    const snap = await adminDb.collection('products').get();
    if (snap.empty) {
      return PRODUCTS;
    }
    return snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: d.sku || doc.id,
        name: d.name,
        slug: d.slug || doc.id,
        description: d.description || '',
        image: d.image || '',
        images: d.images || [d.image],
        price: d.price || 0,
        unit: d.unit || 'Cái',
        category: d.category || '',
        categorySlug: d.categorySlug || '',
        subCategory: d.subCategory || '',
        isBestSeller: d.isBestSeller || false,
        isNew: d.isNew || false,
        specs: d.specs || [],
      };
    });
  } catch (err: any) {
    console.warn('[Firestore] Error fetching all products, falling back to static products:', err.message);
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // 1. Direct doc lookup by slug
    const directDoc = await adminDb.collection('products').doc(slug).get();
    if (directDoc.exists) {
      const d = directDoc.data()!;
      return {
        id: d.sku || directDoc.id,
        name: d.name,
        slug: d.slug || directDoc.id,
        description: d.description || '',
        image: d.image || '',
        images: d.images || [d.image],
        price: d.price || 0,
        unit: d.unit || 'Cái',
        category: d.category || '',
        categorySlug: d.categorySlug || '',
        subCategory: d.subCategory || '',
        isBestSeller: d.isBestSeller || false,
        isNew: d.isNew || false,
        specs: d.specs || [],
      };
    }

    // 2. Query where slug == slug
    const snap = await adminDb.collection('products').where('slug', '==', slug).limit(1).get();
    if (!snap.empty) {
      const d = snap.docs[0].data();
      return {
        id: d.sku || snap.docs[0].id,
        name: d.name,
        slug: d.slug || snap.docs[0].id,
        description: d.description || '',
        image: d.image || '',
        images: d.images || [d.image],
        price: d.price || 0,
        unit: d.unit || 'Cái',
        category: d.category || '',
        categorySlug: d.categorySlug || '',
        subCategory: d.subCategory || '',
        isBestSeller: d.isBestSeller || false,
        isNew: d.isNew || false,
        specs: d.specs || [],
      };
    }
  } catch (err: any) {
    console.warn(`[Firestore] Error fetching product by slug ${slug}:`, err.message);
  }

  // Fallback to static PRODUCTS
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const snap = await adminDb
      .collection('products')
      .where('categorySlug', '==', categorySlug)
      .get();

    if (!snap.empty) {
      return snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: d.sku || doc.id,
          name: d.name,
          slug: d.slug || doc.id,
          description: d.description || '',
          image: d.image || '',
          images: d.images || [d.image],
          price: d.price || 0,
          unit: d.unit || 'Cái',
          category: d.category || '',
          categorySlug: d.categorySlug || '',
          subCategory: d.subCategory || '',
          isBestSeller: d.isBestSeller || false,
          isNew: d.isNew || false,
          specs: d.specs || [],
        };
      });
    }
  } catch (err: any) {
    console.warn(`[Firestore] Error fetching products for category ${categorySlug}:`, err.message);
  }

  return PRODUCTS.filter((p) => p.categorySlug === categorySlug || p.category === categorySlug);
}

