/*
  Warnings:

  - You are about to drop the column `ip` on the `Server` table. All the data in the column will be lost.
  - You are about to drop the column `local` on the `Server` table. All the data in the column will be lost.
  - You are about to drop the column `managed` on the `Server` table. All the data in the column will be lost.
  - Added the required column `containerId` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `port` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Server" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "containerId" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "rconPort" INTEGER NOT NULL,
    "rconPassword" TEXT NOT NULL
);
INSERT INTO "new_Server" ("id", "rconPassword", "rconPort") SELECT "id", "rconPassword", "rconPort" FROM "Server";
DROP TABLE "Server";
ALTER TABLE "new_Server" RENAME TO "Server";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
