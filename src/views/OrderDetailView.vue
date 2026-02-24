<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { dbLocal } from '../dexie'; 
import { doc, onSnapshot, getFirestore } from 'firebase/firestore'; 

const route = useRoute();
const router = useRouter();
const pedido = ref<any>(null);
const loading = ref(true);
const db = getFirestore();

let unsubscribe: (() => void) | null = null;

// 1. Separamos los flujos de estados según el tipo de entrega
const estadosDomicilio = [
  { nombre: 'Recibido', icono: 'mdi-receipt-text-outline' },
  { nombre: 'Preparando', icono: 'mdi-cookie-cog-outline' },
  { nombre: 'En Camino', icono: 'mdi-moped-outline' },
  { nombre: 'Entregado', icono: 'mdi-home-heart' }
];

const estadosRecoger = [
  { nombre: 'Recibido', icono: 'mdi-receipt-text-outline' },
  { nombre: 'Preparando', icono: 'mdi-cookie-cog-outline' },
  { nombre: 'Listo para recoger', icono: 'mdi-store-clock-outline' },
  { nombre: 'Entregado', icono: 'mdi-shopping-outline' } // o "Completado"
];

// 2. Computamos los estados dinámicamente
const estados = computed(() => {
  return pedido.value?.tipoEntrega === 'recoger' ? estadosRecoger : estadosDomicilio;
});

const estadoActualIndex = computed(() => {
  if (!pedido.value?.estado) return 0;
  const index = estados.value.findIndex(e => e.nombre === pedido.value.estado);
  return index !== -1 ? index : 0;
});

// Calculamos el ancho de la línea de progreso
const progressLineWidth = computed(() => {
  if (estados.value.length <= 1) return 0;
  return (estadoActualIndex.value / (estados.value.length - 1)) * 100;
});

onMounted(async () => {
  try {
    const idDesdeRuta = route.params.id;
    let fId: string | null = null;

    if (!isNaN(Number(idDesdeRuta))) {
      const pLocal = await dbLocal.pedidos.get(Number(idDesdeRuta));
      fId = pLocal?.firebaseId || null;
    } else {
      fId = idDesdeRuta as string;
    }

    if (!fId) {
      router.push('/historial');
      return;
    }

    const docRef = doc(db, "pedidos", fId);
    
    unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const dataFB = docSnap.data();
        
        pedido.value = {
          id: fId,
          estado: dataFB.estado || 'Recibido',
          // Aseguramos capturar el tipo de entrega (asume 'domicilio' por defecto)
          tipoEntrega: dataFB.tipoEntrega || 'domicilio', 
          productos: dataFB.productos,
          direccion: dataFB.cliente?.direccion,
          total: dataFB.resumen?.total,
          fecha: dataFB.fecha
        };

        const registroLocal = await dbLocal.pedidos.where('firebaseId').equals(fId!).first();
        if (registroLocal && registroLocal.id) {
          await dbLocal.pedidos.update(registroLocal.id, {
            estado: dataFB.estado
          });
        }
        
        loading.value = false;
      } else {
        console.error("El pedido no existe en Firebase");
        router.push('/historial');
      }
    }, (error) => {
      console.error("Error en tiempo real:", error);
      loading.value = false;
    });

  } catch (error) {
    console.error("Error inicial:", error);
    loading.value = false;
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<template>
  <v-container class="py-8 max-width-container">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" color="brown-darken-4" @click="router.back()"></v-btn>
        <h1 class="text-h5 font-weight-black text-brown-darken-4 ml-2">Seguimiento de Pedido</h1>
      </div>
      <v-chip 
        v-if="pedido"
        :color="pedido.tipoEntrega === 'recoger' ? 'purple-accent-2' : 'pink-accent-2'" 
        variant="tonal"
        class="font-weight-bold"
      >
        <v-icon start>{{ pedido.direccion=== 'Recoge en Tienda' ? 'mdi-store' : 'mdi-bike' }}</v-icon>
        {{ pedido.direccion=== 'Recoge en Tienda' ? 'Recogida en tienda' : 'A domicilio' }}
      </v-chip>
    </div>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="pink-accent-2"></v-progress-circular>
    </div>

    <div v-else-if="pedido">
      
      <v-card class="rounded-xl border-sweet elevation-2 mb-8 pa-6">
        <div class="text-center mb-6">
          <span class="text-overline text-pink-accent-2 font-weight-bold">¿Cómo va tu antojo?</span>
          <h2 class="text-h6 text-brown-darken-3 font-weight-bold">Estado: {{ pedido.estado }}</h2>
        </div>

        <div class="stepper-wrapper">
          <div class="progress-line-bg"></div>
          <div class="progress-line-fill" :style="{ width: progressLineWidth + '%' }"></div>
          
          <div v-for="(step, index) in estados" :key="index" class="step-item">
            <v-avatar 
              :color="index <= estadoActualIndex ? 'pink-accent-2' : 'white'" 
              size="56"
              :class="[
                { 'elevation-4 pulse-animation': index === estadoActualIndex },
                { 'border-grey': index > estadoActualIndex }
              ]"
            >
              <v-icon :color="index <= estadoActualIndex ? 'white' : 'grey-lighten-1'">
                {{ step.icono }}
              </v-icon>
            </v-avatar>
            <span 
              class="text-caption mt-2 font-weight-bold text-center"
              :class="index <= estadoActualIndex ? 'text-pink-accent-2' : 'text-grey-darken-1'"
            >
              {{ step.nombre }}
            </span>
          </div>
        </div>
      </v-card>

      <v-row>
        <v-col cols="12" md="7">
          <v-card class="rounded-xl border-sweet elevation-2">
            <v-card-title class="pa-4 text-brown-darken-3 font-weight-bold">
              Tu Selección Dulce
            </v-card-title>
            <v-divider></v-divider>
            <v-list>
              <v-list-item v-for="prod in pedido.productos" :key="prod.id" class="py-3">
                <template v-slot:prepend>
                  <v-icon color="pink-lighten-3">mdi-star-four-points</v-icon>
                </template>
                <v-list-item-title class="font-weight-bold text-brown-darken-2">
                  {{ prod.cantidad }}x {{ prod.nombre }}
                </v-list-item-title>
                <template v-slot:append>
                  <span class="text-body-2 font-weight-black">${{ prod.subtotal.toLocaleString() }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="rounded-xl border-sweet elevation-2 bg-brown-lighten-5">
            <v-card-text>
              <div v-if="pedido.tipoEntrega === 'recoger'">
                <div class="d-flex align-center mb-4">
                  <v-icon color="brown-darken-2" class="mr-2">mdi-store-marker-outline</v-icon>
                  <span class="font-weight-bold text-brown-darken-3">Punto de Recogida</span>
                </div>
                <p class="text-body-2 text-brown-darken-1 mb-2">
                  Pasa por tu pedido en nuestra tienda:
                </p>
                <p class="text-body-1 font-weight-bold text-brown-darken-3 mb-6">
                  Calle de la Dulzura #123, Local 4
                </p>
              </div>

              <div v-else>
                <div class="d-flex align-center mb-4">
                  <v-icon color="brown-darken-2" class="mr-2">mdi-map-marker-radius</v-icon>
                  <span class="font-weight-bold text-brown-darken-3">Dirección de Envío</span>
                </div>
                <p class="text-body-2 text-brown-darken-1 mb-6">
                  {{ pedido.direccion || 'Dirección no proporcionada' }}
                </p>
              </div>

              <v-divider class="mb-4"></v-divider>
              
              <div class="d-flex justify-space-between align-center">
                <span class="text-h6 font-weight-bold text-brown-darken-3">Total</span>
                <v-chip color="pink-accent-2" variant="flat" class="text-h6 px-4">
                  ${{ pedido.total.toLocaleString() }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
          
          <v-btn 
            block 
            variant="outlined" 
            color="pink-accent-2" 
            class="mt-4 rounded-pill"
            prepend-icon="mdi-whatsapp"
            href="https://wa.me/tu-numero"
            target="_blank"
          >
            ¿Necesitas ayuda? Escríbenos
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.border-sweet { 
  border: 2px solid #FCE4EC !important; 
}

.max-width-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Rediseño de la barra de progreso */
.stepper-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 10px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  width: 90px;
}

.border-grey {
  border: 2px solid #E0E0E0 !important;
}

.progress-line-bg {
  position: absolute;
  top: 26px; /* Ajustado al centro del avatar */
  left: 45px;
  right: 45px;
  height: 4px;
  background: #EEEEEE;
  z-index: 1;
}

.progress-line-fill {
  position: absolute;
  top: 26px;
  left: 45px;
  height: 4px;
  background: #FF4081; /* pink-accent-2 */
  z-index: 1;
  transition: width 0.4s ease;
}

/* Animación para el estado actual */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0px rgba(240, 98, 146, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(240, 98, 146, 0); }
  100% { box-shadow: 0 0 0 0px rgba(240, 98, 146, 0); }
}
</style>
