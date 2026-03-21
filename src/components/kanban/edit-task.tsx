
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useFirestore, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, Send, Sparkles } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { TimeAgo } from '../ui/time-ago';
import { Separator } from '../ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { handleTagSuggestion } from '@/app/actions';

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  status: z.enum(['todo', 'in-progress', 'done', 'archived']),
  priority: z.enum(['Low', 'Medium', 'High']),
  tags: z.string().optional(),
});

type TaskSchema = z.infer<typeof taskSchema>;

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
  comments?: Comment[];
  createdAt: string;
}

interface EditTaskProps {
  task: Task;
  onTaskUpdated: () => void;
}

export function EditTask({ task, onTaskUpdated }: EditTaskProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      status: task.status,
      priority: task.priority,
      tags: task.tags?.join(', ') || '',
    },
  });

  const titleValue = form.watch('title');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (titleValue && titleValue.length >= 10 && titleValue !== task.title) {
      setIsSuggesting(true);
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const suggestedTags = await handleTagSuggestion(titleValue);
          if (suggestedTags.length > 0) {
            form.setValue('tags', suggestedTags.join(', '));
          }
        } catch (error) {
          console.error("Failed to fetch tag suggestions:", error);
        } finally {
          setIsSuggesting(false);
        }
      }, 1000); // 1-second debounce
    } else {
        setIsSuggesting(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [titleValue, form, task.title]);

  const handleDataSubmit = (data: TaskSchema) => {
    if (!firestore) return;

    setIsSubmitting(true);
    const taskRef = doc(firestore, 'tasks', task.id);
    
    const taskData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };

    updateDoc(taskRef, taskData)
      .then(() => {
        toast({
          title: 'Success!',
          description: 'Task updated successfully.',
        });
        onTaskUpdated();
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        
        const permissionError = new FirestorePermissionError({
          path: taskRef.path,
          operation: 'update',
          requestResourceData: taskData,
        });

        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim() || !firestore || !user) return;

      const commentData = {
          text: newComment.trim(),
          author: user.email || 'Anonymous',
          createdAt: new Date().toISOString(),
      };

      const taskRef = doc(firestore, 'tasks', task.id);

      try {
        await updateDoc(taskRef, {
            comments: arrayUnion(commentData)
        });
        setNewComment("");
      } catch (error) {
         console.error("Error adding comment:", error);
         const permissionError = new FirestorePermissionError({
            path: taskRef.path,
            operation: 'update',
            requestResourceData: { comments: arrayUnion(commentData) }
         });
         errorEmitter.emit('permission-error', permissionError);
      }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleDataSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To-Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                     <div className="flex items-center gap-2">
                        <span>Tags (optional)</span>
                        {isSuggesting && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
                    </div>
                  </FormLabel>
                   <FormControl>
                    <Input placeholder="e.g., Design, Web, Urgent" {...field} />
                   </FormControl>
                  <p className="text-xs text-muted-foreground">Separate multiple tags with commas.</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
        </form>
      </Form>
      
      <div className="space-y-4 flex flex-col">
          <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5"/> Comments</h3>
          <Separator />
          <ScrollArea className="flex-grow h-48 pr-4">
              <div className="space-y-4">
                  {task.comments && task.comments.length > 0 ? (
                      [...task.comments].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((comment, index) => (
                          <div key={index} className="text-sm">
                              <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                                  <span className="font-semibold">{comment.author}</span>
                                  <TimeAgo dateString={comment.createdAt} />
                              </div>
                              <p className="p-2 bg-muted rounded-md">{comment.text}</p>
                          </div>
                      ))
                  ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No comments yet.</p>
                  )}
              </div>
          </ScrollArea>
          <form onSubmit={handleCommentSubmit} className="flex gap-2 items-start">
              <Textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[60px]"
              />
              <Button type="submit" size="icon" disabled={!newComment.trim()}>
                  <Send className="h-4 w-4"/>
                  <span className="sr-only">Add comment</span>
              </Button>
          </form>
      </div>
    </div>
  );
}

    