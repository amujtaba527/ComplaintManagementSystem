import NoComplaint from '@/components/NoComplaint'
import React from 'react'

const page = () => {
  return (
    <div className="flex">
          <div className="flex-1">
            <main className="p-4">
              <h2 className="text-xl font-bold mb-4">User Dashboard</h2>
              <NoComplaint />
            </main>
          </div>
        </div>
  )
}

export default page