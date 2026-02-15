import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        rooms: resolve(__dirname, 'rooms.html'),
        bookings: resolve(__dirname, 'bookings.html'),
        bookingForm: resolve(__dirname, 'booking-form.html'),
        admin: resolve(__dirname, 'admin-approval.html'),
      },
    },
  },
})