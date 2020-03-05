function Hover(element, args){

    var _this = this;
    args = $.extend({}, _this.defaultArgs, args);


    var classname = {
        this : 'mdui-effect__hover',
        state : {
            hover: 'mdui-state--hover',
            disabled: 'mdui-state--disabled'
        }
    };



    var $element = $(element);

    $element.addClass('mdui-effect--hover');

    var obj = 'effect--hover';
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
    if(!$this.length){
        $this = $('<span />').addClass(classname.this);

        if(args.insertAt !== undefined){
            $this.insertBefore($(element).children().eq(args.insertAt));
        }else {
            $this.prependTo(element);
        }
    }





    /***
     *
     * Events
     *
     */

    var state = {};

    var eventListener = args.trigger || element;
    eventListener = $(eventListener);


    eventListener.on('mouseover', function(){
        if($(element).hasClass(classname.state.disabled)) return false;
        if(state.over) return false;
        state.over = true;
        $element.addClass(classname.state.hover);
        $this.stop(true).css({
            'background-color': getHoverColor()
        }).animate({
            'background-color': getHoverColor(),
            opacity: args.opacity
        }, args.transition.duration, args.transition.ease);

    });

    eventListener.on('click', function(){
        if($(element).hasClass(classname.state.disabled)) return false;
        $this.stop(true).animate({
            'background-color': getHoverColor(),
            opacity: 0
        }, args.transition.duration*2, args.transition.ease);
    });

    eventListener.on('mouseleave blur', function(){
        if($(element).hasClass(classname.state.disabled)) return false;
        if(!state.over) return false;
        state.over = false;
        $element.removeClass(classname.state.hover);
        $this.stop(true).animate({
            'background-color': getHoverColor(),
            opacity: 0
        }, args.transition.duration*2, args.transition.ease);
    });


    function getHoverColor(){
        return $(element).css('color');
    }

}

Hover.prototype.defaultArgs = {
    transition: {
        duration: 300,
        ease: 'easeOutCubic'
    },
    opacity:.10,
    trigger: null
};

module.exports = Hover;