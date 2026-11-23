FROM oven/bun:1.3.0-alpine AS development
WORKDIR /app
RUN chown bun:bun /app
COPY --chown=bun:bun package.json bun.lock ./
USER bun
RUN bun install --frozen-lockfile
COPY --chown=bun:bun . .
EXPOSE 5173
CMD ["bun", "run", "dev"]
