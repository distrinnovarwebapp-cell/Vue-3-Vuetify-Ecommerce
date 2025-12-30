<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const tax = computed(() => cartStore.tax);
const total = computed(() => cartStore.total);

const updateQuantity = (productId: number, newQuantity: number) => {
  cartStore.updateQuantity(productId, newQuantity);
};

const removeItem = (productId: number) => {
  cartStore.removeFromCart(productId);
};

const clearCart = () => {
  cartStore.clearCart();
};

const goToCatalog = () => {
  router.push({ name: 'Catalog' });
};

const goToProduct = (id: number) => {
  router.push({ name: 'ProductDetail', params: { id } });
};

const checkout = () => {
  alert('Funcionalidad de checkout en desarrollo');
};
</script>

<template>
  <v-container class="py-8">
    <h1 class="text-h3 font-weight-bold mb-6">
      <v-icon size="40" class="mr-2">mdi-cart</v-icon>
      Mi Carrito
    </h1>

    <v-row v-if="items.length > 0">
      <v-col cols="12" lg="8">
        <v-card elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Productos ({{ items.length }})</span>
            <v-btn
              variant="text"
              color="error"
              size="small"
              @click="clearCart"
            >
              <v-icon class="mr-1">mdi-delete</v-icon>
              Vaciar Carrito
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="item.product.id"
              class="cart-item py-4"
            >
              <template #prepend>
                <v-avatar size="100" rounded="lg" class="mr-4 cursor-pointer" @click="goToProduct(item.product.id)">
                  <v-img :src="item.product.image" cover></v-img>
                </v-avatar>
              </template>

              <v-list-item-title class="text-h6 mb-2 cursor-pointer" @click="goToProduct(item.product.id)">
                {{ item.product.name }}
              </v-list-item-title>

              <v-list-item-subtitle class="mb-2">
                <v-chip size="small" variant="outlined">
                  {{ item.product.brand }}
                </v-chip>
              </v-list-item-subtitle>

              <div class="d-flex align-center mt-2">
                <v-btn
                  icon
                  size="small"
                  variant="outlined"
                  color="primary"
                  @click="updateQuantity(item.product.id, item.quantity - 1)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>

                <v-text-field
                  :model-value="item.quantity"
                  readonly
                  variant="outlined"
                  hide-details
                  density="compact"
                  class="mx-2"
                  style="max-width: 60px;"
                  centered
                ></v-text-field>

                <v-btn
                  icon
                  size="small"
                  variant="outlined"
                  color="primary"
                  :disabled="item.quantity >= item.product.stock"
                  @click="updateQuantity(item.product.id, item.quantity + 1)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>

                <v-spacer></v-spacer>

                <div class="text-right">
                  <p class="text-h6 font-weight-bold text-primary mb-0">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </p>
                  <p class="text-caption text-grey">
                    ${{ item.product.price.toFixed(2) }} c/u
                  </p>
                </div>

                <v-btn
                  icon
                  variant="text"
                  color="error"
                  class="ml-2"
                  @click="removeItem(item.product.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>

              <v-divider v-if="index < items.length - 1" class="mt-4"></v-divider>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card elevation="4" class="sticky-summary">
          <v-card-title class="text-h5 font-weight-bold">
            Resumen de Compra
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-list bg-color="transparent">
              <v-list-item>
                <template #prepend>
                  <span class="text-body-1">Subtotal:</span>
                </template>
                <template #append>
                  <span class="text-h6 font-weight-bold">
                    ${{ subtotal.toFixed(2) }}
                  </span>
                </template>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <span class="text-body-1">Impuestos (16%):</span>
                </template>
                <template #append>
                  <span class="text-h6 font-weight-bold">
                    ${{ tax.toFixed(2) }}
                  </span>
                </template>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item>
                <template #prepend>
                  <span class="text-h6 font-weight-bold">Total:</span>
                </template>
                <template #append>
                  <span class="text-h5 font-weight-bold text-primary">
                    ${{ total.toFixed(2) }}
                  </span>
                </template>
              </v-list-item>
            </v-list>

            <v-alert
              v-if="subtotal >= 100"
              type="success"
              variant="tonal"
              density="compact"
              class="mt-4"
            >
              <v-icon start>mdi-truck-fast</v-icon>
              ¡Envío gratis!
            </v-alert>

            <v-alert
              v-else
              type="info"
              variant="tonal"
              density="compact"
              class="mt-4"
            >
              Añade ${{ (100 - subtotal).toFixed(2) }} más para envío gratis
            </v-alert>

            <v-btn
              size="x-large"
              color="success"
              block
              elevation="4"
              class="mt-4"
              @click="checkout"
            >
              <v-icon class="mr-2">mdi-lock</v-icon>
              Proceder al Pago
            </v-btn>

            <v-btn
              variant="outlined"
              color="primary"
              block
              class="mt-2"
              @click="goToCatalog"
            >
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              Seguir Comprando
            </v-btn>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text>
            <div class="text-center">
              <v-icon color="success" class="mr-2">mdi-shield-check</v-icon>
              <span class="text-caption">Compra 100% segura</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2" class="text-center py-12">
          <v-icon size="120" color="grey-lighten-1">
            mdi-cart-off
          </v-icon>
          <h2 class="text-h4 font-weight-bold mt-4 mb-2">
            Tu carrito está vacío
          </h2>
          <p class="text-body-1 text-grey mb-6">
            Explora nuestro catálogo y encuentra productos increíbles
          </p>
          <v-btn
            size="large"
            color="primary"
            elevation="4"
            @click="goToCatalog"
          >
            <v-icon class="mr-2">mdi-shopping</v-icon>
            Ir al Catálogo
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.cart-item {
  transition: background-color 0.2s ease;
}

.cart-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.sticky-summary {
  position: sticky;
  top: 80px;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>
