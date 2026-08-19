import { useEffect, useState } from "react";
import { getLocalDateKey } from "../utils/gameStats";

export function useCurrentLocalDate() {
  const [dateKey, setDateKey] = useState(() => getLocalDateKey());

  useEffect(() => {
    let timer = 0;
    const schedule = () => {
      const now = new Date();
      const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 25);
      timer = window.setTimeout(() => {
        setDateKey(getLocalDateKey());
        schedule();
      }, Math.max(250, nextDay.getTime() - now.getTime()));
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return dateKey;
}
