FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src/ ./src/
RUN adduser -D appuser
USER appuser
EXPOSE 8080
CMD ["node", "src/index.js"]
