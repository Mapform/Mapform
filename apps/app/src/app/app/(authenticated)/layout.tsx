import { MobileWarning } from "~/components/mobile-warning";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* <MobileWarning /> */}
    </>
  );
}
