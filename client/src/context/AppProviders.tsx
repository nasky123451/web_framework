import React from "react";
import { ThemeProviderCustom } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { composeProviders } from "./composeProviders";

const allProviders = [AuthProvider, ThemeProviderCustom /* 其他 Provider */];

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{composeProviders(allProviders, children)}</>;
};