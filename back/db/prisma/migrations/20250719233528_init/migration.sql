-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "Recipe" TEXT NOT NULL,
    "notes" TEXT,
    "season" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "robot" BOOLEAN NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecipeContext" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "context" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    CONSTRAINT "RecipeContext_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_IngredientsToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_IngredientsToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Ingredients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IngredientsToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Recipe_type_name_season_id_idx" ON "Recipe"("type", "name", "season", "id");

-- CreateIndex
CREATE INDEX "Ingredients_name_id_idx" ON "Ingredients"("name", "id");

-- CreateIndex
CREATE UNIQUE INDEX "_IngredientsToRecipe_AB_unique" ON "_IngredientsToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_IngredientsToRecipe_B_index" ON "_IngredientsToRecipe"("B");
