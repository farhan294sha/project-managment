import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounce, setdebounce] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setdebounce(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounce;
}
