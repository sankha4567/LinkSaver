"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchStore } from "@/store/search-store";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, setSearchTerm]);

  function handleClear() {
    setValue("");
    setSearchTerm("");
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="size-4 text-muted-foreground" data-testid="search-icon" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search links"
        placeholder="Search by title, URL, or note..."
        className="pl-9 pr-9 h-10"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" data-testid="x-icon" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
