import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isoWeek from "dayjs/plugin/isoWeek";

// Configure dayjs plugins
dayjs.extend(weekday);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

// Configure to start week on Monday (1 = Monday, 0 = Sunday)
dayjs.Ls.en.weekStart = 1;

export default dayjs;
