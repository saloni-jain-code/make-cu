import { Suspense } from 'react';
import QRLoginClient from './QRLoginClient';

export default function QRLoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-16">Loading login...</div>}>
      <QRLoginClient />
    </Suspense>
  );
}
