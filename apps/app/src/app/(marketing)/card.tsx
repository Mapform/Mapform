import { cn } from "@mapform/lib/classnames";

export const Card = ({
  emoji,
  title,
  children,
  className,
}: {
  emoji: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "w-[300px] rounded-2xl border bg-white p-4 shadow-lg",
          className,
        )}
      >
        <div className="flex flex-col gap-2">
          <span className="text-6xl">{emoji}</span>
          <h3 className="mb-4 text-3xl font-semibold">{title}</h3>
          {children}
        </div>
      </div>

      {/* <div className="mx-auto mt-4 flex size-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg">
        <MapPinIcon className="size-5 text-white" fill="currentColor" />
      </div> */}
    </div>
  );
};
