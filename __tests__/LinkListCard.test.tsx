import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import LinkListCard from "@/components/LinkListCard";
import type { Id } from "@/convex/_generated/dataModel";

const mockUseMutation = vi.mocked(useMutation);

function wireDelete(spy: ReturnType<typeof vi.fn>) {
  mockUseMutation.mockImplementation((() => spy) as unknown as typeof useMutation);
}

const baseLink = {
  _id: "k1" as Id<"links">,
  title: "GitHub",
  url: "https://www.github.com/some/path",
  note: "code host",
  createdAt: new Date("2026-01-15").getTime(),
};

describe("LinkListCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the title, the www-stripped domain, and the note", () => {
    render(<LinkListCard Link={baseLink} />);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("github.com")).toBeInTheDocument();
    expect(screen.getByText("code host")).toBeInTheDocument();
  });

  it("falls back to the raw URL when the URL is unparseable", () => {
    render(<LinkListCard Link={{ ...baseLink, url: "not a url" }} />);
    expect(screen.getByText("not a url")).toBeInTheDocument();
  });

  it("links the external anchor to the original URL with target=_blank", () => {
    render(<LinkListCard Link={baseLink} />);
    const anchor = screen.getByRole("link", { name: /github\.com/i });
    expect(anchor).toHaveAttribute("href", baseLink.url);
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("calls deleteLink and toasts success after confirming the AlertDialog", async () => {
    const deleteSpy = vi.fn().mockResolvedValue(undefined);
    wireDelete(deleteSpy);
    const user = userEvent.setup();
    render(<LinkListCard Link={baseLink} />);

    await user.click(screen.getByLabelText(/delete github/i));
    await user.click(await screen.findByRole("button", { name: /^delete$/i }));

    await waitFor(() =>
      expect(deleteSpy).toHaveBeenCalledWith({ linkId: baseLink._id }),
    );
    expect(toast.success).toHaveBeenCalledWith("Link deleted");
  });

  it("toasts an error when the delete mutation fails", async () => {
    const deleteSpy = vi.fn().mockRejectedValue(new Error("nope"));
    wireDelete(deleteSpy);
    const user = userEvent.setup();
    render(<LinkListCard Link={baseLink} />);

    await user.click(screen.getByLabelText(/delete github/i));
    await user.click(await screen.findByRole("button", { name: /^delete$/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to delete link"),
    );
  });

  it("does not fire a delete when the user cancels the dialog", async () => {
    const deleteSpy = vi.fn();
    wireDelete(deleteSpy);
    const user = userEvent.setup();
    render(<LinkListCard Link={baseLink} />);

    await user.click(screen.getByLabelText(/delete github/i));
    await user.click(await screen.findByRole("button", { name: /cancel/i }));

    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
