"use client";
import { Area, ComplaintType } from "@/types/types";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Building, Floor } from "@/utils/constants";

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
  const [areas, setAreas] = useState<Area[]>([]); 
  const [complaintTypes, setComplaintTypes] = useState<ComplaintType[]>([]);  
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
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

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const storedDetails = JSON.parse(localStorage.getItem("complaintDetails") || "[]");
    setSuggestions(storedDetails);
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === 'area') {
      const selectedArea = areas.find(area => area.area_name === value);
      setFormData(prev => ({ ...prev, area_id: selectedArea?.id.toString() || '' }));
    } else if (name === 'complaintType') {
      const selectedType = complaintTypes.find(type => type.type_name === value);
      setFormData(prev => ({ ...prev, complaint_type_id: selectedType?.id.toString() || '' }));
    } else if (name === 'floor') {
      setFormData(prev => ({ ...prev, floor: value }));
    } else if (name === 'details') {
      if (value.length > 0) {
        const filteredSuggestions = suggestions.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setShowDropdown(filteredSuggestions.length > 0);
      } else {
        setShowDropdown(false);
      }
      setFormData(prev => ({ ...prev, details: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectSuggestion = (value: string) => {
    setFormData((prev) => ({ ...prev, details: value }));
    setShowDropdown(false);
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

      if (!suggestions.includes(formData.details)) {
        const updatedSuggestions = [...suggestions, formData.details];
        localStorage.setItem("complaintDetails", JSON.stringify(updatedSuggestions));
        setSuggestions(updatedSuggestions);
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
        dateFormat="dd-MM-yyyy"
        className="border p-1 rounded text-black text-bold w-full mb-2"
        placeholderText="Select date"
      />

      {/* Building Selection */}
      <label className="text-black block">Building:</label>
      <select name="building" onChange={handleChange} className="w-full p-2 mb-2 border text-black">
        <option value="">Select Building</option>
        {Building.map(building => (
          <option key={building.id} value={building.name}>{building.name}</option>
        ))}
      </select>

      {/* Floor Selection */}
      <label className="text-black block">Floor:</label>
      <select name="floor" onChange={handleChange} className="w-full p-2 mb-2 border text-black">
        <option value="">Select Floor</option>
          {Floor.map(floor => (
            <option key={floor.id} value={floor.id}>{floor.name}</option>
          ))} 
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
      <textarea
        name="details"
        value={formData.details}
        onChange={handleChange}
        className="w-full p-2 mb-2 border text-black"
        placeholder="Describe your complaint"
      />
      {showDropdown && (
        <div className="border p-2 bg-white absolute w-full max-h-32 overflow-y-auto">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="p-1 hover:bg-gray-200 text-black cursor-pointer"
              onClick={() => handleSelectSuggestion(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
