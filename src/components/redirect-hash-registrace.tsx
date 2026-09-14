"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Old stacked page used `#registrace`. Send that hash to the dedicated route. */
export function RedirectHashRegistrace() {
  const router = useRouter();
  useEffect(() => {
    if (window.location.hash === "#registrace") {
      router.replace("/firma/registrace");
    }
  }, [router]);
  return null;
}
