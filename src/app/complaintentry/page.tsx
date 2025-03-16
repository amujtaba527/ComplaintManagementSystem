import ComplaintForm from "@/components/ComplaintForm";
import ComplaintTable from "@/components/ComplaintTable";

export default function Dashboard() {
  return (
    <div className="flex">
      <div className="flex-1">
        <main className="p-4">
          <h2 className="text-xl font-bold mb-4">User Dashboard</h2>
          <ComplaintTable />
        </main>
      </div>
    </div>
  );
}
