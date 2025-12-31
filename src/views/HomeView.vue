<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { products } from '../data/mockProducts';
import { useCartStore } from '../stores/cart';

// --- Configuración y Datos ---
const router = useRouter();
const cartStore = useCartStore();

// Filtramos productos destacados
const featuredProducts = computed(() => products.filter((p) => p.featured));

// --- Métodos de Navegación y Acción ---
const goToProduct = (id: number) => {
  router.push({ name: 'ProductDetail', params: { id } });
};

const goToCatalog = () => {
  router.push({ name: 'Catalog' });
};

const addToCart = (productId: number) => {
  const product = products.find((p) => p.id === productId);
  if (product) {
    cartStore.addToCart(product, 1);
  }
};

const openWhatsApp = () => {
  // REEMPLAZAR con el número real de la empresa
  // El formato debe ser internacional sin el '+' (ej: 573001234567)
  window.open('https://wa.me/570000000000?text=Hola,%20estoy%20interesado%20en%20sus%20productos.', '_blank');
};
</script>

<template>
  <div class="page-wrapper">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <v-container class="position-relative h-100 d-flex align-center">
        <v-row align="center" justify="center" class="text-center text-md-left">
          <v-col cols="12" md="8" lg="7">
             <v-chip
              color="orange-accent-3"
              class="mb-4 font-weight-bold text-uppercase"
              label
              elevation="3"
            >
              <v-icon start icon="mdi-factory"></v-icon>
              Fabricantes Directos
            </v-chip>

            <h1 class="text-h3 text-sm-h2 font-weight-black mb-2 hero-title text-white">
              Distrinnovar<span class="brand-gradient-text">Soluciones</span>
            </h1>

            <p class="text-h6 text-white mb-6 opacity-90 font-weight-regular">
              Ornamentación, embalaje e icopor de alta densidad. Precios competitivos y entrega confiable para tu negocio.
            </p>

            <div class="d-flex flex-column flex-sm-row gap-4 justify-center justify-md-start">
              <v-btn
                size="x-large"
                color="orange-accent-3"
                elevation="6"
                class="font-weight-bold flex-grow-1 flex-sm-grow-0 text-white"
                @click="goToCatalog"
              >
                Ver Catálogo
                <v-icon right class="ml-2">mdi-storefront-outline</v-icon>
              </v-btn>
              <v-btn
                size="x-large"
                variant="outlined"
                color="white"
                class="flex-grow-1 flex-sm-grow-0"
                @click="openWhatsApp"
              >
                Cotizar al Mayor
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="d-none d-md-block text-center">
             <v-icon size="180" color="white" class="opacity-20 icon-bg-hero">mdi-cube-send</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="py-10 py-md-16 bg-grey-lighten-4">
      <v-container>
        <v-row justify="center" class="mb-8 text-center">
          <v-col cols="12" md="8">
            <h3 class="text-h5 text-md-h4 font-weight-bold text-brand-purple mb-3">
              Beneficios de comprar al fabricante
            </h3>
            <p class="text-body-1 text-grey-darken-1">
              Ideales para ferreterías y comercios que buscan calidad constante y margen de ganancia.
            </p>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="6" sm="6" md="3">
            <v-card class="h-100 text-center py-6 px-3 benefit-card rounded-xl" elevation="2">
              <div class="icon-circle bg-brand-cyan-light mb-4 mx-auto">
                 <v-icon color="brand-cyan" size="36">mdi-cash-check</v-icon>
              </div>
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Mejor Precio</h4>
              <p class="text-caption text-sm-body-2 text-grey-darken-1">Sin intermediarios. Tarifas directas de fábrica.</p>
            </v-card>
          </v-col>
          <v-col cols="6" sm="6" md="3">
            <v-card class="h-100 text-center py-6 px-3 benefit-card rounded-xl" elevation="2">
              <div class="icon-circle bg-brand-orange-light mb-4 mx-auto">
                <v-icon color="orange-accent-4" size="36">mdi-warehouse</v-icon>
              </div>
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Abastecimiento Seguro</h4>
              <p class="text-caption text-sm-body-2 text-grey-darken-1">Disponibilidad inmediata para tu negocio.</p>
            </v-card>
          </v-col>
          <v-col cols="6" sm="6" md="3">
            <v-card class="h-100 text-center py-6 px-3 benefit-card rounded-xl" elevation="2">
               <div class="icon-circle bg-brand-cyan-light mb-4 mx-auto">
                <v-icon color="brand-cyan" size="36">mdi-shield-star-outline</v-icon>
               </div>
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Alta Resistencia</h4>
              <p class="text-caption text-sm-body-2 text-grey-darken-1">Productos de calidad comercial e industrial.</p>
            </v-card>
          </v-col>
          <v-col cols="6" sm="6" md="3">
            <v-card class="h-100 text-center py-6 px-3 benefit-card rounded-xl" elevation="2">
              <div class="icon-circle bg-brand-orange-light mb-4 mx-auto">
                <v-icon color="orange-accent-4" size="36">mdi-account-headset</v-icon>
              </div>
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Atención Directa</h4>
              <p class="text-caption text-sm-body-2 text-grey-darken-1">Personalizada y rápida por canales digitales.</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="featured-section py-12">
      <v-container>
        <div class="d-flex justify-space-between align-end mb-8">
          <div>
             <h2 class="text-h4 font-weight-bold text-brand-purple mb-1">
               Productos Destacados
             </h2>
             <p class="text-body-2 text-grey-darken-1">Soluciones listas para enviar</p>
          </div>
          <v-btn variant="text" color="brand-cyan" class="d-none d-sm-flex" @click="goToCatalog">
            Ver todo el catálogo <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <v-row>
          <v-col
            v-for="product in featuredProducts"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="product-card rounded-lg"
              elevation="2"
              @click="goToProduct(product.id)"
            >
              <div class="image-container position-relative">
                <v-img
                  :src="product.image"
                  height="200"
                  cover
                  class="product-image"
                >
                 <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                        <v-icon color="grey-lighten-1">mdi-image-outline</v-icon>
                    </div>
                  </template>
                </v-img>
                <v-chip
                  v-if="product.featured"
                  color="orange-accent-3"
                  size="small"
                  class="position-absolute top-0 left-0 ma-2 text-white font-weight-medium"
                  elevation="2"
                >
                  Destacado
                </v-chip>
              </div>

              <v-card-item class="pb-2">
                <v-card-title class="text-subtitle-1 font-weight-bold">
                  {{ product.name }}
                </v-card-title>
                 <v-card-subtitle>
                  <v-rating
                    :model-value="product.rating"
                    density="compact"
                    readonly
                    color="amber-accent-4"
                    half-increments
                    size="x-small"
                  ></v-rating>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text class="pt-0">
                <div class="d-flex justify-space-between align-center mt-2">
                  <span class="text-h6 font-weight-black text-brand-purple">
                    ${{ product.price.toLocaleString() }}
                  </span>
                </div>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="pa-3 bg-grey-lighten-5">
                <v-btn
                  color="orange-accent-3"
                  block
                  variant="flat"
                  class="text-white font-weight-bold"
                  @click.stop="addToCart(product.id)"
                >
                  <v-icon left class="mr-2">mdi-cart-plus</v-icon>
                  Agregar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-8 d-sm-none">
           <v-btn block variant="outlined" color="brand-purple" @click="goToCatalog">
            Explorar Catálogo Completo
          </v-btn>
        </div>
      </v-container>
    </section>

     <section class="py-12 bg-brand-purple-dark text-white">
        <v-container>
            <v-row align="center">
                <v-col cols="12" md="6" class="mb-8 mb-md-0">
                    <h3 class="text-h4 font-weight-bold mb-6">
                        Nuestras Categorías<span class="text-orange-accent-3">.</span>
                    </h3>
                     <p class="text-body-1 opacity-80 mb-8">
                        Encuentra soluciones confiables diseñadas para uso comercial e industrial.
                    </p>
                    
                    <v-list bg-color="transparent" class="text-white pa-0">
                        <v-list-item class="px-0 mb-3">
                            <template v-slot:prepend><v-icon color="cyan-accent-3" class="mr-3 bg-cyan-accent-4-opacity-20 pa-2 rounded-circle">mdi-gate</v-icon></template>
                            <v-list-item-title class="text-h6">Ornamentación</v-list-item-title>
                        </v-list-item>
                        <v-divider class="border-opacity-25 mb-3"></v-divider>

                        <v-list-item class="px-0 mb-3">
                            <template v-slot:prepend><v-icon color="cyan-accent-3" class="mr-3 bg-cyan-accent-4-opacity-20 pa-2 rounded-circle">mdi-package-variant</v-icon></template>
                             <v-list-item-title class="text-h6">Embalaje y Protección</v-list-item-title>
                        </v-list-item>
                         <v-divider class="border-opacity-25 mb-3"></v-divider>

                        <v-list-item class="px-0">
                            <template v-slot:prepend><v-icon color="cyan-accent-3" class="mr-3 bg-cyan-accent-4-opacity-20 pa-2 rounded-circle">mdi-cube-outline</v-icon></template>
                             <v-list-item-title class="text-h6">Icopor de alta densidad</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card class="rounded-xl bg-white text-brand-purple pa-6 pa-md-8" elevation="4">
                        <div class="d-flex align-center mb-6">
                            <v-icon size="32" color="orange-accent-3" class="mr-3">mdi-truck-fast-outline</v-icon>
                            <h3 class="text-h5 font-weight-bold">Envíos y Entregas</h3>
                        </div>

                        <div class="logistic-item mb-6 d-flex">
                            <v-icon color="brand-cyan" class="mt-1 mr-3">mdi-map-marker-radius-outline</v-icon>
                            <div>
                                <h4 class="font-weight-bold text-body-1">📍 Cartagena y alrededores</h4>
                                <p class="text-body-2 text-grey-darken-2 mt-1">Entrega inmediata para ferreterías y clientes comerciales.</p>
                            </div>
                        </div>

                         <div class="logistic-item d-flex">
                            <v-icon color="brand-cyan" class="mt-1 mr-3">mdi-flag-outline</v-icon>
                            <div>
                                <h4 class="font-weight-bold text-body-1">🇨🇴 Envíos nacionales</h4>
                                <p class="text-body-2 text-grey-darken-2 mt-1">Despachamos a todo el país de forma segura. Tiempos según volumen.</p>
                            </div>
                        </div>
                        
                         <v-btn block color="brand-purple" class="mt-8 text-white" size="large" @click="openWhatsApp">
                            Consultar Costo de Envío
                        </v-btn>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </section>


    <section class="trust-section py-8 bg-grey-lighten-5 text-center">
      <v-container>
         <h4 class="text-h6 font-weight-bold text-brand-purple mb-6">Compra con confianza en DistrinnovarSoluciones</h4>
        <v-row justify="center" class="text-caption text-sm-body-2 text-grey-darken-2">
          <v-col cols="4" sm="auto" class="d-flex flex-column align-center px-2">
            <v-icon color="brand-cyan" class="mb-2">mdi-handshake-outline</v-icon>
            <span>No intermediarios</span>
          </v-col>
          <v-col cols="4" sm="auto" class="d-flex flex-column align-center px-2 border-s border-e">
             <v-icon color="brand-cyan" class="mb-2">mdi-whatsapp</v-icon>
            <span>Atención rápida</span>
          </v-col>
           <v-col cols="4" sm="auto" class="d-flex flex-column align-center px-2">
             <v-icon color="brand-cyan" class="mb-2">mdi-store-outline</v-icon>
            <span>Al por mayor y detal</span>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-fab-transition>
      <v-btn
        position="fixed"
        location="bottom right"
        icon="mdi-whatsapp"
        color="#25D366"
        size="x-large"
        class="whatsapp-fab elevation-4 mb-4 mr-2 text-white"
        style="z-index: 100;"
        @click="openWhatsApp"
      >
      </v-btn>
    </v-fab-transition>

  </div>
