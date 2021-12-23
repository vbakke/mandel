class MandelView {
    self = this;
    scale = 50;
    constructor() {
        this.$mandel = $('.mandelbrot');

        this.drag_on = true;

        this.mandel_canvas = this.$mandel.find('canvas.mandelbrot')[0];
        this.overlay_canvas = this.$mandel.find('canvas.overlay')[0];
        this.mandel_ctx = this.mandel_canvas.getContext('2d');
        this.overlay_ctx = this.overlay_canvas.getContext('2d');

        this.overlay_canvas.classList.toggle('cursor-pointer', this.drag_on);

        // Setup event handlers
        this.$mandel.find('canvas').click((event) => { return this.on_mandel_mouseclick(event) });
        this.$mandel.find('canvas').mousemove((event) => { return this.on_mandel_mousemove(event) });
        this.$mandel.find('input.num').change((event) => { return this.on_num_changes(event) });
    }


    init(model) {
        this.model = model;

        model.mandel_view.tx = this.mandel_ctx.canvas.width / 2;
        model.mandel_view.ty = this.mandel_ctx.canvas.height / 2;

        // this.mandel_ctx.scale(1, 1);
        // this.overlay_ctx.scale(1, 1);
        this.setCanvasSize(this.mandel_canvas);
        this.setCanvasSize(this.overlay_canvas);

        this.mandel_ctx.translate(model.mandel_view.tx, model.mandel_view.ty);
        this.overlay_ctx.translate(model.mandel_view.tx, model.mandel_view.ty);


    }

    display(model) {
        let ctx_mandel = this.mandel_ctx;
        let ctx = this.overlay_ctx;
        let scale = model.mandel_view.scale;
        let x = model.num.x * scale;
        let y = -model.num.y * scale;
        let tx = model.mandel_view.tx;
        let ty = model.mandel_view.ty;
        let plot = model.explore_plot;

        // ---- Overlay layer ----

        ctx.clearRect(-tx, -ty, tx * 2, ty * 2);

        // Draw the unit circle
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(0, 0, scale, 0, 2 * Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        // ctx.closePath();

        // Cross hair
        let crossSize = 10;
        ctx.beginPath();
        ctx.moveTo(0, crossSize);
        ctx.lineTo(0, -crossSize);
        ctx.moveTo(crossSize, 0);
        ctx.lineTo(-crossSize, 0);
        ctx.stroke();
        ctx.closePath();

        // Draw the current position dot
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.strokeStyle = '#05ff05';
        ctx.stroke();

        let nextLevel = model.nextLevel();
        if (nextLevel) {
            let level_w = 40;
            let level_h = 10;
            let fill_w = level_w * (model.num.count / nextLevel);
            ctx.beginPath();
            ctx.rect(tx - level_w - 10, -ty + 10, fill_w, level_h);
            ctx.fillStyle = '#05cc05';
            ctx.fill();
            ctx.rect(tx - level_w - 10, -ty + 10, level_w, level_h);
            ctx.strokeStyle = '#aaaaaa';
            ctx.stroke();
        }

        if (plot) {
            // ---- Mandelbrot layer ----
            // Color the dot
            if (model.infinite) { // Outside
                let colVal = Math.min(Math.max((model.magnitudes.length - 9) / 10, 0.1), 0.9);
                // let val = Math.log10(Math.log10(model.magnitudes[9].magnitude));
                // let colVal = Math.min(Math.max((3/(val+1)), 0.1), 0.9);
                colVal = Math.round((1 - colVal) * 256);
                ctx_mandel.fillStyle = 'rgb(' + 256 + ', ' + colVal + ', ' + colVal + ')';
            } else { // Inside
                let colVal = Math.min(Math.max((model.stddev / model.max_length + 0.1) / 0.4, 0.1), 0.9);
                colVal = Math.round((1 - colVal) * 256);
                ctx_mandel.fillStyle = 'rgb(' + colVal + ', ' + (colVal / 2 + 150) + ', ' + colVal + ')';
            }

            ctx_mandel.fillRect(x - .5, y - .5, 1, 1);
        }

    }

    setCanvasSize(myCanvas) {
        const originalHeight = myCanvas.height;
        const originalWidth = myCanvas.width;

        let dimensions = this.getObjectFitSize(
            true,
            myCanvas.clientWidth,
            myCanvas.clientHeight,
            myCanvas.width,
            myCanvas.height
        );
        this.dpr = window.devicePixelRatio || 1;
        myCanvas.width = dimensions.width * this.dpr;
        myCanvas.height = dimensions.height * this.dpr;

        let ctx = myCanvas.getContext("2d");
        let ratio = Math.min(
            myCanvas.clientWidth / originalWidth,
            myCanvas.clientHeight / originalHeight
        );
        ctx.scale(ratio * this.dpr, ratio * this.dpr); //adjust this!
        // console.log('Canvas scale: ' + ratio * this.dpr)
    }

    // adapted from: https://www.npmjs.com/package/intrinsic-scale
    getObjectFitSize(
        contains /* true = contain, false = cover */,
        containerWidth,
        containerHeight,
        width,
        height
    ) {
        var doRatio = width / height;
        var cRatio = containerWidth / containerHeight;
        var targetWidth = 0;
        var targetHeight = 0;
        var test = contains ? doRatio > cRatio : doRatio < cRatio;

        if (test) {
            targetWidth = containerWidth;
            targetHeight = targetWidth / doRatio;
        } else {
            targetHeight = containerHeight;
            targetWidth = targetHeight * doRatio;
        }

        return {
            width: targetWidth,
            height: targetHeight,
            x: (containerWidth - targetWidth) / 2,
            y: (containerHeight - targetHeight) / 2
        };
    }

    getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return {
            x: (event.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (event.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    on_mandel_mouseclick(event) {
        this.drag_on = !this.drag_on;
        console.log('Klikk: ' + this.drag_on);
        this.overlay_canvas.classList.toggle('cursor-pointer');
    }

    on_mandel_mousemove(event) {
        if (this.drag_on) {
            let pos = this.getMousePos(this.mandel_canvas, event);
            pos.x /= this.dpr * 2;
            pos.y /= this.dpr * 2;
            pos.x -= this.model.mandel_view.tx;
            pos.y -= this.model.mandel_view.ty;
            pos.x /= this.model.mandel_view.scale;
            pos.y /= -this.model.mandel_view.scale;

            $(this).triggerHandler(
                $.Event('pos_changed', { 'pos': pos })
            );
        }
    }

    on_num_changes(event) {
        let values = event.target.value.replace(/\+/g, '').split(/\s+/);
        let pos = { x: parseFloat(values[0]), y: parseFloat(values[1]) };
        $(this).triggerHandler(
            $.Event('pos_changed', { 'pos': pos })
        );
        return;

    }

}


module.exports = MandelView;
