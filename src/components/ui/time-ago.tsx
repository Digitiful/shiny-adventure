
'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface TimeAgoProps {
  dateString: string;
}

export function TimeAgo({ dateString }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // This effect runs only on the client, after hydration.
    // This prevents the server-rendered value from mismatching the client value.
    setTimeAgo(formatDistanceToNow(new Date(dateString), { addSuffix: true }));
  }, [dateString]);

  // Render a placeholder or nothing on the server and initial client render
  if (!timeAgo) {
    return null;
  }

  return <span>{timeAgo}</span>;
}
