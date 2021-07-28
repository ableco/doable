export type Month = {
  month: number;
  year: number;
};

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

export { getPreviousMonth, getNextMonth };
