
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

// Helper to get server-side Firestore
function getAdminFirestoreInstance() {
    const adminApp = getAdminApp();
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

// Schema for booking form
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
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || "Please fix the errors in the form.";
    return {
      message: firstError,
      status: "error",
    };
  }

  try {
    const { date, time, history, ...rest } = validatedFields.data;
    const submissionDate = new Date(date);
    const timeParts = time.split(/[:\s]/);
    let hours = parseInt(timeParts[0]);
    if (time.includes('PM') && hours < 12) hours += 12;
    if (time.includes('AM') && hours === 12) hours = 0;
    submissionDate.setHours(hours, parseInt(timeParts[1]));

    const formattedDateTime = format(submissionDate, "EEEE, MMMM do, yyyy 'at' h:mm a");

    let conversationHistory: HistoryLine[] = [];
    if (history) {
        try {
            const parsedHistory = JSON.parse(history);
            const validatedHistory = historySchema.safeParse(parsedHistory);
            if (validatedHistory.success) {
                conversationHistory = validatedHistory.data;
            }
        } catch (e) {
            console.warn("Could not parse conversation history", e);
        }
    }


    const newInquiry = {
        ...rest,
        type: 'Booking Request',
        bookingFor: formattedDateTime,
        submittedDate: new Date().toISOString(),
        conversationHistory: conversationHistory,
    };

    const db = getAdminFirestoreInstance();
    await db.collection('clientInquiries').add(newInquiry);
    revalidatePath('/admin/inquiries');

    return {
      message: "Booking confirmed! We've sent the details to your email.",
      status: "success",
    };
  } catch (error) {
    console.error("Error saving booking inquiry:", error);
    return {
      message: "A database error occurred. Please try again later.",
      status: "error",
    };
  }
}

// Schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});


export async function handleContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMessages).flat()[0] || "Please fix the errors in the form.";
    return {
      message: firstError,
      status: "error",
    };
  }

  try {
    const newInquiry = {
        ...validatedFields.data,
        type: 'General Inquiry',
        submittedDate: new Date().toISOString(),
    };
    
    const db = getAdminFirestoreInstance();
    await db.collection('clientInquiries').add(newInquiry);
    revalidatePath('/admin/inquiries');


    return {
      message: "Message Sent! We've received your message and will get back to you soon.",
      status: "success",
    };
  } catch (error) {
    console.error("Error saving contact inquiry:", error);
    return {
      message: "A database error occurred. Please try again later.",
      status: "error",
    };
  }
}

export async function handleTerminalQuery(query: string, userName?: string | null, history?: HistoryLine[]) {
  try {
    const response = await siteQuery({ query, userName: userName || undefined, history });
    return { answer: response.answer };
  } catch (error) {
    console.error("AI query failed:", error);
    return { answer: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later." };
  }
}

export async function handleGeneralQuery(query: string, history?: HistoryLine[]) {
  try {
    const response = await generalQuery({ query, history });
    return { answer: response.answer };
  } catch (error) {
    console.error("General AI query failed:", error);
    return { answer: "Signal lost. Attempting to reconnect..." };
  }
}

const contentAnalyzerSchema = z.object({
  textToAnalyze: z.string().min(50, "Text must be at least 50 characters to analyze."),
});


export async function handleContentAnalysis(
  prevState: any,
  formData: FormData
) {
  const validatedFields = contentAnalyzerSchema.safeParse({
    textToAnalyze: formData.get("textToAnalyze"),
  });

  if (!validatedFields.success) {
    return {
      analysis: null,
      message: validatedFields.error.flatten().fieldErrors.textToAnalyze?.[0] || 'Invalid input.',
      status: "error"
    };
  }

  try {
    const analysis = await analyzeContent({ textToAnalyze: validatedFields.data.textToAnalyze });
    return {
      analysis,
      message: "Content analyzed successfully.",
      status: "success"
    };
  } catch (error) {
    console.error("Content analysis failed:", error);
    return {
      analysis: null,
      message: "Failed to analyze content. The intelligent engine may be temporarily unavailable.",
      status: "error"
    };
  }
}

const serviceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  icon: z.string().min(1, "Please select an icon."),
});

type ServiceFormState = {
    message: string;
    status: 'success' | 'error' | 'idle';
    errors?: Record<string, string[] | undefined> | null;
};

export async function handleAddService(
    prevState: ServiceFormState,
    formData: FormData
): Promise<ServiceFormState> {
    const validatedFields = serviceFormSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        icon: formData.get('icon'),
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: 'Please check the form for errors.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const db = getAdminFirestoreInstance();
        await db.collection('services').add(validatedFields.data);
        
        revalidatePath('/admin/services');
        revalidatePath('/');

        return {
            status: 'success',
            message: 'Service added successfully!',
        };

    } catch (error) {
        console.error('Error adding service to Firestore:', error);
        return {
            status: 'error',
            message: 'Failed to add service. Please try again.',
        };
    }
}


