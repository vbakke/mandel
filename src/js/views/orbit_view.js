class OrbitView {
    self = this;

    constructor() {
        this.$orbit = $('.orbit');
        this.fixed_zoom = 0;
    }
    
    
    init (model) {
        this.model = model;
        let canvas = this.$orbit.find('canvas');
        let data = model.magnitudes.map(x => x.num);
        let orbit_zoom = 1.5;

        this.orbit_chart = new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: "Box",
                        data: [{x:-1,y:-1},{x:+1,y:-1},{x:+1,y:+1},{x:-1,y:+1},{x:-1,y:-1}],
                        showLine: true,
                        fill: false,
                        lineTension: 0,
                        borderWidth: 2,
                        borderColor: '#00fcff',
                        pointRadius: 0,
                    },
                    {
                        label: "Point",
                        data: [data[1]],
                        showLine: true,
                        fill: false,
                        lineTension: 0,
                        borderWidth: 2,
                        radius: 5,
                        borderColor: '#05ff05',
                    },
                    {
                        label: "Orbit",
                        data: data,
                        showLine: true,
                        fill: false,
                        lineTension: 0,
                        borderWidth: 1,
                        borderColor: '#ffae41',
                        backgroundColor: '#ffae4133',
                    },
                ],
            },
            options: {
                responsive: true,
                aspectRatio: 1,
                animation: {
                    duration: 300,
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        min: -orbit_zoom,
                        max: +orbit_zoom,
                        ticks: { color: "rgb(185,191,214)", },
                        grid: { color: "rgb(185,191,214)", },
                    },
                    y: {
                        ticks: { color: "rgb(185,191,214)", },
                        grid: { color: "rgb(185,191,214)", },
                        min: -orbit_zoom,
                        max: +orbit_zoom,
                    },
                }
            }
        });
    }

    display(model) {
        let data = model.magnitudes.map(x => x.num);
        this.orbit_chart.data.datasets[1].data = [data[1]];
        this.orbit_chart.data.datasets[2].data = data;

        let zoom = (this.fixed_zoom) ? this.fixed_zoom : (model.magnitudes[data.length-1].magnitude<2) ? 1 : (data.length < 13) ? 20 : (data.length < 30) ? 5 : 1;
        this.setZoom(zoom);
        this.orbit_chart.update();
    }

    setZoom(zoom) {
        this.orbit_chart.options.scales.x.min = -zoom;
        this.orbit_chart.options.scales.x.max = +zoom;
        this.orbit_chart.options.scales.y.min = -zoom;
        this.orbit_chart.options.scales.y.max = +zoom;
    }

    setDynamicZoom(useDynamic) {
        this.fixed_zoom = (useDynamic) ? 0 : 1.5;
        this.orbit_chart.options.animation.duration = (useDynamic) ? 300 : 0;
    }


}


module.exports = OrbitView;
