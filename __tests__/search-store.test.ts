import { describe, it, expect, beforeEach, vi } from "vitest";

vi.unmock("@/store/search-store");

import { useSearchStore } from "@/store/search-store";

describe("useSearchStore", () => {
  beforeEach(() => {
    useSearchStore.setState({ searchTerm: "" });
  });

  it("initializes with an empty searchTerm", () => {
    expect(useSearchStore.getState().searchTerm).toBe("");
  });

  it("setSearchTerm updates the stored term", () => {
    useSearchStore.getState().setSearchTerm("react");
    expect(useSearchStore.getState().searchTerm).toBe("react");
  });

  it("clearSearch resets the term to an empty string", () => {
    useSearchStore.getState().setSearchTerm("react");
    useSearchStore.getState().clearSearch();
    expect(useSearchStore.getState().searchTerm).toBe("");
  });

  it("notifies subscribers when the term changes", () => {
    const subscriber = vi.fn();
    const unsubscribe = useSearchStore.subscribe(subscriber);
    useSearchStore.getState().setSearchTerm("svelte");
    expect(subscriber).toHaveBeenCalled();
    unsubscribe();
  });
});
