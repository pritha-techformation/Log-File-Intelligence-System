import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Error chart
const ErrorChart = ({ data }) => {

  // If no data, return null
  if (!data || data.length === 0) return null;

  return (
    <div className="h-64 w-full">

      {/* Responsive Chart */}
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ErrorChart;