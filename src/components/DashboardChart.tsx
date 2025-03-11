import React, { useState, useMemo } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveRadar } from '@nivo/radar';
import { CSVLink } from 'react-csv';

const DashboardChart = () => {
  const [activeView, setActiveView] = useState('budget');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [chartType, setChartType] = useState('bar');

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

  const filteredData = useMemo(() => {
    return selectedRegion === 'all' ? budgetData : budgetData.filter(d => d.region === selectedRegion);
  }, [selectedRegion, budgetData]);

  const pieData = filteredData.map(d => ({ id: d.region, label: d.region, value: d.budget }));

  const radarData = useMemo(() => budgetData.map(d => ({
    region: d.region,
    budget: d.budget,
    investment: d.investment
  })), []);

  const csvHeaders = [
    { label: 'Region', key: 'region' },
    { label: 'Budget (Mrd DH)', key: 'budget' },
    { label: 'Investment (Mrd DH)', key: 'investment' }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <ResponsiveBar data={filteredData} keys={['budget', 'investment']} indexBy="region" margin={{ top: 50, right: 130, bottom: 50, left: 60 }} padding={0.3} colors={['#006233', '#C1272D']} animate={true} />;
      case 'line':
        return <ResponsiveLine data={timelineData} margin={{ top: 50, right: 110, bottom: 50, left: 60 }} xScale={{ type: 'point' }} yScale={{ type: 'linear' }} animate={true} />;
      case 'pie':
        return <ResponsivePie data={pieData} margin={{ top: 50, right: 80, bottom: 50, left: 80 }} innerRadius={0.5} padAngle={0.7} colors={{ scheme: 'paired' }} animate={true} />;
      case 'radar':
        return <ResponsiveRadar data={radarData} keys={['budget', 'investment']} indexBy="region" maxValue="auto" margin={{ top: 50, right: 80, bottom: 50, left: 80 }} colors={{ scheme: 'category10' }} animate={true} />;
      default:
        return <p>Aucune donnée disponible.</p>;
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-xl max-w-7xl mx-auto">
      {/* View and Chart Type Buttons */}
      <div className="flex items-center gap-4 mb-6 justify-center">
        <button onClick={() => setActiveView('budget')} className={`px-4 py-2 rounded-md transition-all duration-200 ${activeView === 'budget' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Budget</button>
        <button onClick={() => setActiveView('timeline')} className={`px-4 py-2 rounded-md transition-all duration-200 ${activeView === 'timeline' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Évolution</button>

        <button onClick={() => setChartType('bar')} className={`px-4 py-2 rounded-md transition-all duration-200 ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Barres</button>
        <button onClick={() => setChartType('line')} className={`px-4 py-2 rounded-md transition-all duration-200 ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Lignes</button>
        <button onClick={() => setChartType('pie')} className={`px-4 py-2 rounded-md transition-all duration-200 ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Camembert</button>
        <button onClick={() => setChartType('radar')} className={`px-4 py-2 rounded-md transition-all duration-200 ${chartType === 'radar' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Radar</button>
      </div>

      {/* Region Selection */}
      <div className="flex items-center gap-4 mb-6 justify-center">
        <label className="text-gray-800 font-semibold">Région:</label>
        <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all">
          <option value="all">Toutes</option>
          {budgetData.map(region => <option key={region.region} value={region.region}>{region.region}</option>)}
        </select>

        {/* CSV Export Button */}
        <CSVLink data={filteredData} headers={csvHeaders} filename="budget_data.csv" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all">Exporter CSV</CSVLink>
      </div>

      {/* Chart Display */}
      <div className="h-96 shadow-md rounded-lg bg-white p-4">{renderChart()}</div>
    </div>
  );
};

export default DashboardChart;
