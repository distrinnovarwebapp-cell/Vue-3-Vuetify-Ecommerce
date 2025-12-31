<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { products } from '../data/mockProducts';
import { useCartStore } from '../stores/cart';

// --- Configuración y Datos ---
const router = useRouter();
const cartStore = useCartStore();

// Filtramos productos destacados de Cupcake Mania
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
  // Reemplaza con el número real de Cupcake Mania
  window.open('https://wa.me/573205358816?text=Hola%20Cupcake%20Mania!%20Quiero%20hacer%20un%20pedido%20personalizado.', '_blank');
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
              color="pink-lighten-4"
              class="mb-4 font-weight-bold text-uppercase text-pink-darken-4"
              label
              elevation="1"
            >
              <v-icon start icon="mdi-muffin"></v-icon>
              Horneado con Amor en Cartagena
            </v-chip>

            <h1 class="text-h3 text-sm-h2 font-weight-black mb-2 hero-title text-brown-darken-4">
              Cupcake<span class="brand-gradient-text">Mania</span>
            </h1>

            <p class="text-h6 text-brown-darken-1 mb-6 opacity-90 font-weight-regular">
              Mucho más que un postre: creamos experiencias dulces, cupcakes de autor y tortas que cuentan tu historia.
            </p>

            <div class="d-flex flex-column flex-sm-row gap-4 justify-center justify-md-start">
              <v-btn
                size="x-large"
                color="pink-accent-2"
                elevation="6"
                class="font-weight-bold flex-grow-1 flex-sm-grow-0 text-white rounded-lg"
                @click="goToCatalog"
              >
                Ver Menú Dulce
                <v-icon right class="ml-2">mdi-cake-variant</v-icon>
              </v-btn>
              <v-btn
                size="x-large"
                variant="outlined"
                color="brown-darken-3"
                class="flex-grow-1 flex-sm-grow-0 bg-white rounded-lg"
                @click="openWhatsApp"
              >
                Diseño Personalizado
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="4" class="d-none d-md-block text-center">
             <v-icon size="180" color="pink-lighten-4" class="opacity-40 icon-bg-hero">mdi-cupcake</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="py-10 py-md-16 bg-pink-lighten-5">
      <v-container>
        <v-row justify="center" class="mb-8 text-center">
          <v-col cols="12" md="8">
            <h3 class="text-h5 text-md-h4 font-weight-bold text-brown-darken-3 mb-3">
              ¿Qué hace especial a Cupcake Mania?
            </h3>
            <p class="text-body-1 text-grey-darken-1">
              Combinamos técnicas de alta repostería con el sabor cálido de lo hecho en casa.
            </p>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="6" sm="6" md="3">
            <v-card class="h-100 text-center py-6 px-3 benefit-card rounded-xl" elevation="0">
              <div class="icon-circle bg-cream-light mb-4 mx-auto">
                 <v-icon color="amber-darken-3" size="36">mdi-sparkles</v-icon>
              </div>
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Sabor Premium</h4>
              <p class="text-caption text-sm-body-2 text-grey-darken-1">Mantequilla pura y chocolates de origen.</p>
            </v-card>
          </v-col>
          <v-col cols="6" sm="6" md="3">
            <v-card class="h-100 text-center py-6 px-3 benefit-card rounded-xl" elevation="0">
              <div class="icon-circle bg-pink-light mb-4 mx-auto">
                <v-icon color="pink-accent-2" size="36">mdi-heart-pulse</v-icon>
              </div>
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Hecho Hoy</h4>
              <p class="text-caption text-sm-body-2 text-grey-darken-1">Garantizamos frescura total en cada bocado.</p>
            </v-card>
          </v-col>
          <v-col cols="6" sm="6" md="3">
            <v-card class="h-100 text-center py-6 px-3 benefit-card rounded-xl" elevation="0">
               <div class="icon-circle bg-brown-light mb-4 mx-auto">
                <v-icon color="brown-darken-2" size="36">mdi-auto-fix</v-icon>
               </div>
              <h4 class="text-subtitle-1 font-weight-bold mb-2">Tu Idea, Tu Torta</h4>
              <p class="text-caption text-sm-body-2 text-grey-darken-1">Personalizamos diseños según tu evento.</p>
            </v-card>
          </v-col>
          <v-col cols="6" sm="6" md="3">
            <v-card class="h-100 text-center py-6 px-3 benefit-card rounded-xl" elevation="0">
              <div class="icon-circle bg-orange-light mb-4 mx-auto">
                <v-icon color="orange-darken-3" size="36">mdi-moped</v-icon>
              </div>
              <h4 class="text-subtitle-1 font-weight-bold mb-2">A Domicilio</h4>
              <p class="text-caption text-sm-body-2 text-grey-darken-1">Entrega segura y puntual en Cartagena.</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="featured-section py-12">
      <v-container>
        <div class="d-flex justify-space-between align-end mb-8">
          <div>
             <h2 class="text-h4 font-weight-bold text-brown-darken-3 mb-1">Los Favoritos</h2>
             <p class="text-body-2 text-grey-darken-1">Lo más amado por nuestra comunidad</p>
          </div>
          <v-btn variant="text" color="pink-accent-2" class="d-none d-sm-flex" @click="goToCatalog">
            Ver todo el menú <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <v-row>
          <v-col
            v-for="product in featuredProducts"
            :key="product.id"
            cols="12" sm="6" md="4" lg="3"
          >
            <v-card
              class="product-card rounded-xl overflow-hidden"
              elevation="1"
              @click="goToProduct(product.id)"
            >
              <div class="image-container position-relative">
                <v-img :src="product.image" height="250" cover class="product-image">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                        <v-icon color="grey-lighten-1">mdi-cupcake</v-icon>
                    </div>
                  </template>
                </v-img>
                <v-chip
                  v-if="product.featured"
                  color="pink-accent-2"
                  size="small"
                  class="position-absolute top-0 left-0 ma-3 text-white font-weight-bold"
                >
                  BEST SELLER
                </v-chip>
              </div>

              <v-card-item class="pb-1">
                <v-card-title class="text-subtitle-1 font-weight-bold text-brown-darken-3">
                  {{ product.name }}
                </v-card-title>
                 <v-card-subtitle>
                  <v-rating
                    :model-value="product.rating"
                    density="compact"
                    readonly
                    color="pink-lighten-2"
                    half-increments
                    size="x-small"
                  ></v-rating>
                </v-card-subtitle>
              </v-card-item>

              <v-card-text class="pt-0">
                <div class="d-flex justify-space-between align-center mt-2">
                  <span class="text-h6 font-weight-black text-pink-accent-2">
                    ${{ product.price.toLocaleString() }}
                  </span>
                </div>
              </v-card-text>

              <v-card-actions class="pa-4 pt-0">
                <v-btn
                  color="brown-darken-1"
                  block
                  variant="flat"
                  class="font-weight-bold text-white bg-pink-lighten-3"
                  @click.stop="addToCart(product.id)"
                >
                  <v-icon left class="mr-2">mdi-plus-circle</v-icon>
                  Agregar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="py-12 bg-brown-darken-4 text-white">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6" class="mb-8 mb-md-0">
            <h3 class="text-h4 font-weight-bold mb-6">
              Mundo Cupcake <span class="text-pink-accent-2">Mania.</span>
            </h3>
            <p class="text-body-1 opacity-80 mb-8">
              No solo horneamos cupcakes, creamos el centro de mesa perfecto para tus celebraciones.
            </p>
            
            <v-list bg-color="transparent" class="text-white pa-0">
              <v-list-item class="px-0 mb-3" prepend-icon="mdi-cake-variant" title="Tortas Temáticas"></v-list-item>
              <v-divider class="border-opacity-25 mb-3"></v-divider>
              <v-list-item class="px-0 mb-3" prepend-icon="mdi-cookie" title="Galletas Decoradas"></v-list-item>
              <v-divider class="border-opacity-25 mb-3"></v-divider>
              <v-list-item class="px-0" prepend-icon="mdi-gift-outline" title="Cajas de Regalo Dulces"></v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="rounded-xl bg-white text-brown-darken-4 pa-6 pa-md-8" elevation="4">
              <div class="d-flex align-center mb-6">
                <v-icon size="32" color="pink-accent-2" class="mr-3">mdi-bicycle-fast</v-icon>
                <h3 class="text-h5 font-weight-bold">Pedidos y Entregas</h3>
              </div>

              <div class="logistic-item mb-6 d-flex">
                <v-icon color="pink-lighten-2" class="mt-1 mr-3">mdi-map-marker-check</v-icon>
                <div>
                  <h4 class="font-weight-bold text-body-1">Todo Cartagena</h4>
                  <p class="text-body-2 text-grey-darken-2 mt-1">Llegamos a Bocagrande, Manga, Zona Norte y más.</p>
                </div>
              </div>

              <div class="logistic-item d-flex">
                <v-icon color="pink-lighten-2" class="mt-1 mr-3">mdi-calendar-heart</v-icon>
                <div>
                  <h4 class="font-weight-bold text-body-1">Agenda con Tiempo</h4>
                  <p class="text-body-2 text-grey-darken-2 mt-1">Para pedidos personalizados, escríbenos con 48h de antelación.</p>
                </div>
              </div>
              
              <v-btn block color="pink-accent-2" class="mt-8 text-white rounded-lg" size="large" @click="openWhatsApp">
                Consultar Cupos
              </v-btn>
            </v-card>
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
      ></v-btn>
    </v-fab-transition>
  </div>
