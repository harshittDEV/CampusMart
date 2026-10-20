import { Role, RoleCardData } from '../types';
import { Colors } from './colors';

/**
 * Role card display data — maps each Role enum to user-facing content.
 * Each role has a unique accent color and descriptive icon.
 * Icons reference Ionicons names from @expo/vector-icons.
 */
export const ROLE_CARDS: RoleCardData[] = [
  {
    role: Role.STUDENT,
    title: 'Student',
    description: 'Currently enrolled at a college or university',
    icon: 'school',
    color: Colors.roleStudent,
    lightColor: Colors.roleStudentLight,
  },
  {
    role: Role.FACULTY,
    title: 'Professor / Faculty',
    description: 'Teaching or research staff at a campus',
    icon: 'library',
    color: Colors.roleFaculty,
    lightColor: Colors.roleFacultyLight,
  },
  {
    role: Role.STAFF,
    title: 'Staff',
    description: 'Administrative or support staff member',
    icon: 'briefcase',
    color: Colors.roleStaff,
    lightColor: Colors.roleStaffLight,
  },
  {
    role: Role.SECURITY,
    title: 'Security',
    description: 'Campus security or safety personnel',
    icon: 'shield-checkmark',
    color: Colors.roleSecurity,
    lightColor: Colors.roleSecurityLight,
  },
  {
    role: Role.OTHER,
    title: 'Other',
    description: 'Alumni, visitor, or other campus connection',
    icon: 'people',
    color: Colors.roleOther,
    lightColor: Colors.roleOtherLight,
  },
];
