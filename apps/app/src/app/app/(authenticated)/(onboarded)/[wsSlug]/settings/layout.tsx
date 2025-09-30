import { ServerMapPositioner } from "~/lib/map/map-positioner";
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
    <ServerMapPositioner
      viewState={{ center: [0, 0], zoom: 0, pitch: 0, bearing: 0 }}
    >
      <div className="p-3">
        <SettingsTabs wsSlug={wsSlug} />
      </div>
      <div className="p-6">{children}</div>
    </ServerMapPositioner>
  );
}
