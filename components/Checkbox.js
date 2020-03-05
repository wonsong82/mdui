/***
 * MDUI
 * author : Won Song | wonsong82@gmail.com
 *
 */


var VirtualDocument = require('../mdui/VirtualDocument');
var Ripple = require('../effects/Ripple');
var Hover = require('../effects/Hover');
var Focus = require('../effects/Focus');


function Checkbox(element, args){

    var _this = this;
    args = $.extend({}, args, _this.defaultArgs);


    var classname = {

        this:   'mdui-checkbox',
            state: {
                checked:    'mdui-state--checked',
                disabled:   'mdui-state--disabled'
            },

        input: 'mdui-checkbox__input',

        box:    'mdui-checkbox__box',

        bg:     'mdui-checkbox__box__bg',
        bg_text:    'mdui-checkbox__box__bg__text',


        check:  'mdui-checkbox__box__check',
        check_text: 'mdui-checkbox__box__check__text'


    };


    /***
     * Modify DOM
     */
    var $this = $(element);


    $this.addClass(classname.this);
    var obj = 'checkbox';
    if($this.attr('mdui-object')==undefined){
        $this.attr('mdui-object',obj);
    }
    else{
        var uis = $this.attr('mdui-object');
        if(uis.indexOf(obj)==-1){
            $this.attr('mdui-object', uis+' '+obj);
        }
    }

    $this.input         = $('.'+classname.input, $this);
    $this.box           = $('<div/>').addClass(classname.box).appendTo($this);

    $this.bg        = $('<span/>').addClass(classname.bg).appendTo($this.box);
    $this.bg_text   = $('<i class="material-icons">&#xE835;</i>').addClass(classname.bg_text).appendTo($this.bg);

    $this.check     = $('<span/>').addClass(classname.check).appendTo($this.box);
    $this.check_text    = $('<i class="material-icons">&#xE834;</i>').addClass(classname.check_text).appendTo($this.check);

    if($this.input.prop('checked')){
        $this.addClass(classname.state.checked);
    }

    // Disable
    if($this.input.attr('disabled')!==undefined){
        $this.addClass(classname.state.disabled);
    }
    function disable(){
        $this.input.attr('disabled','');
        $this.addClass(classname.state.disabled);
    }
    function enable(){
        $this.input.removeAttr('disabled');
        $this.removeClass(classname.state.disabled);
    }






    /***
     * Virtual Dom
     */
    var vdoc = null;
    vdoc = new VirtualDocument();

    vdoc.set($this, {
        this: {},
        input: {
            selector: '.'+classname.input
        },
        box: {
            selector: '.'+classname.box
        },
        bg: {
            selector: '.'+classname.bg
        },
        bg_text: {
            selector: '.'+classname.bg_text,
            transition: {
                css: 'color',
                duration: 500,
                ease: 'easeInOutQuad'
            }
        },
        check: {
            selector: '.'+classname.check
        },
        check_text: {
            selector: '.'+classname.check_text,
            transition: {
                css: 'transform opacity',
                duration: 300,
                ease: 'easeInOutQuad'
            }
        }
    });




    /***
     * Events
     */
    $this.box.click(function(){
        if($this.hasClass(classname.state.disabled)) return false;
        if($this.input.prop('checked')){
            $this.input.prop('checked',false);
        } else {
            $this.input.prop('checked', true);
        }
        $this.input.trigger('change');
        return false;
    });


    $this.on('keydown', function(e){
        if($this.hasClass(classname.state.disabled)) return false;
        if(e.keyCode==32){
            if($this.input.prop('checked')){
                $this.input.prop('checked',false);
            } else {
                $this.input.prop('checked', true);
            }
            $this.input.trigger('change');
            return false;
        }
    });



    $this.input.change(function(){
        if($this.input.prop('checked')){
            $this.addClass(classname.state.checked);
        }
        else{
            $this.removeClass(classname.state.checked);
        }
        vdoc.sync('this').animate('bg_text check_text');
    });




    new Hover($this, {trigger: $this.box});
    new Ripple($this, {trigger: $this.box, insertAt:0});
    new Focus($this);


    /***
     *  Public properties and methods
     */
    _this.target = $this;
    _this.vdoc = vdoc;
    _this.enable = enable;
    _this.disable = disable;

}


Checkbox.prototype.defaultArgs = {

};


module.exports = Checkbox;