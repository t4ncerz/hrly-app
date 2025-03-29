"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
  Button,
} from "@headlessui/react";
import UserAvatar from "@/../public/images/user-avatar-32.png";
import { useClerk, useUser } from "@clerk/nextjs";

export default function DropdownProfile({
  align,
}: {
  align?: "left" | "right";
}) {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <Menu as="div" className="relative inline-flex">
      <MenuButton className="inline-flex justify-center items-center group hover:cursor-pointer">
        <Image
          className="w-8 h-8 rounded-full"
          src={user?.imageUrl ?? UserAvatar}
          width={32}
          height={32}
          alt="User"
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {user?.firstName}
          </span>
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </MenuButton>
      <Transition
        as="div"
        className={`origin-top-right z-10 absolute top-full min-w-[11rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${
          align === "right" ? "right-0" : "left-0"
        }`}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
          <div className="font-medium text-gray-800 dark:text-gray-100">
            {user?.fullName}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
            {user?.emailAddresses[0]?.emailAddress}
          </div>
        </div>
        <MenuItems as="ul" className="focus:outline-hidden">
          <MenuItem as="li">
            <Link
              className="font-medium text-sm flex items-center py-1 px-3 text-violet-500"
              href="/settings/account"
            >
              Ustawienia
            </Link>
          </MenuItem>
          <MenuItem as="li">
            <Button
              className="font-medium text-sm flex items-center hover:cursor-pointer py-1 px-3 text-violet-500"
              onClick={() => signOut()}
            >
              Wyloguj
            </Button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
