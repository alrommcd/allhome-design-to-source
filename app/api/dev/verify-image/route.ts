import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getProductById } from "@/lib/catalog";
import type { ImageStatus } from "@/lib/types";

const CATALOG_PATH = path.join(process.cwd(), "lib", "catalog.ts");
const VALID_STATUSES: ImageStatus[] = ["verified", "representative", "pending"];

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This dev-only tool writes to source files on disk and is disabled in production." },
      { status: 403 },
    );
  }

  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || !status || !VALID_STATUSES.includes(status as ImageStatus)) {
    return NextResponse.json(
      { error: 'Body must include { id: string, status: "verified" | "representative" | "pending" }.' },
      { status: 400 },
    );
  }

  const product = getProductById(id);
  if (!product) {
    return NextResponse.json({ error: `No product with id "${id}" in the catalog.` }, { status: 404 });
  }

  const text = fs.readFileSync(CATALOG_PATH, "utf8");
  const idMarker = `id: "${id}"`;
  const idIdx = text.indexOf(idMarker);
  if (idIdx === -1) {
    return NextResponse.json({ error: `Could not locate id "${id}" in catalog.ts.` }, { status: 500 });
  }

  const fieldName = 'imageStatus: "';
  const fieldIdx = text.indexOf(fieldName, idIdx);
  if (fieldIdx === -1) {
    return NextResponse.json({ error: `Could not locate imageStatus field for "${id}".` }, { status: 500 });
  }

  const valueStart = fieldIdx + fieldName.length;
  const valueEnd = text.indexOf('"', valueStart);
  if (valueEnd === -1) {
    return NextResponse.json({ error: `Malformed imageStatus field for "${id}".` }, { status: 500 });
  }

  const newText = text.slice(0, valueStart) + status + text.slice(valueEnd);
  fs.writeFileSync(CATALOG_PATH, newText);

  return NextResponse.json({ ok: true, id, status });
}
