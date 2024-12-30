# Użycie obrazu Node.js
FROM node:18
# Ustawienie katalogu roboczego w kontenerze
WORKDIR /app
# Skopiowanie plików frontendu
COPY . .
# Instalacja zależności frontendu
RUN npm install
# Budowanie frontendu
RUN npm run build
# Instalacja serwera statycznego do obsługi plików frontendu
RUN npm install -g serve
# Uruchomienie aplikacji na porcie 3000
CMD ["serve", "-s", "build", "-l", "3000"]
