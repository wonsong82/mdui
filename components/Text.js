/***
 * MDUI ver 1.0
 * author : Won Song
 *
 *
 *
 */
var VirtualDocument = require('../mdui/VirtualDocument');

function Text(element, args){

    /***
     * Set this instance reference, and
     * parse argumets
     *
     */
    var _this = this;
        _this.isValid = true;


    args = $.extend({}, args, _this.defaultArgs);


    /***
     * Define class names used in this element
     */
    var classname = {

        this: 'mdui-text',
        state: {
            disabled: 'mdui-state--disabled',
            focused: 'mdui-state--focused',
            filled: 'mdui-state--filled',
            error: 'mdui-state--error'
        },

        input: 'mdui-text__input',

        label: 'mdui-text__label',
        float_label: 'mdui-text__label--float',
        required_label: 'mdui-text__label__required',

        indicator: 'mdui-text__indicator',

        status: 'mdui-text__status',
        'status_autohide': 'mdui-text__status--autohide',

        counter: 'mdui-text__counter',
        'counter_autohide': 'mdui-text__counter--autohide'
    };


    /***
     * Initialize Elements and Modify DOM
     */
    var $this = $(element);

    $this.addClass(classname.this);
    var obj = 'text';
    if($this.attr('mdui-object')==undefined){
        $this.attr('mdui-object',obj);
    }
    else{
        var uis = $this.attr('mdui-object');
        if(uis.indexOf(obj)==-1){
            $this.attr('mdui-object', uis+' '+obj);
        }
    }


    $this.input     = $('.'+classname.input, $this);
    $this.indicator = $('.'+classname.indicator, $this);
    if(!$this.indicator.length) {
        $this.indicator = $('<span />').addClass(classname.indicator).insertAfter($this.input);
    }
    $this.label     = $('.'+classname.label, $this);
    $this.status    = $('.'+classname.status, $this);
    $this.counter   = $('.'+classname.counter, $this);





    /***
     * Get Virtual Object
     */
    var vdoc = null;
    vdoc = new VirtualDocument();


    vdoc.set($this, {
        this: {},
        input: {
            selector: '.'+classname.input
        },
        label: {
            selector: '.'+classname.label,
            transition: {
                css: 'top font-size color line-height',
                duration: args.transition.duration,
                ease: args.transition.ease
            }
        },
        indicator: {
            selector: '.'+classname.indicator,
            transition: {
                css: 'left width background-color',
                duration: args.transition.duration,
                ease: args.transition.ease
            }
        },
        status: {
            selector: '.'+classname.status,
            transition: {
                css: 'opacity color',
                duration: args.transition.duration,
                ease: args.transition.ease
            }
        },
        counter: {
            selector: '.'+classname.counter,
            transition: {
                css: 'opacity color',
                duration: args.transition.duration,
                ease: args.transition.ease
            }
        }
    });



    if($.trim($this.input.val())){
        $this.addClass(classname.state.filled);
        validate();
    }

    if($('validation[require="true"]', $this)[0]){
        $('<span>&#32;&#42;&#32;</span>').addClass(classname.required_label).appendTo($this.label);
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
     * Add objects and functions
     */
    $this.counter.limit = 0;
    $this.counter.setText = function(){
        $this.counter.text($this.input.val().length + ' / ' + $this.counter.limit);
    };

    if($this.counter.length){
        var max = $this.counter.attr('limit');
        $this.counter.limit = (typeof max) === 'undefined' ? 150 : max;
        $this.counter.setText();
    }




    var inputUIUpdate = $this.attr('inputUIUpdate') == 'false'? false : true;


    /***
     * Events
     */
    $this.input.focus(function(){
        if($(this).attr('readonly')!==undefined) return false;
        $this.addClass(classname.state.focused);
        vdoc.sync('this').animate('label indicator status counter');

        if(!inputUIUpdate){
            $this.status.text(vdoc.original.status.text());
            $this.removeClass(classname.state.error);
            vdoc.sync('this').animate('label indicator status counter');
        }
    });

    $this.input.blur(function(){
        $this.removeClass(classname.state.focused);
        vdoc.sync('this').animate('label indicator status counter');

        if($.trim($this.input.val())){
            $this.addClass(classname.state.filled);
        }
        else {
            $this.removeClass(classname.state.filled);
        }
        if($this.counter.length) $this.counter.setText();
        validate();
        $this.trigger('inputChange');
    });

    $this.label.click(function(){
        $this.input.trigger('focus');
    });


    $this.input.timer = setTimeout(function(){},1);
    $this.input.on('keyup change input', function(){
        if($.trim($this.input.val())){
            $this.addClass(classname.state.filled);
        }
        else {
            $this.removeClass(classname.state.filled);
        }
        if($this.counter.length) $this.counter.setText();
        clearTimeout($this.input.timer);
        $this.input.timer = setTimeout(function(){
            if(inputUIUpdate){
                validate();
            }
            else {
                _validate();
            }
            $this.trigger('inputChange');
        }, 200);
    });





    if($this.input.is('textarea')){


        var row = vdoc.original.input.attr('rows');

        if((typeof row) === 'undefined') row = 1;
        vdoc.virtual.input.attr('rows', row);

        var currentRow = $this.input.val().split('\n').length;
        var setRow = row > currentRow ? row : currentRow;
        $this.input.height(setRow*parseFloat(vdoc.virtual.input.css('line-height')));

        var emptyHeight = parseInt(row) * parseFloat(vdoc.virtual.input.css('line-height'));

        $this.input.on('keyup change input', function(){
            var __this = this;

            // Get border height , padding handled by border-box
            var offset = __this.offsetHeight - __this.clientHeight;

            // Copy the contents into virtual and get scrollHeight from it
            vdoc.virtual.input.val($(__this).val());
            var height = vdoc.virtual.input[0].scrollHeight + offset;

            // If designated height is smaller than emptyheight, set it to empty height
            if(height < emptyHeight){
                $(__this).css('height', emptyHeight);
            }
            else {
                $(__this).css('height', height + offset);

            }

            $this.trigger('resize');
        });

    }


    /***
     * internal validation that doens't affect the class
     * @returns {boolean}
     * @private
     */
    function _validate(){

        var isValid = true;

        var valid = {
            isValid : isValid,
            errorText : ''
        };

        if($this.counter.limit > 0){
            if($this.input.val().length > $this.counter.limit){
                valid.isValid = false;
                valid.errorText = '';
            }
        }

        $('validation', $this).each(function(i,e){
            if($(e).attr('require')=='true' && $this.input.val()==''){
                valid.errorText = $(e).attr('text');
                valid.isValid = false;
                return false; // jquery each break
            }
            if($(e).attr('regex') && $this.input.val()!=''){
                var pattern = $(e).attr('regex').toString();
                var reg = new RegExp(pattern);
                if(false===reg.test($this.input.val())){
                    valid.errorText = $(e).attr('text');
                    valid.isValid = false;
                    return false;
                }
            }
        });

        _this.isValid = valid.isValid;
        return valid;
    }


    /***
     * Public validation that covers classes too
     * @returns {boolean}
     */
    function validate(){

        var validation = _validate();


        if(validation.isValid){
            $this.status.text(vdoc.original.status.text());
            $this.removeClass(classname.state.error);
            vdoc.sync('this').animate('label indicator status counter');
            return true;
        }

        else {
            $this.status.text(validation.errorText);
            $this.addClass(classname.state.error);
            vdoc.sync('this').animate('label indicator status counter');
            return false;
        }
    }


    _validate();


    /***
     * Public properties and methods
     */

    _this.target = _this.$ = $this;

    _this.vdoc = vdoc;

    _this.enable = enable;
    _this.disable = disable;

    _this.validate = validate;
    //_this.isValid


}

Text.prototype.defaultArgs = {
    transition: {
        duration: 500,
        ease: 'easeOutExpo'
    }
};





module.exports = Text;