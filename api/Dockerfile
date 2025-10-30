FROM oven/bun:latest AS build
WORKDIR /app
COPY . .
RUN bun install --production
RUN export DATABASE_URL=file:./temp.db && bunx prisma generate
RUN bun run build

FROM oven/bun:latest
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY --from=build /app ./
EXPOSE 3000
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run ./dist"]