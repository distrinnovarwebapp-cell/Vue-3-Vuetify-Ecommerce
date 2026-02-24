<script setup lang="ts">
declare var google: any;
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

// 1. Importaciones de Firebase y Dexie
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { dbLocal } from '../dexie';

// 2. Confeti
import confetti from 'canvas-confetti';

const router = useRouter();
const cartStore = useCartStore();

// --- ESTADO ---
const isCheckoutDialogOpen = ref(false);
const isSaving = ref(false);
const formRef = ref<any>(null); // Referencia para la validación de Vuetify

const shippingForm = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  direccion: '',
  metodoEntrega: 'domicilio' // 'domicilio' o 'recogida'
});

// --- REGLAS DE VALIDACIÓN ---
const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  email: (v: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(v) || 'Ingresa un correo electrónico válido';
  },
  phone: (v: string) => {
    const clean = v.replace(/\D/g, '');
    if (clean.length !== 10) return 'El número debe tener 10 dígitos';
    if (!clean.startsWith('3')) return 'Debe empezar por 3 (celular Colombia)';
    return true;
  },
  address: (v: string) => (v && v.length >= 8) || 'Por favor indica una dirección clara (Barrio, Calle/Cra, Casa/Apto)'
};

// --- CÓMPUTOS DEL CARRITO ---
const items = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.subtotal);

const costoEnvio = computed(() => {
  if (shippingForm.value.metodoEntrega === 'recogida') return 0;
  return subtotal.value >= 50000 ? 0 : 5000;
});

const total = computed(() => subtotal.value + costoEnvio.value);

// --- ACCIONES ---
const updateQuantity = (productId: string, newQuantity: number) => {
  if (newQuantity < 1) return;
  cartStore.updateQuantity(productId, newQuantity);
};

const removeItem = (productId: string) => cartStore.removeFromCart(productId);
const clearCart = () => cartStore.clearCart();
const goToCatalog = () => router.push({ name: 'Catalog' });
const goToProduct = (id: string) => router.push({ name: 'ProductDetail', params: { id } });

const openCheckout = () => {
  isCheckoutDialogOpen.value = true;
};

const lanzarConfetiDulce = () => {
  const colors = ['#FF4081', '#F8BBD0', '#3E2723'];
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors });
};

// --- LÓGICA DE GOOGLE ---
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  } catch { return null; }
};

const handleGoogleResponse = (response: any) => {
  const userData = parseJwt(response.credential);
  if (userData) {
    shippingForm.value.nombre = userData.given_name || '';
    shippingForm.value.apellido = userData.family_name || '';
    shippingForm.value.correo = userData.email || '';
  }
};

const renderGoogleButton = () => {
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
    const parent = document.getElementById('googleBtn');
    if (parent) {
      google.accounts.id.renderButton(parent, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', width: parent.offsetWidth });
    }
  }
};

watch(isCheckoutDialogOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    renderGoogleButton();
  }
});

