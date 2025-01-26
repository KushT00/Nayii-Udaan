/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";

import {
  IconArrowLeft,
  IconBrandTabler,
  IconMoon,
  IconSettings,
  IconSun,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useUser } from "@/context/userContext";
import { Account, Client, Databases } from "appwrite";
import { useRouter } from "next/router";
import LanguageTranslationComponent from "@/components/language";
import VoiceNavigationComponent from "@/components/voice";
import { Calendar1Icon } from "lucide-react";


const client = new Client()
  .setProject('67925af700164875e7f7'); // Your project ID

const account = new Account(client);

export default function SidebarDemo() {

  const [theme, setTheme] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };


  const Logout = async () => {
    const router = useRouter();

    try {
      const result = await account.deleteSessions();
      console.log(result);

      // Redirect to the login page
      router.push('/login');
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };


  const { userName } = useUser();
  const links = [
    {
      label: "Community",
      href: "content",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },

    {
      label: "Schemes",
      href: "/schemes",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Angel Listing",
      href: "/crowdfunding",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Events",
      href: "/events",
      icon: (
        <Calendar1Icon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/auth/login",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Panchayat",
      href: "panchayat",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },

  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">

              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <button
                onClick={toggleTheme}
                className="flex items-center max-w-20 justify-center p-1 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow-md transition-all hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {theme === "light" ? (
                  <IconMoon className="h-5 w-5 text-blue-500" />
                ) : (
                  <IconSun className="h-5 w-5 text-yellow-400" />
                )}
              </button>
            </div>
          </div>

          <div>


            <SidebarLink
              link={{
                label: userName || "Guest",
                href: "/profile",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Nayi Udaan
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const databases = new Databases(client);

const Dashboard = () => {


  return (
    <div className="flex flex-1">
      <div className="p-4 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full overflow-auto">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">
            Upcoming Events
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event Card 1 */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src="https://plus.unsplash.com/premium_photo-1682092655459-2ba62ad1ee17?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cnVyYWwlMjBpbmRpYXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Event"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h5 className="text-xl font-semibold text-black dark:text-white mb-3">
                  Rural Innovation Summit
                </h5>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Explore how innovation is shaping rural communities...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <strong>Date:</strong> 25th January 2025
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <strong>Time:</strong> 6:00 PM
                </p>
                <a
                  href="#"
                  className="block w-full text-center py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Go to Event
                </a>
              </div>
            </div>
            {/* Event Card 2 */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src="https://plus.unsplash.com/premium_photo-1681550097108-187abe10d445?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXJjaGl0ZWN0dXJlfGVufDB8fDB8fHww"
                alt="Event"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h5 className="text-xl font-semibold text-black dark:text-white mb-3">
                  Architectural Wonders
                </h5>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  A showcase of modern and historic architectural designs...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <strong>Date:</strong> 28th January 2025
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <strong>Time:</strong> 4:00 PM
                </p>
                <a
                  href="#"
                  className="block w-full text-center py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Go to Event
                </a>
              </div>
            </div>
            {/* Event Card 3 */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img
                src="https://plus.unsplash.com/premium_photo-1682141721960-fcecf4022b5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kdXN0cmllc3xlbnwwfHwwfHx8MA%3D%3D"
                alt="Event"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h5 className="text-xl font-semibold text-black dark:text-white mb-3">
                  Industry Networking Gala
                </h5>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  A networking event for professionals across various industries...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <strong>Date:</strong> 30th January 2025
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <strong>Time:</strong> 7:00 PM
                </p>
                <a
                  href="#"
                  className="block w-full text-center py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Go to Event
                </a>
              </div>
            </div>
            <div className="flex items-center ">
              <LanguageTranslationComponent />
              <VoiceNavigationComponent />
            </div>

          </div>
        </div>
      </div>
    </div>
  );

};

