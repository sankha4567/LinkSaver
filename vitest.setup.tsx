import "@testing-library/jest-dom";
import {expect,afterEach,vi} from 'vitest';
import {cleanup} from "@testing-library/react";

afterEach(()=>{
  cleanup();
})
vi.mock("@clerk/nextjs",()=>({
 useAuth:()=>({
  isSignedIn:true,
  isLoaded:true,
  user:{
    id:"123",
    firstName:"john",
    lastName:"doe",
    EmailAddresses:[{emailAddress:"john.doe@example.com"}]
  },
  sessionId:"session_123",
  getToken:vi.fn(()=>Promise.resolve("token_123"))
 }),
 ClerkProvider: ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
},
UserButton:({afterSignOutUrl}:{afterSignOutUrl?:string})=>{
  return <div data-testid="user-button">UserButton</div>
},
SignIn:({routing,path,signUpUrl,redirectUrl,afterSignInUrl}:{routing:string,path:string,signUpUrl:string,redirectUrl:string,afterSignInUrl:string})=>{
  return <div>SignIn</div>
},
SignUp:({routing,path,signInUrl,redirectUrl,afterSignUpUrl}:{routing:string,path:string,signInUrl:string,redirectUrl:string,afterSignUpUrl:string})=>{
  return <div>SignUp</div>
},






}));
// mock convex
vi.mock('convex/react',()=>({
  useQuery:vi.fn(),
  useMutation:vi.fn(()=>vi.fn()),
  ConvexProvider:({children}:{children:React.ReactNode})=>{
    return <>{children}</>
  }
}))
vi.mock("convex/react-clerk",()=>({
  ConvexProviderWithClerk:({children}:{children:React.ReactNode})=>{
    return <>{children}</>
  }
}));
//mock Convex API
vi.mock("@/convex/_generated/api",()=>({
  api:{
    links:{
      createLink:'links:createLink',getAllLinks:'links:getAllLinks',searchLinks:'links:searchLinks',deleteLink:'links:deleteLink',updateLink:'links:updateLink',getLinkById:'links:getLinkById'
    }
  }
}));
//mock next/navigation
vi.mock("next/navigation",()=>({
  useRouter:vi.fn(()=>({
    push:vi.fn(),
    back:vi.fn()
  })),
  useParams:vi.fn(()=>({
   
  })),
  redirect:vi.fn(),

}));
//mock next/image
vi.mock("next/image",()=>({
  default:({src,alt,width,height}:{src:string,alt:string,width:number,height:number})=>{
    return <img src={src} alt={alt} width={width} height={height} />
  }
}))
//mock next/link
vi.mock("next/link",()=>({
  default:({href,children}:{href:string,children:React.ReactNode})=>{
    return <a href={href}>{children}</a>
  }
}));
// Mock lucide-react icons (moved from test file)
vi.mock("lucide-react",()=>({
  Plus:({className}:{className?:string})=>{
    return <svg data-testid="plus-icon" className={className}>plus</svg>
  },
  Link2:({className}:{className?:string})=>{
    return <svg data-testid="link2-icon" className={className}>link2</svg>
  },
  Search:({className}:{className?:string})=>{
    return <svg data-testid="search-icon" className={className}>search</svg>
  },
  X:({className}:{className?:string})=>{
    return <svg data-testid="x-icon" className={className}>x</svg>
  },
}));
//mock zustand store
vi.mock("@/store/search-store",()=>({
  useSearchStore:vi.fn(()=>({
    searchTerm:"",
    setSearchTerm:vi.fn(),
    clearSearch:vi.fn()
  }))
}));
//mock SearchBar
vi.mock("@/components/SearchBar",()=>({
  default:()=>{
    return <div data-testid="search-bar">SearchBar</div>
  }
}));