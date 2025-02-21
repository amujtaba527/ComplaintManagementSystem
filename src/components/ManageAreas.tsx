"use client";
import { useEffect, useState } from "react";
import { Area } from "@/types/types";

export default function ManageAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [newArea, setNewArea] = useState("");

  useEffect(() => {
    fetch("/api/areas")
      .then((res) => res.json())
      .then((data) => {
        const types = Array.isArray(data) ? data : data.types || [];
        const formattedAreas = types.map((type: Area) => ({
          id: type.id,
          area_name: type.area_name
        }));
        setAreas(formattedAreas);
      })
      .catch((error) => console.error("Error fetching areas:", error));
  }, []);
  

  const addArea = async () => {
    if (!newArea.trim()) {
      alert("Area name cannot be empty!");
      return;
    }
  
    try {
      const res = await fetch("/api/areas", {
        method: "POST",
        body: JSON.stringify({ name: newArea }), 
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to add area");
      }
  
      setAreas([...areas, data.area]);
      setNewArea("");
    } catch (error) {
      alert(error);
    }
  };
  

  const deleteArea = async (id: number) => {
    await fetch(`/api/areas/${id.toString()}`, { method: "DELETE" });

    setAreas(areas.filter((area) => area.id !== id));
  };

  return (
    <div className="bg-white p-4 shadow rounded mt-4 max-w-3xl mx-auto w-full">
      <h3 className="text-lg md:text-xl text-black font-bold mb-4">Manage Areas</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newArea}
          onChange={(e) => setNewArea(e.target.value)}
          className="border text-black p-2 flex-1 rounded"
          placeholder="New Area"
        />
        <button 
          onClick={addArea} 
          className="bg-blue-500 text-white p-2 rounded w-full sm:w-auto"
        >
          Add
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {areas?.map((area) => (
          <li key={area.id||area.area_name} className="flex flex-col sm:flex-row justify-between p-3 border rounded text-black font-bold items-center gap-2">
            <span className="text-center text-black sm:text-left w-full sm:w-auto">{area.area_name}</span>
            <button
              onClick={() => deleteArea(area.id)}
              className="bg-red-500 text-white p-2 rounded w-full sm:w-auto"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
