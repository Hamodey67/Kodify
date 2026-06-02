import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './electron/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './amana-pos.db',
  },
});
