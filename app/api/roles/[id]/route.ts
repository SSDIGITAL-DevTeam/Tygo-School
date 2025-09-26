export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  console.log("Delete role", id);
  return Response.json({ ok: true, id });
}