
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { format, eachWeekOfInterval, addDays } from "date-fns";
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
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tickLine={false}
          tick={{ fontSize: 12 }}
          label={{ value: 'FTE', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            fontSize: '12px'
          }}
          formatter={(value: number) => [value.toFixed(1), '']}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          wrapperStyle={{ fontSize: '12px' }}
        />
        <Area 
          type="monotone" 
          dataKey="totalCapacity" 
          stackId="1" 
          stroke="#3498db" 
          fill="#3498db"
          fillOpacity={0.3}
          name="Total Capacity"
        />
        <Area 
          type="monotone" 
          dataKey="plannedCapacity" 
          stackId="2" 
          stroke="#e74c3c" 
          fill="#e74c3c" 
          fillOpacity={0.3}
          name="Planned Capacity"
        />
        <Area 
          type="monotone" 
          dataKey="netAvailable" 
          stackId="3" 
          stroke="#2ecc71" 
          fill="#2ecc71" 
          fillOpacity={0.3}
          name="Net Available"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CapacityChart;
