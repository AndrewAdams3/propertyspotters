import { useEffect, useState } from "react";

const useScrollPosition = () => {
  const [scrollY, setScroll] = useState();
  useEffect(() => {
    const scrollEvent = () => {
      setScroll(window.pageYOffset)
    }
    window.addEventListener("scroll", scrollEvent)
    return () => window.removeEventListener("scroll", scrollEvent)
  }, [])

  return scrollY;
};

export default useScrollPosition;