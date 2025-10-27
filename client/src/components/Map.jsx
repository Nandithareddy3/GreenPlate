
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';

const Map = ({ listings }) => {
    const defaultPosition = [17.4399, 78.4983];

    return (
        <MapContainer center={defaultPosition} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '8px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {listings.map(listing => (
                // IMPORTANT: Leaflet uses [latitude, longitude], which is the reverse of the GeoJSON format [longitude, latitude]
                <Marker
                    key={listing._id}
                    position={[listing.location.coordinates[1], listing.location.coordinates[0]]}
                >
                    <Popup>
                        <Link to={`/listing/${listing._id}`}>
                            <strong>{listing.title}</strong>
                            <p>Click to view details</p>
                        </Link>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;