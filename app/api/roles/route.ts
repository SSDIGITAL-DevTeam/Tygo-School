import { NextResponse } from "next/server";

type RolePayload = {
  name: string;
  features: string[];
  active: boolean;
};

export async function POST(req: Request) {
  let body: RolePayload | null = null;
  try {
    body = (await req.json()) as RolePayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!body?.name || typeof body.name !== "string") {
    return NextResponse.json({ message: "Role name is required" }, { status: 400 });
  }

  // Contoh validasi nama unik (simulasi)
  if (body.name.trim().toLowerCase() === "admin") {
    return NextResponse.json({ message: "Role name already exists" }, { status: 409 });
  }

  // TODO: simpan ke DB di sini

  return NextResponse.json(
    {
      id: "role_123",
      name: body.name.trim(),
      features: body.features ?? [],
      active: !!body.active,
    },
    { status: 201 }
  );
}
