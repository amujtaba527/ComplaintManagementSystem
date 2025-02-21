import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Complaint } from "@/types/types";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    
    const user_id = session.user.id;
    const baseQuery = `
      SELECT 
        c.*,
        a.area_name,
        ct.type_name as complaint_type_name
      FROM complaints c
      LEFT JOIN areas a ON c.area_id = a.id
      LEFT JOIN complaint_types ct ON c.complaint_type_id = ct.id
    `;

    let query;
    if (session.user.role === "admin") {
      query = `${baseQuery} ORDER BY c.date DESC`;
      const res = await pool.query<Complaint>(query);
      return NextResponse.json(res.rows);
    } else {
      query = `${baseQuery} WHERE c.user_id = $1 ORDER BY c.date DESC`;
      const res = await pool.query<Complaint>(query, [user_id]);
      return NextResponse.json(res.rows);
    }
  } catch (error) {
    return NextResponse.json({ error: "Error fetching complaints" + error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { building, floor, area_id, complaint_type_id, details } = data;
    const user_id = session.user.id;

    if (!building || !floor || !area_id || !complaint_type_id || !details) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const query = `
      INSERT INTO complaints (user_id, building, floor, area_id, complaint_type_id, details, status) 
      VALUES ($1, $2, $3, $4, $5, $6, 'In-Progress') RETURNING *;
    `;

    const values = [user_id, building, floor, area_id, complaint_type_id, details];
    const res = await pool.query(query, values);

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error submitting complaint" + error }, { status: 500 });
  }
}
