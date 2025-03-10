import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveChoropleth } from '@nivo/geo';
import moroccoGeoData from '../data/morocco-regions.json';
import { Download, Filter, HelpCircle } from 'lucide-react';

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

  const sectorData = useMemo(() => [
    { id: 'Education', value: 25.3, description: 'Éducation et formation professionnelle' },
    { id: 'Santé', value: 18.7, description: 'Santé publique et protection sociale' },
    { id: 'Infrastructure', value: 15.4, description: 'Infrastructure et transport' },
    { id: 'Agriculture', value: 12.8, description: 'Agriculture et développement rural' },
    { id: 'Sécurité', value: 10.2, description: 'Sécurité et défense' },
    { id: 'Autres', value: 17.6, description: 'Autres dépenses publiques' }
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

  const downloadData = () => {
    let dataToExport;
    switch (activeView) {
      case 'budget':
        dataToExport = budgetData;
        break;
      case 'sectors':
        dataToExport = sectorData;
        break;
      case 'timeline':
        dataToExport = timelineData;
        break;
      default:
        return;
    }

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-data-${activeView}-${selectedYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            axisTop={null}
            axisRight={null}
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
            labelSkipWidth={12}
            labelSkipHeight={12}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20
              }
            ]}
            animate={true}
            motionConfig="gentle"
            tooltip={({ id, value, color }) => (
              <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
                <strong style={{ color }}>{id}</strong>
                <div>{value.toFixed(1)} Mrd DH</div>
              </div>
            )}
          />
        );
      case 'sectors':
        return (
          <ResponsivePie
            data={sectorData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: 'category10' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            radialLabelsSkipAngle={10}
            radialLabelsTextXOffset={6}
            radialLabelsTextColor="#333333"
            radialLabelsLinkOffset={0}
            radialLabelsLinkDiagonalLength={16}
            radialLabelsLinkHorizontalLength={24}
            radialLabelsLinkStrokeWidth={1}
            radialLabelsLinkColor={{ from: 'color' }}
            slicesLabelsSkipAngle={10}
            slicesLabelsTextColor="#333333"
            animate={true}
            motionConfig="gentle"
            tooltip={({ datum }) => (
              <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
                <strong style={{ color: datum.color }}>{datum.id}</strong>
                <div>{datum.value.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">{datum.data.description}</div>
              </div>
            )}
          />
        );
      case 'timeline':
        return (
          <ResponsiveLine
            data={timelineData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            axisTop={null}
            axisRight={null}
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
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)'
              }
            ]}
            animate={true}
            motionConfig="gentle"
            enableSlices="x"
            sliceTooltip={({ slice }) => (
              <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
                <strong>{slice.points[0].data.xFormatted}</strong>
                {slice.points.map((point) => (
                  <div key={point.id} style={{ color: point.serieColor }}>
                    {point.serieId}: {point.data.yFormatted} Mrd DH
                  </div>
                ))}
              </div>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center md:justify-between mb-6">
        <h3 className="text-xl font-semibold">{t('dashboard.title')}</h3>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-morocco-green focus:ring focus:ring-morocco-green focus:ring-opacity-50"
            >
              {['2020', '2021', '2022', '2023', '2024'].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-morocco-green focus:ring focus:ring-morocco-green focus:ring-opacity-50"
            >
              <option value="all">Tous les secteurs</option>
              {sectorData.map((sector) => (
                <option key={sector.id} value={sector.id}>{sector.id}</option>
              ))}
            </select>

            <button
              onClick={downloadData}
              className="p-2 text-gray-600 hover:text-morocco-green rounded-full hover:bg-gray-100"
              title="Télécharger les données"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-gray-600 hover:text-morocco-green rounded-full hover:bg-gray-100"
              title="Aide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="flex space-x-2">
            {['budget', 'sectors', 'timeline'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeView === view
                    ? 'bg-morocco-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[500px]">
        {renderChart()}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-morocco-green bg-opacity-10 p-4 rounded-lg">
          <h4 className="font-semibold text-morocco-green">{t('dashboard.budget')}</h4>
          <p className="text-2xl font-bold text-morocco-green">519.2 Mrd DH</p>
          <p className="text-sm text-morocco-green/70">+2.8% vs 2023</p>
        </div>
        <div className="bg-morocco-red bg-opacity-10 p-4 rounded-lg">
          <h4 className="font-semibold text-morocco-red">{t('dashboard.investment')}</h4>
          <p className="text-2xl font-bold text-morocco-red">106.5 Mrd DH</p>
          <p className="text-sm text-morocco-red/70">+2.4% vs 2023</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700">{t('dashboard.debt')}</h4>
          <p className="text-2xl font-bold text-gray-900">105 Mrd DH</p>
          <p className="text-sm text-gray-600">-1.2% vs 2023</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;