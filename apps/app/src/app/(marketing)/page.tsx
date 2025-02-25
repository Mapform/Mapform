import { Hero } from "./hero";
import { ShowcaseTabs } from "./showcase-tabs";
// import { Bento } from "./bento";
// import { UseCases } from "./use-cases";
import { Pricing } from "./pricing";
import { Storytelling } from "./storytelling";

export default function Page() {
  return (
    <>
      <Hero />
      <div className="flex flex-col gap-40">
        <ShowcaseTabs />
        <Storytelling />
        {/* <Bento />
        <UseCases /> */}
        <Pricing />
      </div>
    </>
  );
}
