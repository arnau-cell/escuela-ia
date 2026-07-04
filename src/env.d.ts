/// <reference types="@cloudflare/workers-types/experimental" />

// Bindings reales del Worker (wrangler.toml): el KV de límite de uso y el secret de Anthropic.
// @cloudflare/workers-types ya declara `cloudflare:workers` con `env: Cloudflare.Env`; el patrón
// documentado por el propio paquete es ampliar ese namespace aquí (TypeScript fusiona todas las
// declaraciones). No hay `wrangler types` disponible en este entorno (wrangler sin autenticar)
// para generarlo automáticamente — mantener esto sincronizado con wrangler.toml a mano.
declare namespace Cloudflare {
	interface Env {
		RATE_LIMIT: KVNamespace;
		ANTHROPIC_API_KEY: string;
	}
}
