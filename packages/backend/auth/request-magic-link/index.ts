import jwt from "jsonwebtoken";
import { sendEmail } from "@mapform/transactional/emails/magic-links";
import { type RequestMagicLinkSchema } from "./schema";
import { env } from "../../env.mjs";

export const requestMagicLink = async ({ email }: RequestMagicLinkSchema) => {
  // 1. Generate a jwt token
  const token = jwt.sign({ email }, env.JWT_SECRET, {
    expiresIn: "10m",
  });

  // 2. Send the email
  sendEmail({
    to: email,
    // Temp
    link: `http://localhost:3000/api/auth/magic-link?token=${token}`,
  });
};
