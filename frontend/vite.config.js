import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({

  plugins: [
    react(),

    VitePWA({

      registerType: 'autoUpdate',

      includeAssets: [
        'icon-192.png',
        'icon-512.png'
      ],

      manifest: {

        name: 'Dream Book Shop Analytics',

        short_name: 'Dream Analytics',

        description:
          'Interactive bibliographic data analysis system for Dream Book Shop.',

        theme_color: '#0b172a',

        background_color: '#f6f8fb',

        display: 'standalone',

        start_url: '/',

        icons: [

          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },

          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }

        ]
      },


      devOptions: {
        enabled: true
      }

    })
  ],


  // Production build settings
  build: {

    outDir: 'dist',

    sourcemap: false

  },


  // Local development
  server: {

    port: 5173,

    host: true,


    proxy: {

      '/api': {

        // Local Django backend during development
        target: 'http://127.0.0.1:8000',

        changeOrigin: true,

        secure: false

      }

    }

  }

})