<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { categories } from '../data/mockProducts';

// --- Lógica Original Intacta ---
const router = useRouter();
const cartStore = useCartStore();

const searchQuery = ref('');
const selectedCategory = ref('');
const drawer = ref(false); // Nuevo: Control para menú móvil

const cartItemsCount = computed(() => cartStore.cartItemsCount);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'Catalog',
      query: { search: searchQuery.value },
    });
    drawer.value = false; // Cerrar menú móvil al buscar
  }
};

const handleCategoryChange = () => {
  if (selectedCategory.value) {
    router.push({
      name: 'Catalog',
      query: { category: selectedCategory.value },
    });
  } else {
    router.push({ name: 'Catalog' });
  }
  drawer.value = false; // Cerrar menú móvil al cambiar categoría
};

const goToCart = () => {
  router.push({ name: 'Cart' });
  drawer.value = false;
};

const goHome = () => {
  router.push({ name: 'Home' });
  searchQuery.value = '';
  selectedCategory.value = '';
  drawer.value = false;
};
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    class="d-md-none"
  >
    <v-list>
      <v-list-item title="Menú" subtitle="Explora nuestros productos"></v-list-item>
      <v-divider class="mb-4"></v-divider>

      <v-list-item>
        <v-select
          v-model="selectedCategory"
          :items="[{ id: '', name: 'Todas las Categorías' }, ...categories]"
          item-title="name"
          item-value="id"
          label="Categoría"
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-shape-outline"
          hide-details
          class="mb-4"
          @update:model-value="handleCategoryChange"
        ></v-select>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="searchQuery"
          label="Buscar..."
          variant="outlined"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          @keyup.enter="handleSearch"
          @click:clear="searchQuery = ''"
        >
          <template v-slot:append-inner>
             <v-icon size="small" class="cursor-pointer" @click="handleSearch">mdi-arrow-right</v-icon>
          </template>
        </v-text-field>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar 
    elevation="1" 
    class="glass-bar px-2" 
    scroll-behavior="elevate"
    color="surface"
  >
    <v-app-bar-nav-icon 
      class="d-md-none mr-2" 
      variant="text" 
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-app-bar-title class="cursor-pointer logo-container" @click="goHome">
      <div class="d-flex align-center text-primary">
        <v-icon icon="mdi-shopping-outline" size="28" class="mr-2 logo-icon" />
        <span class="text-h6 font-weight-black tracking-wide">DistrinnovarSoluciones</span>
      </div>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="d-none d-md-flex align-center justify-center search-bar-container mx-4">
      <v-select
        v-model="selectedCategory"
        :items="[{ id: '', name: 'Todas' }, ...categories]"
        item-title="name"
        item-value="id"
        density="compact"
        variant="outlined"
        rounded="s-pill e-0"
        hide-details
        class="category-select"
        bg-color="surface"
        placeholder="Categoría"
        @update:model-value="handleCategoryChange"
      ></v-select>

      <v-text-field
        v-model="searchQuery"
        density="compact"
        variant="outlined"
        rounded="s-0 e-pill"
        hide-details
        placeholder="¿Qué estás buscando?"
        prepend-inner-icon="mdi-magnify"
        clearable
        bg-color="surface"
        class="search-input"
        @keyup.enter="handleSearch"
        @click:clear="searchQuery = ''"
      ></v-text-field>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <v-btn icon class="mr-1" color="grey-darken-1">
        <v-icon>mdi-account-outline</v-icon>
        <v-tooltip activator="parent" location="bottom">Mi Cuenta</v-tooltip>
      </v-btn>

      <v-btn icon @click="goToCart" class="text-none">
        <v-badge
          :content="cartItemsCount"
          :model-value="cartItemsCount > 0"
          color="error"
          location="top end"
          offset-x="3"
          offset-y="3"
        >
          <v-icon color="primary">mdi-cart-outline</v-icon>
        </v-badge>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style scoped>
/* Efecto de cristal esmerilado */
.glass-bar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.cursor-pointer {
  cursor: pointer;
  transition: opacity 0.2s;
}

.cursor-pointer:hover {
  opacity: 0.8;
}

.tracking-wide {
  letter-spacing: 0.5px;
}

/* Contenedor central de búsqueda */
.search-bar-container {
  flex: 1;
  max-width: 600px;
  /* Unifica visualmente el select y el input */
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.02)); 
}

/* Ajustes finos para unir el select y el input en desktop */
:deep(.category-select .v-field__outline__end) {
  border-right: none !important;
}

:deep(.search-input .v-field__outline__start) {
  border-left: none !important;
}

:deep(.v-field) {
  transition: all 0.3s ease;
}

:deep(.v-field--focused) {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

/* Animación sutil para el logo */
.logo-icon {
  transition: transform 0.3s ease;
}

.logo-container:hover .logo-icon {
  transform: rotate(-10deg) scale(1.1);
}
</style>