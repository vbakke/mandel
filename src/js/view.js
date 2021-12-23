const MandelView = require('./views/mandel_view');
const OrbitView = require('./views/orbit_view');
const MagnitudeView = require('./views/magnitude_view');
const GuideView = require('./views/guide_view');

class View {
    self = this;

    constructor() {
        this.mandel_view = new MandelView();
        this.orbit_view = new OrbitView();
        this.magnitude_view = new MagnitudeView();
        this.guide_view = new GuideView();

        this.fill_animation = false;
    }

    init(model) {
        this.model = model;
        this.mandel_view.init(model);
        this.orbit_view.init(model);
        this.magnitude_view.init(model);
        this.guide_view.init(model);

        $(this.mandel_view).on('pos_changed', (event) => {
            $(this).triggerHandler($.Event(event.type, { pos: event.pos }));
        });

        $('button.spiral').click((event) => {
            this.on_startstop_fillanimation(!this.fill_animation);
        });


        // Guide View
        $('a.arrow').on('click', (event) => {
            console.log('Guide:', event.target.classList);
            $(this).triggerHandler($.Event('next_guide'));
        });
    }

    display() {
        this.displayConsole(this.model);
        this.mandel_view.display(this.model);
        this.orbit_view.display(this.model);
        this.magnitude_view.display(this.model);
        this.guide_view.display(this.model);
        let formulae = this.model.ui.getFomulaeUI();
        $('.formulae').html(formulae.label);
    }


    setDynamicZoom(useDynamic) {
        this.orbit_view.setDynamicZoom(useDynamic);
    }


    on_startstop_fillanimation(start_animation) {
        let $button = $('button.spiral');
        this.fill_animation = start_animation;
        if (this.fill_animation) {
            // Start fill animation
            $button.data('startlabel', $button.text());  // Keep original label
            $button.text($button.data('stoplabel'));
            this.spiral(3/this.mandel_view.scale);
            $(this).triggerHandler($.Event('fill_animation', { running: true }));
        } else {
            // Stop fill animation
            $button.text($button.data('startlabel'));
            $(this).triggerHandler($.Event('fill_animation', { running: false }));
        }
    }

    spiral(step, pos, r, angle, i, maxSpiral) {
        

        pos = pos || {x:0, y:0};
        r = r || Math.random()*step;
        angle = angle || Math.random() * 2 * Math.PI;
        i = i || 0;
        if (!maxSpiral) {
            let formulae = this.model.ui.getFomulaeUI();
            maxSpiral = formulae.maxSpiral;
        }

        let tan = Math.atan(step / r);
        let delta_r = step * tan / 2 / Math.PI; // * (1+Math.random());
        angle += tan;
        pos = { x: r * Math.cos(angle), y: r * Math.sin(angle) };
        r += delta_r;
        
        if (this.fill_animation && r < maxSpiral) {
            $(this).triggerHandler($.Event('pos_changed', { pos: pos }));
            setTimeout(() => {
                this.spiral(step, pos, r, angle, i+1, maxSpiral);
            }, 0);
        } else {
            this.on_startstop_fillanimation(false);
            $(this).triggerHandler($.Event('pos_changed', { pos: pos }));
        }
    }

    displayConsole(model) {
        this.mandel_view.$mandel.find('input.num').val(model.num.xStr + ' ' + model.num.yStr + ' i');
        this.mandel_view.$mandel.find('.len').text('len = ' + model.magnitudes.length);
        this.mandel_view.$mandel.find('.z9').text('count = ' + model.num.count);
        // this.mandel_view.$mandel.find('.z9').text('Z₉ = ' + model.magnitudes[9].magnitude);
        // this.mandel_view.$mandel.find('.logz9').text('log(Z₉) = ' + Math.log10(model.magnitudes[9].magnitude));
        // this.mandel_view.$mandel.find('.wobble').text('wobble = ' + model.wobble);
        // this.mandel_view.$mandel.find('.stddev').text('std.dev. = ' + model.stddev);
    }

}

module.exports = View;
