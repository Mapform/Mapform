import { Nav } from "./nav";
import Footer from "./footer";
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      {/* <Footer /> */}
    </>
  );
}