const deleteServiceSchema = z.object({
    id: z.string(),
});

export async function handleDeleteService(
    prevState: { message: string, status: 'success' | 'error' | 'idle' },
    formData: FormData
): Promise<{ message: string, status: 'success' | 'error' | 'idle' }> {
    const validatedFields = deleteServiceSchema.safeParse({
        id: formData.get('id'),
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: 'Invalid service ID.',
        };
    }

    try {
        const db = getAdminFirestoreInstance();
        await db.collection('services').doc(validatedFields.data.id).delete();
        
        revalidatePath('/admin/services');
        revalidatePath('/');

        return {
            status: 'success',
            message: 'Service deleted successfully!',
        };

    } catch (error) {
        console.error('Error deleting service from Firestore:', error);
        return {
            status: 'error',
            message: 'Failed to delete service. Please try again.',
        };
    }
}

// Client Management Actions

const clientFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  logo: z.string().url("Invalid logo URL."),
  href: z.string().url("Invalid website URL.").optional().or(z.literal('')),
  invert: z.boolean().default(false),
});

export async function handleAddClient(prevState: any, formData: FormData) {
    const validatedFields = clientFormSchema.safeParse({
        name: formData.get('name'),
        logo: formData.get('logo'),
        href: formData.get('href'),
        invert: formData.get('invert') === 'on',
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const db = getAdminFirestoreInstance();
        await db.collection('clients').add({
            ...validatedFields.data,
            order: Date.now(),
        });
        revalidatePath('/admin/clients');
        revalidatePath('/');
        return { status: 'success', message: 'Partner added to signal grid.' };
    } catch (error) {
        return { status: 'error', message: 'Failed to broadcast client signal.' };
    }
}

export async function handleDeleteClient(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return { status: 'error', message: 'ID required.' };

    try {
        const db = getAdminFirestoreInstance();
        await db.collection('clients').doc(id).delete();
        revalidatePath('/admin/clients');
        revalidatePath('/');
        return { status: 'success', message: 'Partner removed from signal grid.' };
    } catch (error) {
        return { status: 'error', message: 'Failed to terminate client signal.' };
    }
}

// Kanban Actions

const deleteTaskSchema = z.object({
    id: z.string().min(1, 'Task ID is required.'),
});

export async function handleDeleteTask(formData: FormData): Promise<{ status: 'success' | 'error'; message: string; }> {
    const validatedFields = deleteTaskSchema.safeParse({
        id: formData.get('id'),
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: 'Invalid task ID.',
        };
    }

    try {
        const db = getAdminFirestoreInstance();
        await db.collection('tasks').doc(validatedFields.data.id).delete();
        revalidatePath('/dashboard');
        return {
            status: 'success',
            message: 'Task deleted successfully!',
        };
    } catch (error) {
        console.error('Error deleting task from Firestore:', error);
        return {
            status: 'error',
            message: 'Failed to delete task. Please try again.',
        };
    }
}

export async function handleTagSuggestion(taskTitle: string): Promise<string[]> {
  if (!taskTitle || taskTitle.length < 10) {
    return [];
  }
  try {
    const result = await suggestTags({ taskTitle });
    return result.tags;
  } catch (error) {
    console.error("Tag suggestion failed:", error);
    return [];
  }
}

// Warehouse Actions

const placeBidSchema = z.object({
    itemId: z.string(),
    bidAmount: z.number().positive(),
    userId: z.string(),
});

export async function handlePlaceBid(formData: FormData): Promise<{ status: 'success' | 'error'; message: string; }> {
    const validatedFields = placeBidSchema.safeParse({
        itemId: formData.get('itemId'),
        bidAmount: parseFloat(formData.get('bidAmount') as string),
        userId: formData.get('userId'),
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: validatedFields.error.errors[0].message,
        };
    }

    try {
        const db = getAdminFirestoreInstance();
        const itemRef = db.collection('auctionItems').doc(validatedFields.data.itemId);
        
        await db.runTransaction(async (transaction) => {
            const itemDoc = await transaction.get(itemRef);
            if (!itemDoc.exists) {
                throw new Error("Item not found.");
            }

            const currentBid = itemDoc.data()?.currentBid || 0;
            if (validatedFields.data.bidAmount <= currentBid) {
                throw new Error(`Bid must be higher than the current bid of $${currentBid}.`);
            }

            transaction.update(itemRef, {
                currentBid: validatedFields.data.bidAmount,
                highestBidder: validatedFields.data.userId,
            });
        });

        revalidatePath('/warehouse');
        return {
            status: 'success',
            message: 'Bid placed successfully!',
        };
    } catch (error: any) {
        console.error('Error placing bid:', error);
        return {
            status: 'error',
            message: error.message || 'Failed to place bid.',
        };
    }
}
