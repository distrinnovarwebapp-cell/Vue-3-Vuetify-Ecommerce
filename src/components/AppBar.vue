<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { categories } from '../data/mockProducts';

// --- Lógica de Navegación ---
const router = useRouter();
const cartStore = useCartStore();

const searchQuery = ref('');
const selectedCategory = ref('');
const drawer = ref(false);

const cartItemsCount = computed(() => cartStore.cartItemsCount);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'Catalog',
      query: { search: searchQuery.value },
    });
    drawer.value = false;
  }
};

const handleCategoryChange = () => {
  const query: any = {};
  if (selectedCategory.value) query.category = selectedCategory.value;
  
  router.push({ name: 'Catalog', query });
  drawer.value = false;
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

const goToCatalog = () => {
  router.push({ name: 'Catalog' });
  drawer.value = false;
};
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="left"
    class="d-md-none bg-pink-lighten-5"
  >
    <v-list class="bg-transparent">
      <v-list-item class="py-4">
        <div class="d-flex align-center">
          <v-icon color="pink-accent-2" class="mr-2">mdi-cupcake</v-icon>
          <span class="text-h6 font-weight-black text-brown-darken-3">Cupcake Mania</span>
        </div>
      </v-list-item>
      
      <v-divider></v-divider>

      <v-list-item class="mt-4">
        <v-select
          v-model="selectedCategory"
          :items="[{ id: '', name: 'Todo el Menú' }, ...categories]"
          item-title="name"
          item-value="id"
          label="Categoría"
          variant="solo"
          flat
          bg-color="white"
          rounded="lg"
          prepend-inner-icon="mdi-filter-variant"
          @update:model-value="handleCategoryChange"
        ></v-select>
      </v-list-item>

      <v-list-item>
        <v-text-field
          v-model="searchQuery"
          label="¿Qué antojo tienes?"
          variant="solo"
          flat
          bg-color="white"
          rounded="lg"
          prepend-inner-icon="mdi-magnify"
          @keyup.enter="handleSearch"
        ></v-text-field>
      </v-list-item>

      <v-divider class="my-4"></v-divider>
      
      <v-list-item prepend-icon="mdi-home-heart" title="Inicio" @click="goHome"></v-list-item>
      <v-list-item prepend-icon="mdi-cake" title="Catálogo" @click="goToCatalog"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar 
    elevation="0" 
    class="main-app-bar px-md-4" 
    scroll-behavior="elevate"
    height="80"
  >
    <v-app-bar-nav-icon 
      class="d-md-none text-brown-darken-2" 
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-app-bar-title class="cursor-pointer logo-wrapper" @click="goHome">
      <div class="d-flex align-center">
        <div class="logo-circle mr-2">
          <v-icon icon="mdi-cupcake" color="white" size="24" />
        </div>
        <div class="d-flex flex-column">
          <span class="brand-text text-h6 font-weight-black lh-1 text-brown-darken-4">Cupcake</span>
          <span class="brand-subtext text-caption font-weight-bold text-pink-accent-2">MANIA</span>
        </div>
      </div>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="d-none d-md-flex align-center search-group mx-4">
      <v-select
        v-model="selectedCategory"
        :items="[{ id: '', name: 'Todo' }, ...categories]"
        item-title="name"
        item-value="id"
        density="compact"
        variant="solo"
        flat
        rounded="s-xl e-0"
        hide-details
        class="category-dropdown"
        bg-color="pink-lighten-5"
        @update:model-value="handleCategoryChange"
      ></v-select>

      <v-text-field
        v-model="searchQuery"
        density="compact"
        variant="solo"
        flat
        rounded="s-0 e-xl"
        hide-details
        placeholder="Buscar un postre..."
        prepend-inner-icon="mdi-magnify"
        bg-color="pink-lighten-5"
        class="search-field"
        @keyup.enter="handleSearch"
      ></v-text-field>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center gap-2">
      <v-btn icon color="brown-darken-1" class="d-none d-sm-flex">
        <v-icon>mdi-heart-outline</v-icon>
        <v-tooltip activator="parent" location="bottom">Mis Favoritos</v-tooltip>
      </v-btn>

      <v-btn 
        @click="goToCart" 
        class="cart-btn text-none px-4 rounded-pill"
        color="pink-accent-2"
        variant="flat"
      >
        <v-badge
          :content="cartItemsCount"
          :model-value="cartItemsCount > 0"
          color="brown-darken-4"
          offset-x="-2"
          offset-y="-2"
        >
          <v-icon class="mr-md-2" color="white">mdi-cart-heart</v-icon>
        </v-badge>
        <span class="d-none d-md-inline text-white font-weight-bold">Mi Pedido</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style scoped>
.main-app-bar {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(15px);
  border-bottom: 2px solid #FCE4EC !important;
}

.logo-circle {
  background: linear-gradient(45deg, #FF4081, #F06292);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(255, 64, 129, 0.3);
  transition: transform 0.3s ease;
}

.logo-wrapper:hover .logo-circle {
  transform: rotate(-15deg) scale(1.1);
}

.brand-text {
  line-height: 1;
  letter-spacing: -0.5px;
}

.brand-subtext {
  line-height: 1;
  letter-spacing: 2px;
  margin-top: -2px;
}

/* Buscador Estilo Repostería */
.search-group {
  flex: 1;
  max-width: 500px;
  height: 44px;
}

.category-dropdown {
  width: 140px;
  max-width: 140px;
}

.category-dropdown :deep(.v-field) {
  border-right: 1px solid #F8BBD0 !important;
}

.search-field :deep(.v-field__input) {
  font-size: 0.9rem;
}

.cart-btn {
  height: 44px !important;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 64, 129, 0.3) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.lh-1 { line-height: 1; }
.gap-2 { gap: 8px; }

/* Ajustes para que el select y el input parezcan uno solo */
:deep(.v-field--variant-solo) {
  box-shadow: none !important;
}
</style>