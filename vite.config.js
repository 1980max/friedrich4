import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Lade Umgebungsvariablen aus .env
dotenv.config();

export default defineConfig({
  // Stelle sicher, dass Umgebungsvariablen korrekt geladen werden
  define: {
    // Stelle Umgebungsvariablen für den Client bereit
    'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(process.env.VITE_OPENAI_API_KEY)
  }
});
