'use client';

import { AlertProvider as Alerts } from '@/components/ui/Alerts';

export default function AlertProvider({ children }: { children: React.ReactNode }) {
  return <Alerts>{children}</Alerts>;
}
