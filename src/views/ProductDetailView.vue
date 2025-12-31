<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { products } from '../data/mockProducts';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const quantity = ref(1);
const snackbar = ref(false);

const product = computed(() => {
  const id = parseInt(route.params.id as string);
  return products.find((p) => p.id === id);
});

const relatedProducts = computed(() => {
  if (!product.value) return [];
  return products
    .filter((p) => p.category === product.value?.category && p.id !== product.value?.id)
    .slice(0, 4);
});

const incrementQuantity = () => {
  if (product.value && quantity.value < product.value.stock) quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value);
    snackbar.value = true;
  }
};

const goToProduct = (id: number) => {
  router.push({ name: 'ProductDetail', params: { id } });
  quantity.value = 1;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const goBack = () => router.back();
</script>

<template>
  <v-container v-if="product" class="py-6 py-md-12 px-4 px-md-10 bg-grey-lighten-5">
    <v-btn
      variant="text"
      color="brown-lighten-1"
      prepend-icon="mdi-arrow-left"
      class="mb-6 rounded-pill text-none"
      @click="goBack"
    >
      Volver al menú
    </v-btn>

    <v-row class="bg-white rounded-xl overflow-hidden elevation-1 mx-0">
      <v-col cols="12" md="6" class="pa-0">
        <v-hover v-slot="{ isHovering, props }">
          <v-card v-bind="props" flat class="rounded-0 overflow-hidden" height="100%">
            <v-img
              :src="product.image"
              height="100%"
              min-height="400"
              cover
              class="product-main-img"
              :class="{ 'zoom-effect': isHovering }"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="pink-lighten-4"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-card>
        </v-hover>
      </v-col>

      <v-col cols="12" md="6" class="pa-6 pa-md-12 d-flex flex-column">
        <div class="mb-4">
          <v-chip
            v-if="product.featured"
            color="pink-accent-2"
            variant="flat"
            size="small"
            class="mb-3 font-weight-black"
          >
            RECETA ESTRELLA ⭐
          </v-chip>
          
          <h1 class="text-h3 font-weight-black text-brown-darken-4 mb-2">
            {{ product.name }}
          </h1>
          
          <div class="d-flex align-center mb-6">
            <v-rating
              :model-value="product.rating"
              readonly
              color="amber-darken-2"
              density="compact"
              half-increments
              size="small"
            ></v-rating>
            <span class="text-subtitle-2 ml-2 text-grey-darken-1 font-weight-bold">
              {{ product.rating }} / 5.0
            </span>
            <v-divider vertical class="mx-4 my-1"></v-divider>
            <span class="text-caption text-uppercase font-weight-black text-pink-accent-2 tracking-widest">
              {{ product.category }}
            </span>
          </div>
        </div>

        <p class="text-h4 font-weight-black text-brown-darken-4 mb-6">
          ${{ product.price.toLocaleString() }}
        </p>

        <div class="description-box mb-8">
          <h3 class="text-subtitle-1 font-weight-bold text-brown-darken-2 mb-2">Sobre este antojo:</h3>
          <p class="text-body-1 text-grey-darken-2 lh-lg">
            {{ product.description }}
          </p>
        </div>

        <v-divider class="mb-8"></v-divider>

        <div class="d-flex flex-column flex-sm-row align-center w-100 mb-8" style="gap: 16px;">
          <div class="qty-selector d-flex align-center bg-pink-lighten-5 rounded-pill pa-1">
            <v-btn
              icon="mdi-minus"
              variant="text"
              size="small"
              color="pink-accent-2"
              @click="decrementQuantity"
            ></v-btn>
            <div class="px-4 font-weight-black text-h6 text-brown-darken-4" style="min-width: 50px; text-align: center;">
              {{ quantity }}
            </div>
            <v-btn
              icon="mdi-plus"
              variant="text"
              size="small"
              color="pink-accent-2"
              @click="incrementQuantity"
            ></v-btn>
          </div>

          <v-btn
            size="x-large"
            color="pink-accent-2"
            variant="flat"
            class="rounded-pill flex-grow-1 text-none font-weight-bold"
            height="56"
            @click="addToCart"
          >
            <v-icon start>mdi-cart-heart</v-icon>
            Añadir al pedido
          </v-btn>
        </div>

        <div class="bg-brown-lighten-5 rounded-xl pa-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="success" size="small" class="mr-2">mdi-check-decagram</v-icon>
            <span class="text-caption font-weight-bold text-brown-darken-3">Ingredientes 100% frescos hoy</span>
          </div>
          <div class="d-flex align-center">
            <v-icon color="pink-accent-2" size="small" class="mr-2">mdi-moped</v-icon>
            <span class="text-caption font-weight-bold text-brown-darken-3">Domicilios en toda Cartagena</span>
          </div>
        </div>
      </v-col>
    </v-row>

    <section v-if="relatedProducts.length > 0" class="mt-16">
      <div class="d-flex align-center mb-8">
        <h2 class="text-h4 font-weight-black text-brown-darken-4">Más tentaciones</h2>
        <v-divider class="ml-6"></v-divider>
      </div>
      
      <v-row>
        <v-col
          v-for="rel in relatedProducts"
          :key="rel.id"
          cols="12" sm="6" md="3"
        >
          <v-card 
            class="related-card rounded-xl" 
            flat 
            @click="goToProduct(rel.id)"
          >
            <v-img :src="rel.image" height="200" cover class="rounded-xl mb-3"></v-img>
            <h4 class="text-subtitle-1 font-weight-bold text-brown-darken-4 mb-1 px-2">{{ rel.name }}</h4>
            <p class="text-body-1 font-weight-black text-pink-accent-2 px-2">${{ rel.price.toLocaleString() }}</p>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <v-snackbar
      v-model="snackbar"
      color="brown-darken-4"
      rounded="pill"
      elevation="24"
    >
      <div class="d-flex align-center">
        <v-icon color="pink-accent-2" class="mr-2">mdi-heart-pulse</v-icon>
        <span>¡Añadido! Tu dulce espera está más cerca.</span>
      </div>
    </v-snackbar>
  </v-container>

  <v-container v-else class="py-16 text-center">
    <v-img src="https://cdn-icons-png.flaticon.com/512/3448/3448654.png" height="120" class="mb-6"></v-img>
    <h2 class="text-h4 font-weight-bold text-brown-darken-4">¡Oh no! El postre se ha escapado</h2>
    <v-btn color="pink-accent-2" class="mt-8 rounded-pill" size="large" @click="router.push('/catalog')">
      Volver al menú completo
    </v-btn>
  </v-container>
</template>

<style scoped>
.product-main-img {
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.zoom-effect {
  transform: scale(1.1);
}

.qty-selector {
  border: 1px solid #F8BBD0;
  width: fit-content;
}

.lh-lg {
  line-height: 1.8;
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.related-card {
  transition: all 0.3s ease;
  cursor: pointer;
  background: transparent !important;
}

.related-card:hover {
  transform: translateY(-5px);
}

.related-card:hover h4 {
  color: #FF4081;
}

/* Animación sutil para el Snackbar */
:deep(.v-snackbar__wrapper) {
  min-width: 300px !important;
}

@media (max-width: 960px) {
  .text-h3 {
    font-size: 2rem !important;
  }
}

/* Ajuste responsivo para el selector de cantidad */
@media (max-width: 600px) {
  .qty-selector {
    width: 100% !important;
    justify-content: space-between;
    margin-bottom: 8px;
  }
}
</style>