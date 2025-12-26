"use client";
import * as z from "zod";

import Link from "next/link";
import AuthForm from "@/components/Auth/AuthForm";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(30, "Password must be at most 30 characters."),
  });

 
  const { register} = useAuth();

  const registerFields = [
    {
      name: "username" as const,
      label: "Username:",
      type: "text",
      placeholder: "Enter username",
    },
    {
      name: "password" as const,
      label: "Password:",
      type: "password",
      placeholder: "Enter password",
      showPasswordToggle: true,
    },
  ];

  const registerFooter = (
    <p className="text-gray-600 text-base">
      Already have an account?{" "}
      <Link
        href="/register"
        className="text-teal-600 hover:text-teal-700 transition-colors"
      >
        Login
      </Link>
    </p>
  );

  return (
    <AuthForm
      schema={registerSchema}
      defaultValues={{ username: "", password: "" }}
      onSubmit={register}
      fields={registerFields}
      submitText="Register"
      title="Register"
      footer={registerFooter}
    />
  );
}
