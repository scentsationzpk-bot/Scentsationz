import { Product, CartItem, Order, Bundle, StoreData } from './types';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  getDocs, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  setDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore';

const STORAGE_KEY = 'scentsationz_universal_v4';

const sanitizeForStorage = <T>(obj: T): T => {
  if (!obj) return obj;
  try {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (value.constructor && value.constructor.name !== 'Object') {
          return undefined; 
        }
      }
      return value;
    }));
  } catch (e) {
    console.warn("Storage sanitization failed", e);
    return (Array.isArray(obj) ? [] : {}) as T;
  }
};

export const getLocalCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data).cart || [];
  } catch {
    return [];
  }
};

export const setLocalCart = (cart: CartItem[]) => {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const parsed = current ? JSON.parse(current) : {};
    const cleanCart = sanitizeForStorage(cart);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, cart: cleanCart }));
  } catch (e) {
    console.error("Cart Persistence Error:", e);
  }
};

export const getAdminState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data).admin || { loggedIn: false, key: "Khazina123" } : { loggedIn: false, key: "Khazina123" };
  } catch {
    return { loggedIn: false, key: "Khazina123" };
  }
};

export const updateAdminStatus = (loggedIn: boolean) => {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const parsed = current ? JSON.parse(current) : {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
      ...parsed, 
      admin: { ...(parsed.admin || { key: "Khazina123" }), loggedIn } 
    }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error("Admin Status Persistence Error:", e);
  }
};

export const getStoreDataSync = (): StoreData => {
  const cart = getLocalCart();
  const admin = getAdminState();
  return {
    products: [], 
    bundles: MOCK_BUNDLES,
    upsells: [],
    cart,
    orders: [],
    reviews: [],
    admin
  };
};

const mapDocToProduct = (d: any): Product => ({
  ...d.data(),
  id: d.id,
  price: Number(d.data().price) || 0,
  stock: Number(d.data().stock) || 0
});

export const getProducts = async (): Promise<Product[]> => {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(mapDocToProduct);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? mapDocToProduct(docSnap) : null;
  } catch (error) {
    console.error("Get Product Error:", error);
    return null;
  }
};

export const addProduct = async (data: Product) => {
  await setDoc(doc(db, 'products', data.id), sanitizeForStorage(data));
};

export const updateProduct = async (product: Product) => {
  const { id, ...data } = product;
  await updateDoc(doc(db, 'products', id), sanitizeForStorage(data));
};

export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({
      ...d.data(),
      orderId: d.id,
      date: d.data().createdAt?.toDate()?.toISOString() || new Date().toISOString()
    } as Order));
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return [];
  }
};

export const addOrder = async (order: Omit<Order, 'orderId' | 'date'>) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...sanitizeForStorage(order),
    createdAt: serverTimestamp()
  });
  setLocalCart([]);
  window.dispatchEvent(new Event('storage'));
  return docRef.id;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  await updateDoc(doc(db, 'orders', orderId), { status });
};

export const deleteOrder = async (orderId: string) => {
  await deleteDoc(doc(db, 'orders', orderId));
};

export const addToCart = (product: Product, quantity: number) => {
  const cart = getLocalCart();
  const existing = cart.find(i => i.id === product.id);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  
  setLocalCart(cart);
  window.dispatchEvent(new Event('storage'));
};

export const removeFromCart = (productId: string) => {
  const cart = getLocalCart().filter(i => i.id !== productId);
  setLocalCart(cart);
  window.dispatchEvent(new Event('storage'));
};

