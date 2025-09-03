import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id } = await params;
    const data = await req.json();
    const { date, building } = data;

    const query = `
      UPDATE complaints 
      SET date = $1, 
          building = $2
      WHERE id = $3 AND user_id = $4 
      RETURNING *
    `;
    
    const res = await pool.query(query, [date,building,id,session.user.id]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error updating complaint" + error }, { status: 500 });
  }
}