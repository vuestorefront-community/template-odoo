FROM node:14-alpine3.17

WORKDIR /app

COPY . /app

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

COPY . .

ENV NODE_ENV=production

RUN yarn build

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000


CMD [ "npm", "start" ]