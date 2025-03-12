"use client";
import { Area, ComplaintType } from "@/types/types";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  return new Date(year, month, day);
}

export default function ComplaintForm() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date | null>(getTodayDate());
  
  const [formData, setFormData] = useState({
    date: getTodayDate().toLocaleDateString('en-CA'),
    user_id: "",
    building: "",
    floor: "",
    area_id: "",
    complaint_type_id: "",
    details: "",
  });

  useEffect(() => {
    if (session?.user?.id) {
      setFormData(prev => ({
        ...prev,
        user_id: session.user.id
      }));
    }
  }, [session]);

  const [areas, setAreas] = useState<Area[]>([]); // Stores complaint areas from API
  const [complaintTypes, setComplaintTypes] = useState<ComplaintType[]>([]); // Stores complaint types from API

  // Fetch Areas and Complaint Types from API (Assuming API exists)
  useEffect(() => {
    async function fetchData() {
      try {
        const areasRes = await fetch("/api/areas");
        const areasData = await areasRes.json();
        const formattedAreas = areasData.map((area: Area) => ({
          id: area.id,
          area_name: area.area_name
        }));
        setAreas(formattedAreas);

        const typesRes = await fetch("/api/complaint-types");
        const typesData = await typesRes.json();
        const formattedTypes = typesData.map((type: ComplaintType) => ({
          id: type.id,
          type_name: type.type_name
        }));
        setComplaintTypes(formattedTypes);
      } catch (error) {
        alert('Error fetching complaint types' + error);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'area') {
      const selectedArea = areas.find(area => area.area_name === value);
      setFormData(prev => ({ ...prev, area_id: selectedArea?.id.toString() || '' }));
    }
    else if (name === 'complaintType') {
      const selectedType = complaintTypes.find(type => type.type_name === value);
      setFormData(prev => ({ ...prev, complaint_type_id: selectedType?.id.toString() || '' }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, date: formattedDate }));
      setSelectedDate(date);
    } else {
      setFormData(prev => ({ ...prev, date: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("Please login to submit a complaint");
      return;
    }
  
    const response = await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
  
    const result = await response.json();
  
    if (response.ok) {
      alert("Complaint Submitted!");
      setFormData({
        date: getTodayDate().toLocaleDateString('en-CA'),
        user_id: session.user.id,
        building: "",
        floor: "",
        area_id: "",
        complaint_type_id: "",
        details: "",
      });
      
      const selectElements = document.querySelectorAll<HTMLSelectElement>('select');
      selectElements.forEach(select => {
        select.value = '';
      });
      
      const textarea = document.querySelector<HTMLTextAreaElement>('textarea');
      if (textarea) {
        textarea.value = '';
      }

      // Dispatch event to refresh complaints table
      window.dispatchEvent(new Event('newComplaint'));
    } else {
      alert("Error submitting complaint: " + result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
      <h3 className="text-lg text-black font-bold mb-2">Submit Complaint</h3>
      {/*Date Selection*/}
      <label className="text-black block">Date:</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        className="border p-1 rounded text-black text-bold w-full mb-2"
        placeholderText="Select date"
      />

      {/* Building Selection */}
      <label className="text-black block">Building:</label>
      <select name="building" onChange={handleChange} className="w-full p-2 mb-2 border text-black">
        <option value="">Select Building</option>
        <option value="Building 1">Building 1</option>
        <option value="Building 2">Building 2</option>
        <option value="Building 3">Building 3</option>
      </select>

      {/* Floor Selection */}
      <label className="text-black block">Floor:</label>
      <select name="floor" onChange={handleChange} className="w-full p-2 mb-2 border text-black">
        <option value="">Select Floor</option>
        <option value="Basement Floor">Basement Floor</option>
        <option value="Ground Floor">Ground Floor</option>
        <option value="1st Floor">1st Floor</option>
        <option value="2nd Floor">2nd Floor</option>
      </select>

      {/* Complaint Area Selection */}
      <label className="text-black block">Complaint Area:</label>
      <select name="area" onChange={handleChange} className="w-full p-2 mb-2 border text-black">
        <option value="">Select Area</option>
        {areas.map((area: Area) => (
          <option key={area.id} value={area.area_name}>
            {area.area_name}
          </option>
        ))}
      </select>

      {/* Complaint Type Selection */}
      <label className="text-black block">Complaint Type:</label>
      <select name="complaintType" onChange={handleChange} className="w-full p-2 mb-2 border text-black">
        <option value="">Select Complaint Type</option>
        {complaintTypes.map((type: ComplaintType) => (
          <option key={type.id} value={type.type_name}>
            {type.type_name}
          </option>
        ))}
      </select>

      {/* Complaint Details */}
      <label className="text-black block">Complaint Details:</label>
      <textarea name="details" onChange={handleChange} className="w-full p-2 mb-2 border text-black"></textarea>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
