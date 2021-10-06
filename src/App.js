import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/dist/styles.min.css";
import axios from "axios";
import { geoJSON } from "./rents";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

function App() {
  const [rents, setRents] = useState(geoJSON);
  useEffect(() => {
    axios
      .get("https://azulrent.info/get_locations/")
      .then((response) => {
        console.log(response.data);
        setRents(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <text>ЭТО ЧË КАРТА</text>
      <MapContainer
        style={{ height: "500px", width: "500px" }}
        center={[59.4745283067, 26.1]}
        zoom={11}
        minZoom={7}
        scrollWheelZoom={true}
        maxBounds={[
          [57, 21.3397953631],
          [60.6110903998, 29.1316992531],
        ]}
        bounceAtZoomLimits={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          <GeoJSON
            data={rents}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(feature.properties.address);
            }}
          />
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default App;
