FROM node:16.17-alpine

WORKDIR /var/www

COPY package*.json ./

RUN npm cache clean --force \
  && npm install -g node-gyp \
  && npm install --unsafe-perm=true

COPY . .

CMD ["sh", "-c", "npm run migration:run && npm run build && npm run start:prod"]
#CMD ["sh", "-c", "npm start"]
