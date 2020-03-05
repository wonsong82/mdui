/***
 * MDUI
 * Author : Won Song | wonsong82@gmail.com
 *
 */

var VirtualDocument = require('../mdui/VirtualDocument');
var Ripple = require('../effects/Ripple');
var Hover = require('../effects/Hover');
var Focus = require('../effects/Focus');

function Button(element){

    var _this = this;


    var classname = {

        this: 'mdui-button',
            state: {
                disabled: 'mdui-state--disabled',
                pressed: 'mdui-state--pressed'
            },

        text: 'mdui-button__text'

    };


    /***
     * Set DOM
     */
    var $this = $(element);

    $this.addClass(classname.this);
    var obj = 'button';
    if($this.attr('mdui-object')==undefined){
        $this.attr('mdui-object',obj);
    }
    else{
        var uis = $this.attr('mdui-object');
        if(uis.indexOf(obj)==-1){
            $this.attr('mdui-object', uis+' '+obj);
        }
    }


    // wrap contents into span inside
    if(!$this.find('.'+classname.text).length){
        var txt = $this.html();
        $this.empty();
        $this.text = $('<span />').addClass(classname.text).html(txt).appendTo($this);
    } else {
        $this.text = $('.'+classname.text, $this);
    }

    // disable handler
    if($this.attr('disabled')!==undefined){
        $this.addClass(classname.state.disabled);
    }

    function enable(){
        $this.removeAttr('disabled');
        $this.removeClass(classname.state.disabled);
    }

    function disable(){
        $this.attr('disabled','');
        $this.addClass(classname.state.disabled);
    }



    // Light or Dark
    if(!$this.hasClass('dark')){
        $this.addClass('light');
    }



    /***
     * Virtual Object
     */
    var vdoc = null;
    vdoc = new VirtualDocument();
    _this.vdoc = vdoc;

    vdoc.set($this, {
        this: {
            transition: {
                css: 'box-shadow',
                duration: 200,
                ease: 'easeOutQuad'
            }
        },
        text: {
            selector: '.'+classname.text
        }
    });







    /***
     * Event Listeners
     */
    var state = {down:false, timer: setTimeout(function(){},0), in_transit:false};


    $this.on('mousedown', function(){
        if($this.hasClass(classname.state.disabled)) return false;
        $this.addClass(classname.state.pressed);
        vdoc.sync('this').animate('this');
        state.down = true;
        state.in_transit = true;
        clearTimeout(state.timer);
        state.timer = setTimeout(function() {
            state.in_transit = false;
            if (state.down == false){
                $this.removeClass(classname.state.pressed);
                vdoc.sync('this').animate('this');
            }
        }, 200);
    });

    $this.on('focus', function(){
        if($this.hasClass(classname.state.disabled)) return false;
        if(!state.down) {
            vdoc.sync('this').animate('this');
        }
    });

    $this.on('mouseup mouseleave blur', function(){
        if($this.hasClass(classname.state.disabled)) return false;
        state.down = false;

        if(state.in_transit) return false;

        $this.removeClass(classname.state.pressed);
        vdoc.sync('this').animate('this');
    });


    $this.on('click', function(){
        if($(this).hasClass(classname.state.disabled)) return false;
    });



    _this.target = $this;
    _this.vdoc = vdoc;
    _this.enable = enable;
    _this.disable = disable;



    /***
     * Effects
     */
    new Hover($this);
    new Ripple($this);
    new Focus($this);
}


module.exports = Button;