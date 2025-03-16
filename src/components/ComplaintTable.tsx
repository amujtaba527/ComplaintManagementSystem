"use client";
import { useEffect, useState } from "react";
import { Complaint } from "@/types/types";
import { useSession } from "next-auth/react";
import ComplaintForm from "./ComplaintForm";

export default function ComplaintTable() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`/api/complaints`);
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      alert('Error fetching complaints' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchComplaints();
    }

    const handleNewComplaint = () => {
      fetchComplaints();
    };

    window.addEventListener('newComplaint', handleNewComplaint);
    return () => {
      window.removeEventListener('newComplaint', handleNewComplaint);
    };
  }, [session]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        const response = await fetch(`/api/complaints/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchComplaints();
        }
      } catch (error) {
        alert('Error deleting complaint' + error);
      }
    }
  };

  if (loading) {
    return <div className="text-black">Loading...</div>;
  }

  return (
    <div>
      <ComplaintForm 
        editingComplaint={editingComplaint}
        setEditingComplaint={setEditingComplaint}
      />
      
      <div className="bg-white p-4 shadow rounded mt-4 overflow-x-auto">
        <h3 className="text-lg text-black font-bold mb-2">Your Complaints</h3>
        <div className="min-w-full">
          {/* Desktop View */}
          <table className="w-full border hidden md:table">
            <thead>
              <tr className="bg-gray-200">
                <th className="border text-black p-2">Date</th>
                <th className="border text-black p-2">Building</th>
                <th className="border text-black p-2">Floor</th>
                <th className="border text-black p-2">Area</th>
                <th className="border text-black p-2">Type</th>
                <th className="border text-black p-2">Details</th>
                <th className="border text-black p-2">Status</th>
                <th className="border text-black p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="border">
                  <td className="border text-black p-2">{new Date(complaint.date).toDateString()}</td>
                  <td className="border text-black p-2">{complaint.building}</td>
                  <td className="border text-black p-2">{complaint.floor}</td>
                  <td className="border text-black p-2">{complaint.area_name}</td>
                  <td className="border text-black p-2">{complaint.complaint_type_name}</td>
                  <td className="border text-black p-2">{complaint.details}</td>
                  <td className={`border text-black p-2 ${complaint.status === "Resolved" ? "bg-green-200" : "bg-red-200"}`}>
                    {complaint.status}
                  </td>
                  <td className="border text-black p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingComplaint(complaint)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      {session?.user.role === "admin" && (
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="border text-black rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <p className="font-semibold text-sm text-black">Date</p>
                    <p>{new Date(complaint.date).toDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">Building</p>
                    <p>{complaint.building}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">Floor</p>
                    <p>{complaint.floor}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">Area</p>
                    <p>{complaint.area_name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">Type</p>
                    <p>{complaint.complaint_type_name}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="font-semibold text-sm text-black">Details</p>
                  <p>{complaint.details}</p>
                </div>
                
                <div className="mb-3">
                  <p className="font-semibold text-sm text-black">Status</p>
                  <p>{complaint.status}</p>
                </div>

                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={() => setEditingComplaint(complaint)}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm"
                  >
                    Edit
                  </button>
                  {/* Only visible to admins */}
                  {session?.user?.role === 'admin' && (
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

