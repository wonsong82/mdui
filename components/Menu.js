/***
 * MDUI
 * author : Won Song | wonsong82@gmail.com
 *
 */


var VirtualDocument = require('../mdui/VirtualDocument');
var Ripple = require('../effects/Ripple');
var Hover = require('../effects/Hover');
var Focus = require('../effects/Focus');
var Scroll = require('./Scroll');

function Menu(element, args){

    var _this = this; // _this is a javascript instance of this
    var $this = $(element); // $this is the jquery object of the menu element passed in
    var _args = $.extend({}, args, _this.defaultArgs);

    var classname = {

        this:   'mdui-menu',
        state: {
            hidden: 'mdui-state--hidden',
            visible: 'mdui-state--visible',
            disabled: 'mdui-state--disabled'
        },

        option: {
            top: 'mdui-menu--top',
            bottom: 'mdui-menu--bottom',
            left: 'mdui-menu--left',
            right: 'mdui-menu--right',
            top_left: 'mdui-menu--top-left',
            top_right: 'mdui-menu--top-right',
            bottom_left: 'mdui-menu--bottom-left',
            bottom_right: 'mdui-menu--bottom-right'
        },

        item: 'mdui-menu__item',
        divider:    'mdui-menu__divider'
    };




    /***
     *  Only 1 can be enabled
     */
    $this.addClass(classname.this);
    var obj = 'menu';
    if($this.attr('mdui-object')==undefined){
        $this.attr('mdui-object',obj);
    }
    else{
        var uis = $this.attr('mdui-object');
        if(uis.indexOf(obj)==-1){
            $this.attr('mdui-object', uis+' '+obj);
        }
    }



    $this.items     = $('.'+classname.item, $this);
    $this.dividers  = $('.'+classname.divider, $this);
    $this.for       = $this.attr('for')!==undefined? $('#'+$this.attr('for')) : null;



    // Find option
    var _found = false;
    $.each(classname.option, function(i,e){
        if($this.hasClass(e)) _found = true;
    });
    if(!_found) $this.addClass(classname.option.top_left);


    var _size = getSize();
    var _position = getPosition();


    // Set Initial Position
    if($this.for){
        // Set menu size to off
        $this.css({width:_size.off.width, height:_size.off.height,
            left:_position.off.left, top:_position.off.top,
            'padding-top':0, 'padding-bottom':0,
            'opacity':0, display:'block', position:'absolute'
        });
    }
    else {
        // Set menu size to on
        $this.css({width:_size.width, height:_size.height,
            opacity:1, display:'block'
        });
    }


    // Modify if for is MDUI-TEXT
    if($this.for && $this.for.hasClass('mdui-text')){
        $this.arrow_down = $('<i class="material-icons mdui-menu__arrow-down">&#xE5C5;</i>');
        $this.arrow_down.appendTo($this.for.mdui().target);
        $this.for.mdui().target.input.attr('readonly','readonly');
        $this.for.mdui().target.addClass('mdui-text--menu');
        $this.css({
            'transform': 'translateY(12px)'
        });
    }






    /***
     * Events
     */

    var state = {on:false, scrollFixTimer:setInterval(function(){},100), scrollFixTimeout:setTimeout(function(){},1)};
    clearInterval(state.scrollFixTimer);


    if($this.for){

        // show
        $this.for.on('click', function () {
            if(!$this.attr('for')) return false;
            if($this.for.hasClass(classname.state.disabled)) return false;
            if($this.hasClass(classname.state.disabled)) return false;
            state.on = true;
            show();
            return false;
        });

        // hide
        $(document).on('click', function () {
            //if(!$this.attr('for')) return false;
            //if($this.for.hasClass(classname.state.disabled)) return false;

            if(state.on) {
                state.on = false;
                hide();
            }

        });

    }



    $this.items.click(function () {
        var val;
        if(!$this.attr('for')) return false;
        if($this.for.hasClass(classname.state.disabled)) return false;
        state.on = false;
        hide();
        if($this.for && $this.for.hasClass('mdui-text')) {
            val = $(this).attr('value')? $(this).attr('value') : $(this).text();
            $this.for.mdui().target.input.val(val).trigger('change');
        }
    });




    function disable(){
        $this.addClass(classname.state.disabled);
    }


    function enable(){
        $this.removeClass(classname.state.disabled);
    }





    function hide(){
        $this.addClass(classname.state.hidden);

        // scroll fix
        clearTimeout(state.scrollFixTimeout);
        if(state.scrollFixTimer!==null){
            clearInterval(state.scrollFixTimer);
            state.scrollFixTimer=null;
        }


        $this.stop(true).animate({
            width:_size.off.width, height:_size.off.height, 'padding-top':0, 'padding-bottom':0,
            left:_position.off.left, top:_position.off.top, opacity:0
        }, _args.transition.duration, _args.transition.ease);
    }



    function show(){
        $this.removeClass(classname.state.hidden);

        setTimeout(function(){
            $this.trigger('resize');
        }, _args.transition.duration + 300);


        _position = getPosition();

        $this.css({left:_position.off.left, top:_position.off.top});

        $this.stop(true).animate({
            width:_size.width, height:_size.height, 'padding-top':_size.padding.top, 'padding-bottom':_size.padding.bottom,
            left:_position.left, top:_position.top, opacity:1
        }, {
            duration: _args.transition.duration,
            easing: _args.transition.ease,
            progress: function(){
                $this.trigger('resize');
            }
        });
    }


    function getSize(){
        var cssWidth, cssHeight, width, height, padding = {}, $temp, $tempFor;

        // Make temp dom for sizing and positioning
        $temp = $this.clone().css({'opacity':1,'display':'block','position':'fixed','top':'-9999px','left':'-9999x'}).insertAfter($this);
        $temp.items = $('.'+classname.item, $temp);
        $temp.dividers = $('.'+classname.divider, $temp);

        if($this.for){
            $tempFor = $this.for.clone().css({'opacity':1,'display':'block','position':'fixed','top':'-9999px','left':'-9999x'}).insertAfter($this);
        };


        // Save original size props
        var props = ['width', 'height', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom'];
        function computeProps(item){
            $.each(props, function(i, e){
                item.attr('data-'+e, parseInt(item.css(e)));
            });
        }
        computeProps($temp);
        $temp.items.each(function(i, e){
           computeProps($(e));
        });
        $temp.dividers.each(function(i, e){
           computeProps($(e));
        });


        // Get CSS Width / Height
        $temp.css({padding:0, margin:0});
        $temp.items.css({padding:0, margin:0, width:0, height:0});
        $temp.dividers.css({padding:0, margin:0, width:0, height:0});

        cssWidth = parseInt($temp.css('width'));
        cssHeight = parseInt($temp.css('height'));


        // Put size back to normal
        function setProps(item){
            $.each(props, function(i, e){
                item.css(e, item.attr('data-'+e)+'px');
            });
        }
        setProps($temp);
        $temp.items.each(function(i, e){
            setProps($(e));
        });
        $temp.dividers.each(function(i, e){
            setProps($(e));
        });


        // Handle Sizes

        // Get Width
        if($this.for && $this.for.hasClass('mdui-text')){ // if this menu is for any trigger item, get width of the trigger
            width = $tempFor.outerWidth() + parseInt($temp.css('padding-left')) + parseInt($temp.css('padding-right'));
        }
        else if(cssWidth){ // if width is explicitly defined, get defined width
            width = cssWidth;
        }
        else { // else calculate inline elements width
            width = 0;
            $temp.items.css({display:'inline'});
            $temp.items.each(function(){
                var w = $(this).outerWidth();
                if(w > width) width = w;
            });
            $temp.items.css({display:'block'});
            width = width + parseInt($temp.css('padding-left')) + parseInt($temp.css('padding-right'));
        }

        // Get Height
        if(cssHeight){
            height = cssHeight;
            new Scroll($this);
        }
        else {
            height = 0;
            var h;
            $temp.items.each(function(){
                h = $(this).outerHeight(true);
                height += h;
            });
            $temp.dividers.each(function(){
                h = $(this).outerHeight(true);
                height += h;
            });
            height = height + parseInt($temp.css('padding-top')) + parseInt($temp.css('padding-bottom'));
        }

        var o = {
            width: width,
            height: height,
            padding: {
                left: parseInt($temp.css('padding-left')),
                right: parseInt($temp.css('padding-right')),
                top: parseInt($temp.css('padding-top')),
                bottom: parseInt($temp.css('padding-bottom'))
            },
            off:{
                width: 0,
                height: 0
            }
        };

        $temp.remove();
        $tempFor.remove();
        return o;
    }


    function getPosition(){
        var $for, offset, origin, pos={off:{}}, offsetFromDocument, parentOffset;

        origin = 'top_left'; // Position registration point
        pos.left   = pos.off.left   = $this.css('left');
        pos.top    = pos.off.top    = $this.css('top');

        if($this.for){
            if($this.for.parent().css('position') == 'static')
                $this.for.parent().css('position',' relative');

            offsetFromDocument = $this.for.offset();
            parentOffset = $this.for.parent().offset();
            offset = {
                top : offsetFromDocument.top  - parentOffset.top,
                left: offsetFromDocument.left - parentOffset.left
            };


            // TOP LEFT
            if($this.hasClass(classname.option.top_left)){
                origin = 'top_left';
                pos.left = pos.off.left = offset.left - _size.padding.left;
                pos.top  = pos.off.top  = offset.top  - _size.padding.top;
            }

            // TOP RIGHT
            else if($this.hasClass(classname.option.top_right)){
                origin = 'top_right';
                pos.left = offset.left - _size.width + $this.for.outerWidth();
                pos.top  = offset.top;
                pos.off.left = offset.left + $this.for.outerWidth();
                pos.off.top  = offset.top;
            }

            // BOTTOM LEFT
            else if($this.hasClass(classname.option.bottom_left)){
                origin = 'bottom_left';
                pos.left = offset.left;
                pos.top  = offset.top - _size.height + $this.for.outerHeight();
                pos.off.left = offset.left;
                pos.off.top  = offset.top + $this.for.outerHeight();
            }

            // BOTTOM RIGHT
            else if($this.hasClass(classname.option.bottom_right)){
                origin = 'bottom_right';
                pos.left = offset.left - _size.width  + $this.for.outerWidth();
                pos.top  = offset.top  - _size.height + $this.for.outerHeight();
                pos.off.left = offset.left + $this.for.outerWidth();
                pos.off.top  = offset.top  + $this.for.outerHeight();
            }

            // TOP
            else if($this.hasClas(classname.option.top)){
                origin = 'top';
                pos.left = offset.left - _size.padding.left;
                pos.top  = offset.top - _size.padding.top;
                pos.off.left = offset.left - _size.padding.left;
                pos.off.top  = offset.top - _size.padding.top;
                _size.off.width = _size.width;
            }

            return {
                origin  : origin,
                top     : pos.top,
                left    : pos.left,
                off     : pos.off // pos.off.top, pos.off.left
            }

        }


    }




/*
    /!***
     * Functions
     *!/
    function getSize2(){
        var menu=$this, width, height, cssHeight, items=$this.items, dividers=$this.dividers, itemWidth,
            padding_left, padding_right, padding_top, padding_bottom;

        cssHeight = menu.css('height');
        items.css('display','none');
        dividers.css('display','none');

        width = menu.width();
        height = menu.height();
        padding_top = parseInt(menu.css('padding-top'));
        padding_bottom = parseInt(menu.css('padding-bottom'));
        padding_left = parseInt(items.css('padding-left'));
        padding_right = parseInt(items.css('padding-right'));

        menu.css({display:'block', opacity:0, position:'absolute'});

        items.css('display','block');
        dividers.css('display','block');


        if(menu.for && menu.for.hasClass('mdui-text')){
            width = menu.for.outerWidth() + padding_left + padding_right;
        }
        else if(width){
            width =  menu.css('width');
        }
        else {
            items.css('display', 'inline');
            items.each(function(){
                itemWidth = $(this).outerWidth();
                if(itemWidth > width) width = itemWidth;
            });
            items.css('display', 'block');
        }


        if(height){
            new Scroll($this);
        }

        menu.css({display:'none'});

        return {
            width: width,
            height: cssHeight,
            padding_top: padding_top,
            padding_bottom: padding_bottom,
            padding_left: padding_left,
            padding_right: padding_right,
            off: {}
        }
    }*/


    /*function getPosition2(){
        var menu=$this, forUI, offset, origin, left, top, off;

        origin = 'top_left';
        off = {};
        left = off.left = menu.css('left');
        top = off.top = menu.css('top');


        if(menu.for) {

            forUI = $this.for;

            if (forUI.parent().css('position') == 'static')
                forUI.parent().css('position', 'relative');

            offset = forUI.position();


            if (menu.hasClass(classname.option.top_left)) {
                origin = 'top_left';
                left = off.left = offset.left - _size.padding_left;
                top = off.top = offset.top - _size.padding_top;
                _size.off.width = 0;
                _size.off.height = 0;
            }

            else if (menu.hasClass(classname.option.top_right)) {
                origin = 'top_right';
                left = offset.left - menu.outerWidth() + forUI.outerWidth();
                off.left = offset.left + forUI.outerWidth();
                top = off.top = offset.top;
            }

            else if (menu.hasClass(classname.option.bottom_left)){
                origin = 'bottom_left';
                left = off.left = offset.left;
                top = offset.top - menu.outerHeight() + forUI.outerHeight();
                off.top = offset.top + forUI.outerHeight();
            }

            else if(menu.hasClass(classname.option.bottom_right)){
                origin = 'bottom_right';
                left = offset.left - menu.outerWidth() + forUI.outerWidth();
                off.left = offset.left + forUI.outerWidth();
                top = offset.top - menu.outerHeight() + forUI.outerHeight();
                off.top = offset.top + forUI.outerHeight();
            }

            else if (menu.hasClass(classname.option.top)){
                origin = 'top';
                left = off.left = offset.left - _size.padding_left;
                top = off.top = offset.top - _size.padding_top;
                _size.off.width = _size.width;
                _size.off.height = 0;
            }

        }

        return {
            origin: origin,
            top: top,
            left: left,
            off: off
        }

    }*/




    $this.items.each(function(){
        new Hover(this);
        new Focus(this);
        new Ripple(this);
    });






    _this.target = $this;
    //_this.vdoc = vdoc;
    //_this.size = _size;
    //_this.position = _position;

    _this.hide = hide;
    _this.show = show;
    _this.enable = enable;
    _this.disable = disable;






}


Menu.prototype.defaultArgs = {
    transition: {
        duration: 500,
        ease: 'easeInOutExpo'
    }
};


module.exports = Menu;