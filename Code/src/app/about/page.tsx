
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RedundantAboutPageRedirect() {
  useEffect(() => {
    redirect('/#about-section');
  }, []);
  return null;
}