export const updateCartQuantity = (productId: string, quantity: number) => {
  const cart = getLocalCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    setLocalCart(cart);
    window.dispatchEvent(new Event('storage'));
  }
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'starborn',
    name: 'STARBORN',
    price: 2250,
    stock: 50,
    description: 'Black Vault Series. A celestial fusion of gold amber and dark oud. 50ml Eau De Parfum.',
    category: 'Bold',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    badge: 'Bestseller',
    specifications: {
      topNotes: ['Saffron', 'Bergamot'],
      middleNotes: ['Black Rose', 'Oud'],
      baseNotes: ['Amber', 'Vanilla'],
      longevity: 95,
      sillage: 'Strong',
      occasions: ['Evening ✨', 'Party 🕺']
    }
  },
  {
    id: 'cool-current',
    name: 'COOL CURRENT',
    price: 2250,
    stock: 50,
    description: 'Sky Blue Collection. A surge of glacial freshness and teal ocean notes. 50ml Eau De Parfum.',
    category: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    specifications: {
      topNotes: ['Sea Salt', 'Lime'],
      middleNotes: ['Mint', 'Neroli'],
      baseNotes: ['Amberwood', 'Musk'],
      longevity: 80,
      sillage: 'Moderate',
      occasions: ['Daily 💼', 'Summer ☀️']
    }
  },
  {
    id: 'forever-dawn',
    name: 'FOREVER DAWN',
    price: 2250,
    stock: 50,
    description: 'Pure White Edition. Radiant notes of first light and dewy garden blooms. 50ml Eau De Parfum.',
    category: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    badge: 'New Arrival',
    specifications: {
      topNotes: ['White Peach', 'Aldehydes'],
      middleNotes: ['Dewy Rose', 'Peony'],
      baseNotes: ['Iris', 'Solar Musk'],
      longevity: 82,
      sillage: 'Moderate',
      occasions: ['Morning 🌞', 'Office']
    }
  },
  {
    id: 'golden-pulse',
    name: 'GOLDEN PULSE',
    price: 2250,
    stock: 50,
    description: 'Deep Emerald & Orange Series. A warm, vibrating scent of luxury amber. 50ml Eau De Parfum.',
    category: 'Bold',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    badge: 'Limited Edition',
    specifications: {
      topNotes: ['Saffron', 'Nutmeg'],
      middleNotes: ['Amber', 'Labdanum'],
      baseNotes: ['Sandalwood', 'Patchouli'],
      longevity: 90,
      sillage: 'Strong',
      occasions: ['Formal 👔', 'Special Occasion 🎉']
    }
  },
  {
    id: 'tobacco-trail',
    name: 'TOBACCO TRAIL',
    price: 2250,
    stock: 50,
    description: 'Earthy Taupe Series. A smokey path of roasted tobacco and aged oak. 50ml Eau De Parfum.',
    category: 'Woody',
    imageUrl: 'https://images.unsplash.com/photo-1588405864444-839e38339c65?auto=format&fit=crop&q=80&w=800',
    specifications: {
      topNotes: ['Ginger', 'Spices'],
      middleNotes: ['Tobacco Leaf', 'Cacao'],
      baseNotes: ['Oak', 'Vanilla'],
      longevity: 88,
      sillage: 'Moderate',
      occasions: ['Evening ✨', 'Formal 👔']
    }
  }
];

export const MOCK_BUNDLES: Bundle[] = [
  {
    id: 'duo-elite',
    title: 'The Elite Duo',
    productIds: ['starborn', 'cool-current'],
    bundlePrice: 4000,
    originalPrice: 4500,
    discountText: 'Save Rs. 500',
    type: 'duo',
    badge: 'Popular',
    description: 'One for the night, one for the day. Free Shipping included!'
  }
];

export const seedIfEmpty = async () => {
  try {
    const products = await getProducts();
    if (products.length === 0) {
      console.log('Seeding cloud registry with 5 signature scents...');
      const batch = writeBatch(db);
      for (const p of MOCK_PRODUCTS) {
        const docRef = doc(db, 'products', p.id);
        batch.set(docRef, sanitizeForStorage(p));
      }
      await batch.commit();
      console.log('Registry synced successfully.');
    }
  } catch (e) {
    console.error('Seeding error:', e);
  }
};