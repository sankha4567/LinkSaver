import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import SearchBar from "@/components/SearchBar";
import { useSearchStore } from "@/store/search-store";

function getSetSearchTerm() {
  return (useSearchStore as unknown as (sel: (s: { setSearchTerm: ReturnType<typeof vi.fn> }) => ReturnType<typeof vi.fn>) => ReturnType<typeof vi.fn>)(
    (s) => s.setSearchTerm,
  );
}

describe("SearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the input with placeholder", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      /Search by title, URL, or note.../i,
    );
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders the search icon", () => {
    render(<SearchBar />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("does not show the clear button when input is empty", () => {
    render(<SearchBar />);
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  it("debounces setSearchTerm by 300ms after the user types", () => {
    const setSearchTerm = getSetSearchTerm();
    render(<SearchBar />);

    // flush the initial-mount effect (fires with "")
    act(() => {
      vi.advanceTimersByTime(300);
    });
    setSearchTerm.mockClear();

    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: "react" } });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(setSearchTerm).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(setSearchTerm).toHaveBeenCalledWith("react");
  });

  it("clear button resets the input and dispatches an empty search term", () => {
    const setSearchTerm = getSetSearchTerm();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/Search/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "go" } });
    expect(input.value).toBe("go");
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();

    setSearchTerm.mockClear();
    fireEvent.click(screen.getByLabelText(/clear search/i));

    expect(input.value).toBe("");
    expect(setSearchTerm).toHaveBeenCalledWith("");
  });
});
