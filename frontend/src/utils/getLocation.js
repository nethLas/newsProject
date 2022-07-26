import axios from 'axios';

export default async function getLocation(address) {
  const response = await axios.get(
    `https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${process.env.REACT_APP_GEOCODE_API_KEY}`
  );

  const { data } = response;
  // console.log(data);
  const lat = data?.results[0]?.lat ?? 0;
  const lng = data?.results[0]?.lon ?? 0;
  const formatted = data?.results[0]?.formatted ?? undefined;

  if (formatted === undefined || formatted.includes('undefined')) {
    throw new Error('Invalid Address');
  }

  return { lat, lng, formatted };
}
