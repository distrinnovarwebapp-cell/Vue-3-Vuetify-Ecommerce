<script setup lang="ts">
declare var google: any;
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

// 1. Importaciones de Firebase
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// 2. Importacion de Dexie
import { dbLocal } from '../dexie';

// 3. Importacion de confeti
import confetti from 'canvas-confetti';

const lanzarConfetiDulce = () => {
  // Colores temáticos: Rosado fuerte, Rosado claro, Café oscuro
  const colors = ['#FF4081', '#F8BBD0', '#3E2723']; 

  // Un disparo central explosivo
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }, // Empieza un poco más abajo del centro
    colors: colors,
    disableForReducedMotion: true // Importante para accesibilidad
  });

  // Opcional: Una segunda ráfaga pequeña poco después
  setTimeout(() => {
      confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });
  }, 250);
};

const router = useRouter();
const cartStore = useCartStore();

// Estado del Carrito
const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);
const total = computed(() => {
  const shipping = subtotal.value >= 50000 ? 0 : 5000;
  return subtotal.value + shipping;
});

// Estado del Diálogo, Formulario y Carga
const isCheckoutDialogOpen = ref(false);
const isSaving = ref(false); 
const shippingForm = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  direccion: ''
});

const updateQuantity = (productId: number, newQuantity: number) => {
  if (newQuantity < 1) return;
  cartStore.updateQuantity(productId, newQuantity);
};

const removeItem = (productId: number) => cartStore.removeFromCart(productId);
const clearCart = () => cartStore.clearCart();
const goToCatalog = () => router.push({ name: 'Catalog' });
const goToProduct = (id: number) => router.push({ name: 'ProductDetail', params: { id } });

const openCheckout = () => {
  isCheckoutDialogOpen.value = true;
};

// --- LÓGICA DE GOOGLE IDENTITY SERVICES ---

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT", error);
    return null;
  }
};

const handleGoogleResponse = (response: any) => {
  const userData = parseJwt(response.credential);
  if (userData) {
    shippingForm.value.nombre = userData.given_name || '';
    shippingForm.value.apellido = userData.family_name || '';
    shippingForm.value.correo = userData.email || '';
    //ahippingForm.value.direccion = Existe alguna manera de obtener la dirección del usuario desde tal vez usando su unbicacion actual?

  }
};

const renderGoogleButton = () => {
  // Asegurarse de que el objeto 'google' existe (cargado desde index.html)
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
    });

    const parent = document.getElementById('googleBtn');
    if (parent) {
      google.accounts.id.renderButton(parent, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: parent.offsetWidth
      });
    }
  }
};

// Observar apertura de diálogo para inyectar el botón
watch(isCheckoutDialogOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    renderGoogleButton();
  }
});

// --- FIN LÓGICA DE GOOGLE ---

