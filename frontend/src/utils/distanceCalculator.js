/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {string} Distance in kilometers (formatted)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return `${distance.toFixed(2)} km`;
}

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total distance of a route (sum of all segments)
 * @param {Array} stops - Array of stops with lat/lng or latitude/longitude
 * @returns {string} Total distance in kilometers (formatted)
 */
export function calculateRouteDistance(stops) {
  if (!stops || stops.length < 2) {
    return '0 km';
  }

  let totalDistance = 0;
  
  for (let i = 0; i < stops.length - 1; i++) {
    const stop1 = stops[i];
    const stop2 = stops[i + 1];
    
    const lat1 = stop1.vido;
    const lon1 = stop1.kinhdo;
    const lat2 = stop2.vido;
    const lon2 = stop2.kinhdo;
    
    if (lat1 && lon1 && lat2 && lon2) {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }
  }
  
  return `${totalDistance.toFixed(2)} km`;
}

/**
 * Estimate travel time based on distance (assumes average speed of 25 km/h in city)
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Estimated time (formatted)
 */
export function estimateTravelTime(distanceKm) {
  const averageSpeed = 25; // km/h (city traffic)
  const hours = distanceKm / averageSpeed;
  const minutes = Math.round(hours * 60);
  
  if (minutes < 60) {
    return `${minutes} phút`;
  } else {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  }
}
