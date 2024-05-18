import { signIn } from "~/auth";

export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("resend", formData);
      }}
    >
      <input name="email" placeholder="Email" type="text" />
      <button type="submit">Signin with Resend</button>
    </form>
  );
}
