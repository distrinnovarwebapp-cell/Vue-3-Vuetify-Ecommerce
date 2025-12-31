<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { products, categories } from '../data/mockProducts';
import { useCartStore } from '../stores/cart';
import type { Product } from '../types/product';

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();

// --- Estado ---
const selectedCategories = ref<string[]>([]);
const priceRange = ref<number[]>([0, 50000]);
const searchQuery = ref('');
const filterDrawer = ref(false); // Control para filtros en móvil

// --- Computados ---
const maxPrice = computed(() => Math.max(...products.map((p) => p.price), 50000));

watch(() => route.query, (query) => {
  if (query.category) selectedCategories.value = [query.category as string];
  if (query.search) searchQuery.value = query.search as string;
}, { immediate: true });

const filteredProducts = computed(() => {
  return products.filter((p) => {
    const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(p.category);
    const matchesPrice = p.price >= priceRange.value[0] && p.price <= priceRange.value[1];
    const matchesSearch = !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });
});

// --- Acciones ---

const goToProduct = (id: number) => {
  router.push({ name: 'ProductDetail', params: { id } });
};


const clearFilters = () => {
  selectedCategories.value = [];
  priceRange.value = [0, maxPrice.value];
  searchQuery.value = '';
  router.push({ name: 'Catalog' });
};

const addToCart = (product: Product) => {
  cartStore.addToCart(product, 1);
};
</script>

<template>
  <v-container fluid class="bg-grey-lighten-5 min-vh-100 py-6 px-md-10">

    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h4 font-weight-black text-brown-darken-4 mb-1">Nuestro Menú</h1>
        <p class="text-subtitle-1 text-brown-lighten-1">Endulza tu día con nuestras creaciones</p>
      </div>

      <v-btn class="d-md-none rounded-xl" color="pink-accent-2" variant="flat" prepend-icon="mdi-filter-variant"
        @click="filterDrawer = true">
        Filtros
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="3" class="d-none d-md-block">
        <v-card variant="flat" class="pa-6 rounded-xl border-sweet sticky-top">
          <div class="d-flex justify-space-between align-center mb-6">
            <h3 class="text-h6 font-weight-bold text-brown-darken-3">Filtros</h3>
            <v-btn size="small" variant="text" color="pink-accent-2" @click="clearFilters">Limpiar</v-btn>
          </div>

          <h4 class="text-subtitle-2 font-weight-bold mb-4 text-uppercase text-grey-darken-1">Categorías</h4>
          <v-chip-group v-model="selectedCategories" column multiple selected-class="bg-pink-accent-2 text-white">
            <v-chip v-for="cat in categories" :key="cat.id" :value="cat.id" variant="tonal" class="ma-1">
              <v-icon start size="small">{{ cat.icon }}</v-icon>
              {{ cat.name }}
            </v-chip>
          </v-chip-group>

          <v-divider class="my-6"></v-divider>

          <h4 class="text-subtitle-2 font-weight-bold mb-8 text-uppercase text-grey-darken-1">Presupuesto</h4>
          <v-range-slider v-model="priceRange" :max="maxPrice" :min="0" :step="500" color="pink-accent-2"
            thumb-label="always" class="mt-4"></v-range-slider>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <v-row v-if="filteredProducts.length > 0">
          <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" lg="4">
            <v-card class="product-card rounded-xl overflow-hidden cursor-pointer" elevation="0"
              @click="goToProduct(product.id)">
              <div class="position-relative overflow-hidden">
                <v-img :src="product.image" height="260" cover class="product-img">
                  <v-chip v-if="product.featured" color="pink-accent-2" class="ma-3 position-absolute font-weight-bold"
                    size="small">
                    ESTRELLA ⭐
                  </v-chip>
                </v-img>
              </div>

              <v-card-text class="pa-5">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-caption font-weight-bold text-pink-accent-2 text-uppercase tracking-widest">{{
                    product.category }}</span>
                  <div class="d-flex align-center">
                    <v-icon color="warning" size="small">mdi-star</v-icon>
                    <span class="text-caption ml-1 font-weight-bold">{{ product.rating }}</span>
                  </div>
                </div>

                <h3 class="text-h6 font-weight-black text-brown-darken-4 mb-2 name-truncate">{{ product.name }}</h3>
                <p class="text-body-2 text-grey-darken-1 mb-4 description-truncate">{{ product.description }}</p>

                <div class="d-flex align-center justify-space-between mt-auto">
                  <span class="text-h5 font-weight-black text-brown-darken-4">
                    ${{ product.price.toLocaleString() }}
                  </span>
                  <v-btn icon="mdi-plus" color="pink-accent-2" variant="flat" size="small" class="rounded-lg add-btn"
                    @click.stop="addToCart(product)"></v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-sheet v-else class="text-center pa-12 rounded-xl bg-transparent">
          <v-icon size="100" color="pink-lighten-4">mdi-cookie-alert-outline</v-icon>
          <h2 class="text-h5 font-weight-bold mt-4">¡Ups! No hay dulces aquí</h2>
          <p class="text-grey-darken-1">Intenta con otros filtros o categorías.</p>
          <v-btn color="pink-accent-2" class="mt-4 rounded-pill" @click="clearFilters">Ver todo el menú</v-btn>
        </v-sheet>
      </v-col>
    </v-row>

    <v-bottom-sheet v-model="filterDrawer">
      <v-card class="rounded-t-xl pa-6">
        <div class="d-flex justify-space-between align-center mb-6">
          <h3 class="text-h6 font-weight-black">Filtrar Antojos</h3>
          <v-btn icon="mdi-close" variant="text" @click="filterDrawer = false"></v-btn>
        </div>

        <h4 class="text-subtitle-1 font-weight-bold mb-3">Categorías</h4>
        <v-chip-group v-model="selectedCategories" column multiple selected-class="bg-pink-accent-2 text-white">
          <v-chip v-for="cat in categories" :key="cat.id" :value="cat.id" variant="tonal">{{ cat.name }}</v-chip>
        </v-chip-group>

        <h4 class="text-subtitle-1 font-weight-bold mt-6 mb-8">Precio Máximo</h4>
        <v-slider v-model="priceRange[1]" :max="maxPrice" :min="0" color="pink-accent-2"
          thumb-label="always"></v-slider>

        <v-btn block color="brown-darken-4" size="large" class="mt-6 rounded-pill" @click="filterDrawer = false">
          Aplicar Filtros
        </v-btn>
      </v-card>
    </v-bottom-sheet>

  </v-container>
</template>

<style scoped>
.border-sweet {
  border: 2px solid #FCE4EC !important;
}

.sticky-top {
  position: sticky;
  top: 100px;
}

.product-card {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid #f0f0f0;
  background: white;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(240, 98, 146, 0.15) !important;
}

.product-img {
  transition: transform 0.6s ease;
}

.product-card:hover .product-img {
  transform: scale(1.1);
}

.name-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}

.add-btn {
  transition: all 0.3s ease;
}

.product-card:hover .add-btn {
  transform: scale(1.1);
}

.tracking-widest {
  letter-spacing: 0.1em;
}

@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }
}
</style>