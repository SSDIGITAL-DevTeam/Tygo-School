export type ClassStatus = "Active" | "Non Active";

export type ClassRecord = {
  name: string;
  homeroomTeacher: string;
  capacity: number | null;
  totalStudents: number;
  totalSubjects: number;
  status: ClassStatus;
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

const CLASS_CACHE: ClassRecord[] = buildClassCache();

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

export function getClassList(): ClassRecord[] {
  return CLASS_CACHE.map((row) => ({ ...row }));
}

export const CLASS_STATUS_FILTERS: Array<"All" | ClassStatus> = [
  "All",
  "Active",
  "Non Active",
];
