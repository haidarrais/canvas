import { Suspense } from "react";
import WorkspaceClient from "./WorkspaceClient";

export default async function WorkspacePage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const sp = await searchParams;
  return (
    <Suspense>
      <WorkspaceClient initialId={sp?.id ?? null} />
    </Suspense>
  );
}
