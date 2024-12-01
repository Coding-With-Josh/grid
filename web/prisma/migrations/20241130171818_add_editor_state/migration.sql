-- CreateTable
CREATE TABLE "EditorState" (
    "id" TEXT NOT NULL,
    "elements" JSONB NOT NULL,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditorState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EditorState_projectId_key" ON "EditorState"("projectId");

-- AddForeignKey
ALTER TABLE "EditorState" ADD CONSTRAINT "EditorState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
