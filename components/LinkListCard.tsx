"use client"
import React from 'react'
import { Id } from '@/convex/_generated/dataModel';
import {ExternalLink,Trash2,FileText,Edit} from 'lucide-react';
import { api } from '@/convex/_generated/api';
import {useMutation} from 'convex/react';
import {toast} from 'react-hot-toast';
import {useRouter} from 'next/navigation';
import NextLink from 'next/link';
 interface LinkCardProps{
  _id:Id<'links'>;
  title:string;
  url:string;
  note?:string;
  createdAt:number;
 }
const LinkListCard = ({Link}:{Link:LinkCardProps}) => {
 
  const deleteLink=useMutation(api.links.deleteLink);
  async function handleDelete(){
     try{
      await deleteLink({linkId:Link._id});
      toast.success("Link deleted successfully");
      
     }
     catch(err){
      toast.error("Failed to delete link");
     }
  } 
  function getDomain(url:string){
    try{
      return new URL(url).hostname.replace('www.','');
    }
    catch(err){
      toast.error("Invalid URL");
    }
    }
    function formatDate(timestamp:number){
      return new Date(timestamp).toLocaleDateString("en-US",{
        month:"short",
        day:"numeric",
        year:"numeric",
      })
    }
  
  return (
   
    <div className='bg-white rounded-xl border border-gray-200  p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 group'>
    
      <div className='flex items-center justify-between gap-4'>
        <div className='flex-1 min-w-0'>
           <h3 className='text-lg font-medium text-gray-900 truncate'>{Link.title}</h3>
           <a href={Link.url} target='_blank' rel='noopener noreferrer' className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mt-1 truncate max-w-full"
          >
            <ExternalLink className="h-4 w-4" />
            <span>{getDomain(Link.url)}</span>

           </a>
        </div>
        <NextLink href={`/update/${Link._id}`} >
        <button className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Edit link">
          <Edit className="h-4 w-4" />
        </button>
        </NextLink>
        <button
          onClick={handleDelete}
          className="p-2 text-indigo-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Delete link"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {Link?.note && (
        <div className="mt-3 flex items-start gap-2">
          <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">{Link?.note}</p>
        </div>
      )}
        <div className="mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{formatDate(Link?.createdAt)}</span>
      </div>
    
    </div>
   
  )
}

export default LinkListCard
