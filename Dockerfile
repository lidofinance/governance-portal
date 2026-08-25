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
# the build is done, so drop devDependencies: server.mjs needs only next and next-logger at runtime,
# while the build tooling left in node_modules is what image scanners report vulnerabilities for
RUN yarn install --production --frozen-lockfile --non-interactive --ignore-scripts && yarn cache clean
# webpack build cache is useless at runtime and k8s mounts an emptyDir over this path anyway
RUN rm -rf /app/.next/cache
# public/runtime is used to inject runtime vars; it should exist and user node should have write access there for it
RUN rm -rf /app/public/runtime && mkdir /app/public/runtime && chown node /app/public/runtime

# final image
FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache curl=~8 
    
# no chown: COPY --from keeps the build stage ownership, where public/runtime is already node's
COPY --from=build /app /app
# the app runs through yarn, so npm is unused here — and the tar it bundles carries CVEs
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

USER node
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["sh", "-c", "source /vault/secrets/app && exec yarn start"]
