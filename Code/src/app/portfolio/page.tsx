
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RedundantPortfolioPageRedirect() {
  useEffect(() => {
    redirect('/#portfolio');
  }, []);
  return null;
}
