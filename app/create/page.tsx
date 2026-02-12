"use client";

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import FormStructure from '../../components/FormStructure';
export default function CreatePage(){
  const {isSignedIn,isLoaded}=useAuth();
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/sign-in");
  }
  return (
   <FormStructure initialData={undefined} />
  )
}