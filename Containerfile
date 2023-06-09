FROM node:18.16 as builder

WORKDIR /build

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

FROM node:18.16 as runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /build/dist/ ./dist/
COPY public/ ./public/
COPY prisma/ ./prisma/
COPY package.json package-lock.json ./

RUN npm ci

ENTRYPOINT [ "npm", "run", "start" ]