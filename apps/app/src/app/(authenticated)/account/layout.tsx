import { StandardLayout } from "~/components/standard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StandardLayout pathNav={[{ name: "Account", href: "/account" }]}>
      {children}
    </StandardLayout>
  );
}
