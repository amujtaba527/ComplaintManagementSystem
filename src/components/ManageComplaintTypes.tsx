"use client";
import { ComplaintType } from "@/types/types";
import { useEffect, useState } from "react";

export default function ManageComplaintTypes() {
  const [complaintTypes, setComplaintTypes] = useState<ComplaintType[]>([]);
  const [newType, setNewType] = useState("");

  useEffect(() => {
    fetch("/api/complaint-types")
      .then((res) => res.json())
      .then((data) => {
        const types = Array.isArray(data) ? data : data.types || [];
        const formattedTypes = types.map((type: ComplaintType) => ({
          id: type.id,
          type_name: type.type_name 
        }));
        setComplaintTypes(formattedTypes);
        console.log(formattedTypes);
      })
      .catch(error => {
        console.error("Error fetching complaint types:", error);
      });
  }, []);

  const addComplaintType = async () => {
    if (!newType.trim()) return;

    try {
      const response = await fetch("/api/complaint-types", {
        method: "POST",
        body: JSON.stringify({ name: newType }),
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      setComplaintTypes([...complaintTypes, { 
        id: data.id,
        type_name: newType 
      }]);
      setNewType("");
    } catch (error) {
      console.error("Error adding complaint type:", error);
    }
  };

  const deleteComplaintType = async (id: number) => {
    await fetch(`/api/complaint-types/${id}`, { method: "DELETE" });

    setComplaintTypes(complaintTypes.filter((type) => type.id !== id));
  };

  return (
    <div className="bg-white p-4 sm:p-6 shadow rounded mt-4 w-full max-w-3xl mx-auto">
      <h3 className="text-lg sm:text-xl text-black font-bold mb-4">Manage Complaint Types</h3>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="border text-black p-2 flex-1 rounded"
          placeholder="New Complaint Type"
        />
        <button 
          onClick={addComplaintType} 
          className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto"
        >
          Add
        </button>
      </div>

      <ul className="mt-2 space-y-2">
        {complaintTypes?.map((type) => (
          <li key={type.id || type.type_name} className="flex flex-col sm:flex-row justify-between p-2 sm:p-3 border rounded text-black font-bold gap-2">
            <span className="break-words">{type.type_name}</span>
            <button
              onClick={() => deleteComplaintType(type.id)}
              className="bg-red-500 text-white p-1 rounded w-full sm:w-auto"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
