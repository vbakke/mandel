const Chart = require('chart.js');
const Model = require('./model.js');
const View = require('./view.js');

// let num = { x: 0.344, y: 0.336 };
let num = { x: 0.3, y: 0.3 };

//$(() => {
//    $('.mandelbrot').append('<span>Hei</span>')
//});


class Controller {
    self = this;
    constructor(model, view) {
        this.model = model
        this.view = view

        this.view.init(this.model);
        this.view.display();

        $(this.view).on('pos_changed', (event) => {
            this.model.updateNum(event.pos);
        });
        $(this.view).on('fill_animation', (event) => {
            this.view.setDynamicZoom(!event.running);
        });
        $(this.model).on('num_updated', (event) => {
            this.view.display();
        });
    }
}

const app = new Controller(new Model(num), new View())
