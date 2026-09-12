'use server';

import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import ContactMsg from '@/models/ContactMsg';

// Zod schema for validation
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
});

export async function submitContact(prevState, formData) {
  try {
    // 1. Validate inputs
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
    
    const validatedData = contactSchema.parse(rawData);

    // 2. Connect to database
    await connectDB();

    // 3. Save to database
    await ContactMsg.create(validatedData);

    return {
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    };
  } catch (error) {
    console.error('Contact Submission Error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = {};
      error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      return {
        success: false,
        errors: fieldErrors,
      };
    }

    // Handle general errors
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}
