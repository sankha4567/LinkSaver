import {describe,it,expect,vi,beforeEach,afterEach} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import SearchBar from '@/components/SearchBar';

describe('SearchBar',()=>{
  beforeEach(()=>{
    vi.clearAllMocks();
    vi.useFakeTimers();
  })
  afterEach(()=>{
    vi.useRealTimers();
  })
  it("renders the search bar with placeholder",()=>{
    render(<SearchBar/>);
    const searchInput=screen.getByPlaceholderText(/Search by title, URL, or note.../i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type","text");
  });
  it("renders the search icon",()=>{
    render(<SearchBar/>);
    const searchIcon=screen.getByTestId("search-icon");
    expect(searchIcon).toBeInTheDocument();
  });
  it("dont show clear button when input is empty",()=>{
    render(<SearchBar/>);
    const clearButton=screen.getByTestId("x-icon");
    expect(clearButton).not.toBeInTheDocument();
  });
})