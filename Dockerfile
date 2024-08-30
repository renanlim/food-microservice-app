FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 5173

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "5173"]
