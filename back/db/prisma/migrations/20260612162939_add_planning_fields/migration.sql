/*
  Warnings:

  - You are about to drop the column `isCustom` on the `SlotEntry` table. All the data in the column will be lost.
  - Made the column `recipeId` on table `SlotEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "RecipeRelation" (
    "recipeId" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,

    PRIMARY KEY ("recipeId", "relatedId"),
    CONSTRAINT "RecipeRelation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RecipeRelation_relatedId_fkey" FOREIGN KEY ("relatedId") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "frequency" INTEGER,
    "prepTime" INTEGER,
    "isComponent" BOOLEAN NOT NULL DEFAULT false,
    "requiresPrevDay" BOOLEAN NOT NULL DEFAULT false,
    "mainIngredient" TEXT
);
INSERT INTO "new_Recipe" ("calorias", "carbohidratos", "createdAt", "frequency", "grasas", "id", "ingredients", "name", "notes", "proteinas", "recipe", "robot", "season", "type", "updatedAt") SELECT "calorias", "carbohidratos", "createdAt", "frequency", "grasas", "id", "ingredients", "name", "notes", "proteinas", "recipe", "robot", "season", "type", "updatedAt" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");
CREATE INDEX "Recipe_type_name_season_id_idx" ON "Recipe"("type", "name", "season", "id");
CREATE TABLE "new_SlotEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slotId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "recipeName" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SlotEntry_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MealSlot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SlotEntry_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SlotEntry" ("id", "order", "recipeId", "recipeName", "slotId") SELECT "id", "order", "recipeId", "recipeName", "slotId" FROM "SlotEntry";
DROP TABLE "SlotEntry";
ALTER TABLE "new_SlotEntry" RENAME TO "SlotEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
