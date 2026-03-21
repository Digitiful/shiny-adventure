
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc } from 'firebase/firestore';
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { handleTagSuggestion } from '@/app/actions';


const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  status: z.enum(['todo', 'in-progress', 'done', 'archived']),
  priority: z.enum(['Low', 'Medium', 'High']),
  tags: z.string().optional(),
});

type TaskSchema = z.infer<typeof taskSchema>;

interface AddTaskProps {
  onTaskAdded: () => void;
  initialStatus: 'todo' | 'in-progress' | 'done' | 'archived';
  initialTitle?: string;
}

export function AddTask({ onTaskAdded, initialStatus, initialTitle }: AddTaskProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const form = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialTitle || '',
      status: initialStatus,
      priority: 'Medium',
      tags: '',
    },
  });

  const titleValue = form.watch('title');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (titleValue && titleValue.length >= 10) {
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
  }, [titleValue, form]);


  const onSubmit = (data: TaskSchema) => {
    if (!firestore) return;

    setIsSubmitting(true);
    const tasksCollection = collection(firestore, 'tasks');
    
    const taskData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      createdAt: new Date().toISOString(),
    };

    addDoc(tasksCollection, taskData)
      .then(() => {
        toast({
          title: 'Success!',
          description: 'Task added successfully.',
        });
        form.reset();
        onTaskAdded();
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        
        const permissionError = new FirestorePermissionError({
          path: tasksCollection.path,
          operation: 'create',
          requestResourceData: taskData,
        });

        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Integrate chatbot into the new homepage" {...field} />
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
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
                <Input placeholder="e.g., UI, Backend, API" {...field} />
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
              Saving Task...
            </>
          ) : (
            'Save Task'
          )}
        </Button>
      </form>
    </Form>
  );
}
