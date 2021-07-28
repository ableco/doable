import { cloneElement, ReactElement, useCallback, useState } from "react";
import { usePopper } from "react-popper";
import Calendar, { Shortcut } from "./Calendar";
import useOnClickOutside from "./useOnClickOutside";

interface DatePickerProps {
  children: ReactElement;
  value: Date;
  onChange: (date: Date) => void;
  shortcuts?: Array<Shortcut>;
}

function DatePicker({
  children,
  onChange,
  value = new Date(),
  shortcuts = [],
}: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
        <Calendar shortcuts={shortcuts} value={value} onChange={handleChange} />
      </div>
    </>
  );
}

export default DatePicker;
