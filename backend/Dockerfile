# backend/Dockerfile

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ADICIONE ESTA LINHA: Compila o TypeScript para JavaScript
RUN npm run build

# O comando para iniciar o servidor, usando o arquivo JS compilado
CMD ["npm", "start"]