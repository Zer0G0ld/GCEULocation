async function getCoordinatesFromGeoapify(address) {
  const apiKey = 'APIGEO'; // Substitua pela sua chave de API do Geoapify
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const latitude = data.features[0].geometry.coordinates[1];
      const longitude = data.features[0].geometry.coordinates[0];
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      return { lat: latitude, lon: longitude };
    } else {
      console.warn('Endereço não encontrado.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return null;
  }
}

// Exemplo de uso
const address = 'R. Pedralva, 30 - Realengo, Rio de Janeiro - RJ, 21725-030';
getCoordinatesFromGeoapify(address).then(coordinates => {
  if (coordinates) {
    console.log(`Coordenadas:`, coordinates);
  }
});
