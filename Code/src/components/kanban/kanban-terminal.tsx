
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { assistCreateTask } from '@/ai/flows/kanban-assistant-flow';
import { AddTask } from './add-task';

type TaskStatus = 'todo' | 'in-progress' | 'done' | 'archived';

interface KanbanTerminalProps {
  onNewTask: (status: TaskStatus) => void;
}

export function KanbanTerminal({ onNewTask }: KanbanTerminalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [assistedTitle, setAssistedTitle] = useState('');


  const handleAssist = async () => {
    if (!userInput.trim()) return;
    setIsThinking(true);
    try {
      const result = await assistCreateTask({ userInput });
      // For now, we'll just use the title, but you could expand this
      // to pre-fill priority and tags in the AddTask component.
      setAssistedTitle(result.title);
      setIsAssistantOpen(false);
      setIsAddTaskOpen(true);
    } catch (error) {
      console.error("AI Task Assistant failed:", error);
      // Fallback to regular add task
      setAssistedTitle(userInput);
      setIsAssistantOpen(false);
      setIsAddTaskOpen(true);
    } finally {
      setIsThinking(false);
      setUserInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAssist();
    }
  };


  return (
    <>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" />
                AI-Powered Task Creation
              </DialogTitle>
              <DialogDescription>
                Describe the task in plain language, and our assistant will structure it for you.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder='e.g., "The login button is broken on mobile"'
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isThinking}
              />
              <Button onClick={handleAssist} disabled={!userInput.trim() || isThinking} className="w-full">
                {isThinking ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                    </>
                ) : "Create with AI"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Review the details for the new task. The AI has given its best suggestion.
            </DialogDescription>
          </DialogHeader>
          <AddTask
            onTaskAdded={() => setIsAddTaskOpen(false)}
            initialStatus="todo"
            initialTitle={assistedTitle}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

