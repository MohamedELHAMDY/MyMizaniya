import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { Download, HelpCircle } from 'lucide-react';

const DashboardChart = () => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('budget');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSector, setSelectedSector] = useState('all');

  const budgetData = useMemo(() => [
    { region: 'Casablanca-Settat', budget: 82.5, investment: 24.3, population: 6.9 },
    { region: 'Rabat-Salé-Kénitra', budget: 65.2, investment: 18.7, population: 4.6 },
    { region: 'Tanger-Tétouan-Al Hoceima', budget: 45.8, investment: 15.2, population: 3.7 },
    { region: 'Fès-Meknès', budget: 38.4, investment: 12.1, population: 4.2 },
    { region: 'Marrakech-Safi', budget: 35.6, investment: 11.8, population: 4.5 },
    { region: 'Souss-Massa', budget: 32.1, investment: 10.5, population: 2.7 }
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
    },
    {
      id: 'Investissements',
      data: [
        { x: '2020', y: 95 },
        { x: '2021', y: 98 },
        { x: '2022', y: 102 },
        { x: '2023', y: 104 },
        { x: '2024', y: 106.5 }
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
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
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
              legend: 'Valeur en Milliards DH', // Corrected string
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            animate={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="chart-container">
      {renderChart()}
    </div>
  );
};

export default DashboardChart;