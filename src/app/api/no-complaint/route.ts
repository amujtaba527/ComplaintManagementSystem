import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { building } = data;
    const user_id = session.user.id;
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-CA');

    if (!building) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const query = `
      INSERT INTO complaints (user_id, building, floor, area_id, complaint_type_id, details, status, action, resolution_date, seen) 
      VALUES ($1, $2, 'No Complaint', 999, 999, 'No Complaint', 'No Complaint', 'No Complaint', $3,true) RETURNING *;
    `;

    const values = [user_id, building, formattedDate];
    const res = await pool.query(query, values);

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error submitting complaint" + error }, { status: 500 });
  }
}