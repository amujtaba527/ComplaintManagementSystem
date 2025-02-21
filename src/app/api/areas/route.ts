import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const res = await pool.query("SELECT * FROM areas ORDER BY area_name ASC");
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching areas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (!body || !body.name || typeof body.name !== "string") {
      return NextResponse.json({ error: "Invalid area name" }, { status: 400 });
    }

    const res = await pool.query("INSERT INTO areas (area_name) VALUES ($1) RETURNING *", [body.name]);

    return NextResponse.json({ message: "Area added successfully", area: res.rows[0] });
  } catch (error) {
    console.error("Error adding area:", error);
    return NextResponse.json({ error: "Error adding area" }, { status: 500 });
  }
}