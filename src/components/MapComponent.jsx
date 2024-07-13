import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from './data.json';
import axios from 'axios';
const MapComponent = () => {
  const [countries, setCountries] = useState([])
  const [latLngs, setLatLngs] = useState([]);
  console.log(countries)
  console.log(latLngs)
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://restcountries.com/v3.1/all');
        setCountries(res.data);

        const regions = [];
        res.data.forEach((country) => {
          const matchedData = data.find((value) => country.region === value.region);
          if (matchedData) {
            let region = regions.find((reg) => reg.region === country.region);
            if (!region) {
              region = {
                region: country.region,
                countries: [],
                latlng: matchedData.latlng,
                data: matchedData.data
              };
              regions.push(region);
            }
            region.countries.push({
              name: country.name.common,
              latlng: country.latlng,
            });
          }
        });

        setLatLngs(regions);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);


  return (
    <div className="map-container">
      <MapContainer center={[51.505, -0.09]} zoom={2} scrollWheelZoom={true} className='map'>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {latLngs.map((item, index) => (
          <CircleMarker
            key={index}
            center={item.latlng}
            radius={item.data / 8} // Adjust radius as needed
            pathOptions={{ fillColor: '#3388ff', color: '#3388ff' }}
          >
            <Popup>
              <div>
                <h3>{item.region}</h3>
                <p>Data Usage: {item.data}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

      </MapContainer>
    </div>
  );
};

export default MapComponent;
