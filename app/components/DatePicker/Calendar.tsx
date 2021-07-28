import clsx from "clsx";
import { format, isSameDay, isToday as isDateToday } from "date-fns";
import {
  cloneElement,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ChevronLeftIcon from "./ChevronLeftIcon";
import ChevronRightIcon from "./ChevronRightIcon";
import {
  getNextMonth,
  getPreviousMonth,
  getShortWeekDays,
  Month,
} from "./dateUtils";
import getDaysInMonth from "./getDaysInMonth";
import getWeeks from "./getWeeks";

type Shortcut = {
  title: ReactNode;
  date: Date;
};

type IsDateDisabled = (date: Date) => boolean;

export interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  shortcuts: Array<Shortcut>;
  isDateDisabled?: IsDateDisabled;
}

function Calendar({
  value,
  onChange,
  shortcuts,
  isDateDisabled = (_date) => false,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Month>(dateToMonth(value));

  useEffect(() => {
    setCurrentMonth(dateToMonth(value));
  }, [value]);

  const handleDaySelect = useCallback(
    (date: Date) => {
      if (onChange) {
        onChange(date);
      }
    },
    [onChange],
  );

  return (
    <div className="shadow-lg rounded-md border border-gray-300 m-3 p-4 space-y-4 bg-white">
      {shortcuts.length > 0 ? (
        <Shortcuts shortcuts={shortcuts} navigateToDate={handleDaySelect} />
      ) : null}
      <MonthNavigation
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
      <DayHeaders />
      <MonthDays
        currentMonth={currentMonth}
        onDaySelect={handleDaySelect}
        selectedDate={value}
        isDateDisabled={isDateDisabled}
      />
    </div>
  );
}

function dateToMonth(date: Date): Month {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

function getDayBgColorClass(isToday: boolean, isSelected: boolean) {
  if (isSelected) {
    return "bg-indigo-600";
  }
  if (isToday) {
    return "bg-gray-100";
  }
  return "";
}

function getDayTextColorClass(
  inOtherMonth: boolean,
  isDisabled: boolean,
  isSelected: boolean,
) {
  if (isDisabled) {
    return "text-gray-200";
  }
  if (isSelected) {
    return "text-white";
  }
  if (inOtherMonth) {
    return "text-gray-400";
  }
  return "text-gray-900";
}

function CalendarDay({
  day,
  currentMonth,
  onDaySelect,
  selectedDate,
  isDateDisabled,
}: {
  day: Date;
  currentMonth: Month;
  onDaySelect: (day: Date) => void;
  selectedDate: Date;
  isDateDisabled: IsDateDisabled;
}) {
  const inOtherMonth = currentMonth.month !== day.getMonth();
  const isToday = useMemo(() => isDateToday(day), [day]);
  const isDisabled = useMemo(() => isDateDisabled(day), [day, isDateDisabled]);
  const isSelected = useMemo(
    () => isSameDay(day, selectedDate),
    [day, selectedDate],
  );

  const selectDay = useCallback(() => {
    if (!isDisabled) {
      onDaySelect(day);
    }
  }, [onDaySelect, day, isDisabled]);

  return (
    <button
      className={clsx(
        "inline-block w-full h-full text-center text-sm rounded-full focus:outline-none",
        getDayBgColorClass(isToday, isSelected),
        getDayTextColorClass(inOtherMonth, isDisabled, isSelected),
        { ["cursor-default"]: isDisabled },
        { ["focus:ring-indigo-500 focus:ring-2"]: !isDisabled },
      )}
      {...(isDisabled ? { "aria-hidden": true, tabIndex: -1 } : {})}
      onClick={selectDay}
    >
      {day.getDate()}
    </button>
  );
}

function MonthDays({
  currentMonth,
  onDaySelect,
  selectedDate,
  isDateDisabled,
}: {
  currentMonth: Month;
  onDaySelect: (day: Date) => void;
  selectedDate: Date;
  isDateDisabled: IsDateDisabled;
}) {
  const allDays = useMemo(() => {
    return getDaysInMonth(currentMonth.month, currentMonth.year);
  }, [currentMonth]);

  const weeks = useMemo(() => {
    return getWeeks(allDays);
  }, [allDays]);

  return (
    <div className="flex flex-col space-y-2">
      {weeks.map((week, weekIndex) => {
        return (
          <div
            key={weekIndex}
            className="flex flex-row justify-between items-center space-x-2"
          >
            {week.map((day, dayIndex) => {
              return (
                <div key={dayIndex} className="w-8 h-8">
                  <CalendarDay
                    day={day}
                    currentMonth={currentMonth}
                    onDaySelect={onDaySelect}
                    selectedDate={selectedDate}
                    isDateDisabled={isDateDisabled}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const SHORT_WEEK_DAYS = getShortWeekDays();

function DayHeaders() {
  return (
    <div className="px-1.5 flex flex-row justify-between space-x-2">
      {SHORT_WEEK_DAYS.map((weekDay) => {
        return (
          <span key={weekDay} className="text-gray-300 text-sm">
            {weekDay}
          </span>
        );
      })}
    </div>
  );
}

function MonthNavigation({
  currentMonth,
  setCurrentMonth,
}: {
  currentMonth: Month;
  setCurrentMonth: (month: Month) => void;
}) {
  const selectPreviousMonth = useCallback(() => {
    setCurrentMonth(getPreviousMonth(currentMonth));
  }, [currentMonth, setCurrentMonth]);

  const selectNextMonth = useCallback(() => {
    setCurrentMonth(getNextMonth(currentMonth));
  }, [currentMonth, setCurrentMonth]);

  return (
    <div className="flex flex-row justify-between space-x-2">
      <MonthNavigationButton
        icon={<ChevronLeftIcon />}
        onClick={selectPreviousMonth}
      />
      <p>
        {format(new Date(currentMonth.year, currentMonth.month), "MMMM yyyy")}
      </p>
      <MonthNavigationButton
        icon={<ChevronRightIcon />}
        onClick={selectNextMonth}
      />
    </div>
  );
}

interface MonthNavigationButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactElement;
}

function MonthNavigationButton({ icon, ...props }: MonthNavigationButtonProps) {
  return (
    <button
      className="p-1 rounded border border-gray-300 flex items-center justify-center"
      {...props}
    >
      {cloneElement(icon, { className: "h-5 w-5" })}
    </button>
  );
}

function Shortcuts({
  shortcuts,
  navigateToDate,
}: {
  shortcuts: Array<Shortcut>;
  navigateToDate: (date: Date) => void;
}) {
  return (
    <div className="flex flex-row flex-wrap space-x-2">
      {shortcuts.map(({ title, date }, index) => {
        return (
          <ShortcutButton
            key={index}
            onClick={() => {
              navigateToDate(date);
            }}
          >
            {title}
          </ShortcutButton>
        );
      })}
    </div>
  );
}

function ShortcutButton(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "rounded py-2 px-3 bg-indigo-100",
        "text-indigo-700 font-medium text-xs",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600",
      )}
      {...props}
    />
  );
}

export default Calendar;
