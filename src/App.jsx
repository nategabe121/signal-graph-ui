
import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'

const defaultData = [
  { signal: 'Login Frequency', value: 8 },
  { signal: 'Geolocation Shift', value: 2 },
  { signal: 'Device Change', value: 5 },
  { signal: 'Unusual Hours', value: 7 },
  { signal: 'Failed Logins', value: 3 }
]

const syntheticProfiles = {
  "Trusted User": [
    { signal: 'Login Frequency', value: 9 },
    { signal: 'Geolocation Shift', value: 1 },
    { signal: 'Device Change', value: 2 },
    { signal: 'Unusual Hours', value: 2 },
    { signal: 'Failed Logins', value: 1 }
  ],
  "Risky User": [
    { signal: 'Login Frequency', value: 3 },
    { signal: 'Geolocation Shift', value: 9 },
    { signal: 'Device Change', value: 8 },
    { signal: 'Unusual Hours', value: 7 },
    { signal: 'Failed Logins', value: 9 }
  ]
}

function App() {
  const [data, setData] = useState(defaultData)

  const calculateScore = () => {
    const weights = [2, 3, 2, 1.5, 1]
    const score = data.reduce((acc, item, idx) => acc + item.value * weights[idx], 0)
    return Math.round((score / 100) * 100)
  }

  const exportAsImage = async () => {
    const element = document.getElementById('chart-container')
    const canvas = await html2canvas(element)
    const link = document.createElement('a')
    link.download = 'signal-graph.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const exportAsCSV = () => {
    const csv = ['Signal,Value']
    data.forEach(row => {
      csv.push(`${row.signal},${row.value}`)
    })
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'signal-graph.csv'
    link.click()
  }

  const loadProfile = (name) => {
    setData(syntheticProfiles[name])
  }

  return (
    <div className="container">
      <h1>Signal Graph UI</h1>
      <div id="chart-container" className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="signal" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#007bff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="buttons">
        <button onClick={() => loadProfile("Trusted User")}>Load Trusted Profile</button>
        <button onClick={() => loadProfile("Risky User")}>Load Risky Profile</button>
        <button onClick={exportAsImage}>Export as PNG</button>
        <button onClick={exportAsCSV}>Export as CSV</button>
      </div>
      <h3>Score: {calculateScore()}</h3>
    </div>
  )
}

export default App
