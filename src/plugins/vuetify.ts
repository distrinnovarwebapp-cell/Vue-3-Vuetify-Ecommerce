import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1B5E8C',
          secondary: '#10A37F',
          accent: '#FF6B6B',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          background: '#F8FAFC',
          surface: '#FFFFFF',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none;',
    },
  },
});
