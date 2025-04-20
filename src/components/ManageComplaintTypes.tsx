"use client";
import { ComplaintType } from "@/types/types";
import { useEffect, useState } from "react";

export default function ManageComplaintTypes() {
  const [complaintTypes, setComplaintTypes] = useState<ComplaintType[]>([]);
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState<{ id: number; name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      })
      .catch(error => {
        alert('Error fetching complaint types: ' + error);
      });
  }, []);

  const addComplaintType = async () => {
    if (!newType.trim()) return;

    try {
      if (editingType) {
        // Update
        const response = await fetch(`/api/complaint-types/${editingType.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: newType }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to update type");

        const updatedList = complaintTypes.map((type) =>
          type.id === editingType.id ? { ...type, type_name: newType } : type
        );

        setComplaintTypes(updatedList);
        setEditingType(null);
      } else {
        // Add new
        const response = await fetch("/api/complaint-types", {
          method: "POST",
          body: JSON.stringify({ name: newType }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        setComplaintTypes([...complaintTypes, { id: data.id, type_name: newType }]);
      }

      setNewType("");
    } catch (error) {
      alert("Error adding/updating complaint type: " + error);
    }
  };

  const deleteComplaintType = async (id: number) => {
    try {
      await fetch(`/api/complaint-types/${id}`, { method: "DELETE" });
      setComplaintTypes(complaintTypes.filter((type) => type.id !== id));
    } catch (error) {
      alert("Error deleting type");
    }
  };

  const filteredComplaintTypes = complaintTypes.filter((type) =>
    type.type_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 sm:p-6 shadow rounded mt-4 w-full max-w-3xl mx-auto">
      <h3 className="text-lg sm:text-xl text-black font-bold mb-4">Manage Complaint Types</h3>

      {/* Input Field & Add/Update Button */}
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
          {editingType ? "Update" : "Add"}
        </button>
      </div>

      {/* Search Field */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Complaint Types..."
        className="border text-black p-2 mb-3 rounded w-full"
      />

      {/* Complaint Type List */}
      <div className="max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {filteredComplaintTypes.length > 0 ? (
          <ul className="space-y-2">
            {filteredComplaintTypes.map((type) => (
              <li
                key={type.id}
                className="flex flex-col sm:flex-row justify-between p-2 sm:p-3 border rounded text-black font-bold gap-2"
              >
                <span className="break-words">{type.type_name}</span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setEditingType({ id: type.id, name: type.type_name });
                      setNewType(type.type_name);
                    }}
                    className="bg-yellow-500 text-white p-1 px-3 rounded w-full sm:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteComplaintType(type.id)}
                    className="bg-red-500 text-white p-1 px-3 rounded w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">No complaint types found.</p>
        )}
      </div>
    </div>
  );
}
