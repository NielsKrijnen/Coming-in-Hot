-- CreateTable
CREATE TABLE "Server" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "local" BOOLEAN NOT NULL,
    "managed" BOOLEAN NOT NULL,
    "ip" TEXT NOT NULL,
    "rconPort" INTEGER NOT NULL,
    "rconPassword" TEXT NOT NULL
);
