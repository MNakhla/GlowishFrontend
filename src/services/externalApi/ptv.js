const getLocationCoordinates = async (locString) => {
  const response = await fetch(
    `https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${locString}`,
    {
      method: "GET",
      headers: {
        apiKey: process.env.REACT_APP_PTV_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

export { getLocationCoordinates };
