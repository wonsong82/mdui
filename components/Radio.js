/***
 * MDUI
 * author : Won Song | wonsong82@gmail.com
 *
 */


var VirtualDocument = require('../mdui/VirtualDocument');
var Ripple = require('../effects/Ripple');
var Hover = require('../effects/Hover');
var Focus = require('../effects/Focus');


function Radio(element, args){

    var _this = this;
    args = $.extend({}, args, _this.defaultArgs);


    var classname = {

        this:   'mdui-radio',
        state: {
            checked:    'mdui-state--checked',
            disabled:   'mdui-state--disabled'
        },

        input: 'mdui-radio__input',

        box:    'mdui-radio__box',

        bg:     'mdui-radio__box__bg',
        bg_text:    'mdui-radio__box__bg__text',


        radio:  'mdui-radio__box__radio',
        radio_text: 'mdui-radio__box__radio__text'

    };


    /***
     * Modify DOM
     */
    var $this = $(element);


    $this.addClass(classname.this);
    var obj = 'radio';
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
    $this.bg_text   = $('<i class="material-icons">&#xE836;</i>').addClass(classname.bg_text).appendTo($this.bg);

    $this.radio     = $('<span/>').addClass(classname.radio).appendTo($this.box);
    $this.radio_text    = $('<i class="material-icons">&#xE837;</i>').addClass(classname.radio_text).appendTo($this.radio);

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
        radio: {
            selector: '.'+classname.radio
        },
        radio_text: {
            selector: '.'+classname.radio_text,
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
        $this.input.prop('checked', true);
        $this.input.trigger('change');
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

    function updateUI(){
        if($this.input.prop('checked')){
            $this.addClass(classname.state.checked);
        }
        else{
            $this.removeClass(classname.state.checked);
        }
        vdoc.sync('this').animate('bg_text radio_text');
    }

    $this.input.change(function(){
        updateUI();

        if($this.input.attr('name')!=undefined){
            $('[name="'+$this.input.attr('name')+'"').each(function(){
                if(this!==$this.input[0] && $(this).parent().mdui()){
                    $(this).parent().mdui().updateUI();
                }
                //$(this).parent().mdui().updateUI();
            });
        }
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
    _this.updateUI = updateUI;

}


Radio.prototype.defaultArgs = {};


module.exports = Radio;