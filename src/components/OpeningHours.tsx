import { openingHoursByWeekday } from "@/data/stylists";
import { formatTime } from "@/lib/dates";

const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const mondayFirst = [1, 2, 3, 4, 5, 6, 0];

export function OpeningHours() {
  return (
    <table className="hours">
      <caption className="visually-hidden">Opening hours</caption>
      <tbody>
        {mondayFirst.map((weekday) => {
          const hours = openingHoursByWeekday[weekday];
          const hoursText = hours ? `${formatTime(hours.opensMinutes)} to ${formatTime(hours.closesMinutes)}` : "Closed";

          return (
            <tr key={weekday}>
              <th scope="row">{weekdayNames[weekday]}</th>
              <td>{hoursText}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
