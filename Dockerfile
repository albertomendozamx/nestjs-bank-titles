FROM node:18 as install
LABEL stage=install
WORKDIR /src/install
COPY package.json .
COPY yarn.lock .
RUN yarn install

FROM node:18 as compile
LABEL stage=compile
WORKDIR /src/build
COPY --from=install /src/install .
COPY . .
RUN yarn build
RUN yarn install --production=true

FROM node:18-alpine as deploy
WORKDIR /app
COPY --from=compile /src/build/dist .
COPY --from=compile /src/build/node_modules node_modules
EXPOSE 3000
ENTRYPOINT node main.js