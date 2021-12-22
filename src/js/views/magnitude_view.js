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
                        ticks: { 
                            color: "rgb(185,191,214)", 
                            callback: function(value, index, values) {
                                if (values[index].major) {
                                    if (value >= 0.001 && value <= 1000 ) {
                                        return ''+value;
                                    } else {
                                        let exp = Math.log10(value).toFixed();
                                        let sup = '⁰¹²³⁴⁵⁶⁷⁸⁹';
                                        let str = '10';
                                        if (exp < 0) str+='⁻',exp=exp.slice(1);
                                        for (let pos = 0; pos < exp.length; pos++) {
                                            str += sup[parseInt(exp[pos])];
                                        }
                                        return str;
                                    }
                                } else {
                                    return '';
                                }
                            }
                        },
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

        // let $list = $('<ul></ul>');
        // for (let i = 0; i< Math.min(10, model.magnitudes.length); i++) {
        //     let p = model.magnitudes[i].num;
        //     $list.append('<li><span>'+p.x.toFixed(2)+', '+p.y.toFixed(2)+' i</span></li>')
        // }
        $('.lengths').html(data.length);
        
    }

}


module.exports = MagnitudeView;
