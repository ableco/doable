import { addDays, lastDayOfMonth, subDays } from "date-fns";
import { getNextMonth, getPreviousMonth } from "./dateUtils";

type Week = Array<Date>;

function getWeeks(days: Array<Date>): Array<Week> {
  const daysStack = [...days];

  const firstDay = days[0]!;
  const firstDayOfWeek = firstDay.getDay();
  const missingDays = 7 - firstDayOfWeek;

  const weeks: Array<Week> = [daysStack.splice(0, missingDays)];

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

function completeFirstWeek(week: Week) {
  const fullWeek: Week = [...week];
  const firstDay = week[0]!;
  const previousMonth = getPreviousMonth({
    month: firstDay.getMonth(),
    year: firstDay.getFullYear(),
  });
  const lastMissingDate = lastDayOfMonth(
    new Date(previousMonth.year, previousMonth.month),
  );
  let missingDate = lastMissingDate;

  while (fullWeek.length < 7) {
    fullWeek.unshift(missingDate);
    missingDate = subDays(missingDate, 1);
  }

  return fullWeek;
}

function completeLastWeek(week: Week) {
  const fullWeek: Week = [...week];
  const lastDay = week[week.length - 1]!;
  const nextMonth = getNextMonth({
    month: lastDay.getMonth(),
    year: lastDay.getFullYear(),
  });
  const firstMissingDate = new Date(nextMonth.year, nextMonth.month, 1);
  let lastAddedDate = firstMissingDate;

  while (fullWeek.length < 7) {
    fullWeek.push(lastAddedDate);
    lastAddedDate = addDays(lastAddedDate, 1);
  }

  return fullWeek;
}

export default getWeeks;
