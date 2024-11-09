import { Resend } from "resend";
import { env } from "../../env.mjs";
import { Email, type EmailProps } from "./email";

const resend = new Resend(process.env.RESEND_API_KEY);

export function sendEmail({
  to,
  ...props
}: {
  to: string;
} & EmailProps): ReturnType<typeof resend.emails.send> {
  return resend.emails.send({
    to: env.NODE_ENV === "production" ? to : "delivered@resend.dev",
    from:
      env.NODE_ENV === "production"
        ? "Mapform <notifications@mapform.co>"
        : "Acme <onboarding@resend.dev>",
    subject: "Your Mapform magic link",
    react: <Email {...props} />,
  });
}
