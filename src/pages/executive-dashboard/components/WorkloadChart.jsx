import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WorkloadChart = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">
          Team Workload Distribution
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground">
          Current task allocation across team members
        </p>
      </div>
      <div className="w-full h-64 md:h-80" aria-label="Team Workload Distribution Bar Chart" style={{ minWidth: 0, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="assigned" fill="hsl(var(--primary))" name="Assigned Tasks" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="hsl(var(--success))" name="Completed Tasks" radius={[4, 4, 0, 0]} />
            <Bar dataKey="capacity" fill="hsl(var(--muted))" name="Capacity" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Total Capacity</p>
          <p className="text-lg md:text-xl font-heading font-bold text-foreground">
            {data?.reduce((sum, item) => sum + item?.capacity, 0)}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Tasks Assigned</p>
          <p className="text-lg md:text-xl font-heading font-bold text-foreground">
            {data?.reduce((sum, item) => sum + item?.assigned, 0)}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Utilization Rate</p>
          <p className="text-lg md:text-xl font-heading font-bold text-foreground">
            {Math.round((data?.reduce((sum, item) => sum + item?.assigned, 0) / data?.reduce((sum, item) => sum + item?.capacity, 0)) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkloadChart;