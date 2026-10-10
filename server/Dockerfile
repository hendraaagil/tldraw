FROM oven/bun:1-alpine
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY server ./server
ENV PORT=5858
ENV DATA_DIR=/data
EXPOSE 5858
VOLUME /data
CMD ["bun", "run", "server/index.ts"]
