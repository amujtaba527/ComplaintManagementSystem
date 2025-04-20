"use client";
import { Area } from "@/types/types";
import { useEffect, useState } from "react";

export default function ManageAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [newArea, setNewArea] = useState("");
  const [editingArea, setEditingArea] = useState<{ id: number; name: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/areas")
      .then((res) => res.json())
      .then((data) => {
        const areasArray = Array.isArray(data) ? data : data.areas || [];
        const formatted = areasArray.map((area: Area) => ({
          id: area.id,
          area_name: area.area_name
        }));
        setAreas(formatted);
      })
      .catch((err) => alert("Error fetching areas: " + err));
  }, []);

  const addOrUpdateArea = async () => {
    if (!newArea.trim()) return;

    try {
      if (editingArea) {
        const response = await fetch(`/api/areas/${editingArea.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: newArea }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to update area");

        const updatedList = areas.map((area) =>
          area.id === editingArea.id ? { ...area, area_name: newArea } : area
        );

        setAreas(updatedList);
        setEditingArea(null);
      } else {
        const response = await fetch("/api/areas", {
          method: "POST",
          body: JSON.stringify({ name: newArea }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        setAreas([...areas, { id: data.id, area_name: newArea }]);
      }

      setNewArea("");
    } catch (error) {
      alert("Error adding/updating area: " + error);
    }
  };

  const deleteArea = async (id: number) => {
    try {
      await fetch(`/api/areas/${id}`, { method: "DELETE" });
      setAreas(areas.filter((area) => area.id !== id));
    } catch (error) {
      alert("Error deleting area");
    }
  };

  const filteredAreas = areas.filter((area) =>
    area.area_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 sm:p-6 shadow rounded mt-4 w-full max-w-3xl mx-auto">
      <h3 className="text-lg sm:text-xl text-black font-bold mb-4">Manage Areas</h3>

      {/* Add / Update Input */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newArea}
          onChange={(e) => setNewArea(e.target.value)}
          className="border text-black p-2 flex-1 rounded"
          placeholder="New Area"
        />
        <button
          onClick={addOrUpdateArea}
          className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto"
        >
          {editingArea ? "Update" : "Add"}
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Areas..."
        className="border text-black p-2 mb-3 rounded w-full"
      />

      {/* Scrollable Area List */}
      <div className="max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {filteredAreas.length > 0 ? (
          <ul className="space-y-2">
            {filteredAreas.map((area) => (
              <li
                key={area.id}
                className="flex flex-col sm:flex-row justify-between p-2 sm:p-3 border rounded text-black font-bold gap-2"
              >
                <span className="break-words">{area.area_name}</span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setEditingArea({ id: area.id, name: area.area_name });
                      setNewArea(area.area_name);
                    }}
                    className="bg-yellow-500 text-white p-1 px-3 rounded w-full sm:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteArea(area.id)}
                    className="bg-red-500 text-white p-1 px-3 rounded w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm">No areas found.</p>
        )}
      </div>
    </div>
  );
}
