"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from "@mapform/ui/components/form";
import { Button } from "@mapform/ui/components/button";
import { Input } from "@mapform/ui/components/input";
import { useAction } from "next-safe-action/hooks";
import {
  requestMagicLinkSchema,
  type RequestMagicLinkSchema,
} from "@mapform/backend/data/auth/request-magic-link/schema";
import { MailCheckIcon, CircleHelpIcon, TimerIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
} from "@mapform/ui/components/alert";
import mapform from "public/static/images/mapform.svg";
import type { MagicLinkErrors } from "~/constants/magic-link-errors";
import { requestMagicLinkAction } from "./actions";

const errors: Record<MagicLinkErrors, { text: string; icon: LucideIcon }> = {
  "not-found": {
    text: "An unknown error occurred. Please try again.",
    icon: CircleHelpIcon,
  },
  expired: {
    text: "Magic link expired. Please request a new one.",
    icon: TimerIcon,
  },
  unknown: {
    text: "An unknown error occurred. Please try again.",
    icon: CircleHelpIcon,
  },
};

export function SignInForm({ type }: { type: "signin" | "signup" }) {
  const searchParams = useSearchParams();
  const [emailSent, setEmailSent] = useState(false);
  const { execute, status } = useAction(requestMagicLinkAction, {
    onSuccess: () => {
      setEmailSent(true);
    },
  });

  const error = searchParams.get("error") as MagicLinkErrors | null;

  const form = useForm<RequestMagicLinkSchema>({
    resolver: zodResolver(requestMagicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: RequestMagicLinkSchema) {
    execute(values);
  }

  if (emailSent) {
    return (
      <>
        <MailCheckIcon className="h-10 w-10 text-green-600" />
        <div>
          <h1 className="mb-2 text-2xl font-semibold text-stone-900">
            Let&apos;s verify your email
          </h1>
          <p className="text-muted-foreground">
            We sent you a magic link to sign in.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {error ? (
        <Alert>
          <AlertIcon icon={errors[error].icon} />
          <AlertDescription>{errors[error].text}</AlertDescription>
        </Alert>
      ) : null}
      <Image alt="Logo" className="inline h-10 w-10" src={mapform} />
      <div>
        <h1 className="mb-2 text-2xl font-semibold text-stone-900">
          {type === "signin"
            ? "Sign in to Mapform"
            : "Get Started with Mapform"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {type === "signin"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            className="link"
            href={type === "signin" ? "/app/signup" : "/app/signin"}
          >
            {type === "signin" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="name@email.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            disabled={status === "executing"}
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
