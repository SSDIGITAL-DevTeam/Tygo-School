export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received role payload", body);
  return Response.json({ ok: true, id: crypto.randomUUID() });
}
