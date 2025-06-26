import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

// Viewer
import 'viewerjs/dist/viewer.min.css';
import imageViewer from 'vitepress-plugin-image-viewer';
import vImageViewer from 'vitepress-plugin-image-viewer/lib/vImageViewer.vue';
import { useRoute } from 'vitepress';

// Custom components
import Banner from './components/Banner.vue'
import FediverseStatus from './components/FediverseStatus.vue'

import './styles/global.css'

export default {
  base: '/WebUkrainianStuff/',
  extends: DefaultTheme,
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('vImageViewer', vImageViewer);
    app.component('Banner', Banner);
    app.component('FediverseStatus', FediverseStatus);
  },

  setup() {
    // Get route
    const route = useRoute();
    // Using
    imageViewer(route);
}
} satisfies Theme