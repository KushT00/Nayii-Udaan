"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Client, Account } from "appwrite";

const client = new Client().setProject("67925af700164875e7f7");
const account = new Account(client);

type UserContextType = {
  userName: string | null;
  userId: string | null;
  userLabels: string[];
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  setUserLabels: React.Dispatch<React.SetStateAction<string[]>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode; // Explicitly define the children prop type
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLabels, setUserLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const result = await account.get();
        setUserName(result.name);
        setUserId(result.$id);
        setUserLabels(result.labels || []);
      } catch (error) {
        console.error("Error fetching account data:", error);
        // Redirect to login if not logged in
      }
    };

    fetchAccount();
  }, []);

  return (
    <UserContext.Provider
      value={{ userName, userId, userLabels, setUserName, setUserId, setUserLabels }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