// 2. Función de Confirmación con Firebase
const confirmOrder = async () => {
  if (!shippingForm.value.nombre || !shippingForm.value.telefono || !shippingForm.value.direccion) {
    alert("Por favor completa los campos obligatorios.");
    return;
  }
  isSaving.value = true;

  try {
    const productosFormateados = items.value.map(i => ({
      nombre: i.product.name,
      cantidad: i.quantity,
      precioUnitario: i.product.price,
      subtotal: i.product.price * i.quantity
    }));

    const pedidoData = {
      cliente: { ...shippingForm.value },
      productos: productosFormateados,
      resumen: {
        subtotal: subtotal.value,
        envio: subtotal.value >= 50000 ? 0 : 5000,
        total: total.value
      },
      fecha: serverTimestamp(),
      estado: 'nuevo'
    };

    // 1. Guardar en Firestore
    const docRef = await addDoc(collection(db, "pedidos"), pedidoData);
    const firebaseId = docRef.id;

    // 2. DISPARO DEL EMAIL (Apps Script)
    // No bloqueamos la experiencia del usuario si el mail tarda un poco
    fetch('https://script.google.com/macros/s/AKfycbzGr084XR4gZGs-lKz4nYd4E_CX3Zg8NdFbdiEHsRDadE5hPAXcWC1SaNtmnNjWgyoHSA/exec', {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
      'Content-Type': 'text/plain;charset=utf-8', // Cambiar a text/plain evita que el navegador haga un "preflight"
      },
      body: JSON.stringify(pedidoData)
    }).catch(e => console.error("Error enviando correo:", e));

    
    // 3. Guardar en Dexie y finalizar
    await dbLocal.pedidos.add({
      firebaseId: firebaseId,
      cliente: { ...shippingForm.value },
      productos: productosFormateados,
      total: total.value,
      fecha: new Date()
    });

    isCheckoutDialogOpen.value = false;
    cartStore.clearCart();
    lanzarConfetiDulce();
    router.push({ name: 'Catalog' });

  } catch (error) {
    console.error("Error al procesar el pedido:", error);
    alert("Ocurrió un error. Inténtalo de nuevo.");
  } finally {
    isSaving.value = false;
  }
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
            <v-btn variant="text" color="pink-darken-1" size="small" class="text-none font-weight-bold"
              prepend-icon="mdi-trash-can-outline" @click="clearCart">
              Vaciar bolsa
            </v-btn>
          </div>

          <v-divider></v-divider>

          <v-list class="pa-0">
            <v-list-item v-for="(item, index) in items" :key="item.product.id" class="cart-item pa-4 pa-md-6">
              <v-row align="center" no-gutters>
                <v-col cols="4" sm="2">
                  <v-avatar size="80" rounded="xl" class="cursor-pointer elevation-2"
                    @click="goToProduct(item.product.id)">
                    <v-img :src="item.product.image" cover></v-img>
                  </v-avatar>
                </v-col>

                <v-col cols="8" sm="4" class="pl-4 pl-md-6">
                  <h3 class="text-h6 font-weight-black text-brown-darken-4 mb-1 cursor-pointer"
                    @click="goToProduct(item.product.id)">
                    {{ item.product.name }}
                  </h3>
                  <v-chip size="x-small" color="pink-lighten-4" variant="flat"
                    class="text-pink-darken-4 font-weight-bold">
                    {{ item.product.category }}
                  </v-chip>
                </v-col>

                <v-col cols="7" sm="3" class="mt-4 mt-sm-0 d-flex justify-start justify-sm-center">
                  <div class="qty-control d-flex align-center bg-grey-lighten-4 rounded-pill px-2">
                    <v-btn icon="mdi-minus" size="x-small" variant="text"
                      @click="updateQuantity(item.product.id, item.quantity - 1)"></v-btn>
                    <span class="px-4 font-weight-bold">{{ item.quantity }}</span>
                    <v-btn icon="mdi-plus" size="x-small" variant="text" :disabled="item.quantity >= item.product.stock"
                      @click="updateQuantity(item.product.id, item.quantity + 1)"></v-btn>
                  </div>
                </v-col>

                <v-col cols="5" sm="3" class="mt-4 mt-sm-0 text-right">
                  <p class="text-h6 font-weight-black text-brown-darken-4 mb-0">
                    ${{ (item.product.price * item.quantity).toLocaleString() }}
                  </p>
                  <v-btn icon="mdi-close-circle-outline" variant="text" color="grey-lighten-1" size="small"
                    @click="removeItem(item.product.id)"></v-btn>
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
              ${{ total.toLocaleString() }}
            </span>
          </div>

          <v-btn block color="pink-accent-2" size="x-large" class="rounded-pill font-weight-black text-none mb-4"
            elevation="8" @click="openCheckout">
            Confirmar Pedido
            <v-icon end>mdi-chevron-right</v-icon>
          </v-btn>

          <v-btn block variant="text" color="white" class="text-none" @click="goToCatalog">
            Seguir antojándome
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
      <v-col cols="12" md="6" class="text-center py-12">
        <v-icon size="120" color="pink-lighten-4" class="mb-6">mdi-cookie-off-outline</v-icon>
        <h2 class="text-h4 font-weight-black text-brown-darken-4 mb-4">¿Bolsa vacía?</h2>
        <p class="text-body-1 text-grey-darken-1 mb-8">Aún no has añadido ninguna delicia.</p>
        <v-btn size="x-large" color="pink-accent-2" class="rounded-pill px-10 font-weight-bold text-none"
          @click="goToCatalog">Explorar Menú</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="isCheckoutDialogOpen" max-width="600" persistent>
      <v-card class="rounded-xl pa-4">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5 font-weight-black text-brown-darken-4">Datos de Entrega</span>
          <v-btn icon="mdi-close" variant="text" :disabled="isSaving" @click="isCheckoutDialogOpen = false"></v-btn>
        </v-card-title>

        <v-card-text>
          <div class="mb-6">
             <p class="text-center text-body-2 text-brown-lighten-1 mb-3">Autocompleta tus datos para ir más rápido:</p>
             <div id="googleBtn" class="d-flex justify-center"></div>
          </div>

          <div class="d-flex align-center mb-6">
            <v-divider></v-divider>
            <span class="px-3 text-caption text-grey">O RELLENA MANUALMENTE</span>
            <v-divider></v-divider>
          </div>

          <div class="bg-brown-lighten-5 pa-4 rounded-lg mb-6">
            <div v-for="item in items" :key="item.product.id" class="d-flex justify-space-between text-body-2 mb-1">
              <span class="text-brown-darken-3">{{ item.quantity }}x {{ item.product.name }}</span>
              <span class="font-weight-bold">${{ (item.product.price * item.quantity).toLocaleString() }}</span>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-between font-weight-black text-h6 text-pink-darken-1">
              <span>Total:</span>
              <span>${{ total.toLocaleString() }}</span>
            </div>
          </div>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field v-model="shippingForm.nombre" label="Nombre" variant="outlined" color="pink-accent-2"
                density="comfortable"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="shippingForm.apellido" label="Apellido" variant="outlined" color="pink-accent-2"
                density="comfortable"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="shippingForm.correo" label="Correo Electrónico" variant="outlined"
                color="pink-accent-2" density="comfortable"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="shippingForm.direccion" label="Dirección de Entrega"
                placeholder="Ej: Calle 123 #45-67, Barrio, Apto/Casa" variant="outlined" color="pink-accent-2"
                density="comfortable" prepend-inner-icon="mdi-map-marker"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="shippingForm.telefono" label="Teléfono / WhatsApp" variant="outlined"
                color="pink-accent-2" density="comfortable" prefix="+57"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn block color="pink-accent-2" size="x-large" variant="flat"
            class="rounded-pill font-weight-black text-none" :loading="isSaving" :disabled="isSaving"
            @click="confirmOrder">
            Completar Pedido            
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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