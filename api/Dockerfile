FROM oven/bun:latest AS build
WORKDIR /app
COPY . .
RUN bun install --production
RUN bunx prisma generate
RUN bun run build

FROM oven/bun:latest
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl
COPY --from=build /app ./
EXPOSE 3000
CMD bunx prisma migrate deploy && bun run ./dist