'use client';
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Account, Client, OAuthProvider } from "appwrite";

// Initialize Appwrite Client
const client = new Client().setProject("67925af700164875e7f7");  // Replace with your Appwrite project ID
const account = new Account(client);
/* eslint-disable react/jsx-no-undef */
export default function Login() {
   
    const handleGoogleLogin = () => {
      try {
        account.createOAuth2Session(
          OAuthProvider.Google, // GitHub as the OAuth provider
          "http://localhost:3000/dashboard", // Redirect to localhost on success
          "http://localhost:3000/failed" // Redirect to localhost on failure
        );
      } catch (error) {
        console.error("GitHub Login Failed:", error);
        postMessage("Something went wrong. Please try again.");
      }
    };
    const handleGithubLogin = () => {
      try {
        account.createOAuth2Session(
          OAuthProvider.Github, // provider
          "http://localhost:3000/dashboard", // Redirect to localhost on success
          "http://localhost:3000/failed" // Redirect to localhost on failure
        
      
        );
      } catch (error) {
        console.error("GitHub Login Failed:", error);
        postMessage("Something went wrong. Please try again.");
      }
    };

  return (
    <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-[60%,40%] font-[family-name:var(--font-geist-sans)]">
      {/* Left side for the image */}

      <div
        className="relative bg-cover bg-center rounded-tr-[10px] m-0.5 overflow-hidden"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/96/46/d0/9646d012c85b72921eb745468770de9b.jpg')",
          clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
        }}
      >
        <div className="absolute   flex flex-col justify-between p-6 text-white">
          <div>
            <h1 className="text-2xl font-bold">Nayi Udaan</h1>
          </div>
        </div>
      </div>


      {/* Right side for the SignupForm */}
      <div className="flex items-center justify-center p-8">
        <form className="flex flex-col items-center gap-4 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Hi Designer</h1>
            <p className="text-muted-foreground">Welcome to UISOCIAL</p>
          </div>
          <div className="w-full grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="w-full grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          
          <Button type="submit" className="w-full bg-[#2A1D13] text-white">
            Login
          </Button>
          <div className="text-center text-sm mt-4">
            <a href="#" className="text-gray-600 underline underline-offset-4">
              Forgot password?
            </a>
          </div>
          <div className="relative text-center text-sm my-2">
            <span className="bg-white px-1 text-gray-500">
              Or login with
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}><IconBrandGoogle /></Button>
            <Button variant="outline" className="w-full" onClick={handleGithubLogin}><IconBrandGithub /></Button>
          </div>
          <div className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <a href="signup" className="text-red-500 underline underline-offset-4">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
