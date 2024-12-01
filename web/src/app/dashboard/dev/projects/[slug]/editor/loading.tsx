'use client';

export default function EditorLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <div className="space-y-2 text-center">
          <h3 className="font-medium">Loading Editor</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we load your project...
          </p>
        </div>
      </div>
    </div>
  );
}
