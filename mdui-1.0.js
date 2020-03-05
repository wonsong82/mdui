/***
 * Load Libraries
 */

// Load Jquery
/*
if(typeof $ === 'undefined'){
    window.$ = window.jQuery = require('./lib/jquery/jquery-1.11.3.min.js');
}
*/

// Load Jquery Effects
if(typeof $.effects === 'undefined'){
    require('./lib/jquery/jquery.effects.min.js');
}

// Load Additional Effects
if(typeof $.transform === 'undefined'){
    require('./lib/jquery/jquery.transform2d.js');
    require('./lib/jquery/jquery.animate-shadow.min.js');
}


/***
 * Load MDUI to global and add mdui to jquery object
 */

(function($){

    var MDUI = require('./mdui/MDUI');
    window.mdui = new MDUI();

    $.fn.mdui = function(){
        return mdui.getObject(this);
    };

    var VirtualDocument = require('./mdui/VirtualDocument');
    window.VirtualDocument = VirtualDocument;
    $.fn.vdoc = function(args){
        var vdoc = new VirtualDocument();
        vdoc.set($(this), args);
        return vdoc;
    };


})(jQuery);


/***
 * Start MDUI UIs
 */

$(function(){mdui.init();});
