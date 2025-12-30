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
    .filter(
      (p) =>
        p.category === product.value?.category && p.id !== product.value?.id
    )
    .slice(0, 4);
});

const incrementQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
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
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <v-container v-if="product" class="py-8">
    <v-btn
      variant="text"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="goBack"
    >
      Volver
    </v-btn>

    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="4">
          <v-img
            :src="product.image"
            height="500"
            cover
            class="product-image"
          ></v-img>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2" class="pa-6">
          <v-chip
            v-if="product.featured"
            color="accent"
            class="mb-3"
          >
            <v-icon start>mdi-star</v-icon>
            Producto Destacado
          </v-chip>

          <h1 class="text-h3 font-weight-bold mb-3">
            {{ product.name }}
          </h1>

          <div class="d-flex align-center mb-4">
            <v-rating
              :model-value="product.rating"
              readonly
              color="warning"
              half-increments
              density="compact"
              class="mr-2"
            ></v-rating>
            <span class="text-h6">({{ product.rating }})</span>
          </div>

          <v-divider class="my-4"></v-divider>

          <div class="mb-4">
            <v-chip color="primary" variant="outlined" class="mr-2">
              <v-icon start>mdi-tag</v-icon>
              {{ product.brand }}
            </v-chip>
            <v-chip
              :color="product.stock > 10 ? 'success' : 'warning'"
              variant="outlined"
            >
              <v-icon start>mdi-package-variant</v-icon>
              {{ product.stock }} disponibles
            </v-chip>
          </div>

          <p class="text-h4 font-weight-bold text-primary mb-4">
            ${{ product.price.toFixed(2) }}
          </p>

          <h3 class="text-h6 font-weight-bold mb-2">Descripción</h3>
          <p class="text-body-1 mb-6" style="line-height: 1.8;">
            {{ product.description }}
          </p>

          <v-divider class="my-4"></v-divider>

          <div class="mb-6">
            <h4 class="text-subtitle-1 font-weight-bold mb-3">Cantidad</h4>
            <div class="d-flex align-center">
              <v-btn
                icon
                variant="outlined"
                color="primary"
                @click="decrementQuantity"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <v-text-field
                v-model.number="quantity"
                readonly
                variant="outlined"
                hide-details
                density="comfortable"
                class="mx-3"
                style="max-width: 80px;"
                centered
              ></v-text-field>
              <v-btn
                icon
                variant="outlined"
                color="primary"
                @click="incrementQuantity"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>

          <v-btn
            size="x-large"
            color="primary"
            block
            elevation="4"
            @click="addToCart"
          >
            <v-icon class="mr-2">mdi-cart-plus</v-icon>
            Añadir al Carrito
          </v-btn>

          <div class="mt-6">
            <v-list bg-color="transparent" density="compact">
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title>Envío gratis en pedidos +$100</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title>Garantía de 30 días</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title>Devoluciones fáciles</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <section v-if="relatedProducts.length > 0" class="mt-12">
      <h2 class="text-h4 font-weight-bold mb-6">Productos Relacionados</h2>
      <v-row>
        <v-col
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card
            class="product-card"
            elevation="3"
            @click="goToProduct(relatedProduct.id)"
          >
            <v-img
              :src="relatedProduct.image"
              height="180"
              cover
            ></v-img>
            <v-card-title class="text-subtitle-1">
              {{ relatedProduct.name }}
            </v-card-title>
            <v-card-text>
              <p class="text-h6 font-weight-bold text-primary">
                ${{ relatedProduct.price.toFixed(2) }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <v-snackbar
      v-model="snackbar"
      color="success"
      timeout="3000"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-check-circle</v-icon>
        Producto añadido al carrito
      </div>
    </v-snackbar>
  </v-container>

  <v-container v-else class="py-12 text-center">
    <v-icon size="120" color="grey">mdi-package-variant-closed</v-icon>
    <h2 class="text-h4 mt-4">Producto no encontrado</h2>
    <v-btn color="primary" class="mt-6" @click="goBack">
      Volver
    </v-btn>
  </v-container>
</template>

<style scoped>
.product-image {
  border-radius: 8px;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}
</style>
