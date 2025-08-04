FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN rm -f package-lock.json && rm -rf node_modules

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]