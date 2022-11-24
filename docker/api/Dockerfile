FROM node:16.17-alpine

WORKDIR /var/www

COPY package.json ./
COPY yarn.lock ./

RUN npm cache clean --force \
  && npm install -g yarn \
  && yarn

COPY . .

CMD ["sh", "-c", "yarn migrate && yarn prebuild && yarn build && yarn start:prod"]