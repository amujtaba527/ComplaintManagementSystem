import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    const {id} = await params;
    const body = await req.json();

    if (session.user.role === "admin" && body.completion_date) {
      
      const res = await pool.query(
        `UPDATE complaints 
         SET resolution_date = $1, 
             status = 'Resolved' 
         WHERE id = $2 
         RETURNING *`,
        [body.completion_date, id]
      );

      if (res.rowCount === 0) {
        return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
      }

      return NextResponse.json(res.rows[0]);
    }

  }catch (error) {
    return NextResponse.json({ error: "Error updating complaint" + error }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id } =  await params;
    const { details } = await req.json();

    const query = "UPDATE complaints SET details = $1 WHERE id = $2 AND user_id = $3 RETURNING *";
    const res = await pool.query(query, [details, id, session.user.id]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Error updating complaint" + error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const {id} = await params;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const res = await pool.query("DELETE FROM complaints WHERE id = $1 AND user_id = $2 RETURNING *", [
      id,
      session.user.id,
    ]);

    if (res.rowCount === 0) return NextResponse.json({ error: "Not found or unauthorized" }, { status: 403 });

    return NextResponse.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting complaint" + error }, { status: 500 });
  }
}