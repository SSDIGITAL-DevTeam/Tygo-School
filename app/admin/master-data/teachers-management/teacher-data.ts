export type TeacherStatus = "Active" | "Non Active";

export type TeacherRecord = {
  id: string;
  fullName: string;
  email: string;
  subjects: string[];
  homeroomClass: string | null;
  status: TeacherStatus;
  phonePrefix: string | null;
  phoneNumber: string | null;
};

const BASE_FEATURED_ROWS: TeacherRecord[] = [
  {
    id: "123456",
    fullName: "Dafa Aulia",
    email: "dafa@gmail.com",
    subjects: ["Math 01", "English 01"],
    homeroomClass: "VII-A",
    status: "Active",
    phonePrefix: "+62",
    phoneNumber: "72833817281",
  },
  {
    id: "789012",
    fullName: "Ryan Kusuma",
    email: "ryan@gmail.com",
    subjects: ["English 02"],
    homeroomClass: "IX-A",
    status: "Active",
    phonePrefix: "+62",
    phoneNumber: "81234567890",
  },
  {
    id: "345678",
    fullName: "Heriyanto",
    email: "heriyanto@gmail.com",
    subjects: ["Math 01", "Programming 02"],
    homeroomClass: null,
    status: "Non Active",
    phonePrefix: "+62",
    phoneNumber: "87765432100",
  },
  {
    id: "901234",
    fullName: "Imroatus",
    email: "imroatus@gmail.com",
    subjects: ["Programming 01"],
    homeroomClass: null,
    status: "Non Active",
    phonePrefix: "+62",
    phoneNumber: "81230011223",
  },
];

const BASE_LEADING_ROWS: TeacherRecord[] = [
  {
    id: "102345",
    fullName: "Anisa Putri",
    email: "anisa.putri@school.id",
    subjects: ["Math 02"],
    homeroomClass: "VII-B",
    status: "Active",
    phonePrefix: "+62",
    phoneNumber: "81922334455",
  },
  {
    id: "104221",
    fullName: "Bambang Maulana",
    email: "bambang.maulana@school.id",
    subjects: ["Science 01"],
    homeroomClass: "VIII-A",
    status: "Active",
    phonePrefix: "+62",
    phoneNumber: "81299887766",
  },
  {
    id: "105987",
    fullName: "Citra Dewi",
    email: "citra.dewi@school.id",
    subjects: ["English 01"],
    homeroomClass: "IX-B",
    status: "Active",
    phonePrefix: "+62",
    phoneNumber: "85211223344",
  },
  {
    id: "108002",
    fullName: "Doni Saputra",
    email: "doni.saputra@school.id",
    subjects: ["Programming 01"],
    homeroomClass: null,
    status: "Non Active",
    phonePrefix: "+62",
    phoneNumber: "87866778899",
  },
];

const EXTRA_NAMES = [
  "Eka Pratama",
  "Fajar Ramdhan",
  "Gita Lestari",
  "Herman Wijaya",
  "Indah Kartika",
  "Joko Santoso",
  "Kirana Safira",
  "Lutfi Rahman",
  "Maya Anggraini",
  "Nurul Mawar",
  "Oskar Firmansyah",
  "Putri Prawita",
  "Qori Safitri",
  "Raka Prakoso",
  "Sari Winata",
  "Taufik Hidayat",
  "Usman Halim",
  "Vera Damayanti",
  "Wahyu Saputra",
  "Yani Marlina",
  "Zaki Kurniawan",
];

const SUBJECT_COMBOS: string[][] = [
  ["Math 01"],
  ["English 01"],
  ["Math 01", "Physics 01"],
  ["Biology 01"],
  ["Chemistry 01"],
  ["Programming 01"],
  ["Programming 02"],
  ["Design 01"],
  ["Art 01"],
  ["Math 02", "English 02"],
];

const HOMEROOM_POOL: Array<string | null> = [
  "VII-A",
  "VII-B",
  "VIII-A",
  "VIII-B",
  "IX-A",
  "IX-B",
  null,
  null,
];

export const PHONE_PREFIXES = ["+62", "+60", "+65", "+91"] as const;

const TEACHER_CACHE: TeacherRecord[] = buildTeacherCache();

function slugifyName(name: string, fallback: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/(^\.+|\.+$)/g, "");
  return slug || fallback;
}

function buildTeacherCache(): TeacherRecord[] {
  const rows: TeacherRecord[] = [...BASE_LEADING_ROWS, ...BASE_FEATURED_ROWS];
  let i = 0;
  while (rows.length < 25) {
    const name = EXTRA_NAMES[i % EXTRA_NAMES.length];
    const subjects = SUBJECT_COMBOS[i % SUBJECT_COMBOS.length];
    const homeroomClass = HOMEROOM_POOL[i % HOMEROOM_POOL.length] ?? null;
    const id = (640000 + i * 7).toString().padStart(6, "0");
    const phonePrefix = PHONE_PREFIXES[i % PHONE_PREFIXES.length];
    const phoneNumber = `${82000000000 + i * 12345}`;
    rows.push({
      id,
      fullName: name,
      email: `${slugifyName(name, `teacher${i}`)}@schoolmail.id`,
      subjects,
      homeroomClass,
      status: i % 6 === 0 ? "Non Active" : "Active",
      phonePrefix,
      phoneNumber,
    });
    i += 1;
  }
  return rows;
}

export function getTeacherList(): TeacherRecord[] {
  return TEACHER_CACHE.map((teacher) => ({
    ...teacher,
    subjects: [...teacher.subjects],
  }));
}

export function getTeacherById(id: string): TeacherRecord | null {
  const teacher = TEACHER_CACHE.find((row) => row.id === id);
  return teacher
    ? {
        ...teacher,
        subjects: [...teacher.subjects],
      }
    : null;
}

export function formatTeacherPhone(record: TeacherRecord): string {
  const { phonePrefix, phoneNumber } = record;
  if (!phonePrefix && !phoneNumber) {
    return "--";
  }
  if (!phonePrefix) {
    return phoneNumber ?? "--";
  }
  if (!phoneNumber) {
    return phonePrefix;
  }
  return `${phonePrefix} ${chunkPhone(phoneNumber)}`;
}

function chunkPhone(phone: string): string {
  return phone.replace(/[^0-9]+/g, "").replace(/(\d{3,4})(?=\d)/g, '$1 ');
}

export const SUBJECT_OPTIONS = Array.from(
  new Set(
    TEACHER_CACHE.flatMap((teacher) => teacher.subjects)
  )
).sort();
