import { Nav } from "~/app/(marketing)/nav";
import { Hero } from "./hero";
import { TabsShowcase } from "./tabs";
import Footer from "./footer";

export default function Page() {
  return (
    <div className="relative flex h-screen flex-col">
      <Nav />
      <div className="flex flex-col gap-20">
        <Hero />
        <TabsShowcase />
        <Footer />
      </div>
    </div>
  );
}
