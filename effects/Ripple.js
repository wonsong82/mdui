function Ripple(element, args){

    var _this = this;
    args = $.extend({}, _this.defaultArgs, args);


    var classname = {
        this : 'mdui-effect__ripple',
          bg : 'mdui-effect__ripple__background',
        inner : 'mdui-effect__ripple__background__inner-bg',
        is_disabled : 'mdui-state--disabled'
    };



    var $element = $(element);

    $element.addClass('mdui-effect--ripple');

    var obj = 'effect--ripple';
    if($element.attr('mdui-object')==undefined){
        $element.attr('mdui-object',obj);
    }
    else{
        var uis = $element.attr('mdui-object');
        if(uis.indexOf(obj)==-1){
            $element.attr('mdui-object', uis+' '+obj);
        }
    }


    if($element.css('position')=='static'){
        $element.css('position','relative');
    }



    var $this = $element.find('.'+classname.this);
        $this.bg = $this.find('.'+classname.bg);
        $this.inner_bg = $this.bg.find('.'+classname.inner);

    if(!$this.length){
        $this = $('<span />').addClass(classname.this);
        $this.bg = $('<span />').addClass(classname.bg).appendTo($this);
        $this.inner_bg = $('<span />').addClass(classname.inner).appendTo($this.bg);

        if(args.insertAt !== undefined){
            $this.insertBefore($(element).children().eq(args.insertAt));
        }else {
            $this.prependTo(element);
        }
    }


    var diameter = getRippleDiameter(element);

    $this.bg.css({width: diameter, height: diameter, opacity: 0});
    $this.inner_bg.css({'background-color': $element.css('color')});





    /***
     *
     * Events
     *
     */
    var state = {
        showTimer : setTimeout(function(){},0),
        hideTimer : setTimeout(function(){},0),
        hold : false,
        anim : false
    };


    var eventListener = args.trigger || element;
    eventListener = $(eventListener);

    eventListener.on('mousedown', function(e){
        if($(element).hasClass(classname.is_disabled)) return false;
        var size = getRippleDiameter(element);
        $this.bg.stop(true);
        $this.bg.css({
            'opacity'           : 0,
            'width'             : 0,
            'height'            : 0,
            'left'              : getMousePosition(element, e).left,
            'top'               : getMousePosition(element, e).top
        }).animate({
            'opacity'           : args.opacity*2,
            'width'             : size,
            'height'            : size
        }, args.transition.duration*3, args.transition.ease, false);
        $this.inner_bg.css({'background-color': $(element).css('color')});

        clearTimeout(state.showTimer);
        state.showTimer = setTimeout(function(){
            if(!state.hold) {
                $this.bg.stop(true).animate({
                    'width'           : size*1.2,
                    'height'          : size*1.2,
                    'opacity'         : 0
                }, args.transition.duration*3, args.transition.ease);
            }
            state.anim = false;
        }, args.transition.duration * .5);


        state.hold = true;
        state.anim = true;
    });

    eventListener.on('mouseup', function(){
        if($(element).hasClass(classname.is_disabled)) return false;

        var size = getRippleDiameter(element);
        state.hold = false;
        if(!state.anim){
            $this.bg.stop(true).animate({
                'width'           : size*1.2,
                'height'          : size*1.2,
                'opacity': 0
            }, args.transition.duration * 3, args.transition.ease);
        }
    });

    eventListener.on('mouseleave', function(){
        if($(element).hasClass(classname.is_disabled)) return false;

        var size = getRippleDiameter(element);
        state.hold = false;
        if(!state.anim){
            $this.bg.stop(true).animate({
                'width'           : size*1.2,
                'height'          : size*1.2,
                'opacity': 0
            }, args.transition.duration * 3, args.transition.ease);
        }
    });






    function getMousePosition(element, e){

        /*var offset = $(element).offset();
        var relativeX = e.pageX - offset.left;
        var relativeY = e.pageY - offset.top;
*/
        var relativeX = Math.abs($element[0].getBoundingClientRect().left - e.clientX);
        var relativeY = Math.abs($element[0].getBoundingClientRect().top - e.clientY);
        //console.log(offset);

        return {left:relativeX, top:relativeY};

    }


    function getRippleDiameter(element){
        // use css width (not width()) because width() always returns the content width
        var w = parseFloat($(element).css('width'));
        var h = parseFloat($(element).css('height'));
        var radius = Math.sqrt(Math.pow(w,2) + Math.pow(h,2));

        return radius * args.radius;
    }

}

Ripple.prototype.defaultArgs = {
    transition: {
        duration: 300,
        ease: 'easeOutCubic'
    },
    opacity:.15,
    radius: 1.1,
    trigger: null,
    insertAt: null
};

module.exports = Ripple;