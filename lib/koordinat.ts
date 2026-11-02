// Parse koordinat string ("lat, lng") to [lat, lng] tuple
export const parseKoordinat = (
  koordinatString: string
): [number, number] | null => {
  const [lat, lng] = koordinatString
    .split(',')
    .map((coord) => parseFloat(coord.trim()));
  if (isNaN(lat) || isNaN(lng)) return null;
  return [lat, lng];
};
