'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { serviceIcons } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface ServiceFormProps {
  onFormSuccess: () => void;
}

export function ServiceForm({ onFormSuccess }: ServiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;

    const serviceData = { title, description, icon };
    const colRef = collection(firestore, 'services');

    startTransition(async () => {
      addDoc(colRef, serviceData)
        .then(() => {
          toast({
            title: 'Success!',
            description: 'Service added successfully!',
          });
          onFormSuccess();
        })
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: colRef.path,
            operation: 'create',
            requestResourceData: serviceData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    });
  };

  return (
    <form onSubmit={handleAdd} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Service Title</Label>
        <Input id="title" name="title" required placeholder="e.g., Web Development" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Describe what this service offers..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Select name="icon" required>
          <SelectTrigger>
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(serviceIcons).map(([key, Icon]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{key}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Service'
        )}
      </Button>
    </form>
  );
}