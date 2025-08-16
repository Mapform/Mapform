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
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}
