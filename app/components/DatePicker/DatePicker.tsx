import { useUniqueId } from "@ableco/abledev-components";
import { cloneElement, ReactElement, useCallback, useState } from "react";
import { usePopper } from "react-popper";
import Calendar, { CalendarProps } from "./Calendar";
import { isElementOutside } from "./domUtils";
import useWindowEvent from "./useWindowEvent";

interface DatePickerProps {
  children: ReactElement;
  value: Date;
  onChange: (date: Date) => void;
  shortcuts?: CalendarProps["shortcuts"];
  isDateDisabled?: CalendarProps["isDateDisabled"];
}

function DatePicker({
  children,
  onChange,
  value = new Date(),
  shortcuts = [],
  isDateDisabled,
}: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
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

  const closeIfOutside = useCallback(
    (element: HTMLElement) => {
      if (popperElement && referenceElement && isCalendarOpen) {
        const isOutside = isElementOutside(
          element,
          popperElement,
          referenceElement,
        );
        if (isOutside) {
          setIsCalendarOpen(false);
        }
      }
    },
    [popperElement, referenceElement, isCalendarOpen],
  );

  useWindowEvent("mousedown", function closeOnOutsideClick({ target }) {
    closeIfOutside(target as HTMLElement);
  });

  useWindowEvent(
    "focus",
    function closeOnOutsideFocus({ target }) {
      closeIfOutside(target as HTMLElement);
    },
    true,
  );

  const handleChange = useCallback(
    (date: Date) => {
      setIsCalendarOpen(false);
      if (onChange) {
        onChange(date);
      }
    },
    [onChange],
  );

  const panelId = useUniqueId("calendar-");

  return (
    <>
      {cloneElement(children, {
        ref: setReferenceElement,
        onClick: toggleCalendar,
        "aria-controls": panelId,
        "aria-expanded": isCalendarOpen,
      })}
      <div
        id={panelId}
        ref={setPopperElement}
        {...attributes.popper}
        style={{ ...styles.popper, display: isCalendarOpen ? "block" : "none" }}
      >
        <Calendar
          value={value}
          onChange={handleChange}
          shortcuts={shortcuts}
          isDateDisabled={isDateDisabled}
        />
      </div>
    </>
  );
}

export default DatePicker;
