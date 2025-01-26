'use client'
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
    IconClipboardCopy,
    IconBoxAlignTopLeft
} from "@tabler/icons-react";

export default function PlaceholdersAndVanishInputDemo() {
    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];

    const [inputValue, setInputValue] = useState("");
    const [responseData, setResponseData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:4444/schemes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: inputValue }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const textResponse = await response.text();
            
            try {
                const jsonData = JSON.parse(textResponse.replace(/^```json\n|\n```$/g, ''));
                setResponseData(jsonData);
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                setResponseData(null);
                setError("Failed to parse response data.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[40rem] flex flex-col justify-center items-center px-4 overflow-y-auto">

            <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
                Ask Udaan UI Anything
            </h2>
            <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
                value={inputValue}
            />

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {responseData && (
                <BentoGrid className="mt-10">
                    {responseData.schemes?.map((scheme: any, i: number) => (
                        <BentoGridItem
                            key={`scheme-${i}`}
                            title={scheme.scheme_name}
                            description={scheme.description}
                            header={<div className="text-lg font-semibold">{scheme.scheme_name}</div>}
                            icon={<IconClipboardCopy className="h-4 w-4 text-neutral-500" />}
                            url={scheme.url}
                        >
                            <div className="mt-2">
                                <p><strong>Eligibility:</strong> {scheme.eligibility}</p>
                                <p><strong>Benefits:</strong> {scheme.benefits}</p>
                                <p><strong>Application Process:</strong> {scheme.application_process}</p>
                            </div>
                        </BentoGridItem>
                    ))}

                    {responseData.ngos?.map((ngo: any, i: number) => (
                        <BentoGridItem
                            key={`ngo-${i}`}
                            title={ngo.ngo_name}
                            description={ngo.description}
                            header={<div className="text-lg font-semibold">{ngo.ngo_name}</div>}
                            icon={<IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />}
                            url={ngo.url}
                        >
                            <div className="mt-2">
                                <p><strong>Focus Area:</strong> {ngo.focus_area}</p>
                                <p><strong>Location:</strong> {ngo.location}</p>
                                <p><strong>Contact:</strong></p>
                                <p><strong>Phone:</strong> {ngo.contact_information.phone}</p>
                                <p><strong>Email:</strong> {ngo.contact_information.email}</p>
                            </div>
                        </BentoGridItem>
                    ))}
                </BentoGrid>
            )}
        </div>
    );
}

