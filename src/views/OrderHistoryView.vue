<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dbLocal } from '../dexie';
import type { PedidoLocal } from '../dexie';

const pedidos = ref<PedidoLocal[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    pedidos.value = await dbLocal.pedidos.orderBy('fecha').reverse().toArray();
  } catch (error) {
    console.error("Error al cargar historial:", error);
  } finally {
    loading.value = false;
  }
});

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const formatMoney = (value: number) => {
  return `$${Math.round(value).toLocaleString('es-CO')}`;
};

const getShortId = (pedido: PedidoLocal) => {
  return pedido.firebaseId ? pedido.firebaseId.substring(0, 6).toUpperCase() : `LOCAL-${pedido.id}`;
};

const getEntrega = (pedido: PedidoLocal) => {
  const cliente = pedido.cliente as any;
  const resumen = (pedido as any).resumen;
  const metodo = resumen?.metodo || cliente?.metodoEntrega || '';
  if (cliente?.direccion === 'Recoge en Tienda' || metodo === 'recogida') return 'recogida';
  return 'domicilio';
};

// Helper para saber si es recogida rápidamente en el template
const isRecogida = (pedido: PedidoLocal) => getEntrega(pedido) === 'recogida';

const getDireccion = (pedido: PedidoLocal) => {
  const cliente = pedido.cliente as any;
  if (isRecogida(pedido)) return 'Nuestra Tienda (AV Cristanlo Luke dg 22#47A155 / Condominio Manaos 2 villas de la candelaria)'; // UX: Mostrar la dirección real del local
  return cliente?.direccion || 'Dirección no proporcionada';
};

const getSubtotal = (pedido: PedidoLocal) => {
  const resumen = (pedido as any).resumen;
  if (typeof resumen?.subtotal === 'number') return resumen.subtotal;
  return pedido.productos.reduce((acc: number, prod: any) => {
    const subtotal = typeof prod.subtotal === 'number'
      ? prod.subtotal
      : (prod.precioUnitario || 0) * (prod.cantidad || 0);
    return acc + subtotal;
  }, 0);
};

const getEnvio = (pedido: PedidoLocal) => {
  const resumen = (pedido as any).resumen;
  if (typeof resumen?.envio === 'number') return resumen.envio;
  return 0;
};

const getTotal = (pedido: PedidoLocal) => {
  const resumen = (pedido as any).resumen;
  if (typeof resumen?.total === 'number') return resumen.total;
  if (typeof pedido.total === 'number' && pedido.total > 0) return pedido.total;
  return getSubtotal(pedido) + getEnvio(pedido);
};

// Asigna colores lógicos según el estado para guiar el ojo del usuario
const getEstadoColor = (estado: string) => {
  const e = estado?.toLowerCase() || '';
  if (e.includes('entregado') || e.includes('completado')) return 'green-darken-1';
  if (e.includes('camino') || e.includes('listo')) return 'purple-accent-2';
  if (e.includes('preparando')) return 'orange-darken-1';
  return 'blue-grey-darken-1'; // Recibido por defecto
};
</script>

