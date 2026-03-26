FROM node:22

WORKDIR /app

COPY package*.json ./

ENV HUSKY=0

RUN npx tsc
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]