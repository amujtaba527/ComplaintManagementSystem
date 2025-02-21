import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
      const { id, role } = await req.json();
  
      if (!["admin", "employee"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
  
      await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, id]);
      return NextResponse.json({ message: "User role updated successfully" });
    } catch (error) {
      return NextResponse.json({ error: "Error updating user role" }, { status: 500 });
    }
  }
  
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const {id} = await params;
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
      const userId = Number(id); 
  
      if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
  
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
      return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
    }
  }
  