import { Hero } from "./hero";
import { ShowcaseTabs } from "./showcase-tabs";
// import { Bento } from "./bento";
// import { UseCases } from "./use-cases";
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
        {/* <Bento />
        <UseCases /> */}
        <Demos />
        <Pricing />
      </div>
    </>
  );
}
