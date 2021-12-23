const _ = require('underscore');
const level1 = require('../../levels/level_1.js');

class GuideView {
    self = this;

    constructor() {
        this.$guide = $('.guide_content');

    }


    init(model) {
        this.model = model;
        this.template = _.template(level1);
    }

    display(model) {
        let html = this.template(model.num);
        this.$guide.html(html);
    }

}


module.exports = GuideView;