// --- CONFIRMACIÓN FINAL ---
const confirmOrder = async () => {
  // 1. Ejecutar validación de Vuetify
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isSaving.value = true;

  try {
    const productosFormateados = items.value.map(i => ({
      nombre: i.product.name,
      cantidad: i.quantity,
      precioUnitario: i.product.price,
      subtotal: i.product.price * i.quantity
    }));

    const pedidoData = {
      cliente: {
        ...shippingForm.value,
        direccion: shippingForm.value.metodoEntrega === 'recogida' ? 'Recoge en Tienda' : shippingForm.value.direccion
      },
      productos: productosFormateados,
      resumen: {
        subtotal: subtotal.value,
        envio: costoEnvio.value,
        total: total.value,
        metodo: shippingForm.value.metodoEntrega
      },
      fecha: serverTimestamp(),
      estado: 'Recibido'
    };

    // Guardar en Firebase
    const docRef = await addDoc(collection(db, "pedidos"), pedidoData);
    
    // Guardar en Dexie (Local)
    await dbLocal.pedidos.add({
      firebaseId: docRef.id,
      ...pedidoData,
      fecha: new Date(),
      total: 0
    });

    // Enviar a Apps Script (No-blocking)
    fetch(import.meta.env.VITE_GMAIL_API, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ ...pedidoData, pedidoId: docRef.id })
    }).catch(e => console.error("Error correo:", e));

    isCheckoutDialogOpen.value = false;
    cartStore.clearCart();
    lanzarConfetiDulce();
    router.push({ name: 'Catalog' });

  } catch (error) {
    console.error(error);
    alert("Error al procesar el pedido.");
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
                    <v-btn icon="mdi-plus" size="x-small" variant="text" :disabled="item.quantity >= item.product.stock"
                      @click="updateQuantity(item.product.id, item.quantity + 1)"></v-btn>
                  </div>
                </v-col>
                <v-col cols="5" sm="3" class="mt-4 mt-sm-0 text-right">
                  <p class="text-h6 font-weight-black text-brown-darken-4 mb-0">
                    ${{ (item.product.price * item.quantity).toLocaleString() }}
                  </p>
                  <v-btn icon="mdi-close-circle-outline" variant="text" color="grey-lighten-1" size="small" @click="removeItem(item.product.id)"></v-btn>
                </v-col>
              </v-row>
              <v-divider v-if="index < items.length - 1" class="mt-4"></v-divider>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="rounded-xl pa-6 sticky-summary elevation-4" color="brown-darken-4" theme="dark">
          <h2 class="text-h5 font-weight-black mb-6">Resumen</h2>
          <div class="d-flex justify-space-between mb-4">
            <span class="text-brown-lighten-3">Subtotal</span>
            <span class="text-h6">${{ subtotal.toLocaleString() }}</span>
          </div>
          <div class="d-flex justify-space-between mb-4 align-center">
            <span class="text-brown-lighten-3">Envío</span>
            <v-chip v-if="costoEnvio === 0" size="small" color="success" variant="flat">GRATIS</v-chip>
            <span v-else class="text-h6 text-pink-lighten-3">$5.000</span>
          </div>
          <v-divider class="my-6 border-opacity-25"></v-divider>
          <div class="d-flex justify-space-between mb-8 align-center">
            <span class="text-h6">Total</span>
            <span class="text-h4 font-weight-black text-pink-accent-2">${{ total.toLocaleString() }}</span>
          </div>
          <v-btn block color="pink-accent-2" size="x-large" class="rounded-pill font-weight-black text-none mb-4" @click="openCheckout">
            Confirmar Pedido
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
      <v-col cols="12" md="6" class="text-center py-12">
        <v-icon size="120" color="pink-lighten-4" class="mb-6">mdi-cookie-off-outline</v-icon>
        <h2 class="text-h4 font-weight-black text-brown-darken-4 mb-4">¿Bolsa vacía?</h2>
        <v-btn size="x-large" color="pink-accent-2" class="rounded-pill px-10 font-weight-bold" @click="goToCatalog">Explorar Menú</v-btn>
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
             <div id="googleBtn" class="d-flex justify-center mb-4"></div>
             <v-divider></v-divider>
          </div>

          <p class="text-subtitle-2 font-weight-bold text-brown-darken-1 mb-2">¿Cómo prefieres recibirlo?</p>
          <v-btn-toggle v-model="shippingForm.metodoEntrega" mandatory color="pink-accent-2" variant="outlined" class="mb-6 d-flex w-100" divided>
            <v-btn value="domicilio" class="flex-grow-1 text-none" prepend-icon="mdi-truck-delivery">Domicilio</v-btn>
            <v-btn value="recogida" class="flex-grow-1 text-none" prepend-icon="mdi-storefront">Recoger</v-btn>
          </v-btn-toggle>

          <v-form ref="formRef" @submit.prevent="confirmOrder">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model="shippingForm.nombre" label="Nombre" variant="outlined" color="pink-accent-2" 
                  :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="shippingForm.apellido" label="Apellido" variant="outlined" color="pink-accent-2" 
                  :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="shippingForm.correo" label="Correo Electrónico" variant="outlined" color="pink-accent-2"
                  :rules="[rules.required, rules.email]"></v-text-field>
              </v-col>
              
              <v-col cols="12" v-if="shippingForm.metodoEntrega === 'domicilio'">
                <v-text-field v-model="shippingForm.direccion" label="Dirección de Entrega" variant="outlined" color="pink-accent-2"
                  prepend-inner-icon="mdi-map-marker" :rules="[rules.required, rules.address]"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="shippingForm.telefono" label="Teléfono / WhatsApp" variant="outlined" color="pink-accent-2"
                  prefix="+57" type="tel" maxlength="10" :rules="[rules.required, rules.phone]"></v-text-field>
              </v-col>
            </v-row>
          </v-form>

          <div class="bg-brown-lighten-5 pa-4 rounded-lg mt-4">
            <div class="d-flex justify-space-between font-weight-black text-h6 text-pink-darken-1">
              <span>Total a pagar:</span>
              <span>${{ total.toLocaleString() }}</span>
            </div>
            <p v-if="shippingForm.metodoEntrega === 'recogida'" class="text-caption text-brown-lighten-1 mt-1">
              * Te avisaremos por WhatsApp cuando tu pedido esté listo para recoger.
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn block color="pink-accent-2" size="x-large" variant="flat" class="rounded-pill font-weight-black text-none"
            :loading="isSaving" @click="confirmOrder">
            Completar Pedido            
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.border-sweet { border: 2px solid #FCE4EC !important; }
.cart-item { transition: all 0.2s ease; }
.cart-item:hover { background-color: #FFF9FB; }
.qty-control { border: 1px solid #E0E0E0; }
.sticky-summary { position: sticky; top: 100px; }
.cursor-pointer { cursor: pointer; }
</style>
