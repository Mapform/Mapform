import { Nav } from "~/app/(marketing)/nav";
import { Hero } from "./hero";
import { ShowcaseTabs } from "./showcase-tabs";
import Footer from "./footer";

export default function Page() {
  return (
    <div className="relative flex h-screen flex-col">
      <Nav />
      <div className="flex flex-col gap-16">
        <Hero />
        <ShowcaseTabs />
        <Footer />
      </div>
    </div>
  );
}
