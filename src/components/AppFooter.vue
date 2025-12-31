<script setup lang="ts">
import { ref } from 'vue';

const currentYear = new Date().getFullYear();
const newsletterEmail = ref('');

const footerLinks = [
  { title: 'Nuestra Historia', icon: 'mdi-heart-outline' },
  { title: 'Catálogo de Dulces', icon: 'mdi-muffin' },
  { title: 'Preguntas Frecuentes', icon: 'mdi-help-circle-outline' },
  { title: 'Términos y Pedidos', icon: 'mdi-clipboard-text-outline' },
];

const socialLinks = [
  { icon: 'mdi-facebook', color: '#1877F2', name: 'Facebook' },
  { icon: 'mdi-instagram', color: '#E4405F', name: 'Instagram' },
  { icon: 'mdi-whatsapp', color: '#25D366', name: 'WhatsApp' },
];

const socialHover = ref<string | null>(null);
</script>

<template>
  <v-footer class="bg-brown-darken-4 text-white pt-12 pb-6">
    <v-container>
      <v-row justify="space-between">
        <v-col cols="12" md="4" class="mb-8 mb-md-0 text-center text-md-left">
          <div class="d-flex align-center mb-4 justify-center justify-md-start">
            <v-icon size="36" color="pink-accent-2" class="mr-2">mdi-cupcake</v-icon>
            <span class="text-h5 font-weight-black tracking-wide brand-text">
              Cupcake<span class="text-pink-accent-2">Mania</span>
            </span>
          </div>
          
          <p class="text-body-2 text-brown-lighten-4 mb-6" style="max-width: 320px; line-height: 1.6;">
            Endulzando tus momentos más especiales en Cartagena con repostería artesanal hecha con el corazón.
          </p>

          <div class="newsletter-box mx-auto mx-md-0" style="max-width: 300px;">
            <p class="text-caption font-weight-bold text-uppercase mb-3 text-pink-lighten-4">
              Recibe nuestras promociones
            </p>
            <v-text-field
              v-model="newsletterEmail"
              placeholder="Tu correo electrónico"
              variant="solo"
              density="compact"
              bg-color="brown-darken-3"
              flat
              hide-details
              rounded="lg"
              class="newsletter-input"
            >
              <template v-slot:append-inner>
                <v-btn size="small" color="pink-accent-2" icon="mdi-send" variant="text"></v-btn>
              </template>
            </v-text-field>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-8 mb-sm-0 text-center text-md-left">
          <h3 class="text-subtitle-1 font-weight-bold mb-6 text-uppercase tracking-wider text-pink-lighten-4">
            Explorar
          </h3>
          <div class="d-flex flex-column gap-3">
            <a
              v-for="link in footerLinks"
              :key="link.title"
              href="#"
              class="footer-link text-decoration-none text-brown-lighten-4 d-flex align-center justify-center justify-md-start"
            >
              <v-icon size="small" class="mr-3 link-icon" color="pink-accent-2">{{ link.icon }}</v-icon>
              {{ link.title }}
            </a>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="text-center text-md-left">
          <h3 class="text-subtitle-1 font-weight-bold mb-6 text-uppercase tracking-wider text-pink-lighten-4">
            Punto Dulce
          </h3>
          
          <div class="contact-info mb-8">
            <div class="d-flex align-center mb-4 text-brown-lighten-4 justify-center justify-md-start">
              <v-avatar color="brown-darken-3" size="36" class="mr-3">
                <v-icon size="small" color="pink-accent-2">mdi-map-marker</v-icon>
              </v-avatar>
              <span class="text-body-2">Cartagena, Colombia</span>
            </div>
            
            <div class="d-flex align-center mb-4 text-brown-lighten-4 justify-center justify-md-start">
              <v-avatar color="brown-darken-3" size="36" class="mr-3">
                <v-icon size="small" color="pink-accent-2">mdi-whatsapp</v-icon>
              </v-avatar>
              <span class="text-body-2">+57 300 123 4567</span>
            </div>

            <div class="d-flex align-center text-brown-lighten-4 justify-center justify-md-start">
              <v-avatar color="brown-darken-3" size="36" class="mr-3">
                <v-icon size="small" color="pink-accent-2">mdi-instagram</v-icon>
              </v-avatar>
              <span class="text-body-2">@cupcakemania_ctg</span>
            </div>
          </div>

          <div class="d-flex gap-3 justify-center justify-md-start">
            <v-btn
              v-for="social in socialLinks"
              :key="social.icon"
              :color="socialHover === social.name ? social.color : 'brown-darken-3'"
              icon
              size="large"
              class="social-btn elevation-2"
              @mouseenter="socialHover = social.name"
              @mouseleave="socialHover = null"
            >
              <v-icon :color="socialHover === social.name ? 'white' : 'pink-lighten-4'">
                {{ social.icon }}
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-10 border-opacity-25" color="pink-lighten-4"></v-divider>

      <v-row align="center">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <p class="text-caption text-brown-lighten-3 mb-0">
            &copy; {{ currentYear }} <strong class="text-pink-lighten-4">Cupcake Mania</strong>. 
            Hecho con azúcar, flores y muchos colores.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right mt-4 mt-md-0">
           <div class="d-flex justify-center justify-md-end gap-4 opacity-60">
             <v-icon title="Pagos Seguros" color="pink-lighten-4">mdi-shield-check</v-icon>
             <v-icon title="Envíos Garantizados" color="pink-lighten-4">mdi-moped</v-icon>
             <v-icon title="Calidad Artesanal" color="pink-lighten-4">mdi-certificate</v-icon>
           </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.bg-brown-darken-4 { background-color: #2D1B18 !important; } /* Marrón chocolate muy oscuro */
.text-brown-lighten-4 { color: #D7CCC8 !important; }
.text-brown-lighten-3 { color: #A1887F !important; }

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }

.brand-text {
  letter-spacing: -0.5px;
}

/* Estilo de los enlaces */
.footer-link {
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #F06292 !important; /* Rosa suave al hover */
  transform: translateX(8px);
}

.link-icon {
  transition: transform 0.3s ease;
}

.footer-link:hover .link-icon {
  transform: scale(1.2);
}

/* Botones sociales */
.social-btn {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.social-btn:hover {
  transform: translateY(-5px) rotate(8deg);
}

/* Ajustes del input */
.newsletter-input :deep(.v-field__input) {
  color: white !important;
  font-size: 0.85rem;
}

.newsletter-input :deep(.v-field__outline) {
  display: none;
}

@media (max-width: 600px) {
  .footer-link {
    font-size: 1rem;
    padding: 5px 0;
  }
}
</style>