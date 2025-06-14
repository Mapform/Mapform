import { Hero } from "./hero";
import { ShowcaseTabs } from "./showcase-tabs";
import { Pricing } from "./pricing";
import { Storytelling } from "./storytelling";
import { Forms } from "./forms";
import { Demos } from "./demos";

export default function Page() {
  return (
    <>
      <Hero />
      <div className="flex flex-col gap-40">
        <ShowcaseTabs />
        <Storytelling />
        <Forms />
        <Demos />
        <Pricing />
      </div>
    </>
  );
}
