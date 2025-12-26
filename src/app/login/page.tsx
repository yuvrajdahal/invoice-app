"use client";
import * as z from "zod";

import Link from "next/link";
import AuthForm from "@/components/Auth/AuthForm";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(30, "Password must be at most 30 characters."),
  });
  const { login } = useAuth();

  const loginFields = [
    {
      name: "username",
      label: "Username:",
      type: "text",
      placeholder: "Enter username",
    },
    {
      name: "password",
      label: "Password:",
      type: "password",
      placeholder: "Enter password",
      showPasswordToggle: true,
    },
  ];

  const loginFooter = (
    <p className="text-gray-600 text-base">
      Don't have an account?{" "}
      <Link
        href="/register"
        className="text-teal-600 hover:text-teal-700 transition-colors"
      >
        Register
      </Link>
    </p>
  );

  return (
    <AuthForm
      schema={loginSchema}
      defaultValues={{ username: "", password: "" }}
      onSubmit={login}
      fields={loginFields}
      submitText="Login"
      title="Login"
      footer={loginFooter}
    />
  );
}
