import Link from "next/link";
import Image from "next/image";
import mapform from "public/static/images/mapform.svg";

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link className="-m-1.5 p-1.5" href="/">
            <span className="sr-only">Your Company</span>
            <Image alt="Logo" className="inline h-10 w-10" src={mapform} />
          </Link>
        </div>
        {/* <div className="flex lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm/6 font-semibold text-gray-900"
          >
            {item.name}
          </a>
        ))}
      </div> */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link className="text-sm/6 font-semibold text-gray-900" href="#">
            Sign in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
