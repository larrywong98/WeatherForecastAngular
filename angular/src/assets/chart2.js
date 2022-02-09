var heyhey=0;
var chartjson;
var winds = [];
var temperatures = [];
var pressures = [];
var humidity = [];
// var json = {};
// var container = '';

function deleteall(){
    heyhey=0;
    chartjson;
    winds = [];
    temperatures = [];
    pressures = [];
    humidity = [];
}
function init(json, container){
    Meteogram(json, container);
    // chartjson=JSON.stringify(getChartOptions());;
    // alert(json)
}

function Meteogram(json, container) {
    json.data.timelines[0].intervals.forEach((node, i) => {
        const x = Date.parse(node.startTime)
        temperatures.push({
            x,
            y: parseInt(node.values.temperature*9/5+32)
        });

        humidity.push({
            x,
            y: parseInt(node.values.humidity)
        })
   
        if (i % 2 === 0) {
            winds.push({
                x,
                value: node.values.windSpeed,
                direction: node.values.windDirection
            });
        }

        pressures.push({
            x,
            y: node.values.pressureSeaLevel
        });

    });
}
  