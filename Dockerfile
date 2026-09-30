FROM node:24-bookworm-slim AS dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=proxy_ca,required=false \
    if [ -f /run/secrets/proxy_ca ]; then \
      NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca npm ci --strict-ssl=true; \
    else \
      npm ci --strict-ssl=true; \
    fi

FROM dependencies AS build

COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS production-dependencies

WORKDIR /app
COPY --from=build /app/build/package.json /app/build/package-lock.json ./
RUN --mount=type=secret,id=proxy_ca,required=false \
    if [ -f /run/secrets/proxy_ca ]; then \
      NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca npm ci --omit=dev --strict-ssl=true; \
    else \
      npm ci --omit=dev --strict-ssl=true; \
    fi

FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node:node --from=production-dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/build ./
COPY --chown=node:node docker/entrypoint.sh ./docker-entrypoint.sh

USER node
EXPOSE 3333

ENTRYPOINT ["./docker-entrypoint.sh"]
