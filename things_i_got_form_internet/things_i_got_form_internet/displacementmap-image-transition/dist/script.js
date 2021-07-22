// use your scrollwheel

// Image credits --> https://www.behance.net/gallery/34853303/Destroying-nature-is-destroying-life

// Tweek the zoom values of each Transition object..
// Different images creates various effects..

var getBetweenColourByPercent = function (percent, highColor, lowColor) {
    var r = highColor >> 16;
    var g = highColor >> 8 & 0xFF;
    var b = highColor & 0xFF;
    r += ((lowColor >> 16) - r) * percent;
    g += ((lowColor >> 8 & 0xFF) - g) * percent;
    b += ((lowColor & 0xFF) - b) * percent;
    var hex = (r << 16 | g << 8 | b);
    return "#" + hex.toString(16);
};
var Application = (function () {
    function Application() {
        // should be overwritten
        var _this = this;
        this.introTweening = true;
        this.colors = [0xffffff, 0xbcb7a4, 0xb4bec2, 0xbcb7a4, 0xb4bec2, 0xffffff];
        this.infiniteScrollPos = 0;
        this.direction = -1;
        this.wheelSpeed = 0;
        this.yRoller = 0;
        this.progressBar = document.createElement("div");
        this.progressBar.id = "progressbar";
        document.body.appendChild(this.progressBar);
        (window.TweenPlugin).activate([window.CSSPlugin]);
        // create a renderer instance.
        this.renderer = new PIXI.autoDetectRenderer(1400, 990, {
            autoResize: true,
            resolution: 1,
            transparent: true
        });
        // this.renderer.backgroundColor = 0x000000;
        // add the renderer view element to the DOM
        document.body.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();
        this.transitions = [];
        this.transitions.push(new Transition({
            renderer: this.renderer,
            stage: this.stage,
            image: "https://rwatggcdn.blob.core.windows.net/cdn/codepens/cp-5-01.jpg",
            index: this.transitions.length,
            zoom: 4
        }));
        this.transitions.push(new Transition({
            renderer: this.renderer,
            stage: this.stage,
            image: "https://rwatggcdn.blob.core.windows.net/cdn/codepens/cp-5-02.jpg",
            index: this.transitions.length,
            zoom: 4
        }));
        this.transitions.push(new Transition({
            renderer: this.renderer,
            stage: this.stage,
            image: "https://rwatggcdn.blob.core.windows.net/cdn/codepens/cp-5-01.jpg",
            index: this.transitions.length,
            zoom: 2
        }));
        this.transitions.push(new Transition({
            renderer: this.renderer,
            stage: this.stage,
            image: "https://rwatggcdn.blob.core.windows.net/cdn/codepens/cp-5-02.jpg",
            index: this.transitions.length,
            zoom: 6
        }));
        this.render();
        window.addEventListener("resize", this.resize.bind(this), false);
        document.addEventListener('DOMMouseScroll', this.handleScroll.bind(this), false); // for Firefox
        document.addEventListener('mousewheel', this.handleScroll.bind(this), false);
        document.addEventListener("touchstart", this.onTouchStart.bind(this), false);
        document.addEventListener("touchmove", this.onTouchMove.bind(this), false);
        TweenLite.to(this, 1, {
            yRoller: (window.innerWidth / 2),
            ease: "easeOutCubic",
            delay: 0.25,
            onStart: function () { return _this.resize(null); },
            onComplete: function () {
                _this.introTweening = false;
            }
        });
    }
    Application.prototype.onTouchStart = function (event) {
        event.preventDefault();
        this.touchStartY = event.touches[0].pageY;
    };
    Application.prototype.onTouchMove = function (event) {
        event.preventDefault();
        this.wheelSpeed = (event.touches[0].pageY - this.touchStartY);
        if (this.wheelSpeed > 0)
            this.direction = 1;
        else if (this.wheelSpeed < 0)
            this.direction = -1;
        this.touchStartY = event.touches[0].pageY;
    };
    Application.prototype.handleScroll = function (event) {
        var normalized;
        if (event.wheelDelta) {
            normalized = (event.wheelDelta % 120 - 0) == -0 ? event.wheelDelta / 120 : event.wheelDelta / 12;
        }
        else {
            var rawAmmount = event.deltaY ? event.deltaY : event.detail;
            normalized = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
        }
        this.wheelSpeed = (normalized * 2);
        if (this.wheelSpeed > 0)
            this.direction = 1;
        else if (this.wheelSpeed < 0)
            this.direction = -1;
    };
    Application.prototype.render = function () {
        // this.noiseFilter.padding += 1;
        var _this = this;
        if (!this.introTweening) {
            this.wheelSpeed += (0 - this.wheelSpeed) * 0.05;
            this.yRoller -= this.wheelSpeed;
        }
        var numItems = this.transitions.length - 1;
        if (this.yRoller > window.innerWidth * numItems)
            this.yRoller = (window.innerWidth * numItems);
        if (this.yRoller < 0)
            this.yRoller = 0;
        var px = this.yRoller / window.innerWidth;
        var progress = px * Application.overlap;
        var p = px / numItems;
        // colors
        var l = this.colors.length - 1;
        var colorProgress = p * l;
        var colorIndex = Math.floor(colorProgress);
        colorProgress = colorProgress - colorIndex;
        var startColor = this.colors[colorIndex];
        var endColor = this.colors[colorIndex + 1];
        var color = getBetweenColourByPercent(colorProgress, startColor, endColor);
        TweenLite.set(document.body, {
            backgroundColor: color
        });
        if (this.progressBar) {
            TweenLite.set(this.progressBar, {
                force3D: true,
                scaleX: p
            });
        }
        for (var i = 0; i < this.transitions.length; i++) {
            var element = this.transitions[i];
            element.render(px);
        }
        this.renderer.render(this.stage);
        requestAnimationFrame(function () { return _this.render(); });
    };
    Object.defineProperty(Application, "viewport", {
        get: function () {
            var ratio = 990 / 1400;
            var w = window.innerWidth;
            var h = window.innerWidth * ratio;
            if (h > window.innerHeight) {
                h = window.innerHeight;
                w = (1400 / 990) * h;
            }
            return {
                w: w,
                h: h
            };
        },
        enumerable: true,
        configurable: true
    });
    Application.prototype.resize = function (event) {
        var rect = Application.viewport;
        this.renderer.view.style.width = rect.w + "px";
        this.renderer.view.style.height = rect.h + "px";
        this.renderer.view.style.left = ((window.innerWidth * 0.5) - (rect.w * 0.5)) + "px";
        this.renderer.view.style.top = ((window.innerHeight * 0.5) - (rect.h * 0.5)) + "px";
        // this.renderer.resize(rect.w, rect.h);
        // for (var i = 0; i < this.transitions.length; i++) {
        // 	var element: Transition = this.transitions[i];
        // 	element.resize(rect.w, rect.h);
        // }
    };
    Application.overlap = 0.6;
    return Application;
}());
// starter code
window.startSingle = function () {
    // should be overwritten with Master Application class
    window.application = new Application();
};
var Transition = (function () {
    function Transition(options) {
        var _this = this;
        this.progressTarget = 0;
        this.renderer = options.renderer;
        this.index = options.index;
        this.zoom = options.zoom;
        this.maskRenderer = new PIXI.autoDetectRenderer(this.renderer.width, this.renderer.height, {
            autoResize: true
        });
        this.container = new PIXI.Container();
        options.stage.addChild(this.container);
        // add the mask for visual ref
        // document.getElementById("page-content").appendChild(this.maskRenderer.view);
        var texture;
        // actual image
        texture = PIXI.Texture.fromImage(options.image);
        texture.baseTexture.on('loaded', function (baseTexture) {
            var rect = Application.viewport;
            _this.resize(rect.w, rect.h);
        });
        this.imageToBeMasked = new PIXI.Sprite(texture);
        // mask image
        texture = PIXI.Texture.fromImage("https://rwatggcdn.blob.core.windows.net/cdn/codepens/dm-02.jpg");
        this.mask = new PIXI.Sprite(texture);
        // displacement map, a copy of the original
        texture = PIXI.Texture.fromImage(options.image);
        this.imageDisplacementSprite = new PIXI.Sprite(texture);
        this.container.addChild(this.imageDisplacementSprite);
        this.maskDisplacementFilter = new PIXI.filters.DisplacementFilter(this.imageDisplacementSprite);
        this.mask.filters = [this.maskDisplacementFilter];
        this.maskToBeDrawTo_AKA_cache = new PIXI.Sprite();
        this.imageToBeMasked.mask = this.maskToBeDrawTo_AKA_cache;
        this.container.addChild(this.imageToBeMasked);
    }
    Transition.prototype.resize = function (w, h) {
        this.hasResized = true;
        var ratio = h / w;
        var zoom = isNaN(this.zoom) ? 4 : this.zoom;
        this.imageDisplacementSprite.width = w * zoom;
        this.imageDisplacementSprite.height = h * zoom;
        this.imageDisplacementSprite.texture.width = w * zoom;
        this.imageDisplacementSprite.texture.height = h * zoom;
        this.imageDisplacementSprite.x = (this.imageDisplacementSprite.width * -0.5) + (w * 0.5);
        this.imageDisplacementSprite.y = (this.imageDisplacementSprite.height * -0.5) + (h * 0.5);
        this.imageDisplacementSprite.texture.requiresUpdate = true;
        this.mask.width = this.renderer.width;
        this.mask.height = (this.renderer.height * 3) + 200; // + 200 because of distortion overlap
        this.mask.texture.requiresUpdate = true;
        this.imageToBeMasked.texture.width = w;
        this.imageToBeMasked.texture.height = h;
        this.imageToBeMasked.texture.requiresUpdate = true;
        // center
        this.container.pivot.x = w * 0.5;
        this.container.pivot.y = h * 0.5;
        this.container.x = w * 0.5;
        this.container.y = h * 0.5;
        this.maskToBeDrawTo_AKA_cache.texture.width = w;
        this.maskToBeDrawTo_AKA_cache.texture.height = h;
        this.maskToBeDrawTo_AKA_cache.texture.requiresUpdate = true;
        // this.maskRenderer.resize(w, h);
    };
    Transition.prototype.render = function (progress) {
        if (!this.hasResized)
            return;
        progress = progress - (this.index * Application.overlap); //overlap..
        if (progress < -0.2 || progress > 1.2)
            return;
        var filterProgress = 1 - Math.abs((0.5 - (progress)) / 0.5);
        var start = Math.min(1, progress / 0.1);
        if (progress > 0.5)
            start = 1;
        var end = Math.min(1, Math.max(0, progress - 0.5) / 0.1);
        if (progress < 0.5)
            end = 1;
        filterProgress *= start;
        filterProgress *= end;
        var scale = 1 + (progress * -0.2);
        this.container.scale.x = scale;
        this.container.scale.y = scale;
        // manipulate this.mask displacement map filter
        this.maskDisplacementFilter.scale.x = (filterProgress) * 600;
        this.maskDisplacementFilter.scale.y = (filterProgress) * 600;
        var overflowy = (progress * this.mask.height);
        this.mask.y = overflowy * -1;
        this.mask.y += progress * this.maskRenderer.height;
        this.maskRenderer.render(this.mask);
        // draw image from mask Sprite
        this.maskToBeDrawTo_AKA_cache.texture = PIXI.Texture.fromCanvas(this.maskRenderer.view);
        this.maskToBeDrawTo_AKA_cache.texture.update();
    };
    return Transition;
}());
// starter code
window.start = function () {
    // should be overwritten with Master Application class
    window.application = new Application();
};
if (document.readyState == "complete" || document.readyState == "interactive") {
    if (!window.application)
        window.start();
}
document.addEventListener("DOMContentLoaded", function (event) {
    if (!window.application)
        window.start();
}, false);