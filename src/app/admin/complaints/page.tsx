import AdminComplaintTable from '@/components/AdminComplaintTable'
import React from 'react'

const Complaints = () => {
  return (
    <div className="flex">
    <div className="flex-1">
      <main className="p-4">
        <h2 className="text-xl text-black font-bold mb-4">Admin Panel</h2>
        <AdminComplaintTable />
       
      </main>
    </div>
  </div>
  )
}

export default Complaints