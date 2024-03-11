import { Button } from "@mapform/ui/components/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <UserButton />
      <Button variant="default">test</Button>
      <p className="text-foreground">Some text</p>
    </main>
  );
}
