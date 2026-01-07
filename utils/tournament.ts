import type { Tournament } from '~/types';

/**
 * Check if registrations are open for a tournament
 * @param tournament - The tournament to check
 * @returns boolean - true if registrations are open, false otherwise
 */
export function isRegistrationOpen(tournament: Tournament): boolean {
  const now = new Date();
  const registrationStart = new Date(tournament.tournamentRegistrationStart);
  const registrationEnd = new Date(tournament.tournamentRegistrationEnd);

  // Registration is open if:
  // 1. Tournament status is OPEN (not DRAFT, IN_PROGRESS, or FINISHED)
  // 2. Current time is between registration start and end dates
  return tournament.status === 'OPEN' && now >= registrationStart && now <= registrationEnd;
}

/**
 * Get registration status message for a tournament
 * @param tournament - The tournament to check
 * @returns string - Human-readable status message
 */
export function getRegistrationStatusMessage(tournament: Tournament): string {
  const now = new Date();
  const registrationStart = new Date(tournament.tournamentRegistrationStart);
  const registrationEnd = new Date(tournament.tournamentRegistrationEnd);

  if (tournament.status !== 'OPEN') {
    return 'Registration not available';
  }

  if (now < registrationStart) {
    const daysUntil = Math.ceil((registrationStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return `Registration opens in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
  }

  if (now > registrationEnd) {
    return 'Registration closed';
  }

  return 'Registration open';
}

/**
 * Get time remaining for registration
 * @param tournament - The tournament to check
 * @returns object - Time remaining in different units
 */
export function getRegistrationTimeRemaining(tournament: Tournament): {
  days: number;
  hours: number;
  minutes: number;
  total: number;
} | null {
  if (!isRegistrationOpen(tournament)) {
    return null;
  }

  const now = new Date();
  const registrationEnd = new Date(tournament.tournamentRegistrationEnd);
  const total = registrationEnd.getTime() - now.getTime();

  if (total <= 0) {
    return null;
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, total };
}
