
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Scientifically Treated', value: 91511, color: '#10b981' },
  { name: 'Landfill Disposal', value: 41455, color: '#f59e0b' },
  { name: 'Unaccounted / Leaked', value: 37373, color: '#ef4444' },
];

const WasteOverview: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold mb-4 text-slate-800">The Waste Gap (FY 2021-22)</h3>
      <p className="text-sm text-slate-600 mb-6">
        Total Generated: <strong>1,70,339 TPD</strong>. 
        Only 54% is scientifically treated, leaving a massive environmental risk.
      </p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div className="p-3 bg-emerald-50 rounded-xl">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Treated</p>
          <p className="text-lg font-bold text-emerald-700">54%</p>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl">
          <p className="text-xs text-amber-600 font-semibold uppercase">Landfill</p>
          <p className="text-lg font-bold text-amber-700">24%</p>
        </div>
        <div className="p-3 bg-red-50 rounded-xl">
          <p className="text-xs text-red-600 font-semibold uppercase">Leaked</p>
          <p className="text-lg font-bold text-red-700">22%</p>
        </div>
      </div>
    </div>
  );
};

export default WasteOverview;
