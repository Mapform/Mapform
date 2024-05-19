import { TopBar } from "~/components/top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <TopBar>
        <div>Some content</div>
      </TopBar>
      {children}
    </div>
  );
}
