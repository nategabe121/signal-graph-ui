import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'

const defaultSignals = [
  { label: "Alias Names", value: 1 },
  { label: "SSN Validity", value: 1 },
  { label: "Recent Address Match", value: 1 },
  { label: "Known Employer", value: 1 },
  { label: "Convictions", value: -2 },
  { label: "SSN Fraud", value: -3 }
]

const App = () => {
  const [signals, setSignals] = useState(defaultSignals)
  const [selected, setSelected] = useState(signals.map(s => true))
  const [data, setData] = useState(generateChartData(signals.map(s => s.value)))

  function generateChartData(vals) {
    return vals.map((v, i) => ({
      index: i + 1,
      risk: vals.slice(0, i + 1).reduce((a, b) => a + b, 0)
    }))
  }

  function toggle(index) {
    const next = [...selected]
    next[index] = !next[index]
    const activeValues = signals.map((s, i) => next[i] ? s.value : 0)
    setSelected(next)
    setData(generateChartData(activeValues))
  }

  function calcScore() {
    return signals.reduce((sum, s, i) => selected[i] ? sum + s.value : sum, 0)
  }

  function exportPNG() {
    html2canvas(document.querySelector("#graph")).then(canvas => {
      const link = document.createElement("a")
      link.download = "signal-graph.png"
      link.href = canvas.toDataURL()
      link.click()
    })
  }

  function exportCSV() {
    const csv = ["Label,Value,Selected"]
    signals.forEach((s, i) => {
      csv.push(`"${s.label}",${s.value},${selected[i]}`)
    })
    const blob = new Blob([csv.join("\n")], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "signal-data.csv"
    link.click()
  }

  function loadSynthetic() {
    const synth = [
      { label: "Fake Employer", value: -2 },
      { label: "VOE Match", value: 2 },
      { label: "Alias Warning", value: -1 },
      { label: "SSN Verified", value: 2 },
      { label: "Eviction Record", value: -3 }
    ]
    setSignals(synth)
    setSelected(synth.map(() => true))
    setData(generateChartData(synth.map(s => s.value)))
  }

  return (
    <div>
      <h1>Signal Graph Risk Engine</h1>
      <p>Score: <strong>{calcScore()}</strong></p>
      <div>
        {signals.map((s, i) => (
          <div key={i}>
            <input type="checkbox" checked={selected[i]} onChange={() => toggle(i)} />
            {s.label} ({s.value})
          </div>
        ))}
      </div>
      <div style={{ height: 300, background: "#fff", marginTop: 20 }} id="graph">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="risk" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={exportPNG}>Export PNG</button>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={loadSynthetic}>Load Synthetic Profile</button>
      </div>
    </div>
  )
}

export default App
