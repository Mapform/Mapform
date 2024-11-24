import Link from "next/link";
import Image from "next/image";
import mapform from "public/static/images/mapform.svg";
import { SignIn } from "./sign-in";

export function Nav() {
  return (
    <header className="sticky inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link className="-m-1.5 p-1.5" href="/">
            <span className="sr-only">Your Company</span>
            <Image alt="Logo" className="inline h-8 w-8" src={mapform} />
          </Link>
        </div>
        <div className="flex flex-1 justify-end">
          <SignIn />
        </div>
      </nav>
    </header>
  );
}
