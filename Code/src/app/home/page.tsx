
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RedundantHomePageRedirect() {
  useEffect(() => {
    redirect('/');
  }, []);
  return null;
}
