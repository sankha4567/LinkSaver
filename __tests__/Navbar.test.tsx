import {describe,it,expect,vi} from 'vitest';
import {render,screen} from '@testing-library/react';
import Navbar from '@/components/Navbar';
describe("Navbar",()=>{
  it("should render the Navbar with logo and brand name",()=>{
    render(<Navbar/>);
    const logo=screen.getByTestId("link2-icon");
    expect(logo).toBeInTheDocument();
    const brandName=screen.getByText("LinkSaver");
    expect(brandName).toBeInTheDocument();
  })
  it('renders the search bar',()=>{
    render(<Navbar/>);
    const searchBar=screen.getByTestId("search-bar");
    expect(searchBar).toBeInTheDocument();
  });
  it("renders the create link button",()=>{
    render(<Navbar/>);
    const createLinkButton=screen.getByRole("link",{name:/create/i});
    expect(createLinkButton).toBeInTheDocument();
    expect(createLinkButton).toHaveAttribute("href","/create");
    const plusIcon=screen.getByTestId("plus-icon");
    expect(plusIcon).toBeInTheDocument();
  });
  it("renders the user button",()=>{
    render(<Navbar/>);
    const userButton=screen.getByTestId("user-button");
    expect(userButton).toBeInTheDocument();
  });
  it('has correct navigation links', () => {
    render(<Navbar />);
    
    // Check home link
    const homeLink = screen.getByRole('link', { name: /linksaver/i });
    expect(homeLink).toHaveAttribute('href', '/');
    
    // Check create link
    const createLink = screen.getByRole('link', { name: /create/i });
    expect(createLink).toHaveAttribute('href', '/create');
  });

})

