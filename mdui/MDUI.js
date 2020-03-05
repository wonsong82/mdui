function MDUI(){

    var _uis = [
        {selector: 'mdui-form',     class: require('../components/Form')},
        {selector: 'mdui-button',   class: require('../components/Button')},
        {selector: 'mdui-text',     class: require('../components/Text')},
        {selector: 'mdui-checkbox', class: require('../components/Checkbox')},
        {selector: 'mdui-radio',    class: require('../components/Radio')},
        {selector: 'mdui-menu',     class: require('../components/Menu')},
        {selector: 'mdui-scroll',   class: require('../components/Scroll')},

        {selector: 'mdui-effect--hover',    class: require('../effects/Hover')},
        {selector: 'mdui-effect--ripple',   class: require('../effects/Ripple')},
        {selector: 'mdui-effect--focus',    class: require('../effects/Focus')}
    ],

    _dom = [];



    function initComponents(){

        $.each(_uis, function(i,e){
            $('.'+e.selector).each(function(){
                if($(this).attr('vdoc')!==undefined) return true;
                var ui = e.selector.replace('mdui-','');
                var uis = $(this).attr('mdui-object') || '';
                if(uis.indexOf(ui) == -1){
                    _dom.push({dom:this, obj:new e.class(this)});
                }
            })
        });

    }

    this.init = this.reload = initComponents;



    function getObject(domElement){

        domElement = domElement[0] || domElement;

        for(var i=0; i<_dom.length; i++){
            if(_dom[i].dom === domElement)
                return _dom[i].obj;
        }
        return null;
    }
    this.getObject = getObject;

}
module.exports = MDUI;


