import { useEffect } from "react";

interface UseThemeChangeEffectProps {
  themeChangeTimestamp: number;
  lastSyncedRef: React.MutableRefObject<string>;
}

export const useThemeChangeEffect = ({
  themeChangeTimestamp,
  lastSyncedRef,
}: UseThemeChangeEffectProps) => {
  // Reset sync ref when theme changes to force re-sync
  useEffect(() => {
    if (themeChangeTimestamp > 0) {
      lastSyncedRef.current = "";
    }
  }, [themeChangeTimestamp, lastSyncedRef]);
};
