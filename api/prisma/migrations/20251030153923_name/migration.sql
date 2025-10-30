/*
  Warnings:

  - Added the required column `name` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Server" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "containerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "rconPort" INTEGER NOT NULL,
    "rconPassword" TEXT NOT NULL
);
INSERT INTO "new_Server" ("containerId", "id", "port", "rconPassword", "rconPort") SELECT "containerId", "id", "port", "rconPassword", "rconPort" FROM "Server";
DROP TABLE "Server";
ALTER TABLE "new_Server" RENAME TO "Server";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
