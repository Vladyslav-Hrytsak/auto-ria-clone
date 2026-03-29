FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

ENV HUSKY=0
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]