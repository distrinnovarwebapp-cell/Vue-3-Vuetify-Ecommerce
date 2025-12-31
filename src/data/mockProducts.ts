import type { Product, Category } from '../types/product';

// --- DEFINICIÓN DE CATEGORÍAS ---
// Enfocadas en el negocio de manufactura y distribución
export const categories: Category[] = [
  { 
    id: 'ornamentacion', 
    name: 'Ornamentación', 
    icon: 'mdi-gate' // Icono de reja/portón
  },
  { 
    id: 'embalaje', 
    name: 'Embalajes y Protección', 
    icon: 'mdi-package-variant' // Icono de caja
  },
  { 
    id: 'molduras', 
    name: 'Molduras e Icopor', 
    icon: 'mdi-texture-box' // Icono de textura/material
  },
];

// --- LISTADO DE PRODUCTOS ---
// Precios en COP (Pesos Colombianos) aproximados para el ejemplo
export const products: Product[] = [
  // --- CATEGORÍA: ORNAMENTACIÓN ---
  {
    id: 1,
    name: 'Pie de Amigo Reforzado Industrial',
    description: 'Soporte metálico de alta resistencia para estanterías pesadas. Acabado en pintura anticorrosiva.',
    price: 22500,
    category: 'ornamentacion',
    brand: 'Distrinnovar Metal',
    image: 'https://imgur.com/a/Zg06rBS', // Usando la imagen que proveíste
    rating: 4.9,
    stock: 150,
    featured: true,
  },
  {
    id: 2,
    name: 'Soporte para Repisa Invisible',
    description: 'Kit de soportes flotantes para instalación oculta. Ideal para carpintería moderna y decoración minimalista.',
    price: 18900,
    category: 'ornamentacion',
    brand: 'Distrinnovar Metal',
    image: 'https://images.pexels.com/photos/8082560/pexels-photo-8082560.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    stock: 80,
    featured: false,
  },
  {
    id: 3,
    name: 'Bisagra Tubular 3 Pulgadas',
    description: 'Bisagra de acero soldable para puertas metálicas y rejas. Alta durabilidad y rotación suave.',
    price: 4500,
    category: 'ornamentacion',
    brand: 'MetalFuerte',
    image: 'https://images.pexels.com/photos/11081053/pexels-photo-11081053.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    stock: 300,
    featured: false,
  },
  {
    id: 13,
    name: 'Pie de Amigo Uso General',
    description: 'Soporte clásico para repisas livianas y medianas. Fabricación nacional con acero de calidad.',
    price: 19999,
    category: 'ornamentacion',
    brand: 'Distrinnovar Soluciones',
    image: 'https://i.imgur.com/zF7aihz.jpeg', // Imagen placeholder similar
    rating: 4.3,
    stock: 75,
    featured: true,
  },

  // --- CATEGORÍA: EMBALAJES ---
  {
    id: 4,
    name: 'Rollo Plástico Burbuja (100m)',
    description: 'Rollo industrial de plástico burbuja para protección de mercancía frágil durante el transporte.',
    price: 85000,
    category: 'embalaje',
    brand: 'PackSeguro',
    image: 'https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    stock: 45,
    featured: true,
  },
  {
    id: 5,
    name: 'Film Stretch Paletizable',
    description: 'Película estirable transparente de alta resistencia para asegurar cargas en estibas.',
    price: 32000,
    category: 'embalaje',
    brand: 'Distrinnovar Pack',
    image: 'https://images.pexels.com/photos/4483608/pexels-photo-4483608.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    stock: 120,
    featured: true,
  },
  {
    id: 6,
    name: 'Caja Térmica de Icopor 20L',
    description: 'Nevera de poliestireno expandido ideal para cadena de frío, alimentos y medicamentos.',
    price: 15500,
    category: 'embalaje',
    brand: 'IcoporPro',
    image: 'https://images.pexels.com/photos/7262402/pexels-photo-7262402.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    stock: 60,
    featured: false,
  },
  {
    id: 7,
    name: 'Esquineros de Espuma (Pack x12)',
    description: 'Protectores de esquinas para muebles y vidrios. Espuma de polietileno de alta densidad.',
    price: 12000,
    category: 'embalaje',
    brand: 'Distrinnovar Pack',
    image: 'https://images.pexels.com/photos/4246117/pexels-photo-4246117.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.4,
    stock: 200,
    featured: false,
  },

  // --- CATEGORÍA: MOLDURAS E ICOPOR ---
  {
    id: 8,
    name: 'Cornisa Pecho Paloma (Tira 2m)',
    description: 'Moldura decorativa en poliestireno de fácil instalación. Aporta elegancia a techos y paredes.',
    price: 18500,
    category: 'molduras',
    brand: 'DecoMolduras',
    image: 'https://images.pexels.com/photos/6585614/pexels-photo-6585614.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    stock: 80,
    featured: true,
  },
  {
    id: 9,
    name: 'Rosetón Clásico para Techo',
    description: 'Elemento decorativo central para lámparas. Diseño clásico fabricado en icopor de alta densidad.',
    price: 12000,
    category: 'molduras',
    brand: 'DecoHogar',
    image: 'https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    stock: 50,
    featured: false,
  },
  {
    id: 10,
    name: 'Lámina de Icopor Alta Densidad',
    description: 'Lámina para aislamiento térmico y acústico en construcción. Medidas 1m x 2m, espesor variable.',
    price: 28000,
    category: 'molduras',
    brand: 'Distrinnovar Aislamientos',
    image: 'https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    stock: 300,
    featured: true,
  },
  {
    id: 11,
    name: 'Casetón para Aligeramiento',
    description: 'Bloque de poliestireno para aligerar losas de concreto. Económico y fácil de manipular.',
    price: 35000,
    category: 'molduras',
    brand: 'ConstruLight',
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    stock: 40,
    featured: false,
  },
  {
    id: 12,
    name: 'Picado de Icopor (Bulto)',
    description: 'Relleno suelto de poliestireno triturado. Ideal para Puffs, embalaje de relleno y mezclas ligeras.',
    price: 45000,
    category: 'molduras',
    brand: 'Distrinnovar',
    image: 'https://images.pexels.com/photos/7234393/pexels-photo-7234393.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    stock: 25,
    featured: false,
  }
];