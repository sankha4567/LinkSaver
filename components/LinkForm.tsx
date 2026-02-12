"use client"
import React from 'react'
import {useForm} from 'react-hook-form';

import { zodResolver } from "@hookform/resolvers/zod";
import { linkSchema, LinkSchema } from "../lib/validations";
import { useMutation } from "convex/react";
import { api } from '../convex/_generated/api';

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { Loader2, Link2, FileText, Type } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
interface FormStructureProps{
  _id?:Id<'links'>;
  title?:string;
  url?:string;
  note?:string;
  createdAt?:number;
}
const LinkForm = ({initialData}:{initialData?:FormStructureProps}) => {
  const {register,handleSubmit,formState:{errors,isSubmitting},reset}=useForm<LinkSchema>({
    resolver:zodResolver(linkSchema),
    defaultValues:{
      title:initialData?.title || "",
      url:initialData?.url || "",
      note:initialData?.note || "",
    }
  });
  const handleClearAll = () => {
    reset({
      title: "",
      url: "",
      note: ""
    });
  };
  const createLink=useMutation(api.links.createLink);
  const updateLink=useMutation(api.links.updateLink);
  const router=useRouter();
  async function onSubmit(data:LinkSchema){
   try{
    if(initialData?._id){
      await updateLink({
        linkId:initialData._id as Id<"links">,
        title:data.title,
        url:data.url,
        note:data.note || "",
      });
      toast.success("Link updated successfully");
  }
  else{
    
    await createLink({
      title:data.title,
      url:data.url,
      note:data.note || "",
    });
    toast.success("Link created successfully");
   
  }
    reset();
    router.push("/");
   }
   catch(error){
    toast.error("Failed to create link");
   }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Register</h1>
        <p className="text-gray-600 mb-6">Create your saved link with validated fields</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" {...register("title")} placeholder="Enter the title of the link" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900" />
            {errors.title && (<p className="text-red-500 text-sm mt-1">{errors.title.message}</p>)}
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
            <input type="text" {...register("url")} placeholder="Enter the url of the link" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900" />
            {errors.url && (<p className="text-red-500 text-sm mt-1">{errors.url.message}</p>)}
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
            <input type="text" {...register("note")} placeholder="Enter the note of the link" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900" />
            {errors.note && (<p className="text-red-500 text-sm mt-1">{errors.note.message}</p>)}
          </div>
          <div className="flex items-center justify-between gap-2">
            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"> {isSubmitting ? 'Submitting...' : 'Register'}</button>

            <button type="button" onClick={handleClearAll} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">Clear</button>
          </div>
        </form>
        </div>
        </div>
  )
}

export default LinkForm
