<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const cartStore = useCartStore();

const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const total = computed(() => cartStore.total);

const updateQuantity = (productId: number, newQuantity: number) => {
  if (newQuantity < 1) return;
  cartStore.updateQuantity(productId, newQuantity);
};

const removeItem = (productId: number) => cartStore.removeFromCart(productId);
const clearCart = () => cartStore.clearCart();
const goToCatalog = () => router.push({ name: 'Catalog' });
const goToProduct = (id: number) => router.push({ name: 'ProductDetail', params: { id } });

const checkout = () => {
  // Simulación de pedido vía WhatsApp (Muy común en negocios locales)
  const message = items.value.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
  const whatsappUrl = `https://wa.me/573205358816?text=¡Hola! Quiero pedir: ${message}. Total: $${total.value.toLocaleString()}`;
  window.open(whatsappUrl, '_blank');
};
</script>

<template>
  <v-container class="py-8 py-md-12 px-4">
    <div class="d-flex align-center mb-8">
      <v-icon size="40" color="pink-accent-2" class="mr-4">mdi-basket-heart</v-icon>
      <h1 class="text-h3 font-weight-black text-brown-darken-4">Mi Bolsa Dulce</h1>
    </div>

    <v-row v-if="items.length > 0">
      <v-col cols="12" lg="8">
        <v-card variant="flat" class="rounded-xl border-sweet bg-white overflow-hidden">
          <div class="pa-6 d-flex justify-space-between align-center bg-brown-lighten-5">
            <span class="text-subtitle-1 font-weight-bold text-brown-darken-3">
              {{ items.length }} {{ items.length === 1 ? 'delicia' : 'delicias' }} seleccionadas
            </span>
            <v-btn
              variant="text"
              color="pink-darken-1"
              size="small"
              class="text-none font-weight-bold"
              prepend-icon="mdi-trash-can-outline"
              @click="clearCart"
            >
              Vaciar bolsa
            </v-btn>
          </div>

          <v-divider></v-divider>

          <v-list class="pa-0">
            <v-list-item
              v-for="(item, index) in items"
              :key="item.product.id"
              class="cart-item pa-4 pa-md-6"
            >
              <v-row align="center" no-gutters>
                <v-col cols="4" sm="2">
                  <v-avatar size="80" rounded="xl" class="cursor-pointer elevation-2" @click="goToProduct(item.product.id)">
                    <v-img :src="item.product.image" cover></v-img>
                  </v-avatar>
                </v-col>

                <v-col cols="8" sm="4" class="pl-4 pl-md-6">
                  <h3 class="text-h6 font-weight-black text-brown-darken-4 mb-1 cursor-pointer" @click="goToProduct(item.product.id)">
                    {{ item.product.name }}
                  </h3>
                  <v-chip size="x-small" color="pink-lighten-4" variant="flat" class="text-pink-darken-4 font-weight-bold">
                    {{ item.product.category }}
                  </v-chip>
                </v-col>

                <v-col cols="7" sm="3" class="mt-4 mt-sm-0 d-flex justify-start justify-sm-center">
                  <div class="qty-control d-flex align-center bg-grey-lighten-4 rounded-pill px-2">
                    <v-btn icon="mdi-minus" size="x-small" variant="text" @click="updateQuantity(item.product.id, item.quantity - 1)"></v-btn>
                    <span class="px-4 font-weight-bold">{{ item.quantity }}</span>
                    <v-btn icon="mdi-plus" size="x-small" variant="text" :disabled="item.quantity >= item.product.stock" @click="updateQuantity(item.product.id, item.quantity + 1)"></v-btn>
                  </div>
                </v-col>

                <v-col cols="5" sm="3" class="mt-4 mt-sm-0 text-right">
                  <p class="text-h6 font-weight-black text-brown-darken-4 mb-0">
                    ${{ (item.product.price * item.quantity).toLocaleString() }}
                  </p>
                  <v-btn
                    icon="mdi-close-circle-outline"
                    variant="text"
                    color="grey-lighten-1"
                    size="small"
                    @click="removeItem(item.product.id)"
                  ></v-btn>
                </v-col>
              </v-row>
              <v-divider v-if="index < items.length - 1" class="mt-4"></v-divider>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="rounded-xl pa-6 sticky-summary elevation-4" color="brown-darken-4" theme="dark">
          <h2 class="text-h5 font-weight-black mb-6">Resumen del Pedido</h2>
          
          <div class="d-flex justify-space-between mb-4">
            <span class="text-brown-lighten-3">Subtotal delicias</span>
            <span class="text-h6">${{ subtotal.toLocaleString() }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-4 align-center">
            <span class="text-brown-lighten-3">Envío (Cartagena)</span>
            <v-chip v-if="subtotal >= 50000" size="small" color="success" variant="flat">GRATIS</v-chip>
            <span v-else class="text-h6 text-pink-lighten-3">$5.000</span>
          </div>

          <v-divider class="my-6 border-opacity-25"></v-divider>

          <div class="d-flex justify-space-between mb-8 align-center">
            <span class="text-h6">Total</span>
            <span class="text-h4 font-weight-black text-pink-accent-2">
              ${{ (subtotal >= 50000 ? subtotal : subtotal + 5000).toLocaleString() }}
            </span>
          </div>

          <v-btn
            block
            color="pink-accent-2"
            size="x-large"
            class="rounded-pill font-weight-black text-none mb-4"
            elevation="8"
            @click="checkout"
          >
            Confirmar Pedido
            <v-icon end>mdi-whatsapp</v-icon>
          </v-btn>

          <v-btn
            block
            variant="text"
            color="white"
            class="text-none"
            @click="goToCatalog"
          >
            Seguir antojándome
          </v-btn>

          <div class="mt-6 pa-4 bg-brown-darken-3 rounded-lg text-center">
            <v-icon size="small" color="pink-accent-2" class="mr-2">mdi-shield-check</v-icon>
            <span class="text-caption">Pago seguro & ingredientes frescos</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
      <v-col cols="12" md="6" class="text-center py-12">
        <v-icon size="120" color="pink-lighten-4" class="mb-6">mdi-cookie-off-outline</v-icon>
        <h2 class="text-h4 font-weight-black text-brown-darken-4 mb-4">¿Bolsa vacía?</h2>
        <p class="text-body-1 text-grey-darken-1 mb-8">
          Aún no has añadido ninguna delicia a tu bolsa. ¡Nuestro horno está listo!
        </p>
        <v-btn
          size="x-large"
          color="pink-accent-2"
          class="rounded-pill px-10 font-weight-bold text-none"
          @click="goToCatalog"
        >
          Explorar Menú
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.border-sweet {
  border: 2px solid #FCE4EC !important;
}

.cart-item {
  transition: all 0.2s ease;
}

.cart-item:hover {
  background-color: #FFF9FB;
}

.qty-control {
  border: 1px solid #E0E0E0;
}

.sticky-summary {
  position: sticky;
  top: 100px;
}

.cursor-pointer {
  cursor: pointer;
}

@media (max-width: 600px) {
  .text-h3 {
    font-size: 2rem !important;
  }
}
</style>