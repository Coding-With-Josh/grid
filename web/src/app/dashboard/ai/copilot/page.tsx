import { Suspense } from 'react';
import CopilotContent from './copilot-content';

export default function CopilotPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CopilotContent />
    </Suspense>
  );
}