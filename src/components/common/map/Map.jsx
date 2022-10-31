import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import PopUp from "./PopUp";
import "./styles.css";
import markerIconRed from "../../../assets/marker-icon-red.png";
import markerIconBlue from "../../../assets/marker-icon-blue.png";
import markerIconGreen from "../../../assets/marker-icon-green.png";
import { Icon } from "leaflet";
import Legend from "./Legend";
import ChangeView from "./ChangeView";

export default function Map({
  searchOptionIndex,
  longitude,
  latitude,
  markersRes,
  mapZoom,
  searchClicked,
}) {
  const [map, setMap] = React.useState(null);
  const [optionIndexChanged, setOptionIndexChanged] = React.useState(false);
  const [center] = React.useState(
    latitude !== null &&
      longitude !== null &&
      latitude !== undefined &&
      longitude !== undefined
      ? [latitude, longitude]
      : [48.136642566675825, 11.575330343104591]
  );

  React.useEffect(() => {
    function resetMap() {
      setOptionIndexChanged(true);
    }
    resetMap();
  }, [searchOptionIndex]);

  return (
    <div id="map">
      {/* map */}
      <MapContainer
        center={center}
        zoom={mapZoom}
        scrollWheelZoom={true}
        whenCreated={setMap}
      >
        {(searchClicked || optionIndexChanged) && (
          // handles map properties changes
          <ChangeView
            center={center}
            mapZoom={mapZoom}
            setMap={setMap}
            optionIndexChanged={optionIndexChanged}
            setOptionIndexChanged={setOptionIndexChanged}
          />
        )}
        {/* build map tiles*/}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* center location marker */}
        <Marker
          position={center}
          icon={
            new Icon({
              iconUrl: markerIconGreen,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }
        />
        {/* freelancers markers */}
        {markersRes.map(
          (freelancer, index) =>
            freelancer &&
            (freelancer?.latitude ||
              freelancer?.defaultAvailability?.centerLocation?.longitude) && (
              <Marker
                key={index}
                position={
                  freelancer?.latitude && freelancer?.longitude
                    ? [freelancer?.latitude, freelancer?.longitude]
                    : [
                        freelancer?.defaultAvailability?.centerLocation
                          ?.latitude,
                        freelancer?.defaultAvailability?.centerLocation
                          ?.longitude,
                      ]
                }
                icon={
                  new Icon({
                    iconUrl: freelancer?.locationStatus
                      ? freelancer?.locationStatus === "AtSalon"
                        ? markerIconRed
                        : markerIconBlue
                      : freelancer?.defaultAvailability?.locationStatus ===
                        "AtSalon"
                      ? markerIconRed
                      : markerIconBlue,

                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })
                }
              >
                {/* marker popup */}
                <PopUp key={index} freelancer={freelancer} />
              </Marker>
            )
        )}
        {/* map legend */}
        <Legend map={map} />
      </MapContainer>
    </div>
  );
}
