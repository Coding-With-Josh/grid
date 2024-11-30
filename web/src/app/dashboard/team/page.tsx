import { Suspense } from 'react';
import TeamContent from './team-content';

export default function TeamsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamContent />
    </Suspense>
  );
}