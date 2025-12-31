import type { Product, Category } from '../types/product';

// --- DEFINICIÓN DE CATEGORÍAS ---
export const categories: Category[] = [
  { id: 'postres', name: 'Postres en Vaso', icon: 'mdi-cup' },
  { id: 'cupcakes', name: 'Cupcakes Especiales', icon: 'mdi-cupcake' },
  { id: 'tortas', name: 'Tortas de Diseño', icon: 'mdi-cake-variant' },
];

// --- LISTADO DE PRODUCTOS REALES ---
export const products: Product[] = [
  // --- POSTRES EN VASO (FOTOS REALES) ---
  {
    id: 1,
    name: 'Postre Chocomania',
    description: 'Explosión de chocolate en capas: bizcocho húmedo, mousse de chocolate artesanal y toppings crujientes.',
    price: 12500,
    category: 'postres',
    brand: 'Cupcake Mania Premium',
    image: 'https://i.imgur.com/8B07kxR.jpeg',
    rating: 5.0,
    stock: 25,
    featured: true,
  },
  {
    id: 2,
    name: 'Postre Fresmania',
    description: 'La combinación perfecta de fresas frescas, crema batida ligera y un toque secreto de la casa.',
    price: 12500,
    category: 'postres',
    brand: 'Cupcake Mania Premium',
    image: 'https://i.imgur.com/EA95e2o.jpeg',
    rating: 4.9,
    stock: 20,
    featured: true,
  },
  {
    id: 3,
    name: 'Postre Oreoches',
    description: 'Delicioso postre cremoso tipo cheesecake con generosos trozos de galleta Oreo y base crocante.',
    price: 13000,
    category: 'postres',
    brand: 'Cupcake Mania Premium',
    image: 'https://i.imgur.com/EdL6F4z.jpeg',
    rating: 4.8,
    stock: 15,
    featured: false,
  },

  // --- CUPCAKES (FOTOS REALES) ---
  {
    id: 4,
    name: 'Cupcake de Vainilla y Arequipe',
    description: 'Clásico bizcocho de vainilla suave, coronado con un generoso y cremoso remolino de arequipe tradicional.',
    price: 7500,
    category: 'cupcakes',
    brand: 'Cupcake Mania Original',
    image: 'https://i.imgur.com/vsorSeP.jpeg',
    rating: 4.7,
    stock: 40,
    featured: true,
  },
  {
    id: 5,
    name: 'Cupcake de Vainilla y Fresas',
    description: 'Esponjoso cupcake de vainilla con un delicado frosting de crema de fresas naturales.',
    price: 7500,
    category: 'cupcakes',
    brand: 'Cupcake Mania Original',
    image: 'https://i.imgur.com/jjaOVpR.jpeg',
    rating: 4.8,
    stock: 35,
    featured: false,
  },

  // --- ADICIONALES (REFERENCIA) ---
  {
    id: 6,
    name: 'Torta Arcoíris (Rainbow)',
    description: 'Seis capas de colores vibrantes con relleno de crema de vainilla. Perfecta para cumpleaños.',
    price: 95000,
    category: 'tortas',
    brand: 'Cupcake Mania Cakes',
    image: 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    stock: 5,
    featured: true,
  }
];