export function plotScatter() {
    // Array of objects containing x and y coordinates
    const data = [
        { x: 10, y: 20 },
        { x: 15, y: 35 },
        { x: 20, y: 25 },
        { x: 25, y: 40 },
        { x: 30, y: 30 },
        { x: 35, y: 45 },
        { x: 40, y: 38 },
    ];

    // Function to transform data into a format suitable for ECharts
    const transformData = (dataArray) => {
        return dataArray.map((point) => [point.sim_madrid, point.aesthetic]);
    };

    // Prepare the transformed data
    const scatterData = transformData(data);

    // Initialize ECharts instance on the element with ID 'scatterplot'
    const scatterChart = echarts.init(document.getElementById("scatterplot"));

    // ECharts scatterplot configuration
    const option = {
        tooltip: {
            trigger: "item",
            formatter: "({c0}, {c1})",
        },
        xAxis: {
            name: "concept",
            type: "value",
        },
        yAxis: {
            name: "madrid",
            type: "value",
        },
        series: [
            {
                name: "Data Points",
                type: "scatter",
                data: scatterData,
                symbolSize: 10,
            },
        ],
    };

    // Use the specified configuration to set options for the chart
    scatterChart.setOption(option);
}
