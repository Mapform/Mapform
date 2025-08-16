import Link from "next/link";
import { Hero } from "./hero";

export default function Page() {
  return (
    <>
      <Hero />
      <footer className="text-muted-foreground flex w-full items-center justify-center gap-1 bg-gray-50 p-4 text-sm">
        Made by{" "}
        <span>
          <Link
            className="underline"
            href="https://nichaley.com"
            target="_blank"
          >
            Nic
          </Link>{" "}
          in Montreal 🥯
        </span>
        {/* <span className="mx-2">•</span>
        <p className="text-center text-sm/6 text-gray-600">
          &copy; 2025 Mapform Inc. All rights reserved.
        </p> */}
      </footer>
    </>
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
