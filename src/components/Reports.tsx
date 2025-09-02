'use client';
import { Complaint ,Area, ComplaintType} from '@/types/types';
import { Floor, Status,Building } from '@/utils/constants';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';
// returns first date of the current month
function getCurrentMonth() {
  const date = new Date();
  date.setDate(1);
  return date;
}

const Reports = () => {
  const [reports, setReports] = useState<Complaint[]>([]);
  const [filteredReports, setFilteredReports] = useState<Complaint[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [types, setTypes] = useState<ComplaintType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    building: '',
    floor: '',
    area_id: '',
    complaint_type_id: '',
    status: '',
    from_date: getCurrentMonth(),
    to_date: new Date()
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports`);
      if (!response.ok) {
        throw new Error(`Error fetching reports: ${response.statusText}`);
      }
      const data = await response.json();
      setReports(data);
      setFilteredReports(data);
      console.log(data);
    } catch (error) {
      alert('Error fetching reports: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchareas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/areas`);
      if (!response.ok) {
        throw new Error(`Error fetching areas: ${response.statusText}`);
      }
      const data = await response.json();
      setAreas(data);
      console.log(data);
    } catch (error) {
      alert('Error fetching areas: ' + error);
    } finally {
      setLoading(false);
    }
    }

    const fetchtypes = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/complaint-types`);
          if (!response.ok) {
            throw new Error(`Error fetching types: ${response.statusText}`);
          }
          const data = await response.json();
          setTypes(data);
          console.log(data);
        } catch (error) {
          alert('Error fetching types: ' + error);
        } finally {
          setLoading(false);
        }
        }    


  useEffect(() => {
    fetchReports();
    fetchareas();
    fetchtypes();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = useCallback(() => {
    let filtered = reports;

    if (filters.building) {
      filtered = filtered.filter(report => report.building.includes(filters.building));
    }
    if (filters.floor) {
      filtered = filtered.filter(report => report.floor.includes(filters.floor));
    }
    if (filters.area_id) {
      filtered = filtered.filter(report => report.area_id === parseInt(filters.area_id));
    }
    if (filters.complaint_type_id) {
      filtered = filtered.filter(report => report.complaint_type_id === parseInt(filters.complaint_type_id));
    }
    if (filters.status) {
      filtered = filtered.filter(report => report.status.includes(filters.status));
    }
    if (filters.from_date) {
      filtered = filtered.filter(report => report.date >= filters.from_date.toISOString());
    }
    if (filters.to_date) {
      filtered = filtered.filter(report => report.date <= filters.to_date.toISOString());
    }

    setFilteredReports(filtered);
  },[filters, reports]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-2 sm:p-4 shadow rounded mt-4">
      <h3 className="text-lg font-bold text-black mb-2">All Complaints</h3>
      {/* Date Range Filter By default it will be current month */}
      <div className="mb-4 flex-row gap-4 flex justify-items-start">
        <label className="block text-black">From Date:</label>
        <input type="date" className="border p-2 mb-2 text-black" value={filters.from_date.toISOString().split('T')[0]} onChange={(e) => setFilters(prev => ({ ...prev, from_date: new Date(e.target.value) }))} />
        <label className="block text-black">To Date:</label>
        <input type="date" className="border p-2 mb-2 text-black" value={filters.to_date.toISOString().split('T')[0]} onChange={(e) => setFilters(prev => ({ ...prev, to_date: new Date(e.target.value) }))} />
      </div>
      <div className="mb-4 flex-row gap-4 flex justify-around">
        <div className="flex flex-row gap-4">
        <label className="block text-black">Building:</label>
        <select name="building" value={filters.building} onChange={handleFilterChange} className="border p-2 mb-2  text-black">
          <option value="">All Buildings</option>
          {Building.map(building => (
              <option key={building.id} value={building.name}>{building.name}</option>
              ))}
        </select></div>
        
        <div className="flex flex-row gap-4">
        <label className="block text-black">Floor:</label>
        <select name="floor" value={filters.floor} onChange={handleFilterChange} className="border p-2 mb-2  text-black">
            <option value="">All Floors</option>
            {Floor.map(floor => (
                <option key={floor.id} value={floor.id}>{floor.name}</option>
                ))} 
        </select></div>
        
        <div className="flex flex-row gap-4">
        <label className="block text-black">Area:</label>
        <select name="area_id" value={filters.area_id} onChange={handleFilterChange} className="border p-2 mb-2 text-black">
          <option value="">All Areas</option>
            {areas.map(area => (
                <option key={area.id} value={area.id}>{area.area_name}</option>
                ))}
        </select></div>
        
        <div className="flex flex-row gap-4">
        <label className="block text-black">Complaint Type:</label>
        <select name="complaint_type_id" value={filters.complaint_type_id} onChange={handleFilterChange} className="border p-2 mb-2 text-black">
          <option value="">All Types</option>
           {types.map(type => (
                <option key={type.id} value={type.id}>{type.type_name}</option>
                ))}
        </select></div>
        
        <div className="flex flex-row gap-4">
        <label className="block text-black">Status:</label>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="border p-2 mb-2 text-black">
          <option value="">All Statuses</option>
          {Status.map(status => (
              <option key={status.id} value={status.name}>{status.name}</option>
              ))}
        </select>
        </div>
      </div>

      <div className="block overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-black">Issue Date</th>
              <th className="border p-2 text-black">Building</th>
              <th className="border p-2 text-black">Floor</th>
              <th className="border p-2 text-black">Area</th>
              <th className="border p-2 text-black">Type</th>
              <th className="border p-2 text-black">Details</th>
              <th className="border p-2 text-black">Status</th>
              <th className="border p-2 text-black">Actions</th>
              <th className="border p-2 text-black">Resolution Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((complaint: Complaint) => (
              <tr key={complaint.id} className="border">
                <td className="border p-2 text-black">{new Date(complaint.date).toDateString()}</td>
                <td className="border p-2 text-black">{complaint.building}</td>
                <td className="border p-2 text-black">{complaint.floor}</td>
                <td className="border p-2 text-black">{complaint.area_id ? complaint.area_name : "Deleted Area"}</td>
                <td className="border p-2 text-black">{complaint.complaint_type_id ? complaint.complaint_type_name : "Deleted Type"}</td>
                <td className="border p-2 text-black max-w-[200px] text-wrap">{complaint.details}</td>
                <td className={`border text-black p-2 ${complaint.status === "Resolved" ? "bg-green-200" : complaint.status=== "In-Progress" ? "bg-red-200" : complaint.status=== "No Complaint" ? "bg-blue-200" : ""}`}>{complaint.status}</td>
                <td className="border p-2 text-black">{complaint.action? complaint.action:"N/A"}</td>
                <td className="border p-2 text-black">{complaint.resolution_date ? new Date(complaint.resolution_date).toDateString().trim() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;