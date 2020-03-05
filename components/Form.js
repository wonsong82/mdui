function Form(element){


    var _this = this;

    var classname = {

        'this': 'mdui-form',
            'has_error': 'mdui-state--error'
    };



    var elements = [
        'mdui-text'
    ];


    var $this = $(element);


    /***
     * Run the validation test of elements inside and return true or false
     * @returns {boolean}
     */
    function validate(){
        var containsError = false;
        for(var i=0;i<elements.length;i++){
            $('.'+elements[i], $this).each(function(){
                if($(this).mdui().validate() === false){
                    containsError = true;
                }
            });
        }
        if(containsError){
            return false;
        }
        else{
            return true;
        }
    }
    _this.validate = validate;


    /***
     * Returns validation state of elements inside without running whole validation test
     * @returns {boolean}
     */
    function isValid(){
        return $('.'+classname.has_error, $this).length ? false : true;
    }
    _this.isValid = isValid;



}

module.exports = Form;