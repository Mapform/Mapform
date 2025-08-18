import { SettingsDrawer } from "./drawer";
import { MapPositioner } from "~/components/map-positioner";
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
    <MapPositioner>
      <SettingsDrawer>
        <div className="p-2">
          <SettingsTabs wsSlug={wsSlug} />
        </div>
        <div className="p-6">{children}</div>
      </SettingsDrawer>
    </MapPositioner>
  );
}
