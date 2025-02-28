
import React, { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RoleCapacityChartProps {
  startDate: Date;
  endDate: Date;
  weeks: number;
}

// Mock data for roles with modern colors
const roles = [
  { id: 1, name: "Frontend Developer", color: "#4243B5" },
  { id: 2, name: "Backend Developer", color: "#6356E5" },
  { id: 3, name: "Designer", color: "#7E69FF" },
  { id: 4, name: "Product Manager", color: "#9977FF" },
  { id: 5, name: "QA Engineer", color: "#B391FF" }
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

// Custom tooltip component that shows legend colors with values
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Group by role name to show capacity and planned together
    const roleGroups: Record<string, any[]> = {};
    
    payload.forEach((entry: any) => {
      const dataKey = entry.dataKey;
      const roleName = dataKey.split('_')[0];
      
      if (!roleGroups[roleName]) {
        roleGroups[roleName] = [];
      }
      
      roleGroups[roleName].push(entry);
    });
    
    return (
      <div className="bg-gradient-to-br from-[#111133]/95 to-[#0A0A20]/95 backdrop-blur-md rounded-lg border border-[#222244] p-4 shadow-lg">
        <p className="text-[#FAFDFF] font-medium mb-3">{`Week: ${label}`}</p>
        
        {Object.entries(roleGroups).map(([roleName, entries], roleIndex) => (
          <div key={`role-${roleIndex}`} className="mb-3">
            <p className="text-[#FAFDFF] font-medium border-b border-[#222244] pb-1 mb-2">{roleName}</p>
            
            {entries.map((entry, entryIndex) => {
              const metricName = entry.dataKey.split('_')[1];
              const baseColor = roles.find(r => r.name === roleName)?.color || '#4243B5';
              
              // Derive different shades based on the metric
              const color = metricName === 'capacity' ? baseColor :
                          metricName === 'planned' ? `${baseColor}90` : 
                          `${baseColor}60`;
              
              return (
                <div key={`metric-${entryIndex}`} className="flex items-center gap-3 ml-2 mb-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-[#C8C8F0] text-sm">
                    <span>{metricName === 'capacity' ? 'Capacity' : 
                           metricName === 'planned' ? 'Planned' : 
                           'Available'}:</span> {entry.value.toFixed(1)}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return null;
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
            className={`px-4 py-1.5 text-xs rounded-full transition-all duration-300 shadow-sm ${
              activeRoles.includes(role.name)
                ? `bg-gradient-to-r from-[${role.color}] to-[${role.color}CC] text-white shadow-[${role.color}]/20 shadow-md`
                : 'bg-[#111133]/50 text-[#A0A0C2] hover:bg-[#222244] hover:text-[#FAFDFF]'
            }`}
            style={{
              background: activeRoles.includes(role.name) 
                ? `linear-gradient(to right, ${role.color}, ${role.color}CC)` 
                : ''
            }}
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
            <CartesianGrid strokeDasharray="3 3" stroke="#222244" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: "#C8C8F0" }}
              tickLine={false}
              stroke="#222244"
            />
            <YAxis 
              tickLine={false}
              tick={{ fontSize: 12, fill: "#C8C8F0" }}
              stroke="#222244"
              label={{ value: 'FTE', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12, fill: "#C8C8F0" } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ fontSize: '12px', color: "#C8C8F0" }}
              iconType="circle"
            />
            
            {roles.filter(role => activeRoles.includes(role.name)).map((role) => {
              // Generate gradient IDs for each role
              const capacityGradientId = `${role.name.replace(/\s+/g, '')}_capacityGradient`;
              const plannedGradientId = `${role.name.replace(/\s+/g, '')}_plannedGradient`;
              
              return (
                <React.Fragment key={role.id}>
                  <defs>
                    <linearGradient id={capacityGradientId} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={role.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={`${role.color}CC`} stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id={plannedGradientId} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={role.color} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={`${role.color}90`} stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  
                  <Line
                    type="monotone"
                    dataKey={`${role.name}_capacity`}
                    name={`${role.name} Capacity`}
                    stroke={`url(#${capacityGradientId})`}
                    strokeWidth={3}
                    dot={{ r: 4, fill: role.color, strokeWidth: 1, stroke: "#111133" }}
                    activeDot={{ r: 6, fill: role.color, strokeWidth: 1, stroke: "#FFFFFF" }}
                  />
                  <Line
                    type="monotone"
                    dataKey={`${role.name}_planned`}
                    name={`${role.name} Planned`}
                    stroke={`url(#${plannedGradientId})`}
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={{ r: 3, fill: `${role.color}90`, strokeWidth: 1, stroke: "#111133" }}
                  />
                </React.Fragment>
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RoleCapacityChart;
