import React from "react";

interface ProviderProps {
  children: React.ReactNode;
}

type ProviderComponent = React.FC<ProviderProps>;

export function composeProviders(
  providers: ProviderComponent[],
  children: React.ReactNode
) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
}