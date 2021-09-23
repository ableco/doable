/*
  Warnings:

  - Added the required column `value` to the `Priority` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Priority" ADD COLUMN     "value" TEXT NOT NULL;
