const navigation = {
  main: [
    { name: "Contact", href: "mailto:contact@mapform.co" },
    { name: "Changelog", href: "https://mapform.productlane.com/changelog" },
    { name: "Roadmap", href: "https://mapform.productlane.com/roadmap" },
    { name: "Terms of service", href: "/terms-of-use" },
    { name: "Privacy policy", href: "/privacy-policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          aria-label="Footer"
          className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6"
        >
          {navigation.main.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <p className="mt-10 text-center text-sm/6 text-gray-600">
          &copy; 2025 Mapform Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
