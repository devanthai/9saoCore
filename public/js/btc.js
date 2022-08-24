let height = window.innerHeight;
let width = $("#cardBodyKetQua").width();
const chartProperties = {
    width: width ,
    height: height / 4,
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    }
}
const domElement = document.getElementById('chartBtc');
const chart = LightweightCharts.createChart(domElement, chartProperties);
const candleSeries = chart.addCandlestickSeries();

$.ajax({
    type: "GET",
    url: "/getcandles",
    success: function (data) {
        data.forEach(element => {
            candleSeries.update(element);
        });
    }
});

socketzzz.on("BTCdata", (data) => {

    if (data.open != null && data.time != null && data.high != null && data.low != null && data.close != null) {
        $("#amountBTC").text(data.close)
        candleSeries.update(data);
    }
})