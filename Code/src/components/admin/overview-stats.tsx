'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Briefcase, ListTodo, ArrowRight, Activity, Zap, CheckCircle2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';


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

const StatCard = ({ title, value, icon: Icon, isLoading, color }: { title: string, value: number, icon: React.ElementType, isLoading: boolean, color: string }) => {
    return (
        <Card className="bg-black/40 border-primary/10 overflow-hidden group hover:border-primary/30 transition-all shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{title}</CardTitle>
                <div className={cn("p-1.5 rounded bg-black/40 border border-white/5", color)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-10 w-1/2 bg-muted/20" />
                ) : (
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-black italic text-foreground tracking-tighter">{value}</div>
                      <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                    </div>
                )}
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-px flex-grow bg-gradient-to-r from-primary/20 to-transparent" />
                  <span className="text-[8px] font-code text-muted-foreground uppercase tracking-widest">Active Signal</span>
                </div>
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
        <div className="grid gap-6 md:grid-cols-3">
            <StatCard title="Client Inquiries" value={inquiries?.length ?? 0} icon={Mail} isLoading={loadingInquiries} color="text-blue-500" />
            <StatCard title="Mission Tasks" value={tasks?.length ?? 0} icon={ListTodo} isLoading={loadingTasks} color="text-yellow-500" />
            <StatCard title="Active Services" value={services?.length ?? 0} icon={Briefcase} isLoading={loadingServices} color="text-primary" />
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
        <Card className="bg-black/40 border-primary/10 shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">Incoming Signal Packet</CardTitle>
                </div>
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary">Live Intake</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                      <TableHeader className="bg-black/40">
                          <TableRow className="hover:bg-transparent border-white/5">
                              <TableHead className="text-[9px] font-black uppercase tracking-widest text-muted-foreground h-10 px-6">Client Node</TableHead>
                              <TableHead className="text-[9px] font-black uppercase tracking-widest text-muted-foreground h-10">Classification</TableHead>
                              <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground h-10 px-6">Transmission</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {isLoading && Array.from({ length: 5 }).map((_, i) => (
                              <TableRow key={i} className="border-white/5">
                                  <TableCell className="px-6"><Skeleton className="h-4 w-32 bg-muted/20" /></TableCell>
                                  <TableCell><Skeleton className="h-6 w-24 rounded-full bg-muted/20" /></TableCell>
                                  <TableCell className="text-right px-6"><Skeleton className="h-4 w-20 bg-muted/20 ml-auto" /></TableCell>
                              </TableRow>
                          ))}
                          {!isLoading && inquiries?.length === 0 && (
                              <TableRow>
                                  <TableCell colSpan={3} className="h-32 text-center">
                                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] opacity-30 italic">Registry Dark // No Active Signals</p>
                                  </TableCell>
                              </TableRow>
                          )}
                          {inquiries?.map(inquiry => (
                              <TableRow key={inquiry.id} className="group hover:bg-primary/5 transition-colors border-white/5">
                                  <TableCell className="px-6 py-4">
                                      <div className="font-black text-sm uppercase italic tracking-tighter text-foreground">{inquiry.name}</div>
                                      <div className="text-[10px] text-muted-foreground font-medium lowercase group-hover:text-primary transition-colors">{inquiry.email}</div>
                                  </TableCell>
                                  <TableCell>
                                      <Badge variant={inquiry.type === 'Booking Request' ? 'default' : 'secondary'} className="text-[8px] font-black uppercase px-2 py-0">
                                          {inquiry.type}
                                      </Badge>
                                  </TableCell>
                                  <TableCell className="text-right text-[10px] text-muted-foreground px-6 font-bold uppercase tracking-tighter">
                                      <TimeAgo dateString={inquiry.submittedDate} />
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                </div>
                 <div className="flex items-center justify-end p-4 border-t border-white/5 bg-black/20">
                    <Button asChild variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                        <Link href="/admin/inquiries">
                            Access Full Archive
                            <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

    
