const _ = require('underscore');
const level1 = require('../../levels/level_1.js');

class GuideView {
    self = this;

    constructor() {
        this.$guide = $('.guide');
        this.$content = this.$guide.find('.guide_content');
        
    }
    
    
    init(model) {
        this.model = model;
        this.template = _.template(level1.html);
        
        // Guide View
        this.$guide.find('a.arrow').on('click', (event) => { 
            return this.on_guide_change(event)
        });
        
    }

    display(model) {
        let html = this.template(model.num);
        this.$content.html(html);
    }

    on_guide_change(event) {
        let change = $(event.target).hasClass('next') ? +1 : -1;
        let level = this.model.level + change;

        $(this).triggerHandler(
            $.Event('guide_change', { level: level })
        );
    }

}


module.exports = GuideView;
