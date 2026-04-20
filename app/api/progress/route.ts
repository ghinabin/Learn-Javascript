import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/progress?slug=color-flipper
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ completedSteps: [] });
  }

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const row = await db.userProgress.findUnique({
    where: { userId_projectSlug: { userId: session.user.id, projectSlug: slug } },
  });

  return NextResponse.json({ completedSteps: row?.completedSteps ?? [] });
}

// POST /api/progress  body: { slug, completedSteps }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });
  }

  const { slug, completedSteps } = await req.json() as {
    slug: string;
    completedSteps: string[];
  };

  if (!slug || !Array.isArray(completedSteps)) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  await db.userProgress.upsert({
    where: { userId_projectSlug: { userId: session.user.id, projectSlug: slug } },
    create: { userId: session.user.id, projectSlug: slug, completedSteps },
    update: { completedSteps },
  });

  return NextResponse.json({ ok: true });
}
