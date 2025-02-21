import { Nav } from "~/components/landing/nav";
import { Hero } from "./hero";
import { TabsShowcase } from "./tabs";

export default function Page() {
  return (
    <div className="relative flex h-screen flex-col">
      <Nav />
      <Hero />
      <TabsShowcase />
    </div>
  );
}
