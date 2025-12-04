FROM node:20-alpine

# pracovný adresár v kontajneri
WORKDIR /app

# najprv package.json, aby sa cache-ol npm install
COPY package*.json ./

# nainštalujeme dependencie
RUN npm install

# skopírujeme zvyšok projektu
COPY . .

# Vite štandardne používa port 5173
EXPOSE 5173

# spustíme dev server, aby bol dostupný zvonku
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
