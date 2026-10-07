
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, FolderKanban, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
}

const getVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'high': return 'destructive';
        case 'medium': return 'secondary';
        default: return 'outline';
    }
}

const TaskItem = ({ task }: { task: Task }) => (
    <div className="group flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all">
        <div className="flex items-center gap-3">
            <div className={`h-1.5 w-1.5 rounded-full ${task.priority === 'High' ? 'bg-destructive animate-pulse' : 'bg-primary/40'}`}></div>
            <p className="font-medium text-xs truncate max-w-[200px] uppercase tracking-tight">{task.title}</p>
        </div>
        <Badge variant={getVariant(task.priority)} className="text-[8px] h-4 px-1.5 uppercase font-bold">
            {task.priority}
        </Badge>
    </div>
);

export function TodoTasksWidget() {
  const firestore = useFirestore();

  const tasksQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'tasks'),
            where('status', '==', 'todo'),
            orderBy('priority', 'desc'),
            limit(3)
          )
        : null,
    [firestore]
  );

  const { data: tasks, isLoading } = useCollection<Task>(tasksQuery);

  return (
    <Card className="bg-card/20 border-primary/10 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div className='flex items-center gap-2'>
            <AlertCircle className="h-4 w-4 text-primary" />
            <CardTitle className="text-[10px] font-code uppercase tracking-[0.2em] text-muted-foreground">High Priority Backlog</CardTitle>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-[9px] uppercase font-bold hover:bg-primary/10">
            <Link href="/dashboard#kanban">
                View Mission Board
                <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-3 w-3/4 bg-muted/20" />
                <Skeleton className="h-3 w-1/4 bg-muted/20" />
              </div>
            ))}
          {!isLoading && tasks?.length === 0 && (
            <p className="text-[10px] text-muted-foreground font-code italic text-center py-4">
              " SYSTEM STATUS: CLEAR. NO PENDING ANOMALIES. "
            </p>
          )}
          {!isLoading &&
            tasks?.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