</template>

<style scoped>
/* --- PALETA DE REPOSTERÍA --- */
.text-brown-darken-4 { color: #3E2723 !important; }
.text-brown-darken-3 { color: #4E342E !important; }
.bg-pink-lighten-5 { background-color: #FFF5F7 !important; }
.bg-cream-light { background-color: #FFF8E1 !important; }
.bg-pink-light { background-color: #FCE4EC !important; }
.bg-brown-light { background-color: #EFEBE9 !important; }
.bg-orange-light { background-color: #FFF3E0 !important; }

.brand-gradient-text {
  background: linear-gradient(45deg, #FF4081, #F06292);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}

/* --- HERO SECTION --- */
.hero-section {
  background: #FFF9FA; 
  background-image: url('https://www.transparenttextures.com/patterns/cream-pixels.png');
  position: relative;
  min-height: 520px;
  padding: 80px 0;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 64, 129, 0.08), transparent);
}

/* --- CARDS --- */
.benefit-card {
  transition: all 0.3s ease;
  background: white !important;
  border: 1px solid #FCE4EC !important;
}

.benefit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(255, 64, 129, 0.12) !important;
}

.icon-circle {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid #f9f9f9;
}

.product-card:hover {
  transform: scale(1.02);
  border-color: #F06292;
}

.product-image {
  transition: transform 0.6s ease;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.gap-4 { gap: 16px; }

@media (max-width: 600px) {
  .hero-title { font-size: 2.5rem !important; }
}
</style>