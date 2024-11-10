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
// import { resendVerificationEmail, signUp } from "../actions/auth.actions";
import { toast } from "@mapform/ui/components/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import {
  requestMagicLinkSchema,
  type RequestMagicLinkSchema,
} from "@mapform/backend/auth/request-magic-link/schema";
import { requestMagicLinkAction } from "~/data/auth/request-magic-link";
// import { useCountdown } from "usehooks-ts";
// import { signIn } from "@/actions/magic-link.actions";

export function SignInForm() {
  // const [count, { startCountdown, stopCountdown, resetCountdown }] =
  //   useCountdown({
  //     countStart: 60,
  //     intervalMs: 1000,
  //   });

  // useEffect(() => {
  //   if (count === 0) {
  //     stopCountdown();
  //     resetCountdown();
  //   }
  // }, [count]);

  // const [showResendVerificationEmail, setShowResendVerificationEmail] =
  //   useState(false);

  // const router = useRouter();
  const { execute } = useAction(requestMagicLinkAction);

  const form = useForm<RequestMagicLinkSchema>({
    resolver: zodResolver(requestMagicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: RequestMagicLinkSchema) {
    execute(values);

    // if (!res.success) {
    //   toast({
    //     variant: "destructive",
    //     description: res.message,
    //   });
    // } else if (res.success) {
    //   toast({
    //     variant: "default",
    //     description: res.message,
    //   });

    //   router.push("/");
    // }
  }

  // const onResendVerificationEmail = async () => {
  //   const res = await resendVerificationEmail(form.getValues("email"));
  //   if (res.error) {
  //     toast({
  //       variant: "destructive",
  //       description: res.error,
  //     });
  //   } else if (res.success) {
  //     toast({
  //       variant: "default",
  //       description: res.success,
  //     });
  //     startCountdown();
  //   }
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
        />{" "}
        <Button className="w-full" type="submit">
          Submit
        </Button>
      </form>
      {/* {showResendVerificationEmail && (
        <Button
          disabled={count > 0 && count < 60}
          onClick={onResendVerificationEmail}
          variant={"link"}
        >
          Send verification email {count > 0 && count < 60 && `in ${count}s`}
        </Button>
      )} */}
    </Form>
  );
}
