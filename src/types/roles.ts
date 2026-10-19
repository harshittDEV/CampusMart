/**
 * Enum representing the different user roles in CampusMart.
 * Used throughout the app to identify how a user is connected to their campus.
 */
export enum Role {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  STAFF = 'STAFF',
  SECURITY = 'SECURITY',
  OTHER = 'OTHER',
}

/**
 * Display information for each role, used in the role selection UI.
 * Each role carries its own accent color for visual distinction.
 */
export interface RoleCardData {
  role: Role;
  title: string;
  description: string;
  icon: string;
  color: string;
  lightColor: string;
}
