import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Use global `test` and `expect`
    environment: 'jsdom', // Simulate browser environment
    setupFiles: './src/test/setup.js', // Add any setup files (optional)
  },
});
