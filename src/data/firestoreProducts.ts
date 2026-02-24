import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Product, Category } from '../types/product';

const mapProduct = (docSnap: any): Product => {
  const data = docSnap.data() as Omit<Product, 'id'>;
  return {
    id: docSnap.id as string,
    ...data,
  };
};

const mapCategory = (docSnap: any): Category => {
  const data = docSnap.data() as Omit<Category, 'id'>;
  return {
    id: docSnap.id as string,
    ...data,
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(mapProduct);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map(mapCategory);
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const snapshot = await getDoc(doc(db, 'products', id));
  if (!snapshot.exists()) return null;
  return mapProduct(snapshot);
};
