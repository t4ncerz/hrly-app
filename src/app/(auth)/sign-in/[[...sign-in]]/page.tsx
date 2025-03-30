"use client";

import { SignIn } from "@clerk/nextjs";
import AuthHeader from "../../auth-header";
import AuthImage from "../../auth-image";
import { env } from "@/data/env/client";

export default function SignInPage() {
  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="relative md:flex">
        {/* Content */}
        <div className="md:w-1/2">
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">
            <AuthHeader />
            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-gray-800 dark:text-gray-100 font-bold mb-6">
                Witaj ponownie!
              </h1>
              <div className="flex justify-center">
                <SignIn
                  signUpUrl={env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white",
                      card: "p-0 bg-transparent shadow-none",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <AuthImage />
      </div>
    </main>
  );
}
