import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartSection = ({ expenses = [] }) => {
  // ✅ HARD GUARD (never crashes)
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center bg-[#1a1a1a] rounded-xl text-gray-400">
        No expense data available
      </div>
    );
  }

  const data = expenses.map((e) => ({
    date: new Date(e.date).getDate(),
    amount: Number(e.amount),
  }));

  return (
    <div className="h-72 min-h-[288px] w-full bg-[#1a1a1a] rounded-xl p-4 overflow-hidden">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <XAxis dataKey="date" stroke="#9ca3af" />
      <YAxis stroke="#9ca3af" />
      <Tooltip
        contentStyle={{
          backgroundColor: "#0f0f0f",
          border: "1px solid #1f1f1f",
          color: "#fff",
        }}
      />
      <Line
        type="monotone"
        dataKey="amount"
        stroke="#f97316"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

  );
};

export default ChartSection;
