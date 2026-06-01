-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SlotEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slotId" TEXT NOT NULL,
    "recipeId" TEXT,
    "recipeName" TEXT NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SlotEntry_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "MealSlot" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SlotEntry_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SlotEntry" ("id", "order", "recipeId", "recipeName", "slotId") SELECT "id", "order", "recipeId", "recipeName", "slotId" FROM "SlotEntry";
DROP TABLE "SlotEntry";
ALTER TABLE "new_SlotEntry" RENAME TO "SlotEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
