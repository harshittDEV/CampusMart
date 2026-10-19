/**
 * Institution data model for CampusMart.
 *
 * Designed to scale across multiple universities in India.
 * Currently populated with VTU colleges; will expand to JNTU,
 * Anna University, IITs, etc.
 */
export interface Institution {
  /** Stable unique identifier, e.g. "vtu-001" */
  id: string;
  /** Official institution name */
  name: string;
  /** Parent university name */
  university: string;
  /** State where the institution is located */
  state: string;
  /** City or region (optional) */
  city?: string;
}
