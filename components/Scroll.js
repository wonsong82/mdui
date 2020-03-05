function Scroll(element, args){

    var _this = this;
    args = $.extend({}, _this.defaultArgs, args);


    var classname = {

        this: 'mdui-scroll',
        state: {
            hover: 'mdui-state--hover',
            scroll: 'mdui-state--scroll'
        },
        option: {
            autohide: 'mdui-scroll--autohide'
        },
        outer_container: 'mdui-scroll__outer-container',
        container: 'mdui-scroll__container',
        track: 'mdui-scroll__track',
        track_type: {
            vertical: 'mdui-scroll__track--vertical',
            horizontal: 'mdui-scroll__track--horizontal'
        },
        handle: 'mdui-scroll__handle'
    };


    var $this;



    construct();


    function construct(){

        $this = $(element);
        $this.addClass(classname.this);

        var obj = 'scroll';
        if($this.attr('mdui-object')==undefined){
            $this.attr('mdui-object',obj);
        }
        else{
            var uis = $this.attr('mdui-object');
            if(uis.indexOf(obj)==-1){
                $this.attr('mdui-object', uis+' '+obj);
            }
        }

        _this.scrollSize = findScrollSize();

        create();
        updateUI();
    }



    function create(){

        $this.wrapInner('<div class="'+classname.outer_container+'"><div class="' + classname.container + '"></div></div>');

        $this.outer_container = $('>.'+classname.outer_container, $this);
        $this.container = $('>.'+classname.container, $this.outer_container);
        $this.v_track = $('<span/>').addClass(classname.track+' '+classname.track_type.vertical).appendTo($this);
        $this.v_track.handle = $('<span/>').addClass(classname.handle).appendTo($this.v_track);
        $this.h_track = $('<span/>').addClass(classname.track+' '+classname.track_type.horizontal).appendTo($this);
        $this.h_track.handle = $('<span/>').addClass(classname.handle).appendTo($this.h_track);

        // attachEvents
        $this.container.on('scroll', onScroll);
        $this.v_track.on('mousedown', onTrackClick);
        $this.h_track.on('mousedown', onTrackClick);
        $this.v_track.handle.on('mousedown touchstart', onHandleStart);
        $this.h_track.handle.on('mousedown touchstart', onHandleStart);
        $(document).on('mouseup touchend', onHandleEnd);
        $(window).on('resize', updateUI);
        $this.on('resize', function(){
            updateUI();
            return false;
        });
        $($this.container).on('DOMMouseScroll mousewheel', disableOtherScroll);
    }


    function destroy(){

        $this.container.contents().unwrap();
        $this.v_track.remove();
        $this.h_track.remove();
        $(document).off('mouseup', onHandleEnd);
        $(window, $this).off('resize', updateUI);
        var attrs = $this.attr('mdui-object').split(' ');
        attrs.splice(attrs.indexOf('scroll'));
        $this.attr('mdui-object', attrs.join(' '));
    }




    function updateUI(){
        var view, x, y;

        // make the container larger by scroll ui size
        if($this.css('position')=='static') $this.css('position','relative');


        $this.outer_container.css({width:$this.outerWidth(),height:$this.outerHeight()});
        $this.container.css({width:containerSize('width'), height:containerSize('height'), paddingLeft:$this.css('padding-left'), paddingRight:$this.css('padding-right'), paddingTop:$this.css('padding-top'), paddingBottom:$this.css('padding-bottom')});

        // set scroll size
        view = $this.container[0];

        x = handleSize('width');
        y = handleSize('height');

        $this.h_track.handle.css('width', x);
        $this.v_track.handle.css('height', y);

        if(x==0) $this.h_track.css('display', 'none');
        else $this.h_track.css('dispaly', 'block');
        if(y==0) $this.v_track.css('display', 'none');
        else $this.v_track.css('display', 'block');


        if($this.hasClass(classname.option.autohide)){
            $this.v_track.stop(true).animate({opacity: 0}, args.transition.duration*2, args.transition.ease);
            $this.h_track.stop(true).animate({opacity: 0}, args.transition.duration*2, args.transition.ease);
        }


        function containerSize(prop){
            var outer = prop=='width'? 'outerWidth' : 'outerHeight';
            return $this[outer]() + _this.scrollSize[prop];
        }


        function handleSize(prop){
            var clientSize = prop=='width'? 'clientWidth' : 'clientHeight';
            var scrollSize = prop=='width'? 'scrollWidth' : 'scrollHeight';
            prop = view[clientSize] / view[scrollSize];
            return prop < 1 ? prop * 100 + '%' : 0;
        }

    }


    function disableOtherScroll(ev) {
        var _$this = $(this),
            scrollTop = this.scrollTop,
            scrollHeight = this.scrollHeight,
            height = _$this.height(),
            delta = (ev.type == 'DOMMouseScroll' ?
            ev.originalEvent.detail * -40 :
                ev.originalEvent.wheelDelta),
            up = delta > 0;

        var prevent = function() {
            ev.stopPropagation();
            ev.preventDefault();
            ev.returnValue = false;
            return false;
        };

        if (!up && -delta > scrollHeight - height - scrollTop) {
            // Scrolling down, but this will take us past the bottom.
            _$this.scrollTop(scrollHeight);
            return prevent();
        } else if (up && delta > scrollTop) {
            // Scrolling up, but this will take us past the top.
            _$this.scrollTop(0);
            return prevent();
        }
    }





    var state = {prevPageX:0, prevPageY:0, dragging:false, handlePosY:0, handlePosX:0, timer:setTimeout(function(){},0)};

    function onScroll(){

        $this.v_track.handle.css('top', handlePosition('vertical') + 'px');
        $this.h_track.handle.css('left', handlePosition('horizontal') + 'px');

        if($this.hasClass(classname.option.autohide)){
            $this.v_track.stop(true).animate({opacity: 1}, args.transition.duration, args.transition.ease);
            $this.h_track.stop(true).animate({opacity: 1}, args.transition.duration, args.transition.ease);
            clearTimeout(state.timer);
            state.timer = setTimeout(function(){
                $this.v_track.stop(true).animate({opacity: 0}, args.transition.duration*2, args.transition.ease);
                $this.h_track.stop(true).animate({opacity: 0}, args.transition.duration*2, args.transition.ease);

            }, args.transition.wait);
        }

        function handlePosition(type) {
            var view = $this.container[0], scrollSize, scrollPos, clientSize;
            scrollPos  = type == 'vertical' ? view.scrollTop : view.scrollLeft;
            clientSize = type == 'vertical' ? view.scrollHeight : view.scrollWidth;
            scrollSize = type == 'vertical' ? $this.v_track.height() : $this.h_track.width();
            return (scrollPos / clientSize) * scrollSize;
        }
    }


    function onTrackClick(e){
        var pos, prop, mousePos, scrollProp, contentSize, target=$(this);

        if(target.hasClass(classname.track_type.vertical)){
            pos='top';prop='height';mousePos='clientY';scrollProp='scrollTop';contentSize='scrollHeight';
        } else {
            pos='left';prop='width';mousePos='clientX';scrollProp='scrollLeft';contentSize='scrollWidth';
        }

        var offset = Math.abs(e.target.getBoundingClientRect()[pos] - e[mousePos]);

        var fact = offset / target[prop]();

        $this.container[scrollProp](fact * $this.container[0][contentSize]);
    }


    function onHandleStart(e){
        startDrag(e);
        if($(this).parent().hasClass(classname.track_type.vertical)){
            state.prevPageY = (e.currentTarget.offsetHeight - (e.clientY - e.currentTarget.getBoundingClientRect().top));
            state.handlePosY = Math.abs(e.target.getBoundingClientRect().top - e.clientY);
        } else {
            state.prevPageX = (e.currentTarget.offsetWidth - (e.clientX - e.currentTarget.getBoundingClientRect().left));
            state.handlePosX = Math.abs(e.target.getBoundingClientRect().left - e.clientX);
        }
    }

    function startDrag(e){
        e.stopImmediatePropagation();
        state.dragging = true;
        $(document).on('mousemove touchmove', onMouseMove);
        $(document).on('selectstart',onSelect);
    }


    function onHandleEnd(){
        state.dragging = false;
        state.prevPageX = state.prevPageY = state.handlePosX = state.handlePosY = 0;
        $(document).off('mousemove touchmove', onMouseMove);
        $(document).off('selectstart', onSelect);
    }


    function onSelect(){
        return false;
    }
    function onMouseMove(e){
        if(state.dragging == false){return true;}

        var offset, fact;

        if (state.prevPageY) {
            offset = (($this.v_track[0].getBoundingClientRect().top - e.clientY) * -1);
            fact = (offset - state.handlePosY) / $this.v_track.height();
            if(fact<0) fact = 0; if(fact>1) fact = 1;
            $this.container['scrollTop'](fact * $this.container[0]['scrollHeight']);

            return void 0;
        }

        if (state.prevPageX) {
            offset = (($this.h_track[0].getBoundingClientRect().left - e.clientX) * -1);
            fact = (offset - state.handlePosX) / $this.h_track.width();
            if(fact<0) fact = 0; if(fact>1) fact = 1;
            $this.container['scrollLeft'](fact * $this.container[0]['scrollWidth']);
        }
    }








    function findScrollSize(){
        var dump = $('<div/>').css({
            'position':'absollute','top':'-9999px','width':'100px','height':'100px',
            'overflow':'scroll','msOverflowStyle':'scrollbar'
        }).appendTo('body');

        var data = {
            width: dump[0].offsetWidth - dump[0].clientWidth,
            height: dump[0].offsetHeight - dump[0].clientHeight
        };
        dump.remove();

        // Fix for the browsers that uses overlay scroll
        if(!data.width) data.width = 20;
        if(!data.height) data.height = 20;

        return data;
    }


    _this.target = $this;
    _this.create = create;
    _this.updateUI = updateUI;
    _this.destroy = destroy;


}


Scroll.prototype.defaultArgs = {
    transition: {
        duration: 200,
        ease: 'easeOutQuad',
        wait: 400
    }
};





module.exports = Scroll;