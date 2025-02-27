
import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface CapacityChartProps {
  startDate: Date;
  endDate: Date;
  weeks: number;
}

// Mock data generator
const generateCapacityData = (start: Date, numWeeks: number) => {
  const data = [];
  
  // Base values
  const baseCapacity = 10;
  const basePlanned = 6;
  
  // Generate week-by-week data
  for (let i = 0; i < numWeeks; i++) {
    const weekStart = addDays(start, i * 7);
    const weekLabel = format(weekStart, 'MMM d');
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
    const totalCapacity = baseCapacity * randomFactor;
    
    const plannedCapacity = basePlanned * (0.9 + Math.random() * 0.3);
    const netAvailable = totalCapacity - plannedCapacity;
    
    data.push({
      name: weekLabel,
      totalCapacity,
      plannedCapacity,
      netAvailable,
    });
  }
  
  return data;
};

// Custom tooltip component that shows legend colors with values
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121212] rounded-md border border-[#333333] p-3 shadow-lg">
        <p className="text-[#FAFDFF] font-medium mb-2">{`Week: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-[#FAFDFF]">
              <span className="font-medium">{entry.name}:</span> {entry.value.toFixed(1)}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const CapacityChart = ({ startDate, endDate, weeks }: CapacityChartProps) => {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate mock data based on start date and number of weeks
    setData(generateCapacityData(startDate, weeks));
  }, [startDate, endDate, weeks]);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: "#FAFDFF" }}
          tickLine={false}
          stroke="#333333"
        />
        <YAxis 
          tickLine={false}
          tick={{ fontSize: 12, fill: "#FAFDFF" }}
          stroke="#333333"
          label={{ value: 'FTE', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12, fill: "#FAFDFF" } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          height={36}
          wrapperStyle={{ fontSize: '12px', color: "#FAFDFF" }}
        />
        <Area 
          type="monotone" 
          dataKey="totalCapacity" 
          stackId="1" 
          stroke="#0000FF" 
          fill="#0000FF"
          fillOpacity={0.3}
          name="Total Capacity"
        />
        <Area 
          type="monotone" 
          dataKey="plannedCapacity" 
          stackId="2" 
          stroke="#6682FF" 
          fill="#6682FF" 
          fillOpacity={0.3}
          name="Planned Capacity"
        />
        <Area 
          type="monotone" 
          dataKey="netAvailable" 
          stackId="3" 
          stroke="#3D5BFF" 
          fill="#3D5BFF" 
          fillOpacity={0.3}
          name="Net Available"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CapacityChart;
