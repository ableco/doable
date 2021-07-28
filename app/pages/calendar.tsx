import { Button, Center } from "@ableco/abledev-components";
import DatePicker from "app/components/DatePicker";
import protectPage from "app/core/helpers/protectPage";
import Layout from "app/core/layouts/Layout";
import { BlitzPage } from "blitz";
import format from "date-fns/format";
import { useState } from "react";

const CalendarPage: BlitzPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Center className="space-y-2">
      <DatePicker onChange={setSelectedDate}>
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
