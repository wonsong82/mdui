/***
 *
 * Public Method & Properties
 *
 * doc : jquery object of virtual document container
 * original : original clone of $dom passed
 * virtual : virtual clone of $dom passed which will be used to monitor css
 *
 */

module.exports = function(debug){

    var _this = this;



    _this.id = 'virtual-document';
    _this.doc = undefined;

    _this.dom = undefined; // Real representation of current dom which will be animated
    _this.original = undefined; // Save original state
    _this.virtual = undefined; // Hidden virtual dom which will be used to find the css values

    _this.props = undefined;



    // create document if not exists
    _this.__construct = function(){

        debug = debug !== undefined;
        _this.createDocument();
    };


    /***
     * Create virtual document container on DOM if not found
     */
    _this.createDocument = function(){
        var id = _this.id;

        _this.doc = $('#' + id);

        if(!_this.doc.length){
            _this.doc = $('<div/>')
                .attr('id', id)
                .css({display:'block', position:'fixed', top:'200%'})
                .appendTo('body');
        }
    };


    /***
     * Set virtualDoc dom and add children as dot notation,
     * Then init css to these elements if the element has transition property
     */
    _this.set = function(dom, props){
        var doc = _this.doc, orig, virt, prop, to, from, css;


        // Set _this.dom, and add temporary 'vdoc-id' that will be removed later
        dom = $(dom);
        for(prop in props){
            if(props.hasOwnProperty(prop)){
                if(prop != 'this'){
                    dom[prop] = $(props[prop].selector, dom);
                    dom[prop].attr('vdoc-id', prop);
                }
            }
        }

        // Make _this.original, _this.virtual by cloning the _this.dom
        orig = dom.clone().removeAttr('id name').attr('vdoc', 'original').appendTo(doc);
        orig.find('[id], [name]').removeAttr('id name');
        virt = orig.clone().attr('vdoc', 'virtual').appendTo(doc);

        // Set props for original and virtual
        for(prop in props){
            if(props.hasOwnProperty(prop)){
                if(prop != 'this'){
                    orig[prop] = $('[vdoc-id="'+prop+'"]', orig);
                    virt[prop] = $('[vdoc-id="'+prop+'"]', virt);
                }
            }
        }

        // Delete vdoc-id
        $.each([dom, orig, virt], function(i, e){
            $('[vdoc-id]', e).removeAttr('vdoc-id');
        });

        _this.dom = dom;
        _this.original = orig;
        _this.virtual = virt;
        _this.props = props;


        // IE9 + , return
        if('transition' in document.body.style){
            return true;
        }

        // Set init css for elements that will be animated (for IE9 css transition)
        for(prop in props){
            if(props.hasOwnProperty(prop)){
                if(props[prop].hasOwnProperty('transition')){
                    from = prop=='this'? orig : orig[prop];
                    to = prop=='this'? dom : dom[prop];
                    css = {};
                    $.each(props[prop].transition.css.split(' '), function(i, e){
                        css[e] = from.css(e);
                    });
                    to.css(css);
                }
            }
        }
    };


    /***
     * Sync the values of elements passed in
     * @param syncProps ex: 'this input label'
     * @return object this virtual document object
     */
    _this.sync = function(syncProps){
        var virt, dom;

        if(typeof syncProps === 'string'){
            $.each(syncProps.split(' '), function(i,e){
                virt = e=='this'? _this.virtual : _this.virtual[e];
                dom = e=='this'? _this.dom : _this.dom[e];
                if(virt.length != dom.length){
                    console.log('VirtualDom:: Number of elements of virtual and actual are different. please rerun the virtual dom and sync them after any addition or deletion.');
                }
                else {
                    virt.each(function(i, e){
                        $(e).attr('class', dom.eq(i).attr('class'));
                    });
                }
            });
        }
        return _this;
    };



    /***
     * Animate. use it after sync. you can chain it.  vdoc.sync('this').animate('input label');
     * @param animateProps ex: 'this input label'
     */
    _this.animate = function(animateProps){
        if('transition' in document.body.style) return true;
        var props = _this.props, transition, virt, dom, css, opt;
        //var obj, css ,from, duration, prop, props = _this.props;


        if(typeof animateProps === 'string'){

            // For each elements queued for animation
            $.each(animateProps.split(' '), function(i,e){
                transition = props[e].transition;
                if(transition){
                    virt = e=='this'? _this.virtual : _this.virtual[e];
                    dom = e=='this'? _this.dom : _this.dom[e];
                    virt.each(function(i){
                        css = {};
                        $.each(transition.css.split(' '), function(y, o){
                            css[o] = virt.eq(i).css(o);
                        });
                        opt = {};
                        opt.duration = transition.duration || 300;
                        opt.easing = transition.ease || 'swing';
                        dom.eq(i).stop(true).animate(css, opt);
                    });
                }
            });
        }
    };



    _this.__construct();
};





