# Investigación 02 · Competidores y fuentes de contenido (jun 2026)

## Competidores y qué les falta

| Plataforma | Qué hace bien | Qué le falta / modelo |
|---|---|---|
| **Futurepedia** | Directorio enorme (2.700+ tools), cursos | Sin sector, sin "cero", educación de pago, no bilingüe |
| **Future Tools** | 4.000+ tools curados, newsletter | Directorio puro, sin pedagogía ni sectores |
| **Hugging Face Learn** | 12 cursos gratis con certificado, neutral | Muy técnico, requiere Python, no generalista |
| **DAIR.AI** | Prompt eng., RAG, agentes (gratis) | Para devs, sin directorio ni generalista |
| **Ben's Bites** | Newsletter diaria accesible + comunidad | Solo news, sin estructura "cero→avanzado" |
| **TLDR AI** | News técnicas diarias, 1.1M subs | Solo news, no educación, no bilingüe |
| **AI for Everyone (Ng)** | No técnico, gran credibilidad | De pago, sin ecosistema/comunidad |
| **DataCamp/Coursera** | Cursos estructurados | Freemium/embudo, para profesionales |

## Huecos reales (la oportunidad)

Nadie cubre bien la combinación: **neutral (no embudo) + bilingüe ES/EN + de cero a avanzado en un sitio + por sector + con "cómo montártelo tú mismo" (open source al lado de lo de pago) + noticias con contexto sectorial.** El mercado hispanohablante está especialmente desatendido. El diferenciador NO es el listado, es la **pedagogía + la ruta personalizada**.

## Fuentes de contenido baratas (mantenerlo actualizado)

RSS gratis de labs/agregadores → n8n (VPS) → resumen → commit:
- OpenAI `openai.com/news/rss.xml` · Google AI `research.google/blog/rss.xml` · Mistral · Meta AI
- Hugging Face `huggingface.co/blog/feed.xml` · MarkTechPost `marktechpost.com/feed/`
- arXiv `arxiv.org/rss/cs.AI` · Papers with Code · The Gradient · Last Week in AI
- Anthropic: sin RSS público (usar digest/email).

**Coste**: RSS €0; resumen extractivo €0; LLM barato solo en destacadas = céntimos/mes. Plantillas n8n RSS→resumen→destino ya existen.

## Herramientas de IA por sector (para inspirar la estructura)

- **Contabilidad/finanzas**: Ramp, Stampli, Sage Intacct.
- **Salud**: RapidClaims (coding), Experian Health, visión diagnóstica, triaje por chatbot.
- **Legal**: Spellbook, Litera Kira.
- **Agricultura/ganadería**: Monarch Tractor, John Deere autónomo, monitorización de cultivos/suelo.
- **Informática/dev**: Tabby, Codestral, DeepSeek Coder, Dify/Flowise/n8n.
- **Marketing**: Canva Magic Write, NotebookLM.

## Fuentes
- https://www.futurepedia.io/ · https://futuretools.io/ · https://huggingface.co/learn
- https://www.dair.ai/ · https://news.bensbites.com/ · https://tldr.tech/ai
- https://www.deeplearning.ai/courses/ai-for-everyone
- https://rss.feedspot.com/ai_rss_feeds/ · https://www.readless.app/blog/best-ai-news-rss-feeds-2026
- https://aimultiple.com/generative-ai-finance · https://www.jellyfishtechnologies.com/ai-use-cases-across-industries/
- https://www.opensourcealternatives.to/blog/open-source-ai-tools
