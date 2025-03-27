// React-based Trip Planner Interface (UI Mockup for Lewis County, WA)

import { useState } from 'react';

export default function TripPlanner() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [tripTime, setTripTime] = useState(new Date());
  const [mode, setMode] = useState('depart');
  const [result, setResult] = useState(null);

  const fetchTransitRoute = async () => {
    if (!origin || !destination) {
      alert("Please enter both origin and destination.");
      return;
    }

    const baseUrl = "https://maps.googleapis.com/maps/api/directions/json";
    const params = new URLSearchParams({
      origin,
      destination,
      mode: "transit"
    });

    const timeParam = Math.floor(tripTime.getTime() / 1000);
    if (mode === 'depart') {
      params.append("departure_time", timeParam.toString());
    } else {
      params.append("arrival_time", timeParam.toString());
    }

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(`/api/proxy?target=${encodeURIComponent(url)}`);
      const data = await response.json();
      console.log("Transit Route Response:", data);
      setResult(data);
    } catch (error) {
      console.error("Error fetching transit route:", error);
      alert("Failed to get directions. Please check your API key and network.");
    }
  };

  const handleSubmit = () => {
    fetchTransitRoute();
  };

  const renderRouteSteps = (route) => {
    const steps = route?.legs?.[0]?.steps || [];
    return (
      <ul>
        {steps.map((step, index) => (
          <li key={index}>
            <span dangerouslySetInnerHTML={{ __html: step.html_instructions }} />
            {step.transit_details && (
              <div>
                <strong>Bus:</strong> {step.transit_details.line.short_name} — {step.transit_details.headsign}<br />
                <strong>From:</strong> {step.transit_details.departure_stop.name} at {step.transit_details.departure_time.text}<br />
                <strong>To:</strong> {step.transit_details.arrival_stop.name} at {step.transit_details.arrival_time.text}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>Lewis County Transit Trip Planner</h1>

      <label>
        From:<br />
        <input
          type="text"
          value={origin}
          onChange={e => setOrigin(e.target.value)}
          placeholder="e.g., Chehalis Library"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </label>

      <label>
        To:<br />
        <input
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="e.g., Twin Transit Center"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </label>

      <label>
        Date & Time:<br />
        <input
          type="datetime-local"
          value={tripTime.toISOString().slice(0, 16)}
          onChange={e => setTripTime(new Date(e.target.value))}
          style={{ padding: '8px', marginBottom: '10px' }}
        />
      </label>

      <div style={{ marginBottom: '10px' }}>
        <label>
          <input type="radio" name="mode" checked={mode === 'depart'} onChange={() => setMode('depart')} /> Leave At
        </label>{' '}
        <label>
          <input type="radio" name="mode" checked={mode === 'arrive'} onChange={() => setMode('arrive')} /> Arrive By
        </label>
      </div>

      <button onClick={handleSubmit} style={{ padding: '10px 20px' }}>Plan My Trip</button>

      {result?.routes?.[0] && (
        <div style={{ marginTop: 20 }}>
          <h2>Route Preview</h2>
          {renderRouteSteps(result.routes[0])}
        </div>
      )}
    </div>
  );
}
