
'use client';

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KanbanTaskCard } from "@/components/kanban/task-card";
import { Plus, type LucideIcon } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

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

interface KanbanColumnProps {
  title: string;
  status: 'todo' | 'in-progress' | 'done' | 'archived';
  tasks: Task[];
  isLoading: boolean;
  onAddTaskClick: () => void;
  onTaskClick: (task: Task) => void;
  icon?: LucideIcon;
  hideTitle?: boolean;
  isArchivedColumn?: boolean;
}

export const KanbanColumn = ({ title, status, tasks, isLoading, onAddTaskClick, onTaskClick, icon: Icon, hideTitle = false, isArchivedColumn = false }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id: status, data: { type: 'Column', status } });
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div 
      ref={setNodeRef} 
      className={cn(
        "bg-background/70 rounded-lg p-4 border md:bg-transparent md:border-none md:p-0",
        isArchivedColumn && "opacity-60"
      )}
    >
      {!hideTitle && (
        <h3 className="font-semibold mb-4 text-center text-primary flex items-center justify-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title} ({tasks?.length || 0})
        </h3>
      )}
      <div className="space-y-4 min-h-[100px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {isLoading && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          {!isLoading && tasks?.map((task) => (
            <KanbanTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
        {!isArchivedColumn && (
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground h-12 border-2 border-dashed hover:border-primary/50"
            onClick={onAddTaskClick}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        )}
      </div>
    </div>
  )
};
