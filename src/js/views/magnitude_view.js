class MagnitudeView {
    self = this;

    constructor() {
        this.$orbit = $('.magnitudes');

    }


    init(model) {
        this.model = model;
        let canvas = this.$orbit.find('canvas');
        let data = model.magnitudes.map(x => x.magnitudes);
        let orbit_zoom = 2;

        this.chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: "magnitudes",
                    data: [],
                    showLine: true,
                    fill: false,
                    lineTension: 0,
                    borderColor: "rgb(185,191,214)",

                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                animation: {
                    duration: 0, // 300
                    onComplete: function(animation) {
                        // console.log( (performance.now() / 1000).toFixed(3) + 'ms: onAnimationComplete');
                    }
                },
                scales: {
                    x: {
                        display: false,
                        ticks: { color: "rgb(185,191,214)", },
                        grid: { color: "rgb(185,191,214)", },
                    },
                    y: {
                        // suggestedMin: 50,
                        suggestedMax: 1,
                        type: 'logarithmic',
                        ticks: { color: "rgb(185,191,214)", },
                        grid: { color: "rgb(185,191,214)", },
                    }
                },
            }
        });
    }

    display(model) {
        // let canvas = this.$orbit.find('canvas');
        let data = model.magnitudes.map(x => x.magnitude);
        let labels = model.magnitudes.map(x => '1');
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();

    }

}


module.exports = MagnitudeView;
