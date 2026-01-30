<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dbLocal } from '../dexie'; // Ajusta la ruta a tu archivo dexie
import type { PedidoLocal } from '../dexie';

const pedidos = ref<PedidoLocal[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    // Obtenemos los pedidos de Dexie ordenados por fecha descendente
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
</script>

<template>
  <v-container class="py-8">
    <div class="d-flex align-center mb-8">
      <v-btn icon="mdi-arrow-left" variant="text" @click="$router.back()" class="mr-2"></v-btn>
      <h1 class="text-h4 font-weight-black text-brown-darken-4">Mi Historial Dulce</h1>
    </div>

    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="pink-accent-2"></v-progress-circular>
    </div>

    <div v-else-if="pedidos.length > 0">
      <v-card v-for="pedido in pedidos" :key="pedido.id" class="mb-4 rounded-xl border-sweet elevation-2">
        <v-card-item class="bg-brown-lighten-5">
          <template v-slot:prepend>
            <v-icon color="pink-accent-2">mdi-bag-check</v-icon>
          </template>
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Pedido #{{ pedido.firebaseId?.substring(0, 6).toUpperCase() }}
          </v-card-title>
          <v-card-subtitle>{{ formatDate(pedido.fecha) }}</v-card-subtitle>
          <template v-slot:append>
            <v-chip color="pink-accent-2" variant="flat" size="small" class="font-weight-bold">
              ${{ pedido.total.toLocaleString() }}
            </v-chip>
          </template>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text>
          <div v-for="prod in pedido.productos" :key="prod.id" class="d-flex justify-space-between text-body-2 mb-1">
            <span class="text-brown-darken-3">{{ prod.cantidad }}x {{ prod.nombre }}</span>
            <span class="text-grey-darken-1">${{ prod.subtotal.toLocaleString() }}</span>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-row v-else justify="center" class="py-12">
      <v-col cols="12" md="6" class="text-center">
        <v-icon size="80" color="grey-lighten-2">mdi-history-off</v-icon>
        <h2 class="text-h5 text-grey-darken-1 mt-4">Aún no has realizado pedidos</h2>
        <v-btn color="pink-accent-2" class="mt-6 rounded-pill" to="/catalog">Ir al Catálogo</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.border-sweet { border: 2px solid #FCE4EC !important; }
</style>