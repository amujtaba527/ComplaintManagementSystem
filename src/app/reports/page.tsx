import Reports from '@/components/Reports'
import React from 'react'

const page = () => {
  return (
    <div className="flex">
        <div className="flex-1">
            <main>
                <h2 className="text-xl text-black font-bold mb-4">Reports</h2>
                <Reports/>
            </main>
        </div>
    </div>
  )
}

export default page