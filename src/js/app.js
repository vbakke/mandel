const Chart = require('chart.js');
const Model = require('./model.js');
const View = require('./view.js');

// let num = { x: 0.344, y: 0.336 };
let num = { x: 0.7, y: 0.2 };

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
        $(this.view).on('guide_change', (event) => {
            console.log(event);
            this.model.change(event.pos);
        });
        $(this.model).on('num_updated', (event) => {
            this.view.display();
        });
    }
}

const app = new Controller(new Model(num), new View())
