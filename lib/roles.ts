export type RoleDetail = {
  id: string;
  name: string;
  status: "Active" | "Non Active";
  features: string[];
};

const FEATURE_LIBRARY = [
  "Subjects Management",
  "Teachers Management",
  "Classes Management",
  "Students Report Management",
  "Payment Administration",
  "School Settings",
  "System Settings",
  "School Profile",
];

const BASE_ROLES: RoleDetail[] = [
  {
    id: "admin",
    name: "Admin",
    status: "Active",
    features: FEATURE_LIBRARY,
  },
  {
    id: "secondary-admin",
    name: "Secondary Admin",
    status: "Active",
    features: FEATURE_LIBRARY.slice(0, 6),
  },
  {
    id: "subjects-teachers-admin",
    name: "Subjects and Teachers Admin",
    status: "Active",
    features: FEATURE_LIBRARY.slice(0, 5),
  },
  {
    id: "students-report-admin",
    name: "Students Report Admin",
    status: "Active",
    features: FEATURE_LIBRARY.slice(0, 6),
  },
];

const EXTRA_NAMES = [
  "Finance Admin",
  "Library Admin",
  "Lab Admin",
  "Counseling Admin",
  "Dorm Admin",
  "Sports Admin",
  "Events Admin",
  "Transport Admin",
  "IT Support",
  "Admissions Admin",
  "Attendance Admin",
  "Curriculum Admin",
  "Schedule Admin",
  "Exams Admin",
  "Alumni Admin",
  "Health Admin",
  "Cafeteria Admin",
  "Discipline Admin",
  "Security Admin",
  "Communication Admin",
  "Procurement Admin",
];

const ROLE_DB: Record<string, RoleDetail> = {};
BASE_ROLES.forEach((role) => {
  ROLE_DB[role.id] = role;
});

EXTRA_NAMES.forEach((name, index) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `role-${index}`;
  const featuresCount = 3 + ((index + 1) % FEATURE_LIBRARY.length);
  ROLE_DB[slug] = {
    id: slug,
    name,
    status: index % 5 === 0 ? "Non Active" : "Active",
    features: FEATURE_LIBRARY.slice(0, featuresCount),
  };
});

export const ROLE_LIST: RoleDetail[] = Object.values(ROLE_DB);

export const getRoleById = (id: string): RoleDetail | undefined => ROLE_DB[id];