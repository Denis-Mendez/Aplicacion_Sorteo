'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests optimal raffle settings
 * based on the provided list of participants. It exports the SuggestRaffleSettingsInput,
 * SuggestRaffleSettingsOutput types, and the suggestRaffleSettings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRaffleSettingsInputSchema = z.object({
  participantCount: z
    .number()
    .describe('The number of participants in the raffle.'),
  demographics: z
    .string()
    .optional()
    .describe('Optional demographic information about the participants.'),
});
export type SuggestRaffleSettingsInput = z.infer<
  typeof SuggestRaffleSettingsInputSchema
>;

const SuggestRaffleSettingsOutputSchema = z.object({
  suggestedWinnerCount: z
    .number()
    .describe(
      'The suggested number of winners for the raffle, based on the number of participants.'
    ),
  allowRepeatsSuggestion: z
    .boolean()
    .describe(
      'A suggestion on whether to allow repeats, based on the number of participants and desired fairness.'
    ),
  additionalNotes: z
    .string()
    .optional()
    .describe('Any additional notes or considerations for the raffle settings.'),
});
export type SuggestRaffleSettingsOutput = z.infer<
  typeof SuggestRaffleSettingsOutputSchema
>;

export async function suggestRaffleSettings(
  input: SuggestRaffleSettingsInput
): Promise<SuggestRaffleSettingsOutput> {
  return suggestRaffleSettingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRaffleSettingsPrompt',
  input: {schema: SuggestRaffleSettingsInputSchema},
  output: {schema: SuggestRaffleSettingsOutputSchema},
  prompt: `You are an AI assistant helping to configure raffle settings.

  Based on the number of participants ({{{participantCount}}}), suggest an optimal number of winners.
  Also, suggest whether repeats should be allowed.

  Consider the following demographic information when providing your suggestions: {{{demographics}}}

  Return the suggestions in JSON format.
  `,
});

const suggestRaffleSettingsFlow = ai.defineFlow(
  {
    name: 'suggestRaffleSettingsFlow',
    inputSchema: SuggestRaffleSettingsInputSchema,
    outputSchema: SuggestRaffleSettingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
