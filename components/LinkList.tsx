"use client"
import React from 'react'
import {useQuery} from 'convex/react';
import {api} from '@/convex/_generated/api';
import {Link2,Loader2} from 'lucide-react';
import Link from 'next/link';
import LinkListCard from './LinkListCard';
const LinkList = ({searchTerm}:{searchTerm:string}) => {
  const links=useQuery(api.links.searchLinks,{searchTerm});
  if(links === undefined){

return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
)
  }
  if(links.length === 0){
    return(
      <div className="flex flex-col items-center justify-center py-20 text-center">
     <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Link2 className="h-10 w-10 text-gray-400" />
        </div>
        {
          searchTerm ? (
            <>
           <h3 className="text-lg font-medium text-gray-900 mb-1">
              No links found
            </h3>
            <p className="text-gray-500">
              No links match &quot;{searchTerm}&quot;. Try a different search.
            </p>
            </>
          ):(
            <>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No links saved yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start by saving your first link
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Create your first link
            </Link>
          </>
          )
        }

      </div>
    )
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
     {
      links.map((link)=>(
        <LinkListCard key={link._id} Link={link} />
      ))
     }
    </div>
  )
}

export default LinkList
