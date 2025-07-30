/*
  Warnings:

  - You are about to drop the `_IngredientsToRecipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `Recipe` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `context` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredients` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipe` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_IngredientsToRecipe_B_index";

-- DropIndex
DROP INDEX "_IngredientsToRecipe_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_IngredientsToRecipe";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "context" TEXT NOT NULL,
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
INSERT INTO "new_Recipe" ("createdAt", "id", "name", "notes", "robot", "season", "type", "updatedAt") SELECT "createdAt", "id", "name", "notes", "robot", "season", "type", "updatedAt" FROM "Recipe";
DROP TABLE "Recipe";
ALTER TABLE "new_Recipe" RENAME TO "Recipe";
CREATE INDEX "Recipe_type_name_season_id_idx" ON "Recipe"("type", "name", "season", "id");
CREATE TABLE "new_RecipeContext" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "context" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL
);
INSERT INTO "new_RecipeContext" ("context", "id", "recipeId") SELECT "context", "id", "recipeId" FROM "RecipeContext";
DROP TABLE "RecipeContext";
ALTER TABLE "new_RecipeContext" RENAME TO "RecipeContext";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
