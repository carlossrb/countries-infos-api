FROM node:18-alpine As dev

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

USER node

# PRODUCTION

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --production=true && yarn cache clean

USER node


FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/.env ./.env

RUN ls -lah

CMD [ "node", "dist/src/main" ]
