export type SubjectStatus = "Active" | "Non Active";

export type SubjectRecord = {
  code: string;
  name: string;
  description: string;
  status: SubjectStatus;
};

const BASE_SUBJECTS: SubjectRecord[] = [
  {
    code: "BIO001",
    name: "Biologi 01",
    description: "Biologi Grade 1",
    status: "Active",
  },
  {
    code: "BIO002",
    name: "Biologi 02",
    description: "Biologi Grade 2",
    status: "Active",
  },
  {
    code: "ENG001",
    name: "English 01",
    description: "English Grade 1",
    status: "Non Active",
  },
  {
    code: "ENG002",
    name: "English 02",
    description: "English Grade 2",
    status: "Non Active",
  },
];

const EXTRA_NAMES: Array<{
  codePrefix: string;
  name: string;
  description: string;
}> = [
  { codePrefix: "MTH", name: "Matematika", description: "Mathematics" },
  { codePrefix: "SCI", name: "Science", description: "Integrated Science" },
  { codePrefix: "PHY", name: "Physics", description: "Physics" },
  { codePrefix: "CHM", name: "Chemistry", description: "Chemistry" },
  { codePrefix: "GEO", name: "Geography", description: "Geography" },
  { codePrefix: "HIS", name: "History", description: "World History" },
  { codePrefix: "ART", name: "Art", description: "Fine Arts" },
  { codePrefix: "MUS", name: "Music", description: "Music Theory" },
  { codePrefix: "PE", name: "Physical Education", description: "Sports" },
  { codePrefix: "CIT", name: "Civics", description: "Citizenship" },
];

const SUBJECT_CACHE: SubjectRecord[] = buildSubjectCache();

function buildSubjectCache(): SubjectRecord[] {
  const rows: SubjectRecord[] = [...BASE_SUBJECTS];
  let index = 0;
  let grade = 1;

  while (rows.length < 25) {
    const template = EXTRA_NAMES[index % EXTRA_NAMES.length];
    const paddedGrade = grade.toString().padStart(2, "0");
    rows.push({
      code: `${template.codePrefix}${paddedGrade}`,
      name: `${template.name} ${paddedGrade}`,
      description: `${template.description} Grade ${grade}`,
      status: index % 4 === 0 ? "Non Active" : "Active",
    });
    index += 1;
    grade = grade === 6 ? 1 : grade + 1;
  }

  return rows;
}

export function getSubjectList(): SubjectRecord[] {
  return SUBJECT_CACHE.map((row) => ({ ...row }));
}

export const SUBJECT_STATUS_FILTERS: Array<"All" | SubjectStatus> = [
  "All",
  "Active",
  "Non Active",
];
