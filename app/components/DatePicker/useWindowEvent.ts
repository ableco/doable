import { useEffect, useRef } from "react";

function useWindowEvent<EventType extends keyof WindowEventMap>(
  type: EventType,
  listener: (event: WindowEventMap[EventType]) => any,
  options?: AddEventListenerOptions | boolean,
) {
  // Using a ref means the effect only needs to change when type and options change,
  // not when the listener does it.
  let listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const handleEvent = (event: WindowEventMap[EventType]) => {
      listenerRef.current.call(window, event);
    };
    window.addEventListener(type, handleEvent, options);
    return () => window.removeEventListener(type, handleEvent, options);
  }, [type, options]);
}

export default useWindowEvent;
