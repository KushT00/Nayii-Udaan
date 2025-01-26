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
import { Calendar1Icon } from "lucide-react";
import LanguageTranslationComponent from "@/components/language";
import VoiceNavigationComponent from "@/components/voice";


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

interface DataItem {
    contact: string;
    desc: string;
    email: string;
    location: string;
    name: string;
    required_amt: string;
    title: string;
}
const Dashboard = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [reqAmt, setReqAmt] = useState('');
    const [location, setLocation] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [data, setData] = useState<DataItem[]>([]); // Specify the type of data here

    useEffect(() => {
        fetch('http://127.0.0.1:5000/get_data')
            .then((response) => response.json())
            .then((result) => {
                const filteredData = result.map((item: any) => ({
                    contact: item.contact,
                    desc: item.desc,
                    email: item.email,
                    location: item.location,
                    name: item.name,
                    required_amt: item.required_amt,
                    title: item.title,
                }));
                setData(filteredData);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);


    const result = databases.listDocuments(
        '67933150002385c06665', // databaseId
        '6793315a001d1edc3831', // collectionId
        [] // queries (optional)
    );
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        // Check for empty fields (you can add more validation as needed)
        if (!title || !desc || !name || !contact || !email || !reqAmt || !location) {
            alert('Please fill in all fields');
            return;
        }

        const formData = {
            title,
            desc,
            name,
            contact,
            email,
            location,
            required_amt: reqAmt, // Corrected field name assignment
        };

        try {
            const response = await fetch('http://localhost:5000/push_data', {  // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Data successfully pushed:', data);
                alert('Data submitted successfully!');
                setIsDialogOpen(false); // Close the dialog after successful submission
            } else {
                console.error('Error:', data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        }


    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
        return (event: { target: { value: string } }) => {
            setter(event.target.value);
        };
    };

    const handleSearchChange = (event: { target: { value: string } }) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="flex flex-1">
            <div className="p-4 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full overflow-y-auto">
                {/* Search Bar and Submit Button */}
                <div className="flex items-center gap-4 mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search or enter your idea"
                        className="px-6 py-3 w-full border rounded-lg text-black dark:text-white dark:bg-neutral-800 bg-neutral-100"
                    />
                    <button
                        className="shadow-lg hover:shadow-xl hover:bg-blue-600 px-8 py-3 bg-blue-500 rounded-lg text-white font-medium transition-all duration-300"
                        onClick={() => setIsDialogOpen(true)} // Open dialog when the button is clicked
                    >
                        Idea
                    </button>
                </div>

                <div className="p-6">
  <h1 className="text-3xl font-bold text-black dark:text-white mb-8">Dashboard</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {data.map((item, index) => (
      <div
        key={index}
        className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 hover:scale-105 transition-transform"
      >
        <h2 className="text-xl font-semibold text-black dark:text-white mb-4">{item.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-medium text-black dark:text-white">Description:</span> {item.desc}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-medium text-black dark:text-white">Contact:</span> {item.contact}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-medium text-black dark:text-white">Email:</span> {item.email}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-medium text-black dark:text-white">Location:</span> {item.location}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <span className="font-medium text-black dark:text-white">Name:</span> {item.name}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium text-black dark:text-white">Required Amount:</span> ₹{item.required_amt}
        </p>
      </div>
    ))}
  </div>
</div>
<LanguageTranslationComponent/>
<VoiceNavigationComponent/>


                {/* Dialog Box */}
                {isDialogOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full dark:bg-neutral-800 dark:text-white">
                            <h3 className="text-xl font-semibold mb-6">Submit Your Idea</h3>
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleInputChange(setTitle)}
                                    placeholder="Title"
                                    className="px-4 py-3 w-full border rounded-lg dark:bg-neutral-800 dark:text-white bg-neutral-100"
                                />
                                <textarea
                                    value={desc}
                                    onChange={handleInputChange(setDesc)}
                                    placeholder="Description"
                                    className="px-4 py-3 w-full border rounded-lg dark:bg-neutral-800 dark:text-white bg-neutral-100"
                                />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleInputChange(setName)}
                                    placeholder="Name"
                                    className="px-4 py-3 w-full border rounded-lg dark:bg-neutral-800 dark:text-white bg-neutral-100"
                                />
                                <input
                                    type="text"
                                    value={contact}
                                    onChange={handleInputChange(setContact)}
                                    placeholder="Contact"
                                    className="px-4 py-3 w-full border rounded-lg dark:bg-neutral-800 dark:text-white bg-neutral-100"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                    placeholder="Email"
                                    className="px-4 py-3 w-full border rounded-lg dark:bg-neutral-800 dark:text-white bg-neutral-100"
                                />
                                <input
                                    type="text"
                                    value={reqAmt}
                                    onChange={handleInputChange(setReqAmt)}
                                    placeholder="Required Amount"
                                    className="px-4 py-3 w-full border rounded-lg dark:bg-neutral-800 dark:text-white bg-neutral-100"
                                />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={handleInputChange(setLocation)}
                                    placeholder="Location"
                                    className="px-4 py-3 w-full border rounded-lg dark:bg-neutral-800 dark:text-white bg-neutral-100"
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    onClick={handleDialogClose}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={handleSubmit}  // Submit data on this button click
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>


    );
};

