import { MapPositioner } from "~/lib/map/map-positioner";
import { SettingsTabs } from "./settings-tabs";

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ wsSlug: string }>;
}) {
  const { wsSlug } = await params;

  return (
    <MapPositioner
      viewState={{ center: [0, 0], zoom: 2, pitch: 0, bearing: 0 }}
    >
      <div className="p-2">
        <SettingsTabs wsSlug={wsSlug} />
      </div>
      <div className="p-6">{children}</div>
    </MapPositioner>
  );
}
