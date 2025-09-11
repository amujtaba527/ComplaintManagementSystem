"use client";
import { useEffect, useState } from "react";
import { Complaint } from "@/types/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSession } from "next-auth/react";
import {CircleCheck, Eye,EyeOff} from 'lucide-react';

export default function ComplaintActionTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [complaintToResolve, setComplaintToResolve] = useState<number | null>(null);
  const [actionTaken, setActionTaken] = useState<string>("");

  const { data: session } = useSession();

  const userRole = session?.user?.role;

  useEffect(() => {
    fetch("/api/complaintaction")
      .then((res) => res.json())
      .then((data) => setComplaints(data));
  }, []);

  const markAsResolved = async (id: number) => {
    if (!selectedDate || !actionTaken) return;

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ resolution_date: selectedDate.toISOString(), action: actionTaken }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error('Failed to mark complaint as resolved');
      }

      // Refresh complaints list
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Resolved", action: actionTaken } : c))
      );
      
      // Reset the date picker, action input, and selected complaint
      setSelectedDate(null);
      setActionTaken("");
      setComplaintToResolve(null);
    } catch (error) {
      alert('Failed to mark complaint as resolved' + error);
    }
  };

  const markAsSeen = async(id:number)=>{
    try{
      const response = await fetch(`/api/complaint-seen/`, {
        method: "POST",
        body: JSON.stringify({ seen_by: session?.user?.id, seen_date: new Date().toISOString(), complaint_id: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error('Failed to mark complaint as seen');
      }

      // Refresh complaints list
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, seen: true } : c))
      );
    }
    catch(error){
      alert('Failed to mark complaint as seen' + error);
    }
  }

  // Complaints visible in the table based on current user's role (mirrors table filters)
  const visibleComplaints: Complaint[] = userRole === "manager"
    ? complaints.filter((c) => c.status === "In-Progress" && c.complaint_type_name !== "IT Issues")
    : userRole === "it_manager"
      ? complaints.filter((c) => c.status === "In-Progress" && c.complaint_type_name === "IT Issues")
      : userRole === "admin"
        ? complaints.filter((c) => c.status === "In-Progress")
        : [];

  // Export the visible complaints to a PDF
  const exportToPDF = async () => {
    try {
      const jspdfModule = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default as any;
      const doc = new jspdfModule.jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

      const head = [["Date", "Building", "Floor", "Area", "Type", "Details", "Status"]];
      const body = visibleComplaints.map((c) => [
        new Date(c.date).toDateString(),
        c.building,
        c.floor,
        c.area_name,
        c.complaint_type_name,
        c.details,
        c.status,
      ]);

      autoTable(doc, {
        head,
        body,
        styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        columnStyles: { 5: { cellWidth: 200 } },
        margin: 20,
      });

      doc.save(`complaints_${new Date().toISOString().slice(0,10)}.pdf`);
    } catch (err) {
      alert("Failed to generate PDF. Please ensure dependencies are installed: jspdf, jspdf-autotable.");
    }
  };

  return (
    <div className="bg-white p-2 sm:p-4 shadow rounded mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-black">All Complaints</h3>
        <button
          onClick={exportToPDF}
          disabled={visibleComplaints.length === 0}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-400"
        >
          Download PDF
        </button>
      </div>
      
      {/* Table view for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">Date</th>
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
            {userRole === "manager" && (
              visibleComplaints
                .filter((complaint) => complaint.status === "In-Progress" && complaint.complaint_type_name !== "IT Issues")
                .map((complaint: Complaint) => (
                  <tr key={complaint.id} className="border">
                    <td className="border p-2 text-black text-center">{new Date(complaint.date).toDateString()}</td>
                    <td className="border p-2 text-black text-center">{complaint.building}</td>
                    <td className="border p-2 text-black text-center">{complaint.floor}</td>
                    <td className="border p-2 text-black text-center">{complaint.area_name}</td>
                    <td className="border p-2 text-black text-center">{complaint.complaint_type_name}</td>
                    <td className="border p-2 text-black max-w-[200px] text-wrap">{complaint.details}</td>
                    <td className="border p-2 text-black text-center bg-red-200">{complaint.status}</td>
                    <td className="p-2">
                      {complaint.status !== "Resolved" && (
                        <div className="flex items-center gap-2 justify-center flex-wrap">
                          {complaintToResolve === complaint.id ? (
                            <div>
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                dateFormat="yyyy-MM-dd"
                                className="border p-1 rounded text-black"
                                placeholderText="Select date"
                              />
                              <input
                                type="text"
                                value={actionTaken}
                                onChange={(e) => setActionTaken(e.target.value)}
                                placeholder="Action taken"
                                className="border p-1 rounded text-black"
                              />
                              <button
                                onClick={() => markAsResolved(complaint.id)}
                                disabled={!selectedDate || !actionTaken}
                                className="bg-green-500 text-white p-1 rounded disabled:bg-gray-400"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  setComplaintToResolve(null);
                                  setSelectedDate(null);
                                  setActionTaken("");
                                }}
                                className="bg-red-500 text-white p-1 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {complaint.seen ? (
                                <div className="bg-green-500 text-white p-1 rounded">
                                  <Eye/>
                                </div>
                              ) : (
                                <button
                              onClick={() => markAsSeen(complaint.id)}
                              className="bg-red-500 text-white p-1 rounded"
                              >
                                <EyeOff/>
                              </button>
                              )}
                            <button
                              onClick={() => setComplaintToResolve(complaint.id)}
                              className="bg-green-500 text-white p-1 rounded"
                            >
                              <CircleCheck/>
                            </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
            )}

            {userRole === "it_manager" && (
              visibleComplaints
                .filter((complaint) => complaint.status === "In-Progress" && complaint.complaint_type_name === "IT Issues")
                .map((complaint: Complaint) => (
                  <tr key={complaint.id} className="border">
                    <td className="border p-2 text-black">{new Date(complaint.date).toDateString()}</td>
                    <td className="border p-2 text-black">{complaint.building}</td>
                    <td className="border p-2 text-black">{complaint.floor}</td>
                    <td className="border p-2 text-black">{complaint.area_name}</td>
                    <td className="border p-2 text-black">{complaint.complaint_type_name}</td>
                    <td className="border p-2 text-black max-w-[200px] text-wrap">{complaint.details}</td>
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
                                className="border p-1 rounded text-black"
                                placeholderText="Select date"
                              />
                              <input
                                type="text"
                                value={actionTaken}
                                onChange={(e) => setActionTaken(e.target.value)}
                                placeholder="Action taken"
                                className="border p-1 rounded text-black"
                              />
                              <button
                                onClick={() => markAsResolved(complaint.id)}
                                disabled={!selectedDate || !actionTaken}
                                className="bg-green-500 text-white p-1 rounded disabled:bg-gray-400"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  setComplaintToResolve(null);
                                  setSelectedDate(null);
                                  setActionTaken("");
                                }}
                                className="bg-red-500 text-white p-1 rounded"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              {complaint.seen ? (
                                <div className="bg-green-500 text-white p-1 rounded">
                                  <Eye/>
                                </div>
                              ) : (
                                <button
                              onClick={() => markAsSeen(complaint.id)}
                              className="bg-red-500 text-white p-1 rounded"
                              >
                                <EyeOff/>
                              </button>
                              )}
                            <button
                              onClick={() => setComplaintToResolve(complaint.id)}
                              className="bg-green-500 text-white p-1 rounded"
                            >
                              <CircleCheck/>
                            </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
            )}

{userRole === "admin" && (
              visibleComplaints
                .filter((complaint) => complaint.status === "In-Progress")
                .map((complaint: Complaint) => (
                  <tr key={complaint.id} className="border">
                    <td className="border p-2 text-black">{new Date(complaint.date).toDateString()}</td>
                    <td className="border p-2 text-black">{complaint.building}</td>
                    <td className="border p-2 text-black">{complaint.floor}</td>
                    <td className="border p-2 text-black">{complaint.area_name}</td>
                    <td className="border p-2 text-black">{complaint.complaint_type_name}</td>
                    <td className="border p-2 text-black max-w-[200px] text-wrap">{complaint.details}</td>
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
                                className="border p-1 rounded text-black"
                                placeholderText="Select date"
                              />
                              <input
                                type="text"
                                value={actionTaken}
                                onChange={(e) => setActionTaken(e.target.value)}
                                placeholder="Action taken"
                                className="border p-1 rounded text-black"
                              />
                              <button
                                onClick={() => markAsResolved(complaint.id)}
                                disabled={!selectedDate || !actionTaken}
                                className="bg-green-500 text-white p-1 rounded disabled:bg-gray-400"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => {
                                  setComplaintToResolve(null);
                                  setSelectedDate(null);
                                  setActionTaken("");
                                }}
                                className="bg-red-500 text-white p-1 rounded"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              {complaint.seen ? (
                                <div className="bg-green-500 text-white p-1 rounded">
                                  <Eye/>
                                </div>
                              ) : (
                                <button
                              onClick={() => markAsSeen(complaint.id)}
                              className="bg-red-500 text-white p-1 rounded"
                              >
                                <EyeOff/>
                              </button>
                              )}
                            <button
                              onClick={() => setComplaintToResolve(complaint.id)}
                              className="bg-green-500 text-white p-1 rounded"
                            >
                              <CircleCheck/>
                            </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card view for small screens */}
      <div className="md:hidden space-y-4">
        {visibleComplaints.filter((complaint) => complaint.status !== "Resolved").map((complaint: Complaint) => (
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
                      className="border p-2 rounded w-full text-black"
                      placeholderText="Select date"
                    />
                    <input
                      type="text"
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      placeholder="Action taken"
                      className="border p-2 rounded w-full text-black"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => markAsResolved(complaint.id)}
                        disabled={!selectedDate || !actionTaken}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setComplaintToResolve(null);
                          setSelectedDate(null);
                          setActionTaken("");
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
