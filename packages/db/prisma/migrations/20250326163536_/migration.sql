/*
  Warnings:

  - Changed the type of `status` on the `WebsiteTicks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WebsiteTicksStatus" AS ENUM ('UP', 'DOWN');

-- AlterTable
ALTER TABLE "WebsiteTicks" DROP COLUMN "status",
ADD COLUMN     "status" "WebsiteTicksStatus" NOT NULL;

-- DropEnum
DROP TYPE "WebsitetTcksStatus";
