export function openInAppleMaps(
  latitude: number,
  longitude: number,
  name: string,
) {
  const query = encodeURIComponent(name);

  const isMac = /Mac/.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isMac) {
    window.open(
      `maps://maps.apple.com/?q=${query}&ll=${latitude},${longitude}`,
      "_blank",
    );
  } else if (isIOS) {
    window.open(
      `https://maps.apple.com/?q=${query}&ll=${latitude},${longitude}`,
      "_blank",
    );
  }
}
