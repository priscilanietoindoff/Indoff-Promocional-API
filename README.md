# Indoff Promocional – API

API en **NestJS** con **Prisma** y PostgreSQL. Expone endpoints para catálogo y health-check. Lista para correr localmente y desplegar en **cPanel** (Node.js Selector + Git™ Version Control).

## Requisitos

- Node.js 20.x (usa `.nvmrc`)
- npm 10+
- PostgreSQL 14+ (o la instancia de tu hosting)
- Prisma CLI (`npx prisma …` usa la local)

## Scripts

```bash
npm i            # instalar dependencias
npm run start:dev# Nest en modo watch
npm run build    # compila a dist/
npm run start:prod # node dist/main.js
npm run prisma:generate # genera el client
npm run prisma:migrate  # aplica migraciones
npm run prisma:studio   # UI local
