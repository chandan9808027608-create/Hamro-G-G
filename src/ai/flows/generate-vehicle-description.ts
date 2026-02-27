'use server';
/**
 * @fileOverview An AI assistant flow for generating detailed vehicle descriptions.
 *
 * - generateVehicleDescription - A function that handles the vehicle description generation process.
 * - GenerateVehicleDescriptionInput - The input type for the generateVehicleDescription function.
 * - GenerateVehicleDescriptionOutput - The return type for the generateVehicleDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateVehicleDescriptionInputSchema = z.object({
  brand: z.string().describe('The brand of the two-wheeler.'),
  model: z.string().describe('The model of the two-wheeler.'),
  type: z.enum(['bike', 'scooter']).describe('The type of the two-wheeler (bike or scooter).'),
  year: z.number().describe('The manufacturing year of the two-wheeler.'),
  kmRun: z.number().describe('The total kilometers the two-wheeler has run.'),
  condition: z.string().describe('The overall condition of the two-wheeler (e.g., excellent, good, fair).'),
  price: z.number().describe('The price of the two-wheeler in NPR.'),
});
export type GenerateVehicleDescriptionInput = z.infer<typeof GenerateVehicleDescriptionInputSchema>;

const GenerateVehicleDescriptionOutputSchema = z.object({
  description: z.string().describe('A comprehensive and engaging description for the vehicle listing.'),
});
export type GenerateVehicleDescriptionOutput = z.infer<typeof GenerateVehicleDescriptionOutputSchema>;

export async function generateVehicleDescription(input: GenerateVehicleDescriptionInput): Promise<GenerateVehicleDescriptionOutput> {
  return generateVehicleDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVehicleDescriptionPrompt',
  input: { schema: GenerateVehicleDescriptionInputSchema },
  output: { schema: GenerateVehicleDescriptionOutputSchema },
  prompt: `You are an expert automotive salesperson specializing in second-hand two-wheelers. Your task is to generate a compelling and detailed sales description for a {{type}}.

Use the following specifications to craft an enticing description that highlights key features, condition, and value for potential buyers, suitable for an online listing. Keep the tone persuasive and informative.

Vehicle Specifications:
- Brand: {{{brand}}}
- Model: {{{model}}}
- Type: {{{type}}}
- Year: {{{year}}}
- Kilometers Run: {{{kmRun}}} km
- Condition: {{{condition}}}
- Price: NPR {{{price}}}

Craft a detailed description that covers:
1.  An engaging opening highlighting the model.
2.  Key features and advantages based on its type and model.
3.  Elaborate on the condition, ensuring trustworthiness.
4.  Mention the kilometers run and how it relates to its value.
5.  A strong call to action to contact the dealership.

The description should be at least 150 words.`,
});

const generateVehicleDescriptionFlow = ai.defineFlow(
  {
    name: 'generateVehicleDescriptionFlow',
    inputSchema: GenerateVehicleDescriptionInputSchema,
    outputSchema: GenerateVehicleDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
