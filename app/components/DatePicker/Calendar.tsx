import clsx from "clsx";
import { format } from "date-fns";
import {
  cloneElement,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import ChevronLeftIcon from "./ChevronLeftIcon";
import ChevronRightIcon from "./ChevronRightIcon";
import { getNextMonth, getPreviousMonth, Month } from "./dateUtils";
import getDaysInMonth from "./getDaysInMonth";
import getWeeks from "./getWeeks";

interface CalendarProps {
  initialDate: Date;
  onChange: (date: Date) => void;
}

function Calendar({ initialDate, onChange }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Month>({
    year: initialDate.getFullYear(),
    month: initialDate.getMonth(),
  });

  const handleDaySelect = useCallback(
    (date: Date) => {
      if (onChange) {
        onChange(date);
      }
    },
    [onChange],
  );

  return (
    <div
      className="shadow-lg rounded-md border border-gray-300 m-3 p-4 space-y-4 bg-white"
      // style={{
      //   width: "304px",
      // }}
    >
      <Shortcuts />
      <MonthNavigation
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />
      <DayHeaders />
      <MonthDays currentMonth={currentMonth} onDaySelect={handleDaySelect} />
    </div>
  );
}

function CalendarDay({
  day,
  currentMonth,
  onDaySelect,
}: {
  day: Date;
  currentMonth: Month;
  onDaySelect: (day: Date) => void;
}) {
  const fromADifferentMonth = currentMonth.month !== day.getMonth();
  const selectDay = useCallback(() => {
    onDaySelect(day);
  }, [onDaySelect, day]);

  return (
    <button
      className={clsx(
        "inline-box w-full h-full text-center text-sm",
        fromADifferentMonth
          ? "cursor-default text-gray-400 focus:outline-none"
          : "text-gray-900",
      )}
      onClick={selectDay}
    >
      {day.getDate()}
    </button>
  );
}

function MonthDays({
  currentMonth,
  onDaySelect,
}: {
  currentMonth: Month;
  onDaySelect: (day: Date) => void;
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

const WEEK_DAYS = [1, 2, 3, 4, 5, 6, 7];
const SAMPLE_YEAR = 1970;

function DayHeaders() {
  return (
    <div className="px-1.5 flex flex-row justify-between space-x-2">
      {WEEK_DAYS.map((dayOfMonth) => {
        return (
          <span key={dayOfMonth} className="text-gray-300 text-sm">
            {format(new Date(SAMPLE_YEAR, dayOfMonth), "EEEEEE")}
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

function Shortcuts() {
  return (
    <div className="flex flex-row flex-wrap space-x-2">
      <ShortcutButton>Today</ShortcutButton>
      <ShortcutButton>Tomorrow</ShortcutButton>
      <ShortcutButton>Next Week</ShortcutButton>
    </div>
  );
}

function ShortcutButton({ children }: { children: ReactNode }) {
  return (
    <button
      className={clsx(
        "rounded py-2 px-3 bg-indigo-100",
        "text-indigo-700 font-medium text-xs",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600",
      )}
    >
      {children}
    </button>
  );
}

export default Calendar;
