function Focus(element){

    var _this = this;

    var classname = {
        this: 'mdui-effect__focus',
        state: {
            disabled: 'mdui-state--disabled',
            focused: 'mdui-state--focused',
            hover: 'mdui-state--hover'
        }
    };


    // Element that the focus will be applied to
    var $element = $(element);

    $element.addClass('mdui-effect--focus');

    var obj = 'effect--focus';
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


    // Focus layer
    var $this = $element.find('.'+classname.this);
    if(!$this.length){
        var $this = $('<span />').addClass(classname.this);
        $this.prependTo(element);
    }


    if($element.attr('tabindex')==undefined){
       $element.attr('tabindex', '0');
    }


    /***
     * Event Handler
     */

    $element.on('focus', function(){
        if($element.hasClass(classname.state.disabled)) return false;
        if($element.hasClass(classname.state.hover)) return false;
        $element.addClass(classname.state.focused);
        $this.stop(true).css({
            'background-color': getColor()
        }).animate({
            opacity:.12
        }, 200, 'easeOutQuad');
    });

    $element.on('blur mouseleave click', function(){
        $element.removeClass(classname.state.focused);
        $this.stop(true).animate({
            opacity:0
        }, 200, 'easeOutQuad');
    });


    function getColor(){
        return $element.css('color');
    }

}



module.exports = Focus;