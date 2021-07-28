import clsx from "clsx";
import { add, addDays, format, lastDayOfMonth, subDays } from "date-fns";
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

interface Month {
  month: number;
  year: number;
}

interface Day extends Month {
  day: number;
  weekDay: number;
}

interface CalendarProps {
  initialDay: Day;
  onChange: (date: Date) => void;
}

function Calendar({ initialDay, onChange }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Month>({
    year: initialDay.year,
    month: initialDay.month,
  });

  const handleDaySelect = useCallback(
    (day: Day) => {
      const date = new Date(day.year, day.month, day.day);
      if (onChange) {
        onChange(date);
      }
    },
    [onChange],
  );

  return (
    <div
      className="shadow-lg rounded-md border border-gray-300 m-3 p-4 space-y-4 bg-white"
      style={{
        width: "304px",
      }}
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
  day: Day;
  currentMonth: Month;
  onDaySelect: (day: Day) => void;
}) {
  const fromADifferentMonth = currentMonth.month !== day.month;
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
      {day.day}
    </button>
  );
}

function getDaysInMonth({ year, month }: Month): Array<Day> {
  const firstDate = new Date(year, month, 1);
  const dates: Array<Date> = [firstDate];

  let currentDate = firstDate;

  while (true) {
    const nextDate = add(currentDate, { days: 1 });
    if (nextDate.getMonth() !== currentDate.getMonth()) {
      break;
    } else {
      currentDate = nextDate;
      dates.push(currentDate);
    }
  }

  return dates.map((date) => ({
    month: date.getMonth(),
    year: date.getFullYear(),
    day: date.getDate(),
    weekDay: date.getDay(),
  }));
}

type Week = Array<Day>;

function completeFirstWeek(week: Week) {
  const fullWeek: Week = [...week];
  const firstDay = week[0]!;
  const previousMonth = getPreviousMonth({
    month: firstDay.month,
    year: firstDay.year,
  });
  const lastMissingDate = lastDayOfMonth(
    new Date(previousMonth.year, previousMonth.month),
  );
  let lastAddedDate = lastMissingDate;

  while (fullWeek.length < 7) {
    fullWeek.unshift({
      day: lastAddedDate.getDate(),
      month: lastAddedDate.getMonth(),
      year: lastAddedDate.getFullYear(),
      weekDay: lastAddedDate.getDay(),
    });
    lastAddedDate = subDays(
      new Date(
        lastAddedDate.getFullYear(),
        lastAddedDate.getMonth(),
        lastAddedDate.getDate(),
      ),
      1,
    );
  }

  return fullWeek;
}

function completeLastWeek(week: Week) {
  const fullWeek: Week = [...week];
  const lastDay = week[week.length - 1]!;
  const nextMonth = getNextMonth({
    month: lastDay.month,
    year: lastDay.year,
  });
  const firstMissingDate = new Date(nextMonth.year, nextMonth.month, 1);
  let lastAddedDate = firstMissingDate;

  while (fullWeek.length < 7) {
    fullWeek.push({
      day: lastAddedDate.getDate(),
      month: lastAddedDate.getMonth(),
      year: lastAddedDate.getFullYear(),
      weekDay: lastAddedDate.getDay(),
    });
    lastAddedDate = addDays(
      new Date(
        lastAddedDate.getFullYear(),
        lastAddedDate.getMonth(),
        lastAddedDate.getDate(),
      ),
      1,
    );
  }

  return fullWeek;
}

function getWeeks(days: Array<Day>): Array<Week> {
  const daysStack = [...days];

  const firstDay = days[0]!;
  const firstDayOfWeek = firstDay.weekDay;
  const remainingFirstWeekDays = 7 - firstDayOfWeek;

  const weeks: Array<Week> = [daysStack.splice(0, remainingFirstWeekDays)];

  while (true) {
    const middleWeek = daysStack.splice(0, 7);
    weeks.push(middleWeek);
    if (daysStack.length === 0) {
      break;
    }
  }

  const firstWeek = weeks[0];
  const lastWeek = weeks[weeks.length - 1];

  if (firstWeek && firstWeek.length < 7) {
    weeks[0] = completeFirstWeek(firstWeek);
  }

  if (lastWeek && lastWeek.length < 7) {
    weeks[weeks.length - 1] = completeLastWeek(lastWeek);
  }

  return weeks;
}

function MonthDays({
  currentMonth,
  onDaySelect,
}: {
  currentMonth: Month;
  onDaySelect: (day: Day) => void;
}) {
  const allDays = useMemo(() => {
    return getDaysInMonth(currentMonth);
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
            className="flex flex-row justify-between items-center"
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
    <div className="px-1.5 flex flex-row justify-between">
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

function getPreviousMonth({ month, year }: Month): Month {
  if (month === 0) {
    return { month: 11, year: year - 1 };
  } else {
    return { month: month - 1, year };
  }
}

function getNextMonth({ month, year }: Month): Month {
  if (month === 11) {
    return { month: 0, year: year + 1 };
  } else {
    return { month: month + 1, year };
  }
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
    <div className="flex flex-row justify-between">
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
