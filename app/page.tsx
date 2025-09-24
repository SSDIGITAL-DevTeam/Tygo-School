export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">School Management Demo</h1>
      <p className="mb-4">Open the Edit Admin page:</p>
      <a className="text-purple-700 underline" href="/role-access/admin/123/edit">
        /role-access/admin/123/edit
      </a>
    </main>
  );
}

