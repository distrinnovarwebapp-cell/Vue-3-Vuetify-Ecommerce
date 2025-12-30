<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { products } from '../data/mockProducts';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const featuredProducts = computed(() => products.filter((p) => p.featured));

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
</script>

<template>
  <div>
    <section class="hero-section">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="text-center text-md-left">
            <h1 class="text-h2 font-weight-bold mb-4 hero-title">
              Descubre lo Mejor
            </h1>
            <p class="text-h5 mb-6 hero-subtitle">
              Productos de calidad premium para tu estilo de vida
            </p>
            <v-btn
              size="x-large"
              color="accent"
              elevation="8"
              class="text-h6 px-8"
              @click="goToCatalog"
            >
              <v-icon left class="mr-2">mdi-shopping</v-icon>
              Explorar Catálogo
            </v-btn>
          </v-col>
          <v-col cols="12" md="6" class="d-none d-md-block">
            <v-img
              src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=800"
              height="400"
              cover
              class="rounded-lg elevation-8"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="featured-section py-12">
      <v-container>
        <h2 class="text-h3 font-weight-bold text-center mb-8">
          Productos Destacados
        </h2>

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
              class="product-card"
              elevation="4"
              @click="goToProduct(product.id)"
            >
              <v-img
                :src="product.image"
                height="200"
                cover
                class="product-image"
              >
                <v-chip
                  v-if="product.featured"
                  color="accent"
                  size="small"
                  class="ma-2"
                >
                  Destacado
                </v-chip>
              </v-img>

              <v-card-title class="text-h6">
                {{ product.name }}
              </v-card-title>

              <v-card-subtitle>
                <v-rating
                  :model-value="product.rating"
                  density="compact"
                  readonly
                  color="warning"
                  half-increments
                  size="small"
                ></v-rating>
              </v-card-subtitle>

              <v-card-text>
                <p class="text-body-2 text-truncate">
                  {{ product.description }}
                </p>
                <p class="text-h5 font-weight-bold primary--text mt-2">
                  ${{ product.price.toFixed(2) }}
                </p>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="primary"
                  block
                  variant="elevated"
                  @click.stop="addToCart(product.id)"
                >
                  <v-icon left class="mr-2">mdi-cart-plus</v-icon>
                  Agregar al Carrito
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="features-section py-12 bg-surface">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="secondary" class="mb-4">
              mdi-truck-fast
            </v-icon>
            <h3 class="text-h5 font-weight-bold mb-2">Envío Rápido</h3>
            <p class="text-body-1">
              Entrega en 24-48 horas en productos seleccionados
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="secondary" class="mb-4">
              mdi-shield-check
            </v-icon>
            <h3 class="text-h5 font-weight-bold mb-2">Pago Seguro</h3>
            <p class="text-body-1">
              Protección total en todas tus transacciones
            </p>
          </v-col>
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="64" color="secondary" class="mb-4">
              mdi-thumb-up
            </v-icon>
            <h3 class="text-h5 font-weight-bold mb-2">Garantía de Calidad</h3>
            <p class="text-body-1">
              30 días de garantía en todos nuestros productos
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #1b5e8c 0%, #10a37f 100%);
  color: white;
  padding: 80px 0;
}

.hero-title {
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  animation: fadeInUp 1s ease-out;
  opacity: 0.95;
}

.featured-section {
  background-color: #f8fafc;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
