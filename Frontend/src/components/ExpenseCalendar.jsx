import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ExpenseCalendar = ({ expenses }) => {
  const getTotalForDate = (date) => {
    return expenses
      .filter(e => new Date(e.date).toDateString() === date.toDateString())
      .reduce((sum, e) => sum + e.amount, 0);
  };

  return (
    <div className="bg-[#0f0f0f] p-4 rounded-xl border border-[#1f1f1f]">
      <Calendar
        tileContent={({ date }) => {
          const total = getTotalForDate(date);
          return total ? (
            <p className="text-xs text-orange-400">₹{total}</p>
          ) : null;
        }}
      />
    </div>
  );
};

export default ExpenseCalendar;
