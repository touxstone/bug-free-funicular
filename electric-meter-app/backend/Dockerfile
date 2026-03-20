FROM node:18-alpine

WORKDIR /app

# Instalar dependencias necesarias para pg (opcional)
RUN apk add --no-cache postgresql-client

COPY package*.json ./
# RUN npm ci --only=production
RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]