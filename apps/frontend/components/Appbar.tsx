"use client"
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import { Activity } from 'lucide-react'
import { useRouter } from 'next/navigation';
export const Appbar = () => {
  const router = useRouter();
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 border-b dark:border-gray-800">
      <div className="flex  items-center gap-4"> 
        <div className="flex items-center space-x-2">
          <Activity className="w-8 h-8 text-emerald-400" />
          <button className="text-2xl font-bold text-white cursor-pointer" onClick={() => {
            router.push("/");
          }}>DecentraWatch</button>
        </div>
      </div>
      <div className="flex justify-end items-center gap-4">
        <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition">
                  Sign Up
                </button>
              </SignUpButton>
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn> 
      </div>
        
    </header>
  )
}
