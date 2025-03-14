import ComplaintActionTable from '@/components/ComplaintActionTable'
import React from 'react'

const Complaints = () => {
  return (
    <div className="flex">
    <div className="flex-1">
      <main className="p-4">
        <ComplaintActionTable />
      </main>
    </div>
  </div>
  )
}

export default Complaints