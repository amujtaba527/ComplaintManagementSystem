"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Building } from "@/utils/constants";
import Link from "next/link";

export default function NoComplaintForm() {
  const { data: session } = useSession();
  const [building, setBuilding] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      setError("Please login to submit");
      return;
    }

    if (!building) {
      setError("Please select a building");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/no-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session.user.id,
          building,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit");
      
      setBuilding("");
      alert("No complaint submitted successfully!");
    } catch (err) {
      setError("An error occurred while submitting");
      console.error("Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
      <div className="flex justify-around">
        <Link href="/complaintentry" className="text-lg text-black font-bold mb-4">Submit Complaint</Link>
      <h3 className="text-lg text-black font-bold mb-4">No Complaint Form</h3>
      </div>  
      
      
      <label className="text-black block mb-2">Building:</label>
      <select 
        value={building}
        onChange={(e) => setBuilding(e.target.value)}
        className="w-full p-2 mb-4 border text-black rounded"
        disabled={isSubmitting}
      >
        <option value="">Select Building</option>
        {Building.map(building => (
          <option key={building.id} value={building.name}>
            {building.name}
          </option>
        ))}
      </select>


      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className={` p-2 rounded text-white font-medium ${
          isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit No Complaint'}
      </button>
    </form>
  );
}