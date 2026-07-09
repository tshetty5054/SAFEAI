import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaSync, FaDirections, FaHospital, FaShieldAlt, FaHome, FaMapMarkerAlt } from 'react-icons/fa';

// Fixed Leaflet icon bug in React bundles
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const createCustomIcon = (color) => {
  return new L.DivIcon({
    html: `<span style="background-color: ${color}; width: 24px; height: 24px; display: block; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></span>`,
    className: 'custom-leaflet-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const userIcon = createCustomIcon('#3B82F6'); // Blue for user
const hospitalIcon = createCustomIcon('#EF4444'); // Red for hospital
const policeIcon = createCustomIcon('#10B981'); // Green for police
const safeZoneIcon = createCustomIcon('#8B5CF6'); // Purple for safe zone

// Component to dynamically update map center
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

export const MapWidget = ({ location, unsafeZones, onLocationRefresh }) => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const center = [location.lat || 12.9716, location.lng || 77.5946];

  // Calculate nearby mock points around user location
  useEffect(() => {
    if (location.lat && location.lng) {
      const lat = location.lat;
      const lng = location.lng;
      
      setNearbyPlaces([
        {
          id: 'hosp_1',
          name: 'City General Hospital',
          type: 'hospital',
          lat: lat + 0.004,
          lng: lng - 0.003,
          address: '45 Emergency Dr',
          icon: hospitalIcon
        },
        {
          id: 'police_1',
          name: 'Central Police Headquarters',
          type: 'police',
          lat: lat - 0.003,
          lng: lng + 0.005,
          address: '99 Protection Ave',
          icon: policeIcon
        },
        {
          id: 'safe_1',
          name: 'Community Safe Shelter',
          type: 'safe_zone',
          lat: lat + 0.002,
          lng: lng + 0.003,
          address: '12 Sanctuary Blvd',
          icon: safeZoneIcon
        }
      ]);
    }
  }, [location.lat, location.lng]);

  const handleDirections = (place) => {
    const dest = place ? `${place.lat},${place.lng}` : 'police station';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    window.open(url, '_blank');
  };

  const hasGoogleKey = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="glass-panel rounded-2xl border border-safety-border p-4 flex flex-col h-full min-h-[400px]">
      {/* Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500 animate-pulse" />
            Live Geolocation Widget
          </h3>
          <p className="text-[10px] text-gray-500 font-mono">
            LAT: {center[0].toFixed(6)} | LNG: {center[1].toFixed(6)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onLocationRefresh}
            className="flex items-center gap-1 bg-safety-border hover:bg-gray-700 text-gray-300 text-xs px-2.5 py-1.5 rounded-lg border border-safety-border transition duration-200"
            title="Refresh current GPS position"
          >
            <FaSync size={10} />
            <span>Sync GPS</span>
          </button>
          <button
            onClick={() => handleDirections(selectedPlace)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1.5 rounded-lg transition duration-200"
          >
            <FaDirections size={10} />
            <span>Directions</span>
          </button>
        </div>
      </div>

      {/* Map Content */}
      <div className="relative flex-grow rounded-xl overflow-hidden border border-safety-border h-[300px]">
        {hasGoogleKey ? (
          // Dummy Google Maps view if requested, but with a friendly reminder
          <div className="absolute inset-0 bg-safety-bg flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-white text-sm font-bold">Google Maps Placeholder</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Google Maps API script is linked. (Running Leaflet fallback below as no valid dynamic subscription is active).
            </p>
          </div>
        ) : (
          // Leaflet OpenStreetMap view - fully functional and free!
          <MapContainer center={center} zoom={14} scrollWheelZoom={false} className="w-full h-full">
            <ChangeView center={center} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Current Location Marker */}
            <Marker position={center} icon={userIcon}>
              <Popup>
                <div className="text-xs">
                  <p className="font-bold text-blue-600">Your Location</p>
                  <p className="text-gray-500">Active protection active.</p>
                </div>
              </Popup>
            </Marker>

            {/* Geofences / Unsafe Zones */}
            {unsafeZones.map(zone => (
              <React.Fragment key={zone.id}>
                <Circle
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  pathOptions={{
                    color: '#EF4444',
                    fillColor: '#EF4444',
                    fillOpacity: 0.25,
                    weight: 2
                  }}
                />
                <Marker position={[zone.lat, zone.lng]} icon={createCustomIcon('#EF4444')}>
                  <Popup>
                    <div className="text-xs text-black">
                      <p className="font-bold text-red-600">⚠️ Unsafe Zone: {zone.name}</p>
                      <p className="text-[10px]">Radius: {zone.radius}m &bull; Threat: {zone.threatLevel}</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}

            {/* Nearby Mock Amenities */}
            {nearbyPlaces.map(place => (
              <Marker 
                key={place.id} 
                position={[place.lat, place.lng]} 
                icon={place.icon}
                eventHandlers={{
                  click: () => setSelectedPlace(place),
                }}
              >
                <Popup>
                  <div className="text-xs text-black">
                    <p className="font-bold flex items-center gap-1">
                      {place.type === 'hospital' && <FaHospital className="text-red-500" />}
                      {place.type === 'police' && <FaShieldAlt className="text-emerald-500" />}
                      {place.type === 'safe_zone' && <FaHome className="text-purple-500" />}
                      {place.name}
                    </p>
                    <p className="text-gray-500 text-[10px]">{place.address}</p>
                    <button 
                      onClick={() => handleDirections(place)}
                      className="mt-1.5 text-[10px] text-blue-600 font-bold underline cursor-pointer"
                    >
                      Route Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Map Legend */}
      <div className="grid grid-cols-4 gap-1 mt-3 pt-2 border-t border-safety-border text-[9px] text-gray-400 text-center">
        <div className="flex items-center justify-center gap-1">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full border border-white"></span>
          <span>You</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
          <span>Hospital</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
          <span>Police</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2.5 h-2.5 bg-purple-500 rounded-full border border-white"></span>
          <span>Safe Zone</span>
        </div>
      </div>
    </div>
  );
};
