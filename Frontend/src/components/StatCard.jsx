const StatCard = ({ title, amount }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-xl font-semibold mt-2">{amount}</h2>
    </div>
  );
};

export default StatCard;
