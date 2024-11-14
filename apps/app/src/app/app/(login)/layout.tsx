import Link from "next/link";

export default function SigninPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full items-center">
      <div className="max-w-screen mx-auto flex w-[340px] max-w-screen-sm flex-col gap-8 px-4 pb-20">
        {children}
        <p className="text-muted-foreground text-sm">
          Need help?{" "}
          <Link className="link" href="mailto:hello@nichaley.com">
            Reach out
          </Link>
        </p>
      </div>
    </div>
  );
}
