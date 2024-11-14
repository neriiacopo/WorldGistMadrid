export function plotScatter(data) {
    // Function to transform data into a format suitable for ECharts

    const simMin = Math.min(...data.map((r) => r.similarity));
    const simMax = Math.max(...data.map((r) => r.similarity));

    const simMadridMin = Math.min(...data.map((r) => r.madrid));
    const simMadridMax = Math.max(...data.map((r) => r.madrid));

    const simAestMin = Math.min(...data.map((r) => r.aesthetic));
    const simAestMax = Math.max(...data.map((r) => r.aesthetic));

    const transformData = (dataArray) => {
        return dataArray.map((point) => [
            (point.similarity - simMin) / (simMax - simMin),
            (point.madrid - simMadridMin) / (simMadridMax - simMadridMin),
            (point.aesthetic - simAestMin) / (simAestMax - simAestMin),
        ]);
    };

    // Prepare the transformed data
    const scatterData = transformData(data);

    const xValues = scatterData.map((point) => point[0]);
    const yValues = scatterData.map((point) => point[1]);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    const getColorFromRadius = (ratio) => {
        const red = Math.round(255 * (1 - ratio));
        const blue = Math.round(255 * ratio);
        return `rgb(${red}, 0, ${blue})`;
    };

    console.log(scatterData);
    // Initialize ECharts instance on the element with ID 'scatterplot'
    const scatterChart = echarts.init(document.getElementById("scatterplot"));

    // ECharts scatterplot configuration
    const option = {
        tooltip: {
            trigger: "item",
            formatter: (params) => {
                let str = `<div
                                style="
                                    width: 200px;
                                    height: 200px;
                                    p: 10;
                                    display: flex;
                                    justify-content: center;
                                    align-ttems: center;
                                    position: relative;
                                    background-color: white;"
                            >
                            <img src= ${data[params.dataIndex]["url"]}
                                   style="
                                   max-width: 100%;
                                   max-height: 100%;
                                   object-fit: contain;
                                   loading:lazy"
                                   ></img>
                            </div>`;
                return str;
            },
        },
        xAxis: {
            name: "Concept",
            type: "value",
            min: xMin,
            max: xMax,
            nameLocation: "middle",
            nameGap: 30, // Adjust the gap between the axis and the name
            nameRotate: 0, // Aligned with the axis (horizontal)
            showMinLabel: false,
            showMaxLabel: false,
        },
        yAxis: {
            name: "Madrid",
            type: "value",
            min: yMin,
            max: yMax,
            nameLocation: "middle",
            nameGap: 40, // Adjust the gap between the axis and the name
            nameRotate: 90, // Aligned with the axis (vertical)
            showMinLabel: false,
            showMaxLabel: false,
        },
        series: [
            {
                name: "Data Points",
                type: "scatter",
                data: scatterData,
                symbolSize: (data) => data[2] * 10,
                itemStyle: {
                    color: (params) => getColorFromRadius(params.value[2]), // Apply gradient color
                },
            },
        ],
    };

    // Use the specified configuration to set options for the chart
    scatterChart.setOption(option);
}
