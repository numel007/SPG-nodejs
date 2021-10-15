FROM node:alpine

WORKDIR /app

COPY . /app
RUN npm install

CMD node server.js
EXPOSE 3000