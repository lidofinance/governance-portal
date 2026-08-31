# production dependencies
FROM node:24-alpine AS production-deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile --non-interactive --ignore-scripts && yarn cache clean

# build env
FROM node:24-alpine AS build

WORKDIR /app

# apk pins are major-only on purpose (curl below too): Alpine repos keep only the latest
# build of a package, so an exact pin (git=2.x.y-rN) breaks the build on every upstream
# patch release; the accepted drift is patch/minor updates within the same major
RUN apk add --no-cache git=~2
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts && yarn cache clean
COPY . .
RUN NODE_NO_BUILD_DYNAMICS=true yarn build
# webpack build cache is useless at runtime and k8s mounts an emptyDir over this path anyway
# public/runtime is used to inject runtime vars; it should exist and user node should have write access there for it
RUN rm -rf /app/.next/cache \
  && rm -rf /app/public/runtime \
  && mkdir /app/public/runtime \
  && chown node /app/public/runtime

# final image
FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache curl=~8 
    
# no chown: COPY --from keeps the stage ownership, where public/runtime is already node's
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build \
  /app/package.json \
  /app/server.mjs \
  /app/next.config.mjs \
  /app/next-logger.config.cjs \
  /app/env-dynamics.mjs \
  /app/build-info.json \
  ./
COPY --from=build /app/config/csp/policy.mjs ./config/csp/policy.mjs
COPY --from=build \
  /app/scripts/build-dynamics.mjs \
  /app/scripts/log-environment-variables.mjs \
  /app/scripts/generate-build-id.mjs \
  ./scripts/
COPY --from=build /app/scripts/startup-checks/rpc.mjs ./scripts/startup-checks/rpc.mjs
# the app runs through yarn, so npm is unused here — and the tar it bundles carries CVEs
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["sh", "-c", "source /vault/secrets/app && exec yarn start"]
