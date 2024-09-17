import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex h-full justify-center items-center">
      <Image
        alt="Loading"
        className="animate-pulse"
        height={48}
        src="/mapform.svg"
        width={48}
      />
    </div>
  );
}
