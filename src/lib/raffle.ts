import type { Participant } from './types';

// Simple mulberry32 PRNG for seeded random numbers
function createPRNG(seed: string) {
  let a = 0;
  for (let i = 0; i < seed.length; i++) {
    a += seed.charCodeAt(i);
  }

  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function runRaffle(
  participants: Participant[],
  numberOfWinners: number,
  seed?: string
): Participant[] {
  if (numberOfWinners > participants.length) {
    throw new Error('Number of winners cannot be greater than the number of participants.');
  }

  const shuffled = [...participants];
  const random = seed && seed.trim() ? createPRNG(seed) : Math.random;

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, numberOfWinners);
}
