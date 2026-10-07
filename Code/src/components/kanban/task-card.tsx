
'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, MoreHorizontal, MessageSquare } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { handleDeleteTask } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface Comment {
  text: string;
  author: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'archived';
  priority: 'Low' | 'Medium' | 'High';
  tags?: string[];
  assignee?: string;
  comments?: Comment[];
  createdAt: string;
}

interface KanbanTaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onClick?: () => void;
}

const tagColorClasses = [
  "border-transparent bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  "border-transparent bg-violet-500/10 text-violet-500 hover:bg-violet-500/20",
  "border-transparent bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
];

const getTagColor = (tag: string) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % tagColorClasses.length);
  return tagColorClasses[index];
};


export function KanbanTaskCard({ task, isOverlay, onClick }: KanbanTaskCardProps) {
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id, data: { type: 'Task', task }, disabled: task.status === 'archived' });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const getVariant = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            default: return 'outline';
        }
    }

    const onTaskDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click from firing
        setIsPending(true);
        const formData = new FormData();
        formData.append('id', task.id);

        const result = await handleDeleteTask(formData);

        if (result.status === 'success') {
            toast({
                title: 'Success!',
                description: result.message,
            });
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
        setIsPending(false);
        setIsDeleteAlertOpen(false);
    }
    
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="group bg-card p-4 rounded-lg border-2 border-primary"
            >
              <div className='flex justify-between items-start'>
                <p className="font-semibold text-sm pr-2 opacity-50">{task.title}</p>
              </div>
            </div>
        )
    }

    return (
        <>
            <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
                <Card className={cn(
                    "group bg-card hover:bg-card/90 transition-all duration-200", 
                    isOverlay && "ring-2 ring-primary",
                    task.status === 'archived' ? "opacity-60 hover:opacity-90 bg-muted/50 cursor-default" : "cursor-grab"
                )}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <p className={cn(
                                "font-semibold text-sm pr-2",
                                task.status === 'archived' && "line-through"
                            )}>{task.title}</p>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button onClick={stopPropagation} className="text-muted-foreground hover:text-foreground opacity-50 group-hover:opacity-100 cursor-pointer">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" onClick={stopPropagation}>
                                    <DropdownMenuItem 
                                        className="text-destructive focus:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteAlertOpen(true)
                                        }}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {task.tags.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className={cn("text-xs", getTagColor(tag))}>{tag}</Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <Badge variant={getVariant(task.priority)}>{task.priority}</Badge>
                          {task.comments && task.comments.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{task.comments.length}</span>
                            </div>
                          )}
                        </div>
                        {task.assignee && (
                            <Avatar className="h-6 w-6">
                                <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                    </CardFooter>
                </Card>
            </div>

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the task titled:
                             <span className="font-bold"> "{task.title}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={stopPropagation}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onTaskDelete} disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
