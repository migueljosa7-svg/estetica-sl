/// <reference types="vite/client" />

// Variables de entorno tipadas (definidas en .env / .env.example).
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
  readonly VITE_ENABLE_DEMO_ADMIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
