import { Button, Center } from "@ableco/abledev-components";
import DatePicker from "app/components/DatePicker";
import protectPage from "app/core/helpers/protectPage";
import Layout from "app/core/layouts/Layout";
import { BlitzPage } from "blitz";
import { addDays, addWeeks } from "date-fns";
import format from "date-fns/format";
import { useState } from "react";

const CalendarPage: BlitzPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <Center className="space-y-2">
      <DatePicker
        value={selectedDate}
        onChange={setSelectedDate}
        shortcuts={[
          { title: "Today", date: new Date() },
          { title: "Tomorrow", date: addDays(new Date(), 1) },
          { title: "Next Week", date: addWeeks(new Date(), 1) },
        ]}
      >
        <Button>Pick a Date</Button>
      </DatePicker>
      <div>
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
