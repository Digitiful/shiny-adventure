'use client';

import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, orderBy, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { AlertCircle, Briefcase, PlusCircle, MoreHorizontal, Trash2, Rocket } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { serviceIcons, services as initialServicesData } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ServiceForm } from '@/components/forms/service-form';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function ServicesPage() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSeeding, startSeedingTransition] = useTransition();

  const firestore = useFirestore();
  const { toast } = useToast();

  const servicesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'services'), orderBy('title', 'asc'))
        : null,
    [firestore]
  );

  const {
    data: services,
    isLoading,
    error,
    mutate,
  } = useCollection<Service>(servicesQuery);

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteAlertOpen(true);
  };

  const onServiceDelete = () => {
    if (!selectedService || !firestore) return;

    const serviceRef = doc(firestore, 'services', selectedService.id);

    startTransition(async () => {
      deleteDoc(serviceRef)
        .then(() => {
          toast({
            title: 'Success!',
            description: 'Service deleted successfully!',
          });
        })
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: serviceRef.path,
            operation: 'delete',
          });
          errorEmitter.emit('permission-error', permissionError);
        });
      
      setIsDeleteAlertOpen(false);
      setSelectedService(null);
    });
  };

  const handleSeedServices = () => {
    if (!firestore) return;

    startSeedingTransition(async () => {
      try {
        const servicesCollection = collection(firestore, 'services');
        const batch = writeBatch(firestore);
        
        initialServicesData.forEach((service) => {
          const { icon, ...serviceData } = service;
          const newServiceRef = doc(servicesCollection);
          batch.set(newServiceRef, { 
            title: serviceData.title,
            description: serviceData.description,
            icon: Object.keys(serviceIcons).find(key => serviceIcons[key] === icon) 
          });
        });

        await batch.commit();
        if (servicesQuery) mutate();

        toast({
          title: 'Success!',
          description: 'Services seeded successfully.',
        });

      } catch (err) {
        console.error("Error seeding services:", err);
        toast({
          title: 'Seeding Failed',
          description: 'Could not seed services.',
          variant: 'destructive'
        });
      }
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>
                  Add, edit, or delete the services offered on your website.
                </CardDescription>
              </div>
            </div>
            <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Service</DialogTitle>
                  <DialogDescription>
                    Fill out the details below to add a new service to your website.
                  </DialogDescription>
                </DialogHeader>
                <ServiceForm
                  onFormSuccess={() => setIsAddFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Services</AlertTitle>
              <AlertDescription>
                Could not load services. Ensure you are logged in as an administrator.
              </AlertDescription>
            </Alert>
          )}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    Icon
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading && services?.length === 0 && !error && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <h3 className="text-xl font-semibold">No services found.</h3>
                            <p className="text-muted-foreground">You can start by adding the default services.</p>
                            <Button onClick={handleSeedServices} disabled={isSeeding}>
                                {isSeeding ? 'Seeding...' : 'Seed Default Services'}
                                <Rocket className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
                {services?.map((service) => {
                  const Icon = serviceIcons[service.icon] || Briefcase;
                  return (
                    <TableRow key={service.id}>
                      <TableCell className="hidden sm:table-cell">
                        <div className="p-2 bg-muted rounded-md inline-flex">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>
                        <p className="truncate-2-lines text-muted-foreground">
                          {service.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              onClick={() => openDeleteDialog(service)}
                            >
                               <Trash2 className="mr-2 h-4 w-4" />
                               Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              <span className="font-bold"> "{selectedService?.title}" </span> 
              service from your website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onServiceDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}