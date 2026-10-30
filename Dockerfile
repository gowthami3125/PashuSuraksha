# Multi-stage Dockerfile for PashuSuraksha
FROM node:20-alpine AS build

WORKDIR /app

# Copy root and build frontend
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS production

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy backend source and frontend dist
COPY backend/ ./backend/
COPY --from=build /app/dist ./dist

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "backend/server.js"]
