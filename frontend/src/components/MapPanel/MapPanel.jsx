import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

function MapPanel({ entries }) {
  return (
    <div className="map-container">
      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
        whenCreated={(mapInstance) => {
          setTimeout(() => {
            mapInstance.invalidateSize();
          }, 200); // delay ensures layout is stable
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {entries.map((entry) => {
          const { latitude, longitude } = entry;
          if (latitude && longitude) {
            return (
              <Marker key={entry.id} position={[latitude, longitude]}>
                <Popup>
                  <strong>{entry.name}</strong>
                  <br />
                  {entry.location}
                  <br />
                  {new Date(entry.timestamp).toLocaleDateString()}
                </Popup>
              </Marker>
            );
          }
          return null;
      })}
      </MapContainer>
    </div>
  );
}

// Fake lookup for now
const lookup = {
  "Philadelphia, Pennsylvania, United States": [39.9526, -75.1652],
  "New York, New York, United States": [40.7128, -74.0060],
  "Los Angeles, California, United States": [34.0522, -118.2437],
  // add more as needed
};

function locationToLatLng(city, state, country) {
  const key = `${city}, ${state}, ${country}`;
  return lookup[key] || null;
}

export default MapPanel;