import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AdminRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Secondary Admin" | "Subjects and Teachers Admin" | "Students Report Admin";
  features: number; // count of accessible features (0..6)
  status: "Active" | "Non Active";
};

function makeAdmins(): AdminRow[] {
  const seed: AdminRow[] = [
    { id: "a-1001", name: "Meijiko", email: "meijiko@gmail.com", role: "Admin", features: 6, status: "Active" },
    { id: "a-1002", name: "Ryan Kusuma", email: "ryan@gmail.com", role: "Secondary Admin", features: 4, status: "Active" },
    { id: "a-1003", name: "Heriyanto", email: "heriyanto@gmail.com", role: "Subjects and Teachers Admin", features: 4, status: "Non Active" },
    { id: "a-1004", name: "Imroatus", email: "imroatus@gmail.com", role: "Students Report Admin", features: 5, status: "Non Active" },
  ];
  const names = [
    "Dafa Aulia", "Citra Ayu", "Budi Santoso", "Fajar Ramadhan", "Gita Savitri",
    "Andi Wijaya", "Maya Fitri", "Rudi Hartono", "Dewi Lestari", "Rangga Saputra",
    "Intan Permata", "Joko Susilo", "Lutfi Kurnia", "Mawar Melati", "Naufal Rizky",
    "Agus Salim", "Siti Nurhaliza", "Doni Pratama", "Eka Putri", "Halim Perdana",
  ];
  const roles: AdminRow["role"][] = [
    "Admin",
    "Secondary Admin",
    "Subjects and Teachers Admin",
    "Students Report Admin",
  ];
  let i = 0;
  while (seed.length < 40) {
    const name = names[i % names.length];
    const role = roles[i % roles.length];
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
    const features = 3 + (i % 4);
    const status = i % 3 === 0 ? "Non Active" : "Active";
    seed.push({ id: `a-${2000 + i}`, name, email, role, features, status });
    i++;
  }
  return seed;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = makeAdmins();
  const row = list.find((r) => r.id === id);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(row);
}
