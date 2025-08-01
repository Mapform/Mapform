export function openInGoogleMaps(latitude: number, longitude: number) {
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    "_blank",
  );
}
