"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "react-hot-toast";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" />
    </Provider>
  );
}
