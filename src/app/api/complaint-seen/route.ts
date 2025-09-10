import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { complaint_id } = await req.json();
    const res = await pool.query("INSERT INTO complaint_seen (user_id, complaint_id) VALUES ($1, $2) RETURNING *", [session.user.id, complaint_id]);
    await pool.query("UPDATE complaints SET seen = true WHERE id = $1", [complaint_id]);
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error adding complaint seen" + error }, { status: 500 });
  }
}

