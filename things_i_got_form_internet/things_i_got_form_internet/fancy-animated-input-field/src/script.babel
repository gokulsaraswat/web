class Input {
    constructor(input, placeholder) {
        this.isFocused = false;
        this.size = 0;
        this.animation = "zoomIn";
        $(input).addClass("input");
        this.$element = $(document.createElement("div"));
        this.$element.addClass("textZone");
        this.$element.attr("tabindex", 0);
        $(input).append(this.$element);
        this.cursor = new Cursor(this);
        this.setEvents();
        Keyboard.readCharacters(this);
        Keyboard.readSpecialCharacters(this);
        this.placeholder = new Placeholder(placeholder, this);
    }
    
    setEvents() {
        var input = this;
        
        this.$element.on("click", function(event) {
            input.focus();
            event.stopPropagation();
        });
        
        $(document).on("click", function(event) {
            input.unfocus();    
        });
    }
    
    focus() {
        if (this.size == 0) {
            this.$element.prepend(this.cursor.$element);
        } else {
            this.cursor.$element.insertAfter(this.$element.children().last());
        }
        this.cursor.show();
        this.isFocused = true;
    }
        
    unfocus() {
        if (this.size == 0) {
            this.placeholder.show();
        }
        this.cursor.hide();
        this.isFocused = false;
    }
    
    write(character) {
        this.size++;
        this.placeholder.hide();
        character.setEvents(this);
        character.$element.insertAfter(this.cursor.$element);
        character.animate(this.animation);
        this.cursor.move("right");
    }
    
    erase() {
        var last = this.cursor.$element.prev();
        if (last.length && this.size > 0) {
            this.size--;
            this.cursor.move("left");
            last.remove();
            if (this.size == 0) {
                this.placeholder.show();
            }
        }
    }
    
    suppress() {
        var next = this.cursor.$element.next();
        if (next.length && this.size > 0) {
            this.size--;
            next.remove();
            if (this.size == 0) {
                this.placeholder.show();
            }
        }
    }
}

class Placeholder {
    constructor(placeholder, input) {
        this.input = input;
        this.$element = $(document.createElement("div"));
        this.$element.text(placeholder);
        this.$element.addClass("placeholder");
        this.show();
    }
    
    show() {
        this.input.$element.append(this.$element);
    }
    
    hide() {
        this.$element.remove();
    }
    
    
}

class Keyboard {    
    
    static space = 32;
    static backspace = 8;
    static leftArrow = 37;
    static rightArrow = 39;
    static suppress = 46;
    static top = 36;
    static end = 35;
    
    static readCharacters(input) {
        input.$element.on("keypress", function(event) {
            event.preventDefault();
            input.write(new Character(String.fromCharCode(event.which)));
        });
    }

    static readSpecialCharacters(input) {
        input.$element.on("keydown", function(event) {
            switch(event.keyCode) {
                case Keyboard.backspace:
                    event.preventDefault();
                    input.erase();
                    break;
                case Keyboard.leftArrow:
                    input.cursor.move("left");
                    break;
                case Keyboard.rightArrow:
                    input.cursor.move("right");
                    break;
                case Keyboard.suppress:
                    input.suppress();
                    break;
                case Keyboard.top:
                    input.cursor.goTo("top");
                    break;
                case Keyboard.end:
                    input.cursor.goTo("end");
                    break;
                default:
                    break;
            }         
        });
    }
}

class Cursor {
    constructor(input) {
        this.$element = $(document.createElement("div"));
        this.$element.addClass("cursor");
        this.$element.addClass("hidden");
        input.$element.prepend(this.$element);
    }
    
    show() {
        this.$element.removeClass("hidden");
    }
    
    hide() {
        this.$element.addClass("hidden");
    }
    
    move(direction) {
        var offSet = this.$element.get(0).offsetLeft;
        var textZone = this.$element.parent();
        
        if (direction == "right") {
            var next = this.$element.next();
            this.$element.insertAfter(next);
            if (offSet > textZone.width() * 0.99) {
                var scroll = textZone.scrollLeft();
                textZone.animate({scrollLeft: scroll+'100'}, 1000);
            }
        } else if (direction == "left") {
            var prev = this.$element.prev();
            this.$element.insertBefore(prev);
        }          
    }
    
    goTo(point) {
        if (point == "top") {
            this.$element.parent().prepend(this.$element);
        } else if (point == "end") {
            this.$element.parent().append(this.$element);
        }
    }
}

