import ComplaintTable from "@/components/ComplaintTable";

export default function Dashboard() {
  return (
    <div className="flex">
      <div className="flex-1">
        <main className="p-4">
          <ComplaintTable />
        </main>
      </div>
    </div>
  );
}
