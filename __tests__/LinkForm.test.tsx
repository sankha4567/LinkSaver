import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LinkForm from "@/components/LinkForm";
import type { Id } from "@/convex/_generated/dataModel";

const mockUseMutation = vi.mocked(useMutation);
const mockUseRouter = vi.mocked(useRouter);

type MaybeMutationFn = ReturnType<typeof vi.fn>;

function wireMutations({
  create,
  update,
}: {
  create?: MaybeMutationFn;
  update?: MaybeMutationFn;
}) {
  mockUseMutation.mockImplementation(((api: unknown) => {
    if (api === "links:createLink") return create ?? vi.fn();
    if (api === "links:updateLink") return update ?? vi.fn();
    return vi.fn();
  }) as unknown as typeof useMutation);
}

describe("LinkForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits createLink with form values, toasts success, and redirects", async () => {
    const createSpy = vi.fn().mockResolvedValue("new-id");
    const updateSpy = vi.fn();
    const push = vi.fn();
    wireMutations({ create: createSpy, update: updateSpy });
    mockUseRouter.mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    const user = userEvent.setup();
    render(<LinkForm />);

    await user.type(screen.getByLabelText(/title/i), "MDN");
    await user.type(
      screen.getByLabelText(/url/i),
      "https://developer.mozilla.org",
    );
    await user.type(screen.getByLabelText(/^note$/i), "docs");
    await user.click(screen.getByRole("button", { name: /create link/i }));

    await waitFor(() =>
      expect(createSpy).toHaveBeenCalledWith({
        title: "MDN",
        url: "https://developer.mozilla.org",
        note: "docs",
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("Link created");
    expect(push).toHaveBeenCalledWith("/");
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls updateLink with linkId in edit mode and toasts updated", async () => {
    const createSpy = vi.fn();
    const updateSpy = vi.fn().mockResolvedValue(undefined);
    const push = vi.fn();
    wireMutations({ create: createSpy, update: updateSpy });
    mockUseRouter.mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    const initial = {
      _id: "k1" as Id<"links">,
      _creationTime: 0,
      userId: "u1",
      title: "Original",
      url: "https://example.com",
      note: "n",
      createdAt: 1,
    };

    const user = userEvent.setup();
    render(<LinkForm initialData={initial} />);

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Updated");
    await user.click(screen.getByRole("button", { name: /update link/i }));

    await waitFor(() =>
      expect(updateSpy).toHaveBeenCalledWith({
        linkId: "k1",
        title: "Updated",
        url: "https://example.com",
        note: "n",
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("Link updated");
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("shows zod validation errors for missing title and invalid URL", async () => {
    const user = userEvent.setup();
    render(<LinkForm />);

    await user.type(screen.getByLabelText(/url/i), "not a url");
    await user.click(screen.getByRole("button", { name: /create link/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/please enter a valid url/i),
    ).toBeInTheDocument();
  });

  it("toasts an error and stays on the page when the mutation fails", async () => {
    const createSpy = vi.fn().mockRejectedValue(new Error("boom"));
    const push = vi.fn();
    wireMutations({ create: createSpy });
    mockUseRouter.mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    const user = userEvent.setup();
    render(<LinkForm />);

    await user.type(screen.getByLabelText(/title/i), "MDN");
    await user.type(screen.getByLabelText(/url/i), "https://x.com");
    await user.click(screen.getByRole("button", { name: /create link/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to create link"),
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("Reset button clears all fields", async () => {
    const user = userEvent.setup();
    render(<LinkForm />);

    await user.type(screen.getByLabelText(/title/i), "MDN");
    await user.type(screen.getByLabelText(/url/i), "https://example.com");
    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect((screen.getByLabelText(/title/i) as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText(/url/i) as HTMLInputElement).value).toBe("");
  });
});
