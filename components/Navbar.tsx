import React from 'react'
import Link from 'next/link'
import {UserButton} from '@clerk/nextjs';
import {Plus,Link2} from 'lucide-react';
import SearchBar from './SearchBar';

const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex items-center justify-between h-16 gap-4'>
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-indigo-600 p-2 rounded-lg">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              LinkSaver
            </span>
          
          </Link>
          <div className='flex-1 max-w-xl'>
            <SearchBar/>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>

        </div>


      </div>

    </nav>
  )
}

export default Navbar
