
import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RoleCapacityChartProps {
  startDate: Date;
  endDate: Date;
  weeks: number;
}

// Mock data for roles with Statworx colors
const roles = [
  { id: 1, name: "Frontend Developer", color: "#9b87f5" },
  { id: 2, name: "Backend Developer", color: "#7E69AB" },
  { id: 3, name: "Designer", color: "#6E59A5" },
  { id: 4, name: "Product Manager", color: "#D6BCFA" },
  { id: 5, name: "QA Engineer", color: "#1A1F2C" }
];

// Mock data generator for role-based capacity
const generateRoleCapacityData = (start: Date, numWeeks: number) => {
  const data = [];
  
  // Generate week-by-week data
  for (let i = 0; i < numWeeks; i++) {
    const weekStart = addDays(start, i * 7);
    const weekLabel = format(weekStart, 'MMM d');
    
    let weekData: any = {
      name: weekLabel,
    };
    
    // Add data for each role
    roles.forEach(role => {
      // Base capacity between 1.5 and 3.5
      const baseCapacity = 1.5 + Math.random() * 2;
      
      // Planned is usually between 50-90% of capacity
      const plannedFactor = 0.5 + Math.random() * 0.4;
      const planned = baseCapacity * plannedFactor;
      
      // Net available is the difference
      const netAvailable = baseCapacity - planned;
      
      weekData[`${role.name}_capacity`] = baseCapacity;
      weekData[`${role.name}_planned`] = planned;
      weekData[`${role.name}_available`] = netAvailable;
    });
    
    data.push(weekData);
  }
  
  return data;
};

const RoleCapacityChart = ({ startDate, endDate, weeks }: RoleCapacityChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [activeRoles, setActiveRoles] = useState<string[]>([roles[0].name, roles[1].name]);
  
  useEffect(() => {
    // Generate mock data based on start date and number of weeks
    setData(generateRoleCapacityData(startDate, weeks));
  }, [startDate, endDate, weeks]);
  
  const toggleRole = (roleName: string) => {
    if (activeRoles.includes(roleName)) {
      setActiveRoles(activeRoles.filter(r => r !== roleName));
    } else {
      setActiveRoles([...activeRoles, roleName]);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map(role => (
          <button
            key={role.id}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeRoles.includes(role.name)
                ? 'bg-[#9b87f5] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-[#E5DEFF]'
            }`}
            onClick={() => toggleRole(role.name)}
          >
            {role.name}
          </button>
        ))}
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
            
            {roles.filter(role => activeRoles.includes(role.name)).map((role) => (
              <Line
                key={`${role.name}_capacity`}
                type="monotone"
                dataKey={`${role.name}_capacity`}
                name={`${role.name} Capacity`}
                stroke={role.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
            
            {roles.filter(role => activeRoles.includes(role.name)).map((role) => (
              <Line
                key={`${role.name}_planned`}
                type="monotone"
                dataKey={`${role.name}_planned`}
                name={`${role.name} Planned`}
                stroke={role.color}
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoleCapacityChart;
