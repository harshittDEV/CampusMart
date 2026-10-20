declare module 'expo' {
  import React from 'react';
  export function registerRootComponent<P>(component: React.ComponentType<P>): void;
}
