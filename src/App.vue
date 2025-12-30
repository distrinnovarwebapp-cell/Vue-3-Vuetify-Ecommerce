<script setup lang="ts">
import AppBar from './components/AppBar.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <v-app>
    <AppBar />

    <v-main>
      <router-view />
    </v-main>

    <AppFooter />
  </v-app>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}
</style>
