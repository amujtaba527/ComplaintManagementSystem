"use client";
import { useEffect, useState } from "react";
import { Complaint } from "@/types/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AdminComplaintTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [complaintToResolve, setComplaintToResolve] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/complaints")
      .then((res) => res.json())
      .then((data) => setComplaints(data));
  }, []);

  const markAsResolved = async (id: number) => {
    if (!selectedDate) return;

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completion_date: selectedDate.toISOString() }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error('Failed to mark complaint as resolved');
      }

      // Refresh complaints list
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Resolved" } : c))
      );
      
      // Reset the date picker and selected complaint
      setSelectedDate(null);
      setComplaintToResolve(null);
    } catch (error) {
      alert('Failed to mark complaint as resolved' + error);
    }
  };

  return (
    <div className="bg-white p-2 sm:p-4 shadow rounded mt-4">
      <h3 className="text-lg font-bold text-black mb-2">All Complaints</h3>
      
      {/* Table view for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">Building</th>
              <th className="border p-2 text-black">Floor</th>
              <th className="border p-2 text-black">Area</th>
              <th className="border p-2 text-black">Type</th>
              <th className="border p-2 text-black">Details</th>
              <th className="border p-2 text-black">Status</th>
              <th className="border p-2 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint: Complaint) => (
              <tr key={complaint.id} className="border">
                <td className="border p-2 text-black">{complaint.building}</td>
                <td className="border p-2 text-black">{complaint.floor}</td>
                <td className="border p-2 text-black">{complaint.area_name}</td>
                <td className="border p-2 text-black">{complaint.complaint_type_name}</td>
                <td className="border p-2 text-black max-w-[200px] truncate">{complaint.details}</td>
                <td className="border p-2 text-black">{complaint.status}</td>
                <td className="p-2">
                  {complaint.status !== "Resolved" && (
                    <div className="flex items-center gap-2">
                      {complaintToResolve === complaint.id ? (
                        <>
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="border p-1 rounded"
                            placeholderText="Select date"
                          />
                          <button
                            onClick={() => markAsResolved(complaint.id)}
                            disabled={!selectedDate}
                            className="bg-green-500 text-white p-1 rounded disabled:bg-gray-400"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setComplaintToResolve(null);
                              setSelectedDate(null);
                            }}
                            className="bg-red-500 text-white p-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setComplaintToResolve(complaint.id)}
                          className="bg-green-500 text-white p-1 rounded"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for small screens */}
      <div className="md:hidden space-y-4">
        {complaints.map((complaint: Complaint) => (
          <div key={complaint.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold text-black">Building</p>
                <p className="text-black">{complaint.building}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Floor</p>
                <p className="text-black">{complaint.floor}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Area</p>
                <p className="text-black">{complaint.area_name}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Type</p>
                <p className="text-black">{complaint.complaint_type_name}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-black">Details</p>
                <p className="break-words text-black">{complaint.details}</p>
              </div>
              <div>
                <p className="font-semibold text-black">Status</p>
                <p className="text-black">{complaint.status}</p>
              </div>
            </div>
            
            {complaint.status !== "Resolved" && (
              <div className="mt-4 space-y-2">
                {complaintToResolve === complaint.id ? (
                  <div className="space-y-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => setSelectedDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="border p-2 rounded w-full"
                      placeholderText="Select date"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => markAsResolved(complaint.id)}
                        disabled={!selectedDate}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setComplaintToResolve(null);
                          setSelectedDate(null);
                        }}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setComplaintToResolve(complaint.id)}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
