"use client"
import React from 'react'
import {useState,useEffect} from 'react';
import {Search,X} from 'lucide-react';
import {useSearchStore} from '@/store/search-store';
const SearchBar = () => {
  const [value,setValue]=useState('');
  const searchTerm=useSearchStore((state)=>state.setSearchTerm);
  useEffect(()=>{
   const timer=setTimeout(()=>{
    searchTerm(value);
   },300);
   return ()=>clearTimeout(timer);
  },[value,searchTerm]);
  function handleClear(){
    setValue('');
    searchTerm('');
  }
  return (
    <div className='relative w-full'>
       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input type="text" value={value} onChange={(e)=>setValue(e.target.value)} className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-gray-900' placeholder='Search by title, URL, or note...' />
      {
        value && (
          <button onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
        )
      }
    </div>
  )
}

export default SearchBar
