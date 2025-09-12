import { useEffect, useState } from "react";

interface StreamingTextProps {
  text: string;
  speed?: number; // ms per character
}

export default function StreamingText({
  text,
  speed = 30,
}: StreamingTextProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");

    if (!text || text.length === 0) {
      return;
    }

    let cancelled = false;

    const typeNext = (index: number) => {
      if (cancelled) return;
      if (index >= text.length) return;
      setDisplayed((prev) => prev + text[index]);
      if (index + 1 < text.length) {
        const id = setTimeout(() => typeNext(index + 1), speed);
        // Ensure timeout is cleared if unmounted before it fires
        // by relying on the cancelled flag in cleanup
        void id; // prevent unused var lint in some configs
      }
    };

    typeNext(0);

    return () => {
      cancelled = true;
    };
  }, [text, speed]);

  return <span>{displayed}</span>;
}
