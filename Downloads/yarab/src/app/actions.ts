"use server";

import { z } from "zod";
import { siteQuery } from "@/ai/flows/site-qa-flow";
import { generalQuery } from "@/ai/flows/general-assistant-flow";
import { analyzeContent } from "@/ai/flows/article-generator-flow";
import { suggestTags } from "@/ai/flows/tag-suggester-flow";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { getAdminApp } from "@/lib/firebase-admin";
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

/**
 * @fileOverview Server Actions Node.
 * Identity: Secure Command Relay.
 */

function getAdminFirestoreInstance() {
    const adminApp = getAdminApp();
    if (!adminApp) return null;
    return getAdminFirestore(adminApp);
}

type HistoryLine = {
    role: 'user' | 'model';
    content: string;
}

const historySchema = z.array(z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
}));

const bookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
  date: z.string().min(1, "Please select a date."),
  time: z.string().min(1, "Please select a time."),
  history: z.string().optional(),
});

type FormState = {
  message: string;
  status: "success" | "error" | "idle";
};

export async function handleBookingForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = bookingFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    date: formData.get("date"),
    time: formData.get("time"),
    history: formData.get("history"),
  });

  if (!validatedFields.success) {
    return { message: "Validation failed.", status: "error" };
  }

  try {
    const db = getAdminFirestoreInstance();
    if (!db) return { message: "System initializing.", status: "error" };
    
    await db.collection('clientInquiries').add({
        ...validatedFields.data,
        type: 'Booking Request',
        submittedDate: new Date().toISOString(),
    });
    
    revalidatePath('/admin/inquiries');
    return { message: "Booking confirmed!", status: "success" };
  } catch (error) {
    return { message: "Database error.", status: "error" };
  }
}

export async function handleContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const db = getAdminFirestoreInstance();
  if (!db) return { message: "System initializing.", status: "error" };
  
  await db.collection('clientInquiries').add({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      type: 'General Inquiry',
      submittedDate: new Date().toISOString(),
  });
  
  revalidatePath('/admin/inquiries');
  return { message: "Message Sent!", status: "success" };
}

export async function handleTerminalQuery(query: string, userName?: string | null, history?: HistoryLine[]) {
  const response = await siteQuery({ query, userName: userName || undefined, history });
  return { answer: response.answer };
}

export async function handleGeneralQuery(query: string, history?: HistoryLine[]) {
  const response = await generalQuery({ query, history });
  return { answer: response.answer };
}

export async function handleContentAnalysis(prevState: any, formData: FormData) {
  const analysis = await analyzeContent({ textToAnalyze: formData.get("textToAnalyze") as string });
  return { analysis, message: "Analysis complete.", status: "success" };
}

export async function handleTagSuggestion(taskTitle: string): Promise<string[]> {
  const result = await suggestTags({ taskTitle });
  return result.tags;
}

export async function handleDeleteTask(formData: FormData): Promise<any> {
    const db = getAdminFirestoreInstance();
    if (!db) return { status: 'error' };
    await db.collection('tasks').doc(formData.get('id') as string).delete();
    revalidatePath('/dashboard');
    return { status: 'success', message: 'Task deleted.' };
}