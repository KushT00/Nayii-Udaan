/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-undef */
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
import { Account, Client, ID, Storage } from "appwrite";
import { useRouter } from "next/router";
import { FileUpload } from "@/components/ui/file-upload";
import { Calendar1Icon, PlusCircle } from "lucide-react";
import VoiceNavigationComponent from "@/components/voice";
import LanguageTranslationComponent from "@/components/language";



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
const storage = new Storage(client);


const Dashboard = () => {
  const [videoPreviews, setVideoPreviews] = useState<(string | null)[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [uploading, setUploading] = useState(false); // Uploading state
  const [buckets, setBuckets] = useState<any[]>([]); // State to store bucket list
  const [links, setLinks] = useState([]); // State to store all the links

  useEffect(() => {
    // Fetch the bucket list when the component mounts
    const fetchBucketList = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_bucket_list');
        const data = await response.json();
        setBuckets(data); // Set the bucket list in state

        const allLinks: ((prevState: never[]) => never[]) | ((url: string) => string)[] = []; // Initialize an array to store all links

        // Log the bucket IDs and get file views
        data.forEach((bucket: { $id: string }) => {
          console.log(bucket.$id);

          const result = storage.getFileView('679321850022e361f6d0', bucket.$id);
          console.log(result);

          // Assuming `result` contains the link you want
          if (result && result.link) {
            allLinks.push(result.link); // Add link to the array
          }
        });

        setLinks(allLinks); // Store the array of links in the state
      } catch (error) {
        console.error('Error fetching bucket list:', error);
      }
    };

    fetchBucketList(); // Call the function
  }, []); // Empty dependency array to run only once on mount

  // Handle file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      setFiles(uploadedFiles);
      console.log(uploadedFiles);
    }
  };

  // Upload file to Appwrite
  const uploadFileToAppwrite = async (file: File) => {
    setUploading(true);
    try {
      const fileID = ID.unique(); // Generate a unique ID for the file
      const response = await storage.createFile(
        '679321850022e361f6d0', // Replace with your actual bucket ID
        fileID,
        file
      );
      console.log("File uploaded successfully:", response);
      console.log(fileID)

      // Fetch the file preview URL after upload
      const filePreview = await storage.getFileView('679321850022e361f6d0', fileID);
      setVideoPreviews((prev) => [...prev, filePreview.href]);

      // Close the modal after uploading
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-1">
      <div className="p-4 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full overflow-auto">
        {/* Search Bar and Filters */}
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-1/2 p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-800 text-black dark:text-white"
          />
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Filter 1
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600">
              Filter 2
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
            >
              <span>Upload</span>
              <PlusCircle className="text-lg" />
            </button>
            
          </div>

        </div>

        {/* Video Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Video Card 1 */}
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <iframe
              className="w-full h-48"
              src="https://cloud.appwrite.io/v1/storage/buckets/679321850022e361f6d0/files/679332590039aa548457/view?project=67925af700164875e7f7&mode=admin"
              title="Event Video 1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="p-6">
              <h5 className="text-xl font-semibold text-black dark:text-white mb-2">
                How china helps indian economy
              </h5>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                This video will help you to know about impact of chinas action on indian economy
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

          {/* Video Card 2 */}
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <iframe
              className="w-full h-48"
              src="https://cloud.appwrite.io/v1/storage/buckets/679321850022e361f6d0/files/679332590039aa548457/view?project=67925af700164875e7f7&mode=admin"
              title="Event Video 2"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="p-6">
              <h5 className="text-xl font-semibold text-black dark:text-white mb-2">
                Helping india to become top power
              </h5>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                This video will help you to know about how india will become top power in coming years
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

          {/* Video Card 3 */}
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <iframe
              className="w-full h-48"
              src="https://cloud.appwrite.io/v1/storage/buckets/679321850022e361f6d0/files/679332590039aa548457/view?project=67925af700164875e7f7&mode=admin"
              title="Event Video 3"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="p-6">
              <h5 className="text-xl font-semibold text-black dark:text-white mb-2">
                How dollers affects india
              </h5>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                This video will help you to know about how doller will take over world  
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
        </div>
        <div className="flex items-center space-x-4">
  <LanguageTranslationComponent />
  <VoiceNavigationComponent />
</div>


        {/* Modal for file upload */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
                Upload Document
              </h2>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="w-full mb-4 p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-gray-100 dark:bg-neutral-800 text-black dark:text-white"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (files.length > 0) {
                      uploadFileToAppwrite(files[0]);
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};
