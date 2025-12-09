FROM node:22-slim

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

ENTRYPOINT ["node", "app.js"]
