import { Button, Html } from "@react-email/components";
import * as React from "react";

export interface EmailProps {
  link: string;
}

export const Email = ({ link }: EmailProps) => {
  return (
    <Html>
      <Button
        href={link}
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Log in
      </Button>
    </Html>
  );
};
