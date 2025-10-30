FROM oven/bun:latest AS build
WORKDIR /app
COPY . .
RUN bun install && bun run build

FROM oven/bun:latest
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["bun", "run", "./build"]