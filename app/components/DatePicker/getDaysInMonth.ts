import { addDays } from "date-fns";

function getDaysInMonth(month: number, year: number): Array<Date> {
  const firstDate = new Date(year, month, 1);
  const dates: Array<Date> = [firstDate];

  let currentDate = firstDate;

  while (true) {
    const nextDate = addDays(currentDate, 1);
    if (nextDate.getMonth() !== currentDate.getMonth()) {
      break;
    } else {
      currentDate = nextDate;
      dates.push(currentDate);
    }
  }

  return dates;
}

export default getDaysInMonth;
