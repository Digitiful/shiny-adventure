
'use client'

import { useState, useMemo, Suspense } from "react";
import { Header } from "@/components/layout/header";
import { LayoutGrid, Phone, Library, Archive, CaseUpper, FileVideo, Loader2, Activity as ActivityIcon, ShieldCheck, Zap } from "lucide-react";
import { DashboardKnowledgeCard } from "@/components/dashboard/knowledge-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTask } from "@/components/kanban/add-task";
import { EditTask } from "@/components/kanban/edit-task";
import { dashboardData } from "@/lib/data";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { KanbanTaskCard } from "@/components/kanban/task-card";
import { createPortal } from "react-dom";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { VideoCallCard } from "@/components/dashboard/video-call-card";
import { ProjectHub } from "@/components/dashboard/project-hub";
import React from 'react';
import { KanbanTerminal } from "@/components/kanban/kanban-terminal";
import { TodoTasksWidget } from "@/components/dashboard/todo-tasks-widget";

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

function DashboardPageContent() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [initialStatusForNewTask, setInitialStatusForNewTask] = useState<Task['status']>('todo');
  
  const tasksQuery = useMemoFirebase(
    () => (firestore && user) ? query(collection(firestore, 'tasks'), orderBy('createdAt', 'desc')) : null,
    [firestore, user]
  );
  
  const { data: serverTasks, isLoading: isLoadingTasks } = useCollection<Task>(tasksQuery);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columns = useMemo(() => ['todo', 'in-progress', 'done', 'archived'], []);

  const tasks = useMemo(() => {
    return serverTasks || [];
  }, [serverTasks]);

  const todoTasks = useMemo(() => tasks.filter(t => t.status === 'todo'), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter(t => t.status === 'in-progress'), [tasks]);
  const doneTasks = useMemo(() => tasks.filter(t => t.status === 'done'), [tasks]);
  const archivedTasks = useMemo(() => tasks.filter(t => t.status === 'archived'), [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor)
  );

  const openAddTaskDialog = (status: Task['status']) => {
    setInitialStatusForNewTask(status);
    setIsAddFormOpen(true);
  };
  
  const openEditTaskDialog = (task: Task) => {
    setSelectedTask(task);
    setIsEditFormOpen(true);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks?.find(t => t.id === active.id);
    if(task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over || !tasks || !firestore || !user) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const currentActiveTask = tasks.find(t => t.id === activeId);

    if (!currentActiveTask) return;
    if (currentActiveTask.status === 'archived') return;

    const overIsAColumn = columns.includes(overId);
    const overTask = tasks.find(t => t.id === overId);
    const destinationStatus = overIsAColumn ? overId as Task['status'] : overTask?.status;

    if (!destinationStatus || destinationStatus === 'archived') return;

    if (currentActiveTask.status !== destinationStatus) {
      const taskRef = doc(firestore, 'tasks', activeId);
      const updatedData = { status: destinationStatus };

      updateDoc(taskRef, updatedData).catch(error => {
          const permissionError = new FirestorePermissionError({
            path: taskRef.path,
            operation: 'update',
            requestResourceData: updatedData,
          });
          errorEmitter.emit('permission-error', permissionError);
      });

      addDoc(collection(firestore, 'activities'), {
        type: 'task',
        author: user.displayName || user.email,
        text: `Moved task "${currentActiveTask.title}" to ${destinationStatus.toUpperCase()}`,
        time: new Date().toISOString(),
        taskId: activeId
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <Header />
      <main className="flex-grow pt-8 pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.2)]">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-headline text-4xl font-black tracking-tighter text-primary uppercase italic">
                  Digitiful <span className="text-foreground/50 not-italic font-light">//</span> Project Hub
                </h1>
                <p className="text-[10px] font-code text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Node Alpha // Mission Status: Live
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <KanbanTerminal onNewTask={openAddTaskDialog} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
             <Card className="bg-primary/5 border-primary/10">
                <CardHeader className="pb-2">
                    <CardTitle className="text-[10px] font-code text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Zap className="h-3 w-3 text-primary" /> Velocity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-black italic">{tasks.filter(t => t.status === 'done').length} / {tasks.length}</p>
                    <p className="text-[9px] text-muted-foreground uppercase mt-1">Milestones Secured</p>
                </CardContent>
             </Card>
             <div className="lg:col-span-3">
                <TodoTasksWidget />
             </div>
          </div>

          <Tabs defaultValue="hub" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 md:w-auto mb-8 bg-muted/20 border border-primary/10">
              <TabsTrigger value="hub" className="data-[state=active]:bg-primary/20"><CaseUpper className="mr-2 h-4 w-4"/>Hub Feed</TabsTrigger>
              <TabsTrigger value="kanban" className="data-[state=active]:bg-primary/20"><LayoutGrid className="mr-2 h-4 w-4"/>Kanban</TabsTrigger>
              <TabsTrigger value="video-call" className="data-[state=active]:bg-primary/20"><Phone className="mr-2 h-4 w-4"/>Video Call</TabsTrigger>
              <TabsTrigger value="knowledge" className="data-[state=active]:bg-primary/20"><Library className="mr-2 h-4 w-4"/>Intel Base</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20"><FileVideo className="mr-2 h-4 w-4"/>Telemetry</TabsTrigger>
            </TabsList>

            <TabsContent value="kanban">
               <Card className="bg-card/30 backdrop-blur-md border-primary/10 shadow-2xl">
                <CardHeader className="border-b border-primary/5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold uppercase italic tracking-tight">Mission Control Board</CardTitle>
                    <CardDescription className="text-[10px] font-code uppercase">Execute and drag tasks to update operational status.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-code text-primary/60">
                    <ActivityIcon className="h-3 w-3" />
                    SYNC: ACTIVE
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <DndContext 
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                  >
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <KanbanColumn title="Backlog" status="todo" tasks={todoTasks} isLoading={isLoadingTasks} onAddTaskClick={() => openAddTaskDialog('todo')} onTaskClick={openEditTaskDialog} />
                      <KanbanColumn title="Development" status="in-progress" tasks={inProgressTasks} isLoading={isLoadingTasks} onAddTaskClick={() => openAddTaskDialog('in-progress')} onTaskClick={openEditTaskDialog} />
                      <KanbanColumn title="Verified" status="done" tasks={doneTasks} isLoading={isLoadingTasks} onAddTaskClick={() => openAddTaskDialog('done')} onTaskClick={openEditTaskDialog} />
                      <KanbanColumn title="Archives" status="archived" tasks={archivedTasks} isLoading={isLoadingTasks} onAddTaskClick={() => openAddTaskDialog('archived')} onTaskClick={openEditTaskDialog} icon={Archive} isArchivedColumn/>
                    </div>

                    <div className="md:hidden">
                        <Tabs defaultValue="todo" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 mb-4">
                            <TabsTrigger value="todo">Todo</TabsTrigger>
                            <TabsTrigger value="in-progress">Doing</TabsTrigger>
                            <TabsTrigger value="done">Done</TabsTrigger>
                            <TabsTrigger value="archived">Box</TabsTrigger>
                          </TabsList>
                          <TabsContent value="todo">
                              <KanbanColumn title="Backlog" status="todo" tasks={todoTasks} isLoading={isLoadingTasks} onAddTaskClick={() => openAddTaskDialog('todo')} onTaskClick={openEditTaskDialog} hideTitle />
                          </TabsContent>
                           <TabsContent value="in-progress">
                              <KanbanColumn title="Development" status="in-progress" tasks={inProgressTasks} isLoading={isLoadingTasks} onAddTaskClick={() => openAddTaskDialog('in-progress')} onTaskClick={openEditTaskDialog} hideTitle />
                          </TabsContent>
                           <TabsContent value="done">
                              <KanbanColumn title="Verified" status="done" tasks={doneTasks} isLoading={isLoadingTasks} onAddTaskClick={() => openAddTaskDialog('done')} onTaskClick={openEditTaskDialog} hideTitle />
                          </TabsContent>
                          <TabsContent value="archived">
                              <KanbanColumn title="Archives" status="archived" tasks={archivedTasks} isLoading={isLoadingTasks} onAddTaskClick={() => openAddTaskDialog('archived')} onTaskClick={openEditTaskDialog} icon={Archive} hideTitle isArchivedColumn />
                          </TabsContent>
                        </Tabs>
                     </div>

                    {typeof document !== 'undefined' && createPortal(
                      <DragOverlay>
                        {activeTask ? (
                          <KanbanTaskCard task={activeTask} isOverlay />
                        ) : null}
                      </DragOverlay>,
                      document.body
                    )}
                  </DndContext>
                </CardContent>
               </Card>
            </TabsContent>
            
            <TabsContent value="hub">
              <ProjectHub />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsCard />
            </TabsContent>

            <TabsContent value="knowledge">
              <Card className="bg-card/30 backdrop-blur-md border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase italic">Operational Intel</CardTitle>
                  <CardDescription className="text-xs">System resources and documentation.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardData.knowledgeBase.map((item) => (
                       <DashboardKnowledgeCard key={item.id} item={item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video-call">
              <VideoCallCard />
            </TabsContent>
            
          </Tabs>
        </div>
      </main>

      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="bg-background/95 border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-primary flex items-center gap-2"><Zap className="h-5 w-5" /> Initiate Mission</DialogTitle>
          </DialogHeader>
          <AddTask 
            onTaskAdded={() => setIsAddFormOpen(false)}
            initialStatus={initialStatusForNewTask}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="sm:max-w-[700px] bg-background/95 border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-primary">Recalibrate Module</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <EditTask 
              task={selectedTask}
              onTaskUpdated={() => setIsEditFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
      <DashboardPageContent />
    </Suspense>
  )
}
