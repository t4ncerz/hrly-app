"use client";

import Logo from "@/components/ui/logo";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function AuthHeader() {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Logo />
        {isSignedIn && (
          <div className="flex items-center space-x-3">
            <UserButton />
          </div>
        )}
      </div>
    </div>
  );
}
