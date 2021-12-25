class Model {
    self = this;

    constructor(num) {
        // The complex number c, and a mathematicion would use c = a + bi, not x and y. 
        // The mathematicion is right, but hopefully x and y is more understandable for non-mathematicions
        this.num = {x: 0, y: 0,
            _xStr: null, _yStr: null,
            get xStr() {
                if (this._xStr === null) this._xStr = this._format(this.x);
                return this._xStr;
            },
            get yStr() {
                if (this._yStr === null) this._yStr = this._format(this.y);
                return this._yStr;
            },
            _format: function(n) {
                let prefix = (n < 0) ? '' : '+';
                return prefix + n.toFixed(2);
            }
            };  
        if (num) {
            this.num.x = num.x;
            this.num.y = num.y;
        }
        this.level = 1;
        this.level_xps = [2500, 10000];
        this.magnitudes = [];
        this.max_length = 1;
        this.explore_plot = false;
        this.orbit_zoom = 2;
        

        this.mandel_view = { cx: 0, cy: 0, scale: 50 };

        this.levels = [
            {xp_delta: 1, max_length: 0, explore: false, orbit_zoom: 2, magnitude: false},
            {xp_delta: 1, max_length: 1, },
            {xp_delta: 1, max_length: 2, },
        ];

        this.ui = {
            formulae: 'Z2',
            formulaes: {
                'Z2': {
                    label: 'Z<sub>n+1</sub> = Z<sub>n</sub><sup>2</sup>',
                    label_mathjax: 'zveb_{n+1} = z_n^2',
                    maxSpiral: 1.5,
                    level: 1,
                }, 
                'Z2Z': {
                    label: 'Z<sub>n+1</sub> = Z<sub>n</sub><sup>2</sup> + Z<sub>n</sub>',
                    maxSpiral: 1.6,
                    level: 2,
                }, 
                'Z2C': {
                    label: 'Z<sub>n+1</sub> = Z<sub>n</sub><sup>2</sup> + C',
                    maxSpiral: 1.9,
                    level: 3,
                },
                'Zsin': {
                    label: 'Z<sub>n+1</sub> = Z<sub>n</sub><sup>2</sup> + sin()',
                    maxSpiral: 1.9,
                    level: 10,
                },
            },
            getFomulaeUI: () => {
                return this.ui.formulaes[this.ui.formulae];
            },
        };

        this.calcMagnitudes();
    }

    nextLevel() {
        if (this.level <= this.level_xps.length)
            return this.level_xps[this.level - 1];
        else
            return null;
    }

    updateNum(num) {
        this.num.x = num.x;
        this.num.y = num.y;
        this.num._xStr = this.num._yStr = null;
        this.num.count++;
        if (this.num.count > this.nextLevel()) {
            this.level++;
        }

        this.calcMagnitudes();

        $(this).triggerHandler(
            $.Event('num_updated')
        );

    }


    calcMagnitudes() {
        this.magnitudes = [];
        let num = { x: 0, y: 0 };
        this.infinite = false;
        for (let i = 0; i <= this.max_length; i++) {
            let magnitude = Math.sqrt(num.x * num.x + num.y * num.y);
            let elem = {
                num, magnitude,
                magnitude_log: Math.log10(magnitude)
            };

            if (i==0) num = null; // DBG
            if (elem.magnitude === Infinity) {
                this.infinite = true;
                break;
            } else if (i>0 && elem.magnitude < 0.000001) {
                break;
            } else {
                this.magnitudes.push(elem);
                // Calculate next number
                num = this.next_number(num);
            }
        }

        this.wobble = 0;
        this.stddev = 0;
        let magnitudes = this.magnitudes.map(e => e.magnitude);
        if (magnitudes.length === this.max_length) {
            let prev = magnitudes[0];
            let mean = magnitudes.reduce((a, b) => a + b) / this.magnitudes.length;
            for (let i = 1; i<=this.max_length; i++) {
                let current = magnitudes[i];
                this.wobble += current * prev;
                this.stddev += (mean-current)*(mean-current);
                prev = current;
            }
            // this.wobble = this.wobble;
        }
    }

    next_number(num) {
        // Square the complex number, plus original num
        // let next_num = {
        //     x: num.x * num.x - num.y * num.y + this.num.x,
        //     y: 2 * num.x * num.y + this.num.y,
        // }

        // Square the complex number
        if (num === null) return {x: this.num.x, y: this.num.y};

        let add = null;
        if (this.ui.formulae === 'Z2') add = {x: 0, y: 0}
        else if (this.ui.formulae === 'Z2Z') add = {x: num.x, y: num.y}
        else if (this.ui.formulae === 'Z2C') add = {x: this.num.x, y: this.num.y}
        else if (this.ui.formulae === 'Zsin') add = {x: Math.sin(num.x)*Math.cosh(num.y), y: Math.cos(num.x)*Math.sinh(num.y)}

        let next_num = {
            x: num.x * num.x - num.y * num.y + add.x,
            y: 2 * num.x * num.y + add.y,
        }
        return next_num;
    }
}


module.exports = Model;
