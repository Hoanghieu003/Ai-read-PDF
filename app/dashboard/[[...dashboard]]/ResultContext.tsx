"use client";
import { createContext, useState, ReactNode } from "react";

type ResultContextType = {
  result: any; // replace 'any' with the type of 'chat' if possible
  setResult: React.Dispatch<React.SetStateAction<any>>; // replace 'any' with the type of 'chat' if possible
};

export const ResultContext = createContext<ResultContextType>({
  result: [],
  setResult: () => {},
});

type Props = {
  children: ReactNode;
};

export function ResultContextProvider({ children }: Props) {
  const [result, setResult] = useState([]);

  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {children}
    </ResultContext.Provider>
  );
}