</template>

<style scoped>
/* --- DEFINICIÓN DE COLORES DE LA MARCA (Basado en el logo) --- */
/*
  Nota: Idealmente, esto iría en tu configuración de tema de Vuetify (vuetify.ts),
  pero lo simulo aquí con clases CSS y colores hexadecimales directos para que funcione este componente.

  Paleta aproximada del logo:
  - Morado/Azul profundo: #3D1E6D -> Brand Purple
  - Naranja vibrante: #FF8C00 -> Brand Orange
  - Cian/Celeste: #00BBD4 -> Brand Cyan
*/

/* Clases de utilidad de color */
.text-brand-purple { color: #3D1E6D !important; }
.bg-brand-purple-dark { background-color: #2A144B !important; }

.text-brand-cyan { color: #00BBD4 !important; }
.bg-brand-cyan-light { background-color: rgba(0, 187, 212, 0.1) !important; }

.text-brand-orange { color: #FF8C00 !important; }
.bg-brand-orange-light { background-color: rgba(255, 140, 0, 0.1) !important; }

/* Gradiente para el texto de la marca */
.brand-gradient-text {
  background: linear-gradient(45deg, #FF8C00, #00BBD4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}


/* --- HERO SECTION STYLES --- */
.hero-section {
  /* Fondo degradado usando los colores morado y azul del logo */
  background: linear-gradient(135deg, #3D1E6D 0%, #1A237E 100%);
  position: relative;
  min-height: 550px; /* Altura mínima para buen impacto en móvil */
  padding: 60px 0;
  overflow: hidden;
}

/* Patrón de superposición sutil para dar textura industrial */
.hero-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0);
  background-size: 20px 20px;
  opacity: 0.3;
}

.hero-title {
  line-height: 1.1;
}

/* Icono de fondo decorativo */
.icon-bg-hero {
    position: absolute;
    right: -40px;
    bottom: -40px;
    transform: rotate(-15deg);
    opacity: 0.15 !important;
}


/* --- BENEFITS CARDS --- */
.benefit-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0,0,0,0.04);
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(61, 30, 109, 0.1) !important; /* Sombra con tinte morado */
}

.icon-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* --- PRODUCT CARDS --- */
.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
  border-color: rgba(0, 187, 212, 0.3); /* Borde cian al hacer hover */
}

.image-container {
  overflow: hidden;
}

.product-image {
  transition: transform 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* --- UTILITIES --- */
.gap-4 {
  gap: 16px;
}

/* --- MOBILE OPTIMIZATIONS (Media Queries) --- */
@media (max-width: 600px) {
  .hero-section {
    min-height: auto;
    padding: 40px 0 50px;
  }

  .hero-title {
    font-size: 2.5rem !important; /* Título más pequeño en móvil */
  }

  /* En móvil, las tarjetas de beneficio son de 2 columnas, texto más pequeño */
  .benefit-card h4 { font-size: 0.9rem !important; }
  .benefit-card p { font-size: 0.75rem !important; line-height: 1.2; }
  .icon-circle { width: 48px; height: 48px; }
  .icon-circle .v-icon { font-size: 24px !important; }
}
</style>