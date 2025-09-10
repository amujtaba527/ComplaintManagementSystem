import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
  
  export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const {id} = await params;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const complaintSeenId = Number(id);
    if (isNaN(complaintSeenId)) {
      return NextResponse.json({ error: "Invalid complaint seen ID" }, { status: 400 });
    }
      const res = await pool.query("DELETE FROM complaint_seen WHERE id = $1 RETURNING *", [complaintSeenId]);
      if (res.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ message: "Complaint seen deleted successfully" });
    } catch (error) {
      return NextResponse.json({ error: "Error deleting complaint seen" + error }, { status: 500 });
    }
  }
  