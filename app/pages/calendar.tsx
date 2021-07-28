import { Button, Center } from "@ableco/abledev-components";
import DatePicker from "app/components/DatePicker";
import protectPage from "app/core/helpers/protectPage";
import Layout from "app/core/layouts/Layout";
import { BlitzPage } from "blitz";
import { addDays, addWeeks, isBefore, startOfDay } from "date-fns";
import format from "date-fns/format";
import { useState } from "react";

const CalendarPage: BlitzPage = () => {
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  return (
    <Center>
      <DatePicker
        value={selectedDate}
        onChange={setSelectedDate}
        shortcuts={[
          { title: "Today", date: today },
          { title: "Tomorrow", date: addDays(today, 1) },
          { title: "Next Week", date: addWeeks(today, 1) },
        ]}
        isDateDisabled={(date) => isBefore(date, today)}
      >
        <Button>Pick a Date</Button>
      </DatePicker>
      <div className="mt-2">
        {selectedDate ? (
          <>Selecte Date: {format(selectedDate, "cccc, MMMM dd, yyyy")}</>
        ) : null}
      </div>
    </Center>
  );
};

CalendarPage.getLayout = (page) => <Layout title="Calendar">{page}</Layout>;
CalendarPage.suppressFirstRenderFlicker = true;

export const getServerSideProps = protectPage;

export default CalendarPage;
