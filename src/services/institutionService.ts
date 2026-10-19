/**
 * Institution service — abstraction layer between the UI and the data source.
 *
 * Currently backed by a local TypeScript dataset (institutions.ts).
 * To migrate to an API later, replace the implementation of these
 * functions (e.g. fetch from GET /api/institutions) without changing
 * the public interface. The UI imports only this service, never the
 * raw dataset.
 */
import { Institution } from '../types';
import { institutions } from '../data/institutions';

/**
 * Return the full list of institutions.
 * In the future this can become an async API call.
 */
export function getInstitutions(): Institution[] {
  return institutions;
}

/**
 * Find a single institution by its stable ID.
 */
export function getInstitutionById(id: string): Institution | undefined {
  return institutions.find((inst) => inst.id === id);
}

/**
 * Search institutions by a query string.
 * - Case-insensitive
 * - Matches partial institution names
 * - Handles leading and trailing whitespace
 * - Handles multiple-word searches sensibly (all search tokens must match)
 */
export function searchInstitutions(query: string): Institution[] {
  if (!query || query.trim().length === 0) {
    return institutions;
  }

  const terms = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 0);

  if (terms.length === 0) {
    return institutions;
  }

  return institutions.filter((inst) => {
    const haystack = `${inst.name} ${inst.city ?? ''} ${inst.university} ${inst.state}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
