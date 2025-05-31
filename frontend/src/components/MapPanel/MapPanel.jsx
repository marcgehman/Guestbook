import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

function MapPanel({ entries }) {
  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={2}
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
          const [city, country] = (entry.location || "").split(", ");
          const coords = locationToLatLng(city, country);
          return (
            coords && (
              <Marker key={entry.id} position={coords}>
                <Popup>
                  <strong>{entry.name}</strong>
                  <br />
                  {city}, {country}
                  <br />
                  {new Date(entry.timestamp).toLocaleDateString()}
                </Popup>
              </Marker>
            )
          );
        })}
      </MapContainer>
    </div>
  );
}

// Fake lookup for now
const lookup = {
  "Philadelphia, United States": [39.9526, -75.1652],
};

function locationToLatLng(city, country) {
  return lookup[`${city}, ${country}`] || null;
}

export default MapPanel;