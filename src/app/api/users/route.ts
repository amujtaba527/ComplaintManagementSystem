import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { VALID_ROLES } from "@/utils/constants";

export async function GET() {
  try {
    const res = await pool.query("SELECT id, name, email, role FROM users ORDER BY created_at DESC");
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users" + error }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error adding user" + error }, { status: 500 });
  }
}
