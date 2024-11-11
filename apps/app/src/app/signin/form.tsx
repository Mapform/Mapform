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
} from "@mapform/backend/auth/request-magic-link/schema";
import { MailCheckIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import mapform from "public/static/images/mapform.svg";
import { requestMagicLinkAction } from "~/data/auth/request-magic-link";

export function SignInForm() {
  const [emailSent, setEmailSent] = useState(false);
  const searchParams = useSearchParams();
  const { execute, status } = useAction(requestMagicLinkAction, {
    onSuccess: () => {
      setEmailSent(true);
    },
  });

  // const error = searchParams.get("error") as
  //   | "not-found"
  //   | "expired"
  //   | "unknown"
  //   | null;

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
      <div>
        <MailCheckIcon className="mb-4 h-10 w-10 text-green-600" />
        <h1 className="mb-2 text-2xl font-semibold text-stone-900">
          Let&apos;s verify your email
        </h1>
        <p className="text-muted-foreground">
          We sent you a magic link to sign in.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div>
        <Image alt="Logo" className="mb-4 inline h-10 w-10" src={mapform} />
        <h1 className="text-2xl font-semibold text-stone-900">
          Sign in to Mapform
        </h1>
      </div>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
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
  );
}