<template>
  <v-container class="py-8 max-width-container">
    <div class="d-flex align-center mb-8">
      <v-btn icon="mdi-arrow-left" variant="text" color="brown-darken-4" @click="$router.back()" class="mr-2"></v-btn>
      <h1 class="text-h4 font-weight-black text-brown-darken-4">Mi Historial Dulce</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="pink-accent-2" size="64"></v-progress-circular>
    </div>

    <div v-else-if="pedidos.length > 0">
      <v-card
        v-for="pedido in pedidos"
        :key="pedido.id"
        class="mb-6 rounded-xl border-sweet elevation-2 order-card overflow-hidden"
        @click="$router.push(`/pedido/${pedido.id}`)"
        hover
      >
        <v-card-item class="bg-brown-lighten-5 py-3">
          <template v-slot:prepend>
            <v-avatar :color="isRecogida(pedido) ? 'purple-accent-2' : 'pink-accent-2'" size="48" class="elevation-1">
              <v-icon color="white">{{ isRecogida(pedido) ? 'mdi-store' : 'mdi-bike' }}</v-icon>
            </v-avatar>
          </template>
          
          <v-card-title class="text-subtitle-1 font-weight-bold d-flex flex-wrap align-center justify-space-between gap-2">
            <span class="text-brown-darken-4">Pedido #{{ getShortId(pedido) }}</span>
            
            <div class="d-flex gap-2">
              <v-chip size="small" variant="outlined" :color="isRecogida(pedido) ? 'purple-accent-2' : 'pink-accent-2'" class="font-weight-bold">
                {{ isRecogida(pedido) ? 'Recogida' : 'Domicilio' }}
              </v-chip>
              <v-chip size="small" :color="getEstadoColor(pedido.estado)" variant="flat" class="font-weight-bold text-white">
                {{ pedido.estado || 'Recibido' }}
              </v-chip>
            </div>
          </v-card-title>
          
          <v-card-subtitle class="mt-1">{{ formatDate(pedido.fecha) }}</v-card-subtitle>
        </v-card-item>
        
        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" sm="7" class="pr-sm-6">
              <div class="d-flex align-center mb-3">
                <v-icon color="brown-lighten-1" size="20" class="mr-2">mdi-cookie</v-icon>
                <span class="text-subtitle-2 font-weight-bold text-brown-darken-3">Resumen del pedido</span>
                <v-chip size="x-small" color="brown-lighten-4" class="ml-2 font-weight-bold">{{ pedido.productos.length }} ítems</v-chip>
              </div>
              
              <div v-for="(prod, _) in pedido.productos.slice(0, 3)" :key="prod.id" class="d-flex justify-space-between text-body-2 mb-1">
                <span class="text-brown-darken-2 text-truncate mr-2">{{ prod.cantidad }}x {{ prod.nombre }}</span>
                <span class="text-brown-darken-4 font-weight-medium">
                  {{ formatMoney(typeof prod.subtotal === 'number' ? prod.subtotal : (prod.precioUnitario || 0) * (prod.cantidad || 0)) }}
                </span>
              </div>
              <div v-if="pedido.productos.length > 3" class="text-caption text-grey-darken-1 mt-1 font-italic">
                + {{ pedido.productos.length - 3 }} productos más...
              </div>
            </v-col>

            <v-divider vertical class="hidden-xs"></v-divider>

            <v-col cols="12" sm="5" class="pl-sm-6">
              <div class="d-flex align-center mb-3">
                <v-icon color="brown-lighten-1" size="20" class="mr-2">
                  {{ isRecogida(pedido) ? 'mdi-store-marker-outline' : 'mdi-map-marker-radius' }}
                </v-icon>
                <span class="text-subtitle-2 font-weight-bold text-brown-darken-3">
                  {{ isRecogida(pedido) ? 'Punto de Recogida' : 'Dirección de Envío' }}
                </span>
              </div>
              <p class="text-body-2 text-brown-darken-2 mb-4 line-clamp-2">
                {{ getDireccion(pedido) }}
              </p>

              <div class="d-flex flex-column bg-brown-lighten-5 pa-3 rounded-lg">
                <div v-if="!isRecogida(pedido) && getEnvio(pedido) > 0" class="d-flex justify-space-between text-caption mb-1">
                  <span class="text-brown-darken-1">Envío</span>
                  <span>{{ formatMoney(getEnvio(pedido)) }}</span>
                </div>
                <div class="d-flex justify-space-between align-center mt-1">
                  <span class="text-subtitle-2 font-weight-bold text-brown-darken-4">Total Pagado</span>
                  <span class="text-subtitle-1 font-weight-black text-pink-accent-2">
                    {{ formatMoney(getTotal(pedido)) }}
                  </span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <v-row v-else justify="center" class="py-12">
      <v-col cols="12" md="6" class="text-center">
        <v-avatar color="pink-lighten-5" size="120" class="mb-6">
          <v-icon size="64" color="pink-lighten-2">mdi-cupcake</v-icon>
        </v-avatar>
        <h2 class="text-h5 text-brown-darken-4 font-weight-bold">Aún no hay antojitos aquí</h2>
        <p class="text-body-1 text-brown-darken-2 mt-3 mb-6">
          Cuando hagas tu primer pedido, podrás seguir su estado y ver tu historial completo en este espacio.
        </p>
        <v-btn color="pink-accent-2" size="large" elevation="2" class="rounded-pill font-weight-bold px-8" to="/catalog">
          Ver Catálogo de Postres
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.max-width-container {
  max-width: 800px;
  margin: 0 auto;
}

.border-sweet { 
  border: 1px solid #FCE4EC !important; 
}

.order-card { 
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
}

.order-card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 8px 16px rgba(240, 98, 146, 0.15) !important;
  border-color: #F8BBD0 !important;
}

.gap-2 {
  gap: 8px;
}

/* Evita que direcciones muy largas rompan el diseño */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
