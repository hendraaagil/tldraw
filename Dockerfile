FROM oven/bun:1-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ARG VITE_TLDRAW_LICENSE_KEY
ARG VITE_SYNC_URI
ARG VITE_SYNC_ROOM
ENV VITE_TLDRAW_LICENSE_KEY=$VITE_TLDRAW_LICENSE_KEY
ENV VITE_SYNC_URI=$VITE_SYNC_URI
ENV VITE_SYNC_ROOM=$VITE_SYNC_ROOM
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
