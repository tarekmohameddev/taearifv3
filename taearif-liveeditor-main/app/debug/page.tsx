"use client"

import { useState } from "react"

export default function DebugPage() {
  const [testStatus, setTestStatus] = useState("all")
  
  console.log("Debug page render - testStatus:", testStatus)
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <div className="mb-4">
        <p>Current status: {testStatus}</p>
        <button 
          onClick={() => setTestStatus("sold")}
          className="px-4 py-2 bg-red-500 text-white rounded mr-2"
        >
          Set to Sold
        </button>
        <button 
          onClick={() => setTestStatus("all")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Set to All
        </button>
      </div>
      
      <div>
        <p>Test API call:</p>
        <button 
          onClick={async () => {
            const url = `/api/properties/properties?transactionType=sale&status=${testStatus}`
            console.log('Fetching:', url)
            try {
              const response = await fetch(url)
              const data = await response.json()
              console.log('API Response:', data)
            } catch (error) {
              console.error('API Error:', error)
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test API Call
        </button>
      </div>
    </div>
  )
}
