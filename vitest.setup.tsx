import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import React from "react";

afterEach(() => {
  cleanup();
});

// Clerk
vi.mock("@clerk/nextjs", () => ({
  useAuth: vi.fn(() => ({
    isSignedIn: true,
    isLoaded: true,
    sessionId: "session_123",
    getToken: vi.fn(() => Promise.resolve("token_123")),
  })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  UserButton: () => <div data-testid="user-button">UserButton</div>,
  SignIn: () => <div>SignIn</div>,
  SignUp: () => <div>SignUp</div>,
}));

// Convex
vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn()),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("convex/react-clerk", () => ({
  ConvexProviderWithClerk: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@/convex/_generated/api", () => ({
  api: {
    links: {
      createLink: "links:createLink",
      getAllLinks: "links:getAllLinks",
      searchLinks: "links:searchLinks",
      deleteLink: "links:deleteLink",
      updateLink: "links:updateLink",
      getLinkById: "links:getLinkById",
    },
  },
}));

// next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  useParams: vi.fn(() => ({})),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// next/font/google — stub the loaders so app/layout.tsx tests don't crash
vi.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
    className: "font-geist-sans",
    style: { fontFamily: "Geist" },
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
    className: "font-geist-mono",
    style: { fontFamily: "Geist Mono" },
  }),
}));

// next/link & next/image
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => <img src={src} alt={alt} width={width} height={height} />,
}));

// sonner — replaces react-hot-toast across the app
vi.mock("sonner", () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    message: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// lucide-react — every icon used by the app
const makeIcon = (testid: string) => {
  const Icon = ({ className }: { className?: string }) => (
    <svg data-testid={testid} className={className} aria-hidden="true">
      {testid}
    </svg>
  );
  Icon.displayName = `Icon(${testid})`;
  return Icon;
};

vi.mock("lucide-react", () => ({
  Plus: makeIcon("plus-icon"),
  Link2: makeIcon("link2-icon"),
  Search: makeIcon("search-icon"),
  X: makeIcon("x-icon"),
  ArrowLeft: makeIcon("arrow-left-icon"),
  Edit: makeIcon("edit-icon"),
  Trash2: makeIcon("trash-icon"),
  ExternalLink: makeIcon("external-link-icon"),
  FileText: makeIcon("file-text-icon"),
  Loader2: makeIcon("loader-icon"),
  AlertTriangle: makeIcon("alert-icon"),
}));

// zustand store — selector-aware so `useSearchStore((s) => s.setSearchTerm)` works.
// Tests that import `useSearchStore` from this mock can call the selector to reach
// the spy fn (e.g. `useSearchStore((s) => s.setSearchTerm)` returns the spy).
vi.mock("@/store/search-store", () => {
  const setSearchTerm = vi.fn();
  const clearSearch = vi.fn();
  const state = { searchTerm: "", setSearchTerm, clearSearch };
  const useSearchStore = vi.fn(
    (selector?: (s: typeof state) => unknown) =>
      selector ? selector(state) : state,
  );
  return { useSearchStore };
});
