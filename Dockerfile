FROM node:20.11.1-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json .
RUN npm install

FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm run build
COPY . .
CMD ["npm", "start"]
