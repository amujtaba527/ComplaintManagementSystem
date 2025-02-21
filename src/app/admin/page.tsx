import ManageUsers from "@/components/ManageUsers";
import ManageAreas from "@/components/ManageAreas";
import ManageComplaintTypes from "@/components/ManageComplaintTypes";

export default function AdminPanel() {
  return (
    <div className="flex">
      <div className="flex-1">
        <main className="p-4">
          <h2 className="text-xl text-black font-bold mb-4">Admin Panel</h2>
          <ManageUsers />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ManageAreas />
            <ManageComplaintTypes />
          </div>
        </main>
      </div>
    </div>
  );
}
