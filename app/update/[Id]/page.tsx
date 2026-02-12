"use client";
import React from 'react'
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import {useQuery} from 'convex/react';
import type { Id } from '@/convex/_generated/dataModel';
import FormStructure from '@/components/FormStructure';

const UpdatePage = () => {
  const {isSignedIn,isLoaded}=useAuth();
  const params = useParams<{ Id: string }>();
  const linkId = params.Id as Id<"links">;
  const link=useQuery(api.links.getLinkById,{linkId});

  if (!isLoaded || link === undefined) {
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
    <div>
      <FormStructure initialData={link} />
    </div>
  )
}

export default UpdatePage;
