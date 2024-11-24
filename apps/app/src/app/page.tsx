import { Nav } from "~/components/landing/nav";
import { Globe } from "~/components/landing/globe";

export default function Page() {
  return (
    <div>
      <Nav />
      <div className="flex flex-col items-center">
        <div className="w-[400px]">
          <Globe />
        </div>
      </div>
    </div>
  );
}