class Character {
    constructor(character) {
        this.$element = $(document.createElement("div"));
        if (character != " ") {
            this.$element.addClass("character");
            this.$element.text(character);
        } else {
            this.$element.addClass("space");
        }
    }
    
    setEvents(input) {
        var character = this;
        this.$element.on("click", function(event) {
            input.cursor.$element.insertBefore(character.$element);
            if (!input.isFocused) {
                input.cursor.show();
            }
            event.stopPropagation();
        });
    }
    
    animate(animation) {
        this.$element.css("animation", animation + " 500ms, colorTransition 500ms");
    }
}

class Selector {
    constructor(selector, options, defaultOption, callback) {
        this.$element = $(selector);
        this.$element.addClass("selector");
        this.$selection = $(document.createElement("div"));
        this.$selection.addClass("selection");
        var i = 0;
        this.current = i;
        this.$selection.text(options[i]);
        for (i = 0; i < options.length; i++) {
            if (options[i] == defaultOption) {
                this.current = i;
                this.$selection.text(options[i]);
            }
        }
        this.$element.append(this.$selection);
        this.options = options;   
        this.setEvents();
        this.setArrows();
        this.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.callback = callback;
        this.selecting = false;
        callback(options[this.current]);
    }
    
    setArrows() {
        var selector = this;
        this.$upArrow = $(document.createElement("div"));
        this.$upArrow.addClass("upArrow");
        this.$element.append(this.$upArrow);
        this.$upArrow.on("click", function() {
            if (!selector.isFirst() && !selector.selecting) {
                selector.select("Down");
            }
        })
        this.$downArrow = $(document.createElement("div"));
        this.$downArrow.addClass("downArrow");
        this.$element.append(this.$downArrow);
        this.$downArrow.on("click", function() {
            if (!selector.isLast() && !selector.selecting) {
                selector.select("Up");
            }
        });
        this.updateArrows();
    }
    
    setEvents() {
        var selector = this;
        this.$element.on("wheel", function(event){
            if (event.originalEvent.deltaY > 0) {
                if (!selector.isLast() && !selector.selecting) {
                    selector.select("Up");
                }
            } else {
                if (!selector.isFirst() && !selector.selecting) {
                    selector.select("Down");
                }
            }
        });
    }
    
    isFirst() {
        return this.current == 0;
    }
    
    isLast() {
        return this.current == this.options.length - 1;
    }
    
    select(direction) {
        this.selecting = true;
        this.current = direction == "Up" ? this.current + 1 : this.current - 1;
        var selector = this;
        this.$selection.addClass("fadeOut" + direction).on(this.animationEnd, function() {
            selector.$selection.removeClass("fadeOut" + direction);
            selector.$selection.text(selector.options[selector.current]);
            selector.$selection.addClass("fadeIn" + direction).on(selector.animationEnd, function() {
                selector.$selection.removeClass("fadeIn" + direction);
                selector.callback(selector.options[selector.current]);
                selector.selecting = false;
                selector.updateArrows();
            });
        });
    }
    
    updateArrows() {
        this.$upArrow.removeClass("upWhiteArrow");
        this.$upArrow.removeClass("upGreyArrow");
        this.$downArrow.removeClass("downWhiteArrow");
        this.$downArrow.removeClass("downGreyArrow");
        
        if (this.current == 0) {
            this.$upArrow.addClass("upGreyArrow");
            if (this.options.length < 2) {
                this.$downArrow.addClass("downGreyArrow");
            } else {
                this.$downArrow.addClass("downWhiteArrow");
            }
        } else if (this.current == this.options.length - 1) {
            this.$upArrow.addClass("upWhiteArrow");
            this.$downArrow.addClass("downGreyArrow");
        } else {
            this.$upArrow.addClass("upWhiteArrow");
            this.$downArrow.addClass("downWhiteArrow");
        }
    }
}

var input = new Input("#myInput", "Try me!");
new Selector("#selector", [
    "bounce",
    "fadeIn",
    "fadeInDown",
    "fadeInUp",
    "fadeInLeft",
    "fadeInRight",
    "flash",
    "jello",
    "lightSpeedIn",
    "pulse",
    "rollIn",
    "rotateIn",
    "rotateInDownLeft",
    "rotateInDownRight",
    "rotateInUpLeft",
    "rotateInUpRight",
    "rubberBand",
    "shake",
    "slideInDown",
    "slideInUp",
    "slideInLeft",
    "slideInRight",
    "swing",
    "tada",
    "wobble",
    "zoomIn"
], "rubberBand", function(selection){
        input.animation = selection;
});
