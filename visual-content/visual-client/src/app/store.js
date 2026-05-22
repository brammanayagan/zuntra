import { create } from "zustand";

const useStore = create((set) => ({
  // Authentication State
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  authLoading: false,

  // Feed State
  pins: [],
  feedLoading: false,
  searchQuery: "",
  activeCategory: "",

  // Modal / Selected Item States
  selectedPin: null,
  isPinModalOpen: false,

  // Actions
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    } else {
      localStorage.removeItem("user");
      set({ user: null });
    }
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem("token");
      set({ token: null, isAuthenticated: false });
    }
  },

  setAuthLoading: (loading) => set({ authLoading: loading }),

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      selectedPin: null,
      isPinModalOpen: false,
    });
  },

  // Feed Actions
  setPins: (pins) => set({ pins }),
  addPin: (pin) => set((state) => ({ pins: [pin, ...state.pins] })),
  removePin: (pinId) =>
    set((state) => ({ pins: state.pins.filter((p) => p._id !== pinId) })),
  setFeedLoading: (loading) => set({ feedLoading: loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveCategory: (category) => set({ activeCategory: category }),

  // Modal Actions
  setSelectedPin: (pin) => set({ selectedPin: pin, isPinModalOpen: !!pin }),
  closePinModal: () => set({ selectedPin: null, isPinModalOpen: false }),
}));

export default useStore;
