import React, { useState, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveRadar } from "@nivo/radar";
import { CSVLink } from "react-csv";

const DashboardChart = () => {
  const [activeView, setActiveView] = useState("budget");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [chartType, setChartType] = useState("bar");

  // Example of adding the datasets
  const budgetData = useMemo(() => [
    { region: "Casablanca-Settat", budget: 82.5, investment: 24.3 },
    { region: "Rabat-Salé-Kénitra", budget: 65.2, investment: 18.7 },
    { region: "Tanger-Tétouan-Al Hoceima", budget: 45.8, investment: 15.2 },
    { region: "Fès-Meknès", budget: 38.4, investment: 12.1 },
    { region: "Marrakech-Safi", budget: 35.6, investment: 11.8 },
    { region: "Souss-Massa", budget: 32.1, investment: 10.5 },
  ], []);

  const finalConsumptionData = useMemo(() => [
    { region: "Casablanca-Settat", consumption: 24.5 },
    { region: "Rabat-Salé-Kénitra", consumption: 22.8 },
    { region: "Tanger-Tétouan-Al Hoceima", consumption: 18.3 },
    { region: "Fès-Meknès", consumption: 16.0 },
    { region: "Marrakech-Safi", consumption: 14.7 },
    { region: "Souss-Massa", consumption: 12.5 },
  ], []);

  const taxesData = useMemo(() => [
    { region: "Casablanca-Settat", taxes: 8.5 },
    { region: "Rabat-Salé-Kénitra", taxes: 7.0 },
    { region: "Tanger-Tétouan-Al Hoceima", taxes: 6.2 },
    { region: "Fès-Meknès", taxes: 5.1 },
    { region: "Marrakech-Safi", taxes: 4.9 },
    { region: "Souss-Massa", taxes: 3.7 },
  ], []);

  const gdpBreakdownData = useMemo(() => [
    { region: "Casablanca-Settat", services: 35, industry: 45, agriculture: 20 },
    { region: "Rabat-Salé-Kénitra", services: 30, industry: 40, agriculture: 30 },
    { region: "Tanger-Tétouan-Al Hoceima", services: 25, industry: 40, agriculture: 35 },
    { region: "Fès-Meknès", services: 22, industry: 38, agriculture: 40 },
    { region: "Marrakech-Safi", services: 33, industry: 35, agriculture: 32 },
    { region: "Souss-Massa", services: 28, industry: 30, agriculture: 42 },
  ], []);

  const filteredData = useMemo(() => {
    return selectedRegion === "all"
      ? budgetData
      : budgetData.filter((d) => d.region === selectedRegion);
  }, [selectedRegion, budgetData]);

  const pieData = filteredData.map((d) => ({
    id: d.region,
    label: d.region,
    value: d.budget,
  }));

  const radarData = useMemo(
    () =>
      budgetData.map((d) => ({
        region: d.region,
        budget: d.budget,
        investment: d.investment,
      })),
    [budgetData]
  );

  const csvHeaders = [
    { label: "Region", key: "region" },
    { label: "Budget (Mrd DH)", key: "budget" },
    { label: "Investment (Mrd DH)", key: "investment" },
  ];

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveBar
            data={filteredData}
            keys={["budget", "investment"]}
            indexBy="region"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            colors={["#006233", "#C1272D"]} // Use a color array for the bars
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: "Région",
              legendPosition: "middle",
              legendOffset: 35,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Milliards DH",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate={true}
            motionConfig="wobbly" // Use a more playful motion config
          />
        );
      case "line":
        return (
          <ResponsiveLine
            data={gdpBreakdownData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom" // Use a smoother curve
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Année",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Milliards DH",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate={true}
            motionConfig="wobbly" // Use a more playful motion config
          />
        );
      case "pie":
        return (
          <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8} // Add an offset for active slices
            colors={{ scheme: "paired" }}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
            animate={true}
            motionConfig="wobbly" // Use a more playful motion config
          />
        );
      case "radar":
        return (
          <ResponsiveRadar
            data={radarData}
            keys={["budget", "investment"]}
            indexBy="region"
            maxValue="auto"
            margin={{ top: 70, right: 100, bottom: 40, left: 100 }}
            curve="linearClosed" // Use a closed curve for the radar chart
            borderWidth={2}
            borderColor={{ from: "color" }}
            gridLevels={5}
            gridShape="circular"
            gridLabelOffset={36}
            enableDots={true}
            dotSize={10}
            dotColor={{ theme: "background" }}
            dotBorderWidth={2}
            dotBorderColor={{ from: "color" }}
            enableDotLabel={true}
            dotLabelYOffset={-12}
            colors={{ scheme: "nivo" }} // Use a different color scheme
            fillOpacity={0.25}
            blendMode="multiply"
            animate={true}
            motionConfig="wobbly" // Use a more playful motion config
            isInteractive={true}
            legends={[
              {
                anchor: "top-left",
                direction: "column",
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: "#999",
                symbolSize: 12,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
          />
        );
      default:
        return <p>Aucune donnée disponible.</p>;
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-xl max-w-7xl mx-auto">
      {/* View and Chart Type Buttons */}
      <div className="flex items-center gap-4 mb-6 justify-center">
        <button
          onClick={() => setActiveView("budget")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            activeView === "budget"
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Budget
        </button>
        <button
          onClick={() => setActiveView("timeline")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            activeView === "timeline"
              ? "bg-red-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Évolution
        </button>

        <button
          onClick={() => setChartType("bar")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            chartType === "bar"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Barres
        </button>
        <button
          onClick={() => setChartType("line")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            chartType === "line"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Lignes
        </button>
        <button
          onClick={() => setChartType("pie")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            chartType === "pie"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Camembert
        </button>
        <button
          onClick={() => setChartType("radar")}
          className={`px-4 py-2 rounded-md transition-all duration-200 ${
            chartType === "radar"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Radar
        </button>
      </div>

      {/* Region Selection */}
      <div className="flex items-center gap-4 mb-6 justify-center">
        <label className="text-gray-800 font-semibold">Région:</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="all">Toutes</option>
          {budgetData.map((region) => (
            <option key={region.region} value={region.region}>
              {region.region}
            </option>
          ))}
        </select>

        {/* CSV Export Button */}
        <CSVLink
          data={filteredData}
          headers={csvHeaders}
          filename="budget_data.csv"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
        >
          Exporter CSV
        </CSVLink>
      </div>

      {/* Chart Display */}
      <div className="h-96 shadow-md rounded-lg bg-white p-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default DashboardChart;
