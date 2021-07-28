import {
  cloneElement,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { usePopper } from "react-popper";
import Calendar from "./Calendar";

interface DatePickerProps {
  children: ReactElement;
  onChange?: (date: Date) => void;
}

function DatePicker({ children, onChange }: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
  );

  const toggleCalendar = useCallback(() => {
    const newState = !isCalendarOpen;
    setIsCalendarOpen(newState);
    if (newState && update) {
      update();
    }
  }, [isCalendarOpen, update]);

  useOnClickOutside(popperElement, referenceElement, function closeCalendar() {
    if (isCalendarOpen) {
      setIsCalendarOpen(false);
    }
  });

  const handleChange = useCallback(
    (date: Date) => {
      setIsCalendarOpen(false);
      if (onChange) {
        onChange(date);
      }
    },
    [onChange],
  );

  return (
    <>
      {cloneElement(children, {
        ref: setReferenceElement,
        onClick: toggleCalendar,
      })}
      <div
        ref={setPopperElement}
        {...attributes.popper}
        style={{ ...styles.popper, display: isCalendarOpen ? "block" : "none" }}
      >
        <Calendar
          // TODO: Make this to come from a Date prop. Make the Day type an implementation
          // detail inside calendar but this value should be a Date
          initialDay={{ day: 27, month: 6, year: 2021, weekDay: 2 }}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

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

export default DatePicker;
