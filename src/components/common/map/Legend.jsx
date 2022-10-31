import { useEffect } from "react";
import L from "leaflet";

function Legend({ map }) {
  useEffect(() => {
    if (map) {
      const legend = L.control({ position: "bottomleft" });

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend");
        div.innerHTML =
          "<div style='background:#FFFFFF;width:100px;height:55px;text-align:center'>" +
          "<i style='background:#F44133'>At Salon</i>" +
          "</br>" +
          "<i style='background:#448DC5'>On The Move</i>" +
          "</br>" +
          "<i style='background:rgba(45, 182, 105, 255)'>Center Location</i>" +
          "</div>";
        return div;
      };

      legend.addTo(map);
    }
  }, [map]); //here add map
  return null;
}

export default Legend;
