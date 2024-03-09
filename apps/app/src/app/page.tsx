import { Button } from "@mapform/ui";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <UserButton />
      <Button appName="test">test</Button>
    </main>
  );
}
