import clsx from "clsx";
import { format, isSameDay, isToday } from "date-fns";
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
import { getNextMonth, getPreviousMonth, Month } from "./dateUtils";
import getDaysInMonth from "./getDaysInMonth";
import getWeeks from "./getWeeks";

export type Shortcut = {
  title: ReactNode;
  date: Date;
};

interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  shortcuts: Array<Shortcut>;
}

function Calendar({ value, onChange, shortcuts }: CalendarProps) {
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

function CalendarDay({
  day,
  currentMonth,
  onDaySelect,
  selectedDate,
}: {
  day: Date;
  currentMonth: Month;
  onDaySelect: (day: Date) => void;
  selectedDate: Date;
}) {
  const fromADifferentMonth = currentMonth.month !== day.getMonth();
  const selectDay = useCallback(() => {
    if (!fromADifferentMonth) {
      onDaySelect(day);
    }
  }, [onDaySelect, day, fromADifferentMonth]);

  const isSelected = isSameDay(day, selectedDate);

  return (
    <button
      className={clsx(
        "inline-block w-full h-full text-center text-sm rounded-full",
        fromADifferentMonth
          ? "cursor-default text-gray-400 focus:outline-none"
          : isSelected
          ? ""
          : "text-gray-900",
        isToday(day) ? "bg-gray-100" : "",
        isSelected ? "bg-indigo-600 text-white" : "",
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
  selectedDate,
}: {
  currentMonth: Month;
  onDaySelect: (day: Date) => void;
  selectedDate: Date;
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
