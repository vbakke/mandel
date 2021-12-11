class Model {
    self = this;

    constructor(num) {
        // The complex number c, and a mathematicion would use c = a + bi, not x and y. 
        // The mathematicion is right, but hopefully x and y is more understandable for non-mathematicions
        this.num = num || {x: 0, y: 0};  
        this.num.count = 0;
        this.level = 1;
        this.level_count = [2500, 10000];
        this.magnitudes = [];
        this.max_length = 100;
        

        this.mandel_view = { cx: 0, cy: 0, scale: 50 };

        this.calcMagnitudes();
    }

    nextLevel() {
        if (this.level <= this.level_count.length)
            return this.level_count[this.level - 1];
        else
            return null;
    }

    updateNum(num) {
        this.num.x = num.x;
        this.num.y = num.y;
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
        for (let i = 0; i < this.max_length; i++) {
            let magnitude = Math.sqrt(num.x * num.x + num.y * num.y);
            let elem = {
                num, magnitude,
                magnitude_log: Math.log10(magnitude)
            };

            if (i==0) num = null; // DBG
            if (elem.magnitude === Infinity) {
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
            for (let i = 1; i<this.max_length; i++) {
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
        if (num === null) num = {x: this.num.x, y: this.num.y};
        let prev = {x: num.x, y:num.y};
        let next_num = {
            x: num.x * num.x - num.y * num.y + prev.x,
            y: 2 * num.x * num.y + prev.y,
        }
        return next_num;
    }
}


module.exports = Model;
