import { Hero } from "./hero";
import { ShowcaseTabs } from "./showcase-tabs";
import { Pricing } from "./pricing";
import { Storytelling } from "./storytelling";
import { Forms } from "./forms";
import { Demos } from "./demos";
import { Globe } from "./globe";

export default function Page() {
  return (
    <div className="absolute inset-0 h-screen w-screen overflow-hidden">
      <div className="absolute top-1/3 size-full">
        <Globe />;
      </div>
    </div>
  );
}

// TOLD PAGE
// export default function Page() {
//   return (
//     <>
//       <Hero />
//       <div className="flex flex-col gap-40">
//         <ShowcaseTabs />
//         <Storytelling />
//         <Forms />
//         <Demos />
//         <Pricing />
//       </div>
//     </>
//   );
// }
