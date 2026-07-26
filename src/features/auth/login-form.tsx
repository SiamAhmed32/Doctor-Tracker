"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useLoginMutation } from "./auth-api";
import { getErrorMessage } from "./get-error-message";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error, reset }] = useLoginMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    reset();

    try {
      await login({ email: email.trim(), password }).unwrap();
      router.replace("/dashboard");
      router.refresh();
    } catch {
      // Error is shown from mutation state.
    }
  }

  return (
    <form className="space-y-5" method="post" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@doctortracker.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 rounded-lg"
          required
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-foreground"
          htmlFor="password"
        >
          Password
        </label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-destructive-soft px-3 py-2.5 text-sm text-destructive">
          {getErrorMessage(error, "Unable to sign in")}
        </p>
      ) : null}
      <Button className="h-11 w-full rounded-lg text-sm font-semibold" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
