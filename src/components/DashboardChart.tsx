import React, { useState, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';

const DashboardChart = () => {
  const [activeView, setActiveView] = useState('budget');

  console.log("DashboardChart is rendering..."); // Debugging log

  const budgetData = useMemo(() => [
    { region: 'Casablanca-Settat', budget: 82.5, investment: 24.3 },
    { region: 'Rabat-Salé-Kénitra', budget: 65.2, investment: 18.7 },
    { region: 'Tanger-Tétouan-Al Hoceima', budget: 45.8, investment: 15.2 },
    { region: 'Fès-Meknès', budget: 38.4, investment: 12.1 },
    { region: 'Marrakech-Safi', budget: 35.6, investment: 11.8 },
    { region: 'Souss-Massa', budget: 32.1, investment: 10.5 }
  ], []);

  const timelineData = useMemo(() => [
    {
      id: 'Budget Total',
      data: [
        { x: '2020', y: 450 },
        { x: '2021', y: 475 },
        { x: '2022', y: 490 },
        { x: '2023', y: 505 },
        { x: '2024', y: 519.2 }
      ]
    }
  ], []);

  const renderChart = () => {
    switch (activeView) {
      case 'budget':
        return (
          <ResponsiveBar
            data={budgetData}
            keys={['budget', 'investment']}
            indexBy="region"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            colors={['#006233', '#C1272D']}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Région',
              legendPosition: 'middle',
              legendOffset: 45
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Milliards DH',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            animate={true}
          />
        );
      case 'timeline':
        return (
          <ResponsiveLine
            data={timelineData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear' }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Année',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Milliards DH',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            animate={true}
          />
        );
      default:
        return <p>Aucune donnée disponible.</p>;
    }
  };

  return (
    <div className="h-96 w-full border border-gray-300 p-4">
      {renderChart()}
    </div>
  );
};

export default DashboardChart;
