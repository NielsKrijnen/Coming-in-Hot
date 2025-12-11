FROM oven/bun:latest AS build
WORKDIR /app
COPY . .

RUN bun install

ENV DATABASE_URL="file:./temp.db"
RUN bunx prisma generate

RUN bun run build

FROM oven/bun:latest
WORKDIR /app

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run ./build"]