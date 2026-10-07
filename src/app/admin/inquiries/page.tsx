'use client';

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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { AlertCircle, Bot, Mail, User, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TimeAgo } from '@/components/ui/time-ago';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import React from 'react';
import { cn } from '@/lib/utils';

interface HistoryLine {
  role: 'user' | 'model';
  content: string;
}

interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedDate: string;
  type: 'General Inquiry' | 'Booking Request';
  bookingFor?: string;
  conversationHistory?: HistoryLine[];
}

export default function InquiriesPage() {
  const firestore = useFirestore();

  const inquiriesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'clientInquiries'),
            orderBy('submittedDate', 'desc')
          )
        : null,
    [firestore]
  );

  const {
    data: inquiries,
    isLoading,
    error,
  } = useCollection<ClientInquiry>(inquiriesQuery);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <div>
            <CardTitle>Client Inquiries</CardTitle>
            <CardDescription>
              View and manage messages from your contact and booking forms.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Inquiries</AlertTitle>
            <AlertDescription>
              Could not load client inquiries. This is likely a permissions
              issue. Ensure you are logged in as an administrator or that your
              Firestore security rules allow access.
            </AlertDescription>
          </Alert>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Client</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[150px]">Type</TableHead>
                <TableHead className="w-[180px] text-right">Received</TableHead>
              </TableRow>
            </TableHeader>

            <Accordion type="single" collapsible asChild>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32 mt-2" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading && inquiries?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No inquiries found.
                    </TableCell>
                  </TableRow>
                )}
                {inquiries?.map((inquiry) => (
                  <AccordionItem value={inquiry.id} key={inquiry.id} asChild>
                    <>
                      <TableRow>
                        <TableCell className="font-medium">
                          <div className="font-bold">{inquiry.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {inquiry.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="truncate-2-lines text-sm text-muted-foreground">
                            {inquiry.bookingFor && (
                              <span className="font-semibold text-primary">
                                Booking for: {inquiry.bookingFor}
                                <br />
                              </span>
                            )}
                            {inquiry.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inquiry.type === 'Booking Request'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {inquiry.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                           <div className='flex items-center justify-end'>
                            <TimeAgo dateString={inquiry.submittedDate} />
                            {inquiry.conversationHistory && inquiry.conversationHistory.length > 0 && (
                              <AccordionTrigger className="p-2 hover:no-underline" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {inquiry.conversationHistory && inquiry.conversationHistory.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="p-0">
                              <AccordionContent>
                                <div className="font-code text-xs space-y-2 p-4 bg-muted/50">
                                  <h4 className="font-bold text-sm mb-2 text-primary">
                                    Conversation History
                                  </h4>
                                  {inquiry.conversationHistory.map(
                                    (line, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2"
                                      >
                                        {line.role === 'user' ? (
                                          <User className="h-4 w-4 text-primary flex-shrink-0" />
                                        ) : (
                                          <Bot className="h-4 w-4 text-primary/80 flex-shrink-0" />
                                        )}
                                        <p className="flex-grow">
                                          {line.content}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </AccordionContent>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  </AccordionItem>
                ))}
              </TableBody>
            </Accordion>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
