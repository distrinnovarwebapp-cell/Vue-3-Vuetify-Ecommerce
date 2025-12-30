<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { products, categories } from '../data/mockProducts';
import { useCartStore } from '../stores/cart';
import type { Product } from '../types/product';

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();

const selectedCategories = ref<string[]>([]);
const selectedBrands = ref<string[]>([]);
const priceRange = ref<number[]>([0, 1500]);
const searchQuery = ref('');

const brands = computed(() => {
  const uniqueBrands = [...new Set(products.map((p) => p.brand))];
  return uniqueBrands.sort();
});

const maxPrice = computed(() => {
  return Math.max(...products.map((p) => p.price));
});

watch(
  () => route.query,
  (query) => {
    if (query.category) {
      selectedCategories.value = [query.category as string];
    }
    if (query.search) {
      searchQuery.value = query.search as string;
    }
  },
  { immediate: true }
);

const filteredProducts = computed(() => {
  let filtered = [...products];

  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((p) =>
      selectedCategories.value.includes(p.category)
    );
  }

  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter((p) => selectedBrands.value.includes(p.brand));
  }

  filtered = filtered.filter(
    (p) => p.price >= priceRange.value[0] && p.price <= priceRange.value[1]
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const clearFilters = () => {
  selectedCategories.value = [];
  selectedBrands.value = [];
  priceRange.value = [0, maxPrice.value];
  searchQuery.value = '';
  router.push({ name: 'Catalog' });
};

const goToProduct = (id: number) => {
  router.push({ name: 'ProductDetail', params: { id } });
};

const addToCart = (product: Product) => {
  cartStore.addToCart(product, 1);
};
</script>

<template>
  <v-container fluid class="py-8">
    <v-row>
      <v-col cols="12" md="3">
        <v-card elevation="2" class="pa-4">
          <div class="d-flex justify-space-between align-center mb-4">
            <h3 class="text-h5 font-weight-bold">Filtros</h3>
            <v-btn
              size="small"
              variant="text"
              color="primary"
              @click="clearFilters"
            >
              Limpiar
            </v-btn>
          </div>

          <v-divider class="mb-4"></v-divider>

          <div class="mb-6">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Categorías</h4>
            <v-chip-group
              v-model="selectedCategories"
              column
              multiple
              selected-class="text-primary"
            >
              <v-chip
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
                filter
                variant="outlined"
              >
                <v-icon start>{{ category.icon }}</v-icon>
                {{ category.name }}
              </v-chip>
            </v-chip-group>
          </div>

          <v-divider class="mb-4"></v-divider>

          <div class="mb-6">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Marcas</h4>
            <v-chip-group
              v-model="selectedBrands"
              column
              multiple
              selected-class="text-primary"
            >
              <v-chip
                v-for="brand in brands"
                :key="brand"
                :value="brand"
                filter
                variant="outlined"
              >
                {{ brand }}
              </v-chip>
            </v-chip-group>
          </div>

          <v-divider class="mb-4"></v-divider>

          <div>
            <h4 class="text-subtitle-1 font-weight-bold mb-3">
              Rango de Precio
            </h4>
            <v-range-slider
              v-model="priceRange"
              :max="maxPrice"
              :min="0"
              :step="10"
              thumb-label
              color="primary"
            ></v-range-slider>
            <div class="d-flex justify-space-between text-body-2">
              <span>${{ priceRange[0] }}</span>
              <span>${{ priceRange[1] }}</span>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <div class="mb-4 d-flex justify-space-between align-center">
          <h2 class="text-h4 font-weight-bold">
            Catálogo de Productos
          </h2>
          <v-chip color="primary" variant="elevated">
            {{ filteredProducts.length }} productos
          </v-chip>
        </div>

        <v-row v-if="filteredProducts.length > 0">
          <v-col
            v-for="product in filteredProducts"
            :key="product.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card
              class="product-card"
              elevation="3"
              @click="goToProduct(product.id)"
            >
              <v-img
                :src="product.image"
                height="220"
                cover
                class="product-image"
              >
                <div class="d-flex justify-space-between pa-2">
                  <v-chip
                    v-if="product.featured"
                    color="accent"
                    size="small"
                  >
                    Destacado
                  </v-chip>
                  <v-spacer></v-spacer>
                  <v-chip
                    :color="product.stock > 10 ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ product.stock }} en stock
                  </v-chip>
                </div>
              </v-img>

              <v-card-title class="text-h6">
                {{ product.name }}
              </v-card-title>

              <v-card-subtitle>
                <div class="d-flex align-center">
                  <v-rating
                    :model-value="product.rating"
                    density="compact"
                    readonly
                    color="warning"
                    half-increments
                    size="small"
                    class="mr-2"
                  ></v-rating>
                  <span class="text-body-2">({{ product.rating }})</span>
                </div>
                <v-chip size="x-small" variant="outlined" class="mt-1">
                  {{ product.brand }}
                </v-chip>
              </v-card-subtitle>

              <v-card-text>
                <p class="text-body-2 product-description">
                  {{ product.description }}
                </p>
                <p class="text-h5 font-weight-bold text-primary mt-3">
                  ${{ product.price.toFixed(2) }}
                </p>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="primary"
                  variant="elevated"
                  block
                  @click.stop="addToCart(product)"
                >
                  <v-icon class="mr-2">mdi-cart-plus</v-icon>
                  Agregar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-alert
          v-else
          type="info"
          variant="tonal"
          prominent
          class="mt-8"
        >
          <v-row align="center">
            <v-col class="grow">
              <div class="text-h6">No se encontraron productos</div>
              <div>Intenta ajustar los filtros para ver más resultados</div>
            </v-col>
            <v-col class="shrink">
              <v-btn color="info" @click="clearFilters">
                Limpiar Filtros
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 40px;
}
</style>
