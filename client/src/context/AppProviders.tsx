import React from "react";
import { ThemeProviderCustom } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { composeProviders } from "./composeProviders";
import { SidebarProvider } from "./SidebarContext";
import { ModeProvider } from "./ModeContext";

const allProviders = [AuthProvider, ThemeProviderCustom, SidebarProvider, ModeProvider];

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{composeProviders(allProviders, children)}</>;
};