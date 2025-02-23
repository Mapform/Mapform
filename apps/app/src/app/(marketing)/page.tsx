import { Hero } from "./hero";
import { ShowcaseTabs } from "./showcase-tabs";
// import { Bento } from "./bento";
// import { UseCases } from "./use-cases";
import { Pricing } from "./pricing";
export default function Page() {
  return (
    <>
      <Hero />
      <div className="flex flex-col gap-40">
        <ShowcaseTabs />
        {/* <Bento />
        <UseCases /> */}
        <Pricing />
      </div>
    </>
  );
}
