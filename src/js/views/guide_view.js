const _ = require('underscore');
const levels = [
        require('../../levels/level_1.js'),
        require('../../levels/level_2.js'),
];
// const MathJax = require('mathjax-')

class GuideView {
    self = this;

    constructor() {
        this.$guide = $('.guide');
        this.$content = this.$guide.find('.guide_content');
    }


    init(model) {
        this.model = model;
        this.guide_level = 1;
        this.setGuide(this.guide_level);

        // Guide View
        this.$guide.find('a.arrow').on('click', (event) => {
            return this.on_guide_change(event)
        });

    }

    setGuide(level) {
        this.guide = this.getGuide(level);
        this.template = _.template(this.guide.html);
    }

    getGuide(level) {
        return levels[level-1];
    }

    display(model) {
        let html = this.template(model.num);
        this.$content.html(html);
        if (MathJax !== undefined && MathJax.typeset !== undefined) {
            MathJax.typeset();
        }
    }

    on_guide_change(event) {
        let change = $(event.target).hasClass('next') ? +1 : -1;
        this.guide_level += change;

        this.setGuide(this.guide_level);
        this.display(this.model);


        // $(this).triggerHandler(
        //     $.Event('guide_change', { level: level })
        // );
    }

}


module.exports = GuideView;
