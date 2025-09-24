export type ClassStatus = "Active" | "Non Active";

export type ClassSubjectRecord = {
  code: string;
  name: string;
  description: string;
};

export type StudentFlagColor = "green" | "yellow" | "red";

export type ClassStudentRecord = {
  id: string;
  name: string;
  email: string | null;
  currentClass: string;
  flag: StudentFlagColor;
};

export type ClassReportFormatRecord = {
  id: string;
  title: string;
  createdAt: string;
};

export type ClassRecord = {
  name: string;
  homeroomTeacher: string;
  capacity: number | null;
  totalStudents: number;
  totalSubjects: number;
  status: ClassStatus;
};

export type ClassDetailRecord = ClassRecord & {
  subjects: ClassSubjectRecord[];
  students: ClassStudentRecord[];
  reportFormats: ClassReportFormatRecord[];
};

const BASE_CLASSES: ClassRecord[] = [
  {
    name: "XI-A",
    homeroomTeacher: "Dafa Aulia",
    capacity: 40,
    totalStudents: 34,
    totalSubjects: 6,
    status: "Active",
  },
  {
    name: "XI-B",
    homeroomTeacher: "Ryan Kusuma",
    capacity: 40,
    totalStudents: 30,
    totalSubjects: 6,
    status: "Active",
  },
  {
    name: "X-A",
    homeroomTeacher: "Heriyanto",
    capacity: null,
    totalStudents: 0,
    totalSubjects: 0,
    status: "Non Active",
  },
  {
    name: "X-B",
    homeroomTeacher: "Ryan Kusuma",
    capacity: null,
    totalStudents: 0,
    totalSubjects: 0,
    status: "Non Active",
  },
];

const HOMEROOM_POOL = [
  "Dafa Aulia",
  "Ryan Kusuma",
  "Heriyanto",
  "Siti Rahma",
  "Adi Nugraha",
  "Laras Wibowo",
  "Nurul Hakim",
  "Slamet Widodo",
  "Intan Permata",
  "Bima Pratama",
];

const LEVELS = ["VII", "VIII", "IX", "X", "XI", "XII"];
const SECTION_CODES = ["A", "B", "C", "D", "E", "F"];

const SUBJECT_LIBRARY = [
  { code: "BIO", name: "Biologi", description: "Biologi Grade" },
  { code: "CHE", name: "Chemistry", description: "Chemistry Grade" },
  { code: "ENG", name: "English", description: "English Grade" },
  { code: "MAT", name: "Mathematics", description: "Mathematics Grade" },
  { code: "PHY", name: "Physics", description: "Physics Grade" },
  { code: "HIS", name: "History", description: "History Grade" },
  { code: "GEO", name: "Geography", description: "Geography Grade" },
  { code: "CIV", name: "Civics", description: "Civics Grade" },
  { code: "ECO", name: "Economics", description: "Economics Grade" },
];

const STUDENT_NAME_LIBRARY = [
  "Dimas Pratama",
  "Alya Salsabila",
  "Raka Mahendra",
  "Nadya Utami",
  "Bagas Firmansyah",
  "Siti Rahmawati",
  "Zidan Hafizh",
  "Rani Kusuma",
  "Agus Santoso",
  "Mega Putri",
  "Farhan Aziz",
  "Rizky Hidayat",
  "Naufal Ramadhan",
  "Intan Permata",
  "Fajar Nugraha",
  "Putri Ayu",
  "Lukman Hakim",
  "Adinda Maharani",
  "Bima Saputra",
  "Salsa Anindita",
];

const STUDENT_EMAIL_LIBRARY: Array<string | null> = [
  "budi@example.com",
  "alya@example.com",
  "raka@example.com",
  "nadya@example.com",
  "bagas@example.com",
  "siti@example.com",
  "zidan@example.com",
  "rani@example.com",
  "agus@example.com",
  "mega@example.com",
  "farhan@example.com",
  "rizky@example.com",
  null,
  "intan@example.com",
  "fajar@example.com",
  "putri@example.com",
  "lukman@example.com",
  "adinda@example.com",
  "bima@example.com",
  "salsa@example.com",
];

const REPORT_FORMAT_LIBRARY = [
  { id: "even-semester", title: "Even Semester Report 2024/2025", createdAt: "15 Jun 2025 - 15:32" },
  { id: "odd-semester", title: "Odd Semester Report 2024/2025", createdAt: "14 Jan 2025 - 15:32" },
  { id: "midterm-progress", title: "Mid Term Progress Report 2024/2025", createdAt: "01 Mar 2025 - 09:00" },
];

