import { StackedLayout } from "./StackedLayout";

export default function Layout({
  children,
  subnav,
}: {
  children: React.ReactNode;
  subnav: React.ReactNode;
}) {
  return <StackedLayout subnav={subnav}>{children}</StackedLayout>;
}
