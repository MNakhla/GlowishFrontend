import { useMap } from "react-leaflet";

const ChangeView = ({
  center,
  mapZoom,
  setMap,
  optionIndexChanged,
  setOptionIndexChanged,
}) => {
  const map = useMap();
  setMap(map);
  map.setView(center, mapZoom);
  if (optionIndexChanged) {
    setOptionIndexChanged(false);
  }
  return null;
};

export default ChangeView;