const CLASS_CACHE: ClassRecord[] = buildClassCache();
const CLASS_DETAIL_CACHE: ClassDetailRecord[] = buildClassDetailCache();

function buildClassCache(): ClassRecord[] {
  const rows: ClassRecord[] = [...BASE_CLASSES];
  const target = 25;
  let index = 0;

  while (rows.length < target) {
    const level = LEVELS[index % LEVELS.length];
    const section = SECTION_CODES[index % SECTION_CODES.length];
    const name = `${level}-${section}`;
    const homeroomTeacher = HOMEROOM_POOL[index % HOMEROOM_POOL.length];

    const totalStudents = index % 6 === 3 ? 0 : 22 + ((index * 5) % 15);
    const capacityCandidate = 32 + ((index * 3) % 10);
    const capacity = index % 6 === 3 ? null : capacityCandidate;
    const totalSubjects = 5 + (index % 3);
    const status: ClassStatus = index % 5 === 0 || index % 6 === 3 ? "Non Active" : "Active";

    rows.push({
      name,
      homeroomTeacher,
      capacity,
      totalStudents,
      totalSubjects,
      status,
    });

    index += 1;
  }

  return rows;
}

function buildClassDetailCache(): ClassDetailRecord[] {
  return CLASS_CACHE.map((row, index) => {
    const subjects = buildSubjects(row.totalSubjects, index);
    const students = buildStudents(row.totalStudents, index, row.name);
    const reportFormats = buildReportFormats(row.name, index);

    return {
      ...row,
      totalSubjects: subjects.length,
      totalStudents: students.length,
      subjects,
      students,
      reportFormats,
    };
  });
}

function buildSubjects(count: number, seed: number): ClassSubjectRecord[] {
  if (count <= 0) {
    return [];
  }

  const subjects: ClassSubjectRecord[] = [];
  for (let i = 0; i < count; i++) {
    const base = SUBJECT_LIBRARY[(seed + i) % SUBJECT_LIBRARY.length];
    const subjectNumber = ((seed + i) % 9) + 1;
    const grade = ((seed + i) % 3) + 1;
    const sequence = seed * SUBJECT_LIBRARY.length + i + 1;

    subjects.push({
      code: `${base.code}${String(sequence).padStart(3, "0")}`,
      name: `${base.name} ${String(subjectNumber).padStart(2, "0")}`,
      description: `${base.description} ${grade}`,
    });
  }

  return subjects;
}

function buildStudents(total: number, seed: number, className: string): ClassStudentRecord[] {
  if (total <= 0) {
    return [];
  }

  const namePoolSize = STUDENT_NAME_LIBRARY.length;
  const emailPoolSize = STUDENT_EMAIL_LIBRARY.length;
  const flagPalette: StudentFlagColor[] = ["yellow", "red", "green"];
  const students: ClassStudentRecord[] = [];

  for (let i = 0; i < total; i++) {
    const name = STUDENT_NAME_LIBRARY[(seed + i) % namePoolSize];
    const email = STUDENT_EMAIL_LIBRARY[(seed + i) % emailPoolSize] ?? null;
    const flag = flagPalette[(seed + i) % flagPalette.length];

    students.push({
      id: `STU${String(seed * namePoolSize + i + 1).padStart(3, "0")}`,
      name,
      email,
      currentClass: className,
      flag,
    });
  }

  return students;
}

function buildReportFormats(className: string, seed: number): ClassReportFormatRecord[] {
  const slug = slugify(className);

  return REPORT_FORMAT_LIBRARY.map((item, index) => ({
    id: `${slug}-${item.id}-${index + 1}-${seed + 1}`,
    title: item.title,
    createdAt: item.createdAt,
  }));
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function cloneDetailRecord(record: ClassDetailRecord): ClassDetailRecord {
  return {
    ...record,
    subjects: record.subjects.map((subject) => ({ ...subject })),
    students: record.students.map((student) => ({ ...student })),
    reportFormats: record.reportFormats.map((report) => ({ ...report })),
  };
}

export function getClassList(): ClassRecord[] {
  return CLASS_CACHE.map((row) => ({ ...row }));
}

export function getClassDetailByName(className?: string | null): ClassDetailRecord {
  const fallback = CLASS_DETAIL_CACHE[0];
  if (!fallback) {
    throw new Error("Class detail cache is empty");
  }

  if (!className) {
    return cloneDetailRecord(fallback);
  }

  const match = CLASS_DETAIL_CACHE.find((row) => row.name === className);
  return cloneDetailRecord(match ?? fallback);
}

export const CLASS_STATUS_FILTERS: Array<"All" | ClassStatus> = [
  "All",
  "Active",
  "Non Active",
];
