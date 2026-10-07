
'use client';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function WarehousePartitionRedirect() {
  useEffect(() => {
    redirect('/admin');
  }, []);
  return null;
}
