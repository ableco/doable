import { useEffect } from "react";

function useOnClickOutside(
  containerElement: HTMLElement | null,
  referenceElement: HTMLElement | null,
  handler: (event: MouseEvent) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      const isEventNotOutside = containerElement?.contains(
        event.target as Node,
      );
      const isEventOnReference = referenceElement?.contains(
        event.target as Node,
      );

      if (isEventNotOutside || isEventOnReference) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [containerElement, handler, referenceElement]);
}

export default useOnClickOutside;
