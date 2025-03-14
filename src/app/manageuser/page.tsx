import ManageUsers from "@/components/ManageUsers";
import React from "react";

export default function AdminPanel() {
  return (
    <div className="flex">
      <div className="flex-1">
        <main className="p-4">
          <ManageUsers />
        </main>
      </div>
    </div>
  );
}
