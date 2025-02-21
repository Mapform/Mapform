import { Hero } from "./hero";
import { ShowcaseTabs } from "./showcase-tabs";
import { Bento } from "./bento";
import { UseCases } from "./use-cases";

export default function Page() {
  return (
    <>
      <Hero />
      <div className="flex flex-col gap-40">
        <ShowcaseTabs />
        <Bento />
        <UseCases />
      </div>
    </>
  );
}
