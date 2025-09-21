"use server";

import { suggestRaffleSettings, type SuggestRaffleSettingsOutput } from '@/ai/flows/suggest-raffle-settings';

export async function getRaffleSuggestions(participantCount: number): Promise<SuggestRaffleSettingsOutput> {
  if (participantCount <= 0) {
    throw new Error("Participant count must be greater than zero.");
  }
  try {
    const suggestions = await suggestRaffleSettings({ participantCount });
    return suggestions;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    throw new Error('Failed to get suggestions from AI.');
  }
}
