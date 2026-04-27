import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";

vi.mock("@/components/SearchBar", () => ({
  default: () => <div data-testid="search-bar">SearchBar</div>,
}));

describe("Navbar", () => {
  it("should render the Navbar with logo and brand name", () => {
    render(<Navbar />);
    expect(screen.getByTestId("link2-icon")).toBeInTheDocument();
    expect(screen.getByText("LinkSaver")).toBeInTheDocument();
  });

  it("renders the search bar", () => {
    render(<Navbar />);
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  it("renders the create link button", () => {
    render(<Navbar />);
    const createLinkButton = screen.getByRole("link", { name: /create/i });
    expect(createLinkButton).toBeInTheDocument();
    expect(createLinkButton).toHaveAttribute("href", "/create");
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
  });

  it("renders the user button", () => {
    render(<Navbar />);
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });

  it("has correct navigation links", () => {
    render(<Navbar />);
    const homeLink = screen.getByRole("link", { name: /linksaver/i });
    expect(homeLink).toHaveAttribute("href", "/");
    const createLink = screen.getByRole("link", { name: /create/i });
    expect(createLink).toHaveAttribute("href", "/create");
  });
});
