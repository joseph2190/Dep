import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This exposes the API_KEY from Netlify environment to the browser code
      // Safe fallback to empty string prevents crash if key is missing during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
  };
});