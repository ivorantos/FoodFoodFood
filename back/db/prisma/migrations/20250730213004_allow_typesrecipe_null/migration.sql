-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "ingredients" TEXT NOT NULL,
    "recipe" TEXT NOT NULL,
    "notes" TEXT,
    "season" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "robot" BOOLEAN NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "proteinas" REAL,
    "grasas" REAL,
    "carbohidratos" REAL,
    "calorias" INTEGER,
    "frequency" INTEGER
);
INSERT INTO "new_Recipe" ("calorias", "carbohidratos", "createdAt", "frequency", "grasas", "id", "ingredients", "name", "notes", "proteinas", "recipe", "robot", "season", "type", "updatedAt") SELECT "calorias", "carbohidratos", "createdAt", "frequency", "grasas", "id", "ingredients", "name", "notes", "proteinas", "recipe", "robot", "season", "type", "updatedAt" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE INDEX "Recipe_type_name_season_id_idx" ON "Recipe"("type", "name", "season", "id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
