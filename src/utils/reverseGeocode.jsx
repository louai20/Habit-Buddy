export async function getCityFromCoords(latitude, longitude) {
  const apiKey = "c1b1ec64491b4c10aa8d66c752c5e27b"; 
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data?.results?.length > 0) {
      const components = data.results[0].components;
      return (
        components.city ||
        components.town ||
        components.village ||
        components.county ||
        components.state ||
        "Your City"
      );
    }
  } catch (err) {
    console.error("Reverse geocoding error:", err);
  }

  return "Your City";
}
