"use client";

import {useAuth} from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import LinkList from "@/components/LinkList";
import { useSearchStore } from "@/store/search-store";
export default function Home() {
 
  const {isSignedIn,isLoaded}=useAuth();
  const searchTerm=useSearchStore((state)=>state.searchTerm);
  if(!isLoaded){
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900">
        <p className="text-gray-900 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }
  if(!isSignedIn){
    redirect("/sign-in");
  }
  
  return (
   <div className="min-h-screen bg-gray-50">
    <Navbar/>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Links</h1>
        <LinkList searchTerm={searchTerm} />
      </main>
    </div>
  );
}
