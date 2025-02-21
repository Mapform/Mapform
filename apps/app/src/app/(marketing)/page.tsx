import { Hero } from "./hero";
import { ShowcaseTabs } from "./showcase-tabs";
import Footer from "./footer";
import { Storytelling } from "./storytelling";
import { Forms } from "./forms";

export default function Page() {
  return (
    <>
      <Hero />
      <div className="flex flex-col gap-40">
        <ShowcaseTabs />
        <Storytelling />
        <Forms />
        <Footer />
      </div>
    </>
  );
}
