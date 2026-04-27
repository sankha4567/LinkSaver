import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useQuery } from "convex/react";
import LinkList from "@/components/LinkList";
import type { Id } from "@/convex/_generated/dataModel";

vi.mock("@/components/LinkListCard", () => ({
  default: ({ Link }: { Link: { _id: string; title: string } }) => (
    <div data-testid="link-card">{Link.title}</div>
  ),
}));

const mockUseQuery = vi.mocked(useQuery);

function makeLink(over: Partial<{ _id: string; title: string; url: string; note: string; createdAt: number }> = {}) {
  return {
    _id: (over._id ?? "k1") as Id<"links">,
    _creationTime: 0,
    userId: "u1",
    title: over.title ?? "Hello",
    url: over.url ?? "https://example.com",
    note: over.note ?? "",
    createdAt: over.createdAt ?? 0,
  };
}

describe("LinkList", () => {
  it("shows a skeleton grid while the query is loading", () => {
    mockUseQuery.mockReturnValue(undefined);
    const { container } = render(<LinkList searchTerm="" />);
    expect(screen.getByLabelText(/loading your links/i)).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("shows the empty-state CTA when there are no links and no search term", () => {
    mockUseQuery.mockReturnValue([]);
    render(<LinkList searchTerm="" />);
    expect(screen.getByText(/no links saved yet/i)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /create your first link/i });
    expect(cta).toHaveAttribute("href", "/create");
  });

  it("shows the no-match message when a search returns nothing", () => {
    mockUseQuery.mockReturnValue([]);
    render(<LinkList searchTerm="zebra" />);
    expect(screen.getByText(/no links found/i)).toBeInTheDocument();
    expect(screen.getByText(/no links match/i)).toBeInTheDocument();
    expect(screen.getByText(/zebra/i)).toBeInTheDocument();
  });

  it("renders one card per link returned by the query", () => {
    mockUseQuery.mockReturnValue([
      makeLink({ _id: "a", title: "First" }),
      makeLink({ _id: "b", title: "Second" }),
    ]);
    render(<LinkList searchTerm="" />);
    expect(screen.getAllByTestId("link-card")).toHaveLength(2);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
