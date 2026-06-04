
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

/**
 * @fileOverview Contact Node Decommissioned.
 * Identity: Redirect to Terminal Intake to prevent build interference.
 */
export default function ContactPageRedirect() {
  useEffect(() => {
    redirect('/#terminal');
  }, []);
  return null;
}
