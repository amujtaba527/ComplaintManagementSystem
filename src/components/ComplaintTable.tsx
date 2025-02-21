"use client";
import { useEffect, useState } from "react";
import { Complaint } from "@/types/types";
import { useSession } from "next-auth/react";

export default function ComplaintTable() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [details, setDetails] = useState("");

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`/api/complaints`);
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchComplaints();
    }

    window.addEventListener('newComplaint', () => {
      fetchComplaints();
    });

    return () => {
      window.removeEventListener('newComplaint', () => {
        fetchComplaints();
      });
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
        console.error('Error deleting complaint:', error);
      }
    }
  };

  const handleEdit = async (id: number) => {
    if (!editingComplaint) return;
    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ details: details }),
      });
      if (response.ok) {
        setEditingComplaint(null);
        setDetails("");
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 shadow rounded mt-4 overflow-x-auto">
      <h3 className="text-lg text-black font-bold mb-2">Your Complaints</h3>
      <div className="min-w-full">
        {/* Desktop View */}
        <table className="w-full border hidden md:table">
          <thead>
            <tr className="bg-gray-200">
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
                <td className="border text-black p-2">{complaint.building}</td>
                <td className="border text-black p-2">{complaint.floor}</td>
                <td className="border text-black p-2">{complaint.area_name}</td>
                <td className="border text-black p-2">{complaint.complaint_type_name}</td>
                <td className="border text-black p-2">
                  {editingComplaint?.id === complaint.id ? (
                    <input
                      type="text"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    complaint.details
                  )}
                </td>
                <td className="border text-black p-2">{complaint.status}</td>
                <td className="border text-black p-2">
                  {editingComplaint?.id === complaint.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(complaint.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingComplaint(null);
                          setDetails("");
                        }}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingComplaint(complaint);
                          setDetails(complaint.details);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
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
                {editingComplaint?.id === complaint.id ? (
                  <input
                    type="text"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full p-1 border rounded mt-1"
                  />
                ) : (
                  <p>{complaint.details}</p>
                )}
              </div>
              
              <div className="mb-3">
                <p className="font-semibold text-sm text-black">Status</p>
                <p>{complaint.status}</p>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                {editingComplaint?.id === complaint.id ? (
                  <>
                    <button
                      onClick={() => handleEdit(complaint.id)}
                      className="bg-green-500 text-white px-3 py-1.5 rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingComplaint(null);
                        setDetails("");
                      }}
                      className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingComplaint(complaint);
                        setDetails(complaint.details);
                      }}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

