import { useNavigate as useNav, useLocation as useLoc, useSearchParams as useSP, useParams as usePrms } from 'react-router-dom';
import { useMemo } from 'react';

export function useSafeNavigate() {
  try {
    return useNav();
  } catch (e) {
    // Router context not ready — return a no-op
    return useMemo(() => () => {}, []);
  }
}

export function useSafeLocation() {
  try {
    return useLoc();
  } catch (e) {
    return { pathname: '/' };
  }
}

export function useSafeSearchParams() {
  try {
    return useSP();
  } catch (e) {
    return [new URLSearchParams(), () => {}];
  }
}

export function useSafeParams() {
  try {
    return usePrms();
  } catch (e) {
    return {};
  }
}
