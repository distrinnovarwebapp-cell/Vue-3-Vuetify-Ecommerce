<script setup lang="ts">
import { ref } from 'vue';

const currentYear = new Date().getFullYear();
const newsletterEmail = ref('');

const footerLinks = [
  { title: 'Sobre Nosotros', icon: 'mdi-information-outline' },
  { title: 'Contacto', icon: 'mdi-email-outline' },
  { title: 'Términos de Servicio', icon: 'mdi-file-document-outline' },
  { title: 'Política de Privacidad', icon: 'mdi-shield-check-outline' },
];

const socialLinks = [
  { icon: 'mdi-facebook', color: '#1877F2', name: 'Facebook' },
  { icon: 'mdi-twitter', color: '#1DA1F2', name: 'Twitter' },
  { icon: 'mdi-instagram', color: '#E4405F', name: 'Instagram' },
  { icon: 'mdi-linkedin', color: '#0A66C2', name: 'LinkedIn' },
];

const socialHover = ref<string | null>(null);
</script>

<template>
  <v-footer class="bg-grey-darken-4 text-white pt-10 pb-5">
    <v-container>
      <v-row justify="space-between">
        <v-col cols="12" md="4" class="mb-8 mb-md-0">
          <div class="d-flex align-center mb-4">
            <v-icon size="32" class="mr-2 text-primary">mdi-shopping-outline</v-icon>
            <span class="text-h5 font-weight-black tracking-wide">ShopVue</span>
          </div>
          
          <p class="text-body-2 text-grey-lighten-1 mb-6" style="max-width: 300px; line-height: 1.6;">
            Tu destino premium para compras online. Calidad garantizada y envíos a todo el país.
          </p>

          <div class="newsletter-box">
            <p class="text-caption font-weight-bold text-uppercase mb-2 text-grey-darken-1">
              Suscríbete a nuestras novedades
            </p>
            <v-text-field
              v-model="newsletterEmail"
              placeholder="tu@email.com"
              variant="outlined"
              density="compact"
              bg-color="grey-darken-3"
              hide-details
              rounded="lg"
            >
              <template v-slot:append-inner>
                <v-btn size="small" color="primary" icon="mdi-arrow-right" variant="text"></v-btn>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-8 mb-sm-0">
          <h3 class="text-subtitle-1 font-weight-bold mb-4 text-uppercase tracking-wider">
            Explorar
          </h3>
          <div class="d-flex flex-column gap-3">
            <a
              v-for="link in footerLinks"
              :key="link.title"
              href="#"
              class="footer-link text-decoration-none text-grey-lighten-1 d-flex align-center"
            >
              <v-icon size="small" class="mr-3 link-icon">{{ link.icon }}</v-icon>
              {{ link.title }}
            </a>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <h3 class="text-subtitle-1 font-weight-bold mb-4 text-uppercase tracking-wider">
            Contacto
          </h3>
          
          <div class="contact-info mb-6">
            <div class="d-flex align-center mb-3 text-grey-lighten-1">
              <v-avatar color="grey-darken-3" size="32" class="mr-3">
                <v-icon size="small">mdi-map-marker</v-icon>
              </v-avatar>
              <span class="text-body-2">Av. Principal 123, Ciudad Comercio</span>
            </div>
            
            <div class="d-flex align-center mb-3 text-grey-lighten-1">
               <v-avatar color="grey-darken-3" size="32" class="mr-3">
                <v-icon size="small">mdi-email</v-icon>
              </v-avatar>
              <span class="text-body-2">soporte@shopvue.com</span>
            </div>

             <div class="d-flex align-center text-grey-lighten-1">
               <v-avatar color="grey-darken-3" size="32" class="mr-3">
                <v-icon size="small">mdi-phone</v-icon>
              </v-avatar>
              <span class="text-body-2">+1 (555) 123-4567</span>
            </div>
          </div>

          <div class="d-flex gap-2">
            <v-btn
              v-for="social in socialLinks"
              :key="social.icon"
              :color="socialHover === social.name ? social.color : 'grey-darken-3'"
              :variant="socialHover === social.name ? 'flat' : 'flat'"
              icon
              size="small"
              class="social-btn"
              @mouseenter="socialHover = social.name"
              @mouseleave="socialHover = null"
            >
              <v-icon :color="socialHover === social.name ? 'white' : 'grey-lighten-1'">
                {{ social.icon }}
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-8 border-opacity-25"></v-divider>

      <v-row align="center">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <p class="text-caption text-grey-darken-1 mb-0">
            &copy; {{ currentYear }} <strong class="text-white">ShopVue</strong>. Todos los derechos reservados.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right mt-4 mt-md-0">
           <div class="d-flex justify-center justify-md-end gap-2 opacity-50">
             <v-icon>mdi-credit-card-outline</v-icon>
             <v-icon>mdi-bank</v-icon>
             <v-icon>mdi-lock-outline</v-icon>
           </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

.tracking-wide { letter-spacing: 0.5px; }
.tracking-wider { letter-spacing: 1px; }

/* Estilo de los enlaces */
.footer-link {
  transition: all 0.3s ease;
  position: relative;
}

.footer-link:hover {
  color: white !important;
  transform: translateX(5px); /* Efecto de deslizamiento sutil */
}

.link-icon {
  transition: color 0.3s ease;
}

.footer-link:hover .link-icon {
  color: rgb(var(--v-theme-primary));
}

/* Botones sociales */
.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-3px);
}

/* Ajustes del input */
:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>