# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Ejecutar servidor de desarrollo con hot reload
CMD ["npm", "run", "dev", "--", "--host"]
