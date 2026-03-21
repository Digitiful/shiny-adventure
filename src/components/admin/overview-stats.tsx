
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Briefcase, ListTodo, Users, ArrowRight, CheckCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TimeAgo } from '@/components/ui/time-ago';
import { Button } from '../ui/button';
import Link from 'next/link';


interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedDate: string;
  type: 'General Inquiry' | 'Booking Request';
}

interface Task {
  id: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface Service {
    id: string;
}

const StatCard = ({ title, value, icon: Icon, isLoading }: { title: string, value: number, icon: React.ElementType, isLoading: boolean }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-1/2" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    )
}


export function OverviewStats() {
    const firestore = useFirestore();

    const inquiriesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'clientInquiries')) : null, [firestore]);
    const servicesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'services')) : null, [firestore]);
    const tasksQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'tasks'), where('status', '!=', 'done')) : null, [firestore]);

    const { data: inquiries, isLoading: loadingInquiries } = useCollection<ClientInquiry>(inquiriesQuery);
    const { data: services, isLoading: loadingServices } = useCollection<Service>(servicesQuery);
    const { data: tasks, isLoading: loadingTasks } = useCollection<Task>(tasksQuery);
    
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Inquiries" value={inquiries?.length ?? 0} icon={Mail} isLoading={loadingInquiries} />
            <StatCard title="Active Tasks" value={tasks?.length ?? 0} icon={ListTodo} isLoading={loadingTasks} />
            <StatCard title="Services Offered" value={services?.length ?? 0} icon={Briefcase} isLoading={loadingServices} />
        </div>
    )
}

export function RecentInquiries() {
    const firestore = useFirestore();

    const recentInquiriesQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'clientInquiries'), orderBy('submittedDate', 'desc'), limit(5)) : null,
        [firestore]
    );

    const { data: inquiries, isLoading } = useCollection<ClientInquiry>(recentInquiriesQuery);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Received</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-4 w-20" /></TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && inquiries?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                    No inquiries yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {inquiries?.map(inquiry => (
                            <TableRow key={inquiry.id}>
                                <TableCell>
                                    <div className="font-medium">{inquiry.name}</div>
                                    <div className="text-sm text-muted-foreground">{inquiry.email}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={inquiry.type === 'Booking Request' ? 'default' : 'secondary'}>
                                        {inquiry.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right text-xs text-muted-foreground">
                                    <TimeAgo dateString={inquiry.submittedDate} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 <div className="flex items-center justify-end mt-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/admin/inquiries">
                            View all inquiries
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

    