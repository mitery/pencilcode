/* ICE Editor.
Copyright (c) 2014 Anthony Bau.
MIT License.
*/
(function() {var QUAD={};QUAD.init=function(args){var node;var TOP_LEFT=0;var TOP_RIGHT=1;var BOTTOM_LEFT=2;var BOTTOM_RIGHT=3;var PARENT=4;args.maxChildren=args.maxChildren||2;args.maxDepth=args.maxDepth||4;node=function(x,y,w,h,depth,maxChildren,maxDepth){var items=[],nodes=[];return{x:x,y:y,w:w,h:h,depth:depth,retrieve:function(item,callback,instance){for(var i=0;i<items.length;++i){instance?callback.call(instance,items[i]):callback(items[i])}if(nodes.length){this.findOverlappingNodes(item,function(dir){nodes[dir].retrieve(item,callback,instance)})}},insert:function(item){var i;if(nodes.length){i=this.findInsertNode(item);if(i===PARENT){items.push(item)}else{nodes[i].insert(item)}}else{items.push(item);if(items.length>maxChildren&&this.depth<maxDepth){this.divide()}}},findInsertNode:function(item){if(item.x+item.w<x+w/2){if(item.y+item.h<y+h/2){return TOP_LEFT}if(item.y>=y+h/2){return BOTTOM_LEFT}return PARENT}if(item.x>=x+w/2){if(item.y+item.h<y+h/2){return TOP_RIGHT}if(item.y>=y+h/2){return BOTTOM_RIGHT}return PARENT}return PARENT},findOverlappingNodes:function(item,callback){if(item.x<x+w/2){if(item.y<y+h/2){callback(TOP_LEFT)}if(item.y+item.h>=y+h/2){callback(BOTTOM_LEFT)}}if(item.x+item.w>=x+w/2){if(item.y<y+h/2){callback(TOP_RIGHT)}if(item.y+item.h>=y+h/2){callback(BOTTOM_RIGHT)}}},divide:function(){var width,height,i,oldChildren;var childrenDepth=this.depth+1;width=w/2;height=h/2;nodes.push(node(this.x,this.y,width,height,childrenDepth,maxChildren,maxDepth));nodes.push(node(this.x+width,this.y,width,height,childrenDepth,maxChildren,maxDepth));nodes.push(node(this.x,this.y+height,width,height,childrenDepth,maxChildren,maxDepth));nodes.push(node(this.x+width,this.y+height,width,height,childrenDepth,maxChildren,maxDepth));oldChildren=items;items=[];for(i=0;i<oldChildren.length;i++){this.insert(oldChildren[i])}},clear:function(){var i;for(i=0;i<nodes.length;i++){nodes[i].clear()}items.length=0;nodes.length=0},getNodes:function(){return nodes.length?nodes:false}}};return{root:function(){return node(args.x,args.y,args.w,args.h,0,args.maxChildren,args.maxDepth)}(),insert:function(item){var len,i;if(item instanceof Array){len=item.length;for(i=0;i<len;i++){this.root.insert(item[i])}}else{this.root.insert(item)}},retrieve:function(selector,callback,instance){return this.root.retrieve(selector,callback,instance)},clear:function(){this.root.clear()}}};
;/*
  Keypress version 2.0.1 (c) 2014 David Mauro.
  Licensed under the Apache License, Version 2.0
  http://www.apache.org/licenses/LICENSE-2.0
*/
(function(){var u,w,x,y,p,v,C,D,E,F,q,r,o,k,s,z,G,A={}.hasOwnProperty,i=[].indexOf||function(a){for(var c=0,b=this.length;c<b;c++)if(c in this&&this[c]===a)return c;return-1};p={is_unordered:!1,is_counting:!1,is_exclusive:!1,is_solitary:!1,prevent_default:!1,prevent_repeat:!1};z="meta alt option ctrl shift cmd".split(" ");k="ctrl";window.keypress={};keypress.debug=!1;var B=function(a){var c,b;for(c in a)A.call(a,c)&&(b=a[c],!1!==b&&(this[c]=b));this.keys=this.keys||[];this.count=this.count||0};B.prototype.allows_key_repeat=
function(){return!this.prevent_repeat&&"function"===typeof this.on_keydown};B.prototype.reset=function(){this.count=0;return this.keyup_fired=null};var H=keypress,g=function(a,c){var b,d;this.should_force_event_defaults=this.should_suppress_event_defaults=!1;this.sequence_delay=800;this._registered_combos=[];this._keys_down=[];this._active_combos=[];this._sequence=[];this._sequence_timer=null;this._prevent_capture=!1;this._defaults=c||{};for(b in p)A.call(p,b)&&(d=p[b],this._defaults[b]=this._defaults[b]||
d);a=a||document.body;b=function(a,b,c){if(a.addEventListener)return a.addEventListener(b,c);if(a.attachEvent)return a.attachEvent("on"+b,c)};var e=this;b(a,"keydown",function(a){a=a||window.event;e._receive_input(a,!0);return e._bug_catcher(a)});var f=this;b(a,"keyup",function(a){a=a||window.event;return f._receive_input(a,!1)});var h=this;b(window,"blur",function(){var a,b,c,d;d=h._keys_down;b=0;for(c=d.length;b<c;b++)a=d[b],h._key_up(a,{});return h._keys_down=[]})};g.prototype._bug_catcher=function(a){var c;
if("cmd"===k&&0<=i.call(this._keys_down,"cmd")&&"cmd"!==(c=x(a.keyCode))&&"shift"!==c&&"alt"!==c&&"caps"!==c&&"tab"!==c)return this._receive_input(a,!1)};g.prototype._cmd_bug_check=function(a){return"cmd"===k&&0<=i.call(this._keys_down,"cmd")&&0>i.call(a,"cmd")?!1:!0};g.prototype._prevent_default=function(a,c){if((c||this.should_suppress_event_defaults)&&!this.should_force_event_defaults)if(a.preventDefault?a.preventDefault():a.returnValue=!1,a.stopPropagation)return a.stopPropagation()};g.prototype._get_active_combos=
function(a){var c,b;c=[];b=v(this._keys_down,function(b){return b!==a});b.push(a);this._match_combo_arrays(b,function(a){return function(b){if(a._cmd_bug_check(b.keys))return c.push(b)}}(this));this._fuzzy_match_combo_arrays(b,function(a){return function(b){if(!(0<=i.call(c,b))&&!b.is_solitary&&a._cmd_bug_check(b.keys))return c.push(b)}}(this));return c};g.prototype._get_potential_combos=function(a){var c,b,d,e,f;b=[];f=this._registered_combos;d=0;for(e=f.length;d<e;d++)c=f[d],c.is_sequence||0<=i.call(c.keys,
a)&&this._cmd_bug_check(c.keys)&&b.push(c);return b};g.prototype._add_to_active_combos=function(a){var c,b,d,e,f,h,j,g,n,l,m;h=!1;f=!0;d=!1;if(0<=i.call(this._active_combos,a))return!0;if(this._active_combos.length){e=j=0;for(l=this._active_combos.length;0<=l?j<l:j>l;e=0<=l?++j:--j)if((c=this._active_combos[e])&&c.is_exclusive&&a.is_exclusive){c=c.keys;if(!h){g=0;for(n=c.length;g<n;g++)if(b=c[g],h=!0,0>i.call(a.keys,b)){h=!1;break}}if(f&&!h){m=a.keys;g=0;for(n=m.length;g<n;g++)if(b=m[g],f=!1,0>i.call(c,
b)){f=!0;break}}h&&(d?(c=this._active_combos.splice(e,1)[0],null!=c&&c.reset()):(c=this._active_combos.splice(e,1,a)[0],null!=c&&c.reset(),d=!0),f=!1)}}f&&this._active_combos.unshift(a);return h||f};g.prototype._remove_from_active_combos=function(a){var c,b,d,e;b=d=0;for(e=this._active_combos.length;0<=e?d<e:d>e;b=0<=e?++d:--d)if(c=this._active_combos[b],c===a){a=this._active_combos.splice(b,1)[0];a.reset();break}};g.prototype._get_possible_sequences=function(){var a,c,b,d,e,f,h,j,g,n,l,m;d=[];n=
this._registered_combos;f=0;for(g=n.length;f<g;f++){a=n[f];c=h=1;for(l=this._sequence.length;1<=l?h<=l:h>=l;c=1<=l?++h:--h)if(e=this._sequence.slice(-c),a.is_sequence){if(0>i.call(a.keys,"shift")&&(e=v(e,function(a){return"shift"!==a}),!e.length))continue;c=j=0;for(m=e.length;0<=m?j<m:j>m;c=0<=m?++j:--j)if(a.keys[c]===e[c])b=!0;else{b=!1;break}b&&d.push(a)}}return d};g.prototype._add_key_to_sequence=function(a,c){var b,d,e,f;this._sequence.push(a);d=this._get_possible_sequences();if(d.length){e=0;
for(f=d.length;e<f;e++)b=d[e],this._prevent_default(c,b.prevent_default);this._sequence_timer&&clearTimeout(this._sequence_timer);-1<this.sequence_delay&&(this._sequence_timer=setTimeout(function(){return this._sequence=[]},this.sequence_delay))}else this._sequence=[]};g.prototype._get_sequence=function(a){var c,b,d,e,f,h,g,t,n,l,m,k;l=this._registered_combos;h=0;for(n=l.length;h<n;h++)if(c=l[h],c.is_sequence){b=g=1;for(m=this._sequence.length;1<=m?g<=m:g>=m;b=1<=m?++g:--g)if(f=v(this._sequence,function(a){return 0<=
i.call(c.keys,"shift")?!0:"shift"!==a}).slice(-b),c.keys.length===f.length){b=t=0;for(k=f.length;0<=k?t<k:t>k;b=0<=k?++t:--t)if(e=f[b],!(0>i.call(c.keys,"shift")&&"shift"===e)&&!("shift"===a&&0>i.call(c.keys,"shift")))if(c.keys[b]===e)d=!0;else{d=!1;break}}if(d)return c}return!1};g.prototype._receive_input=function(a,c){var b;if(this._prevent_capture)this._keys_down.length&&(this._keys_down=[]);else if(b=x(a.keyCode),(c||this._keys_down.length||!("alt"===b||b===k))&&b)return c?this._key_down(b,a):
this._key_up(b,a)};g.prototype._fire=function(a,c,b,d){"function"===typeof c["on_"+a]&&this._prevent_default(b,!0!==c["on_"+a].call(c["this"],b,c.count,d));"release"===a&&(c.count=0);if("keyup"===a)return c.keyup_fired=!0};g.prototype._match_combo_arrays=function(a,c){var b,d,e,f;f=this._registered_combos;d=0;for(e=f.length;d<e;d++)b=f[d],(!b.is_unordered&&w(a,b.keys)||b.is_unordered&&u(a,b.keys))&&c(b)};g.prototype._fuzzy_match_combo_arrays=function(a,c){var b,d,e,f;f=this._registered_combos;d=0;
for(e=f.length;d<e;d++)b=f[d],(!b.is_unordered&&D(b.keys,a)||b.is_unordered&&C(b.keys,a))&&c(b)};g.prototype._keys_remain=function(a){var c,b,d,e;e=a.keys;b=0;for(d=e.length;b<d;b++)if(a=e[b],0<=i.call(this._keys_down,a)){c=!0;break}return c};g.prototype._key_down=function(a,c){var b,d,e,f,h;(b=y(a,c))&&(a=b);this._add_key_to_sequence(a,c);(b=this._get_sequence(a))&&this._fire("keydown",b,c);for(e in s)b=s[e],c[b]&&(e===a||0<=i.call(this._keys_down,e)||this._keys_down.push(e));for(e in s)if(b=s[e],
e!==a&&0<=i.call(this._keys_down,e)&&!c[b]&&!("cmd"===e&&"cmd"!==k)){b=d=0;for(f=this._keys_down.length;0<=f?d<f:d>f;b=0<=f?++d:--d)this._keys_down[b]===e&&this._keys_down.splice(b,1)}d=this._get_active_combos(a);e=this._get_potential_combos(a);f=0;for(h=d.length;f<h;f++)b=d[f],this._handle_combo_down(b,e,a,c);if(e.length){d=0;for(f=e.length;d<f;d++)b=e[d],this._prevent_default(c,b.prevent_default)}0>i.call(this._keys_down,a)&&this._keys_down.push(a)};g.prototype._handle_combo_down=function(a,c,b,
d){var e,f,h,g,k;if(0>i.call(a.keys,b))return!1;this._prevent_default(d,a&&a.prevent_default);e=!1;if(0<=i.call(this._keys_down,b)&&(e=!0,!a.allows_key_repeat()))return!1;h=this._add_to_active_combos(a,b);b=a.keyup_fired=!1;if(a.is_exclusive){g=0;for(k=c.length;g<k;g++)if(f=c[g],f.is_exclusive&&f.keys.length>a.keys.length){b=!0;break}}if(!b&&(a.is_counting&&"function"===typeof a.on_keydown&&(a.count+=1),h))return this._fire("keydown",a,d,e)};g.prototype._key_up=function(a,c){var b,d,e,f,h,g;b=a;(e=
y(a,c))&&(a=e);e=r[b];c.shiftKey?e&&0<=i.call(this._keys_down,e)||(a=b):b&&0<=i.call(this._keys_down,b)||(a=e);(f=this._get_sequence(a))&&this._fire("keyup",f,c);if(0>i.call(this._keys_down,a))return!1;f=h=0;for(g=this._keys_down.length;0<=g?h<g:h>g;f=0<=g?++h:--h)if((d=this._keys_down[f])===a||d===e||d===b){this._keys_down.splice(f,1);break}d=this._active_combos.length;e=[];g=this._active_combos;f=0;for(h=g.length;f<h;f++)b=g[f],0<=i.call(b.keys,a)&&e.push(b);f=0;for(h=e.length;f<h;f++)b=e[f],this._handle_combo_up(b,
c,a);if(1<d){h=this._active_combos;d=0;for(f=h.length;d<f;d++)b=h[d],void 0===b||0<=i.call(e,b)||this._keys_remain(b)||this._remove_from_active_combos(b)}};g.prototype._handle_combo_up=function(a,c,b){var d,e;this._prevent_default(c,a&&a.prevent_default);e=this._keys_remain(a);if(!a.keyup_fired&&(d=this._keys_down.slice(),d.push(b),!a.is_solitary||u(d,a.keys)))this._fire("keyup",a,c),a.is_counting&&("function"===typeof a.on_keyup&&"function"!==typeof a.on_keydown)&&(a.count+=1);e||(this._fire("release",
a,c),this._remove_from_active_combos(a))};g.prototype.simple_combo=function(a,c){return this.register_combo({keys:a,on_keydown:c})};g.prototype.counting_combo=function(a,c){return this.register_combo({keys:a,is_counting:!0,is_unordered:!1,on_keydown:c})};g.prototype.sequence_combo=function(a,c){return this.register_combo({keys:a,on_keydown:c,is_sequence:!0})};g.prototype.register_combo=function(a){var c,b,d;"string"===typeof a.keys&&(a.keys=a.keys.split(" "));d=this._defaults;for(c in d)A.call(d,
c)&&(b=d[c],void 0===a[c]&&(a[c]=b));a=new B(a);if(G(a))return this._registered_combos.push(a),!0};g.prototype.register_many=function(a){var c,b,d,e;e=[];b=0;for(d=a.length;b<d;b++)c=a[b],e.push(this.register_combo(c));return e};g.prototype.unregister_combo=function(a){var c,b,d,e,f;if(!a)return!1;var g=this;b=function(a){var b,c,d,e;e=[];b=c=0;for(d=g._registered_combos.length;0<=d?c<d:c>d;b=0<=d?++c:--c)if(a===g._registered_combos[b]){g._registered_combos.splice(b,1);break}else e.push(void 0);return e};
if(a.keys)return b(a);f=this._registered_combos;d=0;for(e=f.length;d<e;d++)c=f[d];"string"===typeof a&&(a=a.split(" "));if(c.is_unordered&&u(a,c.keys)||!c.is_unordered&&w(a,c.keys))return b(c)};g.prototype.unregister_many=function(a){var c,b,d,e;e=[];b=0;for(d=a.length;b<d;b++)c=a[b],e.push(this.unregister_combo(c));return e};g.prototype.get_registered_combos=function(){return this._registered_combos};g.prototype.reset=function(){return this._registered_combos=[]};g.prototype.listen=function(){return this._prevent_capture=
!1};g.prototype.stop_listening=function(){return this._prevent_capture=!0};g.prototype.get_meta_key=function(){return k};H.Listener=g;x=function(a){return q[a]};v=function(a,c){var b;if(a.filter)return a.filter(c);var d,e,f;f=[];d=0;for(e=a.length;d<e;d++)b=a[d],c(b)&&f.push(b);return f};u=function(a,c){var b,d,e;if(a.length!==c.length)return!1;d=0;for(e=a.length;d<e;d++)if(b=a[d],!(0<=i.call(c,b)))return!1;return!0};w=function(a,c){var b,d,e;if(a.length!==c.length)return!1;b=d=0;for(e=a.length;0<=
e?d<e:d>e;b=0<=e?++d:--d)if(a[b]!==c[b])return!1;return!0};C=function(a,c){var b,d,e;d=0;for(e=a.length;d<e;d++)if(b=a[d],0>i.call(c,b))return!1;return!0};D=function(a,c){var b,d,e,f;e=d=0;for(f=a.length;e<f;e++)if(b=a[e],b=c.indexOf(b),b>=d)d=b;else return!1;return!0};o=function(){if(keypress.debug)return console.log.apply(console,arguments)};E=function(a){var c,b,d;c=!1;for(d in q)if(b=q[d],a===b){c=!0;break}if(!c)for(d in r)if(b=r[d],a===b){c=!0;break}return c};G=function(a){var c,b,d,e,f,g,j;
f=!0;a.keys.length||o("You're trying to bind a combo with no keys:",a);b=g=0;for(j=a.keys.length;0<=j?g<j:g>j;b=0<=j?++g:--g)d=a.keys[b],(c=F[d])&&(d=a.keys[b]=c),"meta"===d&&a.keys.splice(b,1,k),"cmd"===d&&o('Warning: use the "meta" key rather than "cmd" for Windows compatibility');j=a.keys;c=0;for(g=j.length;c<g;c++)d=j[c],E(d)||(o('Do not recognize the key "'+d+'"'),f=!1);if(0<=i.call(a.keys,"meta")||0<=i.call(a.keys,"cmd")){c=a.keys.slice();g=0;for(j=z.length;g<j;g++)d=z[g],-1<(b=c.indexOf(d))&&
c.splice(b,1);1<c.length&&(o("META and CMD key combos cannot have more than 1 non-modifier keys",a,c),f=!1)}for(e in a)"undefined"===p[e]&&o("The property "+e+" is not a valid combo property. Your combo has still been registered.");return f};y=function(a,c){var b;if(!c.shiftKey)return!1;b=r[a];return null!=b?b:!1};s={cmd:"metaKey",ctrl:"ctrlKey",shift:"shiftKey",alt:"altKey"};F={escape:"esc",control:"ctrl",command:"cmd","break":"pause",windows:"cmd",option:"alt",caps_lock:"caps",apostrophe:"'",semicolon:";",
tilde:"~",accent:"`",scroll_lock:"scroll",num_lock:"num"};r={"/":"?",".":">",",":"<","'":'"',";":":","[":"{","]":"}","\\":"|","`":"~","=":"+","-":"_",1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(","0":")"};q={"0":"\\",8:"backspace",9:"tab",12:"num",13:"enter",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"caps",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",44:"print",45:"insert",46:"delete",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",
55:"7",56:"8",57:"9",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",91:"cmd",92:"cmd",93:"cmd",96:"num_0",97:"num_1",98:"num_2",99:"num_3",100:"num_4",101:"num_5",102:"num_6",103:"num_7",104:"num_8",105:"num_9",106:"num_multiply",107:"num_add",108:"num_enter",109:"num_subtract",110:"num_decimal",111:"num_divide",124:"print",144:"num",145:"scroll",186:";",187:"=",188:",",
189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",223:"`",224:"cmd",225:"alt",57392:"ctrl",63289:"num"};-1!==navigator.userAgent.indexOf("Mac OS X")&&(k="cmd");-1!==navigator.userAgent.indexOf("Opera")&&(q["17"]="cmd")}).call(this);
;(function() {
  define('ice-helper',[],function() {
    var exports, fontMetrics, fontMetricsCache;
    exports = {};
    exports.ANY_DROP = 0;
    exports.BLOCK_ONLY = 1;
    exports.MOSTLY_BLOCK = 2;
    exports.MOSTLY_VALUE = 3;
    exports.VALUE_ONLY = 4;
    exports.ENCOURAGE_ALL = 0;
    exports.NORMAL = 1;
    exports.DISCOURAGE_ALL = 2;
    exports.FORBID = 3;
    exports.ENCOURAGED = 0;
    exports.DISCOURAGED = 1;
    exports.FORBIDDEN = 2;
    fontMetricsCache = {};
    exports.fontMetrics = fontMetrics = function(fontFamily, fontHeight) {
      var baseline, canvas, capital, ctx, ex, fontStyle, gp, height, lf, metrics, result, textTopAndBottom, width;
      fontStyle = "" + fontHeight + "px " + fontFamily;
      result = fontMetricsCache[fontStyle];
      textTopAndBottom = function(testText) {
        var col, first, index, last, pixels, right, row, _i, _j;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'white';
        ctx.fillText(testText, 0, 0);
        right = Math.ceil(ctx.measureText(testText).width);
        pixels = ctx.getImageData(0, 0, width, height).data;
        first = -1;
        last = height;
        for (row = _i = 0; 0 <= height ? _i < height : _i > height; row = 0 <= height ? ++_i : --_i) {
          for (col = _j = 1; 1 <= right ? _j < right : _j > right; col = 1 <= right ? ++_j : --_j) {
            index = (row * width + col) * 4;
            if (pixels[index] !== 0) {
              if (first < 0) {
                first = row;
              }
              break;
            }
          }
          if (first >= 0 && col >= right) {
            last = row;
            break;
          }
        }
        return {
          top: first,
          bottom: last
        };
      };
      if (!result) {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        ctx.font = fontStyle;
        metrics = ctx.measureText('Hg');
        if (canvas.height < fontHeight * 2 || canvas.width < metrics.width) {
          canvas.width = Math.ceil(metrics.width);
          canvas.height = fontHeight * 2;
          ctx = canvas.getContext('2d');
          ctx.font = fontStyle;
        }
        width = canvas.width;
        height = canvas.height;
        capital = textTopAndBottom('H');
        ex = textTopAndBottom('x');
        lf = textTopAndBottom('lf');
        gp = textTopAndBottom('g');
        baseline = capital.bottom;
        result = {
          ascent: lf.top,
          capital: capital.top,
          ex: ex.top,
          baseline: capital.bottom,
          descent: gp.bottom
        };
        result.prettytop = Math.max(0, Math.min(result.ascent, result.ex - (result.descent - result.baseline)));
        fontMetricsCache[fontStyle] = result;
      }
      return result;
    };
    exports.getFontHeight = function(family, size) {
      var metrics;
      metrics = fontMetrics(family, size);
      return metrics.descent - metrics.prettytop;
    };
    return exports;
  });

}).call(this);

/*
//@ sourceMappingURL=helper.js.map
*/;
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('ice-draw',['ice-helper'], function(helper) {
    var Draw, avgColor, exports, max, memoizedAvgColor, min, toHex, toRGB, twoDigitHex, zeroPad, _area, _intersects;
    exports = {};
    _area = function(a, b, c) {
      return (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
    };
    _intersects = function(a, b, c, d) {
      return ((_area(a, b, c) > 0) !== (_area(a, b, d) > 0)) && ((_area(c, d, a) > 0) !== (_area(c, d, b) > 0));
    };
    max = function(a, b) {
      return (a > b ? a : b);
    };
    min = function(a, b) {
      return (b > a ? a : b);
    };
    toRGB = function(hex) {
      var b, c, g, r;
      if (hex.length === 4) {
        hex = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = hex.length; _i < _len; _i++) {
            c = hex[_i];
            _results.push(c + c);
          }
          return _results;
        })()).join('').slice(1);
      }
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    zeroPad = function(str, len) {
      if (str.length < len) {
        return ((function() {
          var _i, _ref, _results;
          _results = [];
          for (_i = _ref = str.length; _ref <= len ? _i < len : _i > len; _ref <= len ? _i++ : _i--) {
            _results.push('0');
          }
          return _results;
        })()).join('') + str;
      } else {
        return str;
      }
    };
    twoDigitHex = function(n) {
      return zeroPad(Math.round(n).toString(16), 2);
    };
    toHex = function(rgb) {
      var k;
      return '#' + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = rgb.length; _i < _len; _i++) {
          k = rgb[_i];
          _results.push(twoDigitHex(k));
        }
        return _results;
      })()).join('');
    };
    memoizedAvgColor = {};
    avgColor = function(a, factor, b) {
      var c, i, k, newRGB;
      c = a + ',' + factor + ',' + b;
      if (c in memoizedAvgColor) {
        return memoizedAvgColor[c];
      }
      a = toRGB(a);
      b = toRGB(b);
      newRGB = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
          k = a[i];
          _results.push(a[i] * factor + b[i] * (1 - factor));
        }
        return _results;
      })();
      return memoizedAvgColor[c] = toHex(newRGB);
    };
    exports.Draw = Draw = (function() {
      function Draw() {
        var NoRectangle, Path, Point, Rectangle, Size, Text, self;
        this.ctx = null;
        this.fontSize = 15;
        this.fontFamily = 'Courier New, monospace';
        this.fontAscent = 2;
        self = this;
        this.Point = Point = (function() {
          function Point(x, y) {
            this.x = x;
            this.y = y;
          }

          Point.prototype.clone = function() {
            return new Point(this.x, this.y);
          };

          Point.prototype.magnitude = function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
          };

          Point.prototype.translate = function(vector) {
            this.x += vector.x;
            return this.y += vector.y;
          };

          Point.prototype.add = function(x, y) {
            this.x += x;
            return this.y += y;
          };

          Point.prototype.copy = function(point) {
            this.x = point.x;
            return this.y = point.y;
          };

          Point.prototype.from = function(point) {
            return new Point(this.x - point.x, this.y - point.y);
          };

          Point.prototype.clear = function() {
            return this.x = this.y = 0;
          };

          Point.prototype.equals = function(point) {
            return point.x === this.x && point.y === this.y;
          };

          return Point;

        })();
        this.Size = Size = (function() {
          function Size(width, height) {
            this.width = width;
            this.height = height;
          }

          Size.prototype.equals = function(size) {
            return this.width === size.width && this.height === size.height;
          };

          Size.copy = function(size) {
            return new Size(size.width, size.height);
          };

          return Size;

        })();
        this.Rectangle = Rectangle = (function() {
          function Rectangle(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
          }

          Rectangle.prototype.contains = function(point) {
            return (this.x != null) && (this.y != null) && !((point.x < this.x) || (point.x > this.x + this.width) || (point.y < this.y) || (point.y > this.y + this.height));
          };

          Rectangle.prototype.identical = function(other) {
            return this.x === other.x && this.y === other.y && this.width === other.width && this.height === other.height;
          };

          Rectangle.prototype.copy = function(rect) {
            this.x = rect.x;
            this.y = rect.y;
            this.width = rect.width;
            return this.height = rect.height;
          };

          Rectangle.prototype.clip = function(ctx) {
            ctx.rect(this.x, this.y, this.width, this.height);
            return ctx.clip();
          };

          Rectangle.prototype.clone = function() {
            var rect;
            rect = new Rectangle(0, 0, 0, 0);
            rect.copy(this);
            return rect;
          };

          Rectangle.prototype.clear = function() {
            this.width = this.height = 0;
            return this.x = this.y = null;
          };

          Rectangle.prototype.bottom = function() {
            return this.y + this.height;
          };

          Rectangle.prototype.right = function() {
            return this.x + this.width;
          };

          Rectangle.prototype.fill = function(ctx, style) {
            ctx.fillStyle = style;
            return ctx.fillRect(this.x, this.y, this.width, this.height);
          };

          Rectangle.prototype.unite = function(rectangle) {
            if (!((this.x != null) && (this.y != null))) {
              return this.copy(rectangle);
            } else if (!((rectangle.x != null) && (rectangle.y != null))) {

            } else {
              this.width = max(this.right(), rectangle.right()) - (this.x = min(this.x, rectangle.x));
              return this.height = max(this.bottom(), rectangle.bottom()) - (this.y = min(this.y, rectangle.y));
            }
          };

          Rectangle.prototype.swallow = function(point) {
            if (!((this.x != null) && (this.y != null))) {
              return this.copy(new Rectangle(point.x, point.y, 0, 0));
            } else {
              this.width = max(this.right(), point.x) - (this.x = min(this.x, point.x));
              return this.height = max(this.bottom(), point.y) - (this.y = min(this.y, point.y));
            }
          };

          Rectangle.prototype.overlap = function(rectangle) {
            return (this.x != null) && (this.y != null) && !((rectangle.right()) < this.x || (rectangle.bottom() < this.y) || (rectangle.x > this.right()) || (rectangle.y > this.bottom()));
          };

          Rectangle.prototype.translate = function(vector) {
            this.x += vector.x;
            return this.y += vector.y;
          };

          Rectangle.prototype.stroke = function(ctx, style) {
            ctx.strokeStyle = style;
            return ctx.strokeRect(this.x, this.y, this.width, this.height);
          };

          Rectangle.prototype.fill = function(ctx, style) {
            ctx.fillStyle = style;
            return ctx.fillRect(this.x, this.y, this.width, this.height);
          };

          Rectangle.prototype.upperLeftCorner = function() {
            return new Point(this.x, this.y);
          };

          Rectangle.prototype.toPath = function() {
            var path, point, _i, _len, _ref;
            path = new Path();
            _ref = [[this.x, this.y], [this.x, this.bottom()], [this.right(), this.bottom()], [this.right(), this.y]];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              point = _ref[_i];
              path.push(new Point(point[0], point[1]));
            }
            return path;
          };

          return Rectangle;

        })();
        this.NoRectangle = NoRectangle = (function(_super) {
          __extends(NoRectangle, _super);

          function NoRectangle() {
            NoRectangle.__super__.constructor.call(this, null, null, 0, 0);
          }

          return NoRectangle;

        })(Rectangle);
        this.Path = Path = (function() {
          function Path() {
            this._points = [];
            this._cachedTranslation = new Point(0, 0);
            this._cacheFlag = false;
            this._bounds = new NoRectangle();
            this.style = {
              'strokeColor': '#000',
              'lineWidth': 1,
              'fillColor': null
            };
          }

          Path.prototype._clearCache = function() {
            var maxX, maxY, minX, minY, point, _i, _len, _ref;
            if (this._cacheFlag) {
              minX = minY = Infinity;
              maxX = maxY = 0;
              _ref = this._points;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                point = _ref[_i];
                minX = min(minX, point.x);
                maxX = max(maxX, point.x);
                minY = min(minY, point.y);
                maxY = max(maxY, point.y);
              }
              this._bounds.x = minX;
              this._bounds.y = minY;
              this._bounds.width = maxX - minX;
              this._bounds.height = maxY - minY;
              return this._cacheFlag = false;
            }
          };

          Path.prototype.push = function(point) {
            this._points.push(point);
            return this._cacheFlag = true;
          };

          Path.prototype.unshift = function(point) {
            this._points.unshift(point);
            return this._cacheFlag = true;
          };

          Path.prototype.contains = function(point) {
            var count, dest, end, last, _i, _len, _ref;
            this._clearCache();
            if (this._points.length === 0) {
              return false;
            }
            if (!this._bounds.contains(point)) {
              return false;
            }
            dest = new Point(this._bounds.x - 10, point.y);
            count = 0;
            last = this._points[this._points.length - 1];
            _ref = this._points;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              end = _ref[_i];
              if (_intersects(last, end, point, dest)) {
                count += 1;
              }
              last = end;
            }
            return count % 2 === 1;
          };

          Path.prototype.intersects = function(rectangle) {
            var end, last, lastSide, rectSides, side, _i, _j, _len, _len1, _ref;
            this._clearCache();
            if (this._points.length === 0) {
              return false;
            }
            if (!rectangle.overlap(this._bounds)) {
              return false;
            } else {
              last = this._points[this._points.length - 1];
              rectSides = [new Point(rectangle.x, rectangle.y), new Point(rectangle.right(), rectangle.y), new Point(rectangle.right(), rectangle.bottom()), new Point(rectangle.x, rectangle.bottom())];
              _ref = this._points;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                end = _ref[_i];
                lastSide = rectSides[rectSides.length - 1];
                for (_j = 0, _len1 = rectSides.length; _j < _len1; _j++) {
                  side = rectSides[_j];
                  if (_intersects(last, end, lastSide, side)) {
                    return true;
                  }
                  lastSide = side;
                }
                last = end;
              }
              if (this.contains(rectSides[0])) {
                return true;
              }
              if (rectangle.contains(this._points[0])) {
                return true;
              }
              return false;
            }
          };

          Path.prototype.bounds = function() {
            this._clearCache();
            return this._bounds;
          };

          Path.prototype.translate = function(vector) {
            this._cachedTranslation.translate(vector);
            return this._cacheFlag = true;
          };

          Path.prototype.draw = function(ctx) {
            var i, point, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
            this._clearCache();
            if (this._points.length === 0) {
              return;
            }
            ctx.strokeStyle = this.style.strokeColor;
            ctx.lineWidth = this.style.lineWidth;
            if (this.style.fillColor != null) {
              ctx.fillStyle = this.style.fillColor;
            }
            ctx.beginPath();
            ctx.moveTo(this._points[0].x, this._points[0].y);
            _ref = this._points;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              point = _ref[_i];
              ctx.lineTo(point.x, point.y);
            }
            ctx.lineTo(this._points[0].x, this._points[0].y);
            if (this._points.length > 1) {
              ctx.lineTo(this._points[1].x, this._points[1].y);
            }
            if (this.style.fillColor != null) {
              ctx.fill();
            }
            ctx.save();
            if (!this.noclip) {
              ctx.clip();
            }
            if (this.bevel) {
              ctx.beginPath();
              ctx.moveTo(this._points[0].x, this._points[0].y);
              _ref1 = this._points.slice(1);
              for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
                point = _ref1[i];
                if ((point.x < this._points[i].x && point.y >= this._points[i].y) || (point.y > this._points[i].y && point.x <= this._points[i].x)) {
                  ctx.lineTo(point.x, point.y);
                } else if (!point.equals(this._points[i])) {
                  ctx.moveTo(point.x, point.y);
                }
              }
              if (!(this._points[0].x > this._points[this._points.length - 1].x || this._points[0].y < this._points[this._points.length - 1].y)) {
                ctx.lineTo(this._points[0].x, this._points[0].y);
              }
              ctx.lineWidth = 4;
              ctx.strokeStyle = avgColor(this.style.fillColor, 0.85, '#000');
              ctx.stroke();
              ctx.lineWidth = 2;
              ctx.strokeStyle = avgColor(this.style.fillColor, 0.7, '#000');
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(this._points[0].x, this._points[0].y);
              _ref2 = this._points.slice(1);
              for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
                point = _ref2[i];
                if ((point.x > this._points[i].x && point.y <= this._points[i].y) || (point.y < this._points[i].y && point.x >= this._points[i].x)) {
                  ctx.lineTo(point.x, point.y);
                } else if (!point.equals(this._points[i])) {
                  ctx.moveTo(point.x, point.y);
                }
              }
              if (this._points[0].x > this._points[this._points.length - 1].x || this._points[0].y < this._points[this._points.length - 1].y) {
                ctx.lineTo(this._points[0].x, this._points[0].y);
              }
              ctx.lineWidth = 4;
              ctx.strokeStyle = avgColor(this.style.fillColor, 0.85, '#FFF');
              ctx.stroke();
              ctx.lineWidth = 2;
              ctx.strokeStyle = avgColor(this.style.fillColor, 0.7, '#FFF');
              ctx.stroke();
            } else {
              ctx.stroke();
            }
            return ctx.restore();
          };

          Path.prototype.clone = function() {
            var clone, el, _i, _len, _ref;
            clone = new Path();
            _ref = this._points;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              el = _ref[_i];
              clone.push(el);
            }
            return clone;
          };

          Path.prototype.drawShadow = function(ctx, offsetX, offsetY, blur) {
            var key, oldValues, point, value, _i, _len, _ref, _results;
            this._clearCache();
            ctx.fillStyle = this.style.fillColor;
            if (this._points.length === 0) {
              return;
            }
            oldValues = {
              shadowColor: ctx.shadowColor,
              shadowBlur: ctx.shadowBlur,
              shadowOffsetY: ctx.shadowOffsetY,
              shadowOffsetX: ctx.shadowOffsetX,
              globalAlpha: ctx.globalAlpha
            };
            ctx.globalAlpha = 0.5;
            ctx.shadowColor = '#000';
            ctx.shadowBlur = blur;
            ctx.shadowOffsetX = offsetX;
            ctx.shadowOffsetY = offsetY;
            ctx.beginPath();
            ctx.moveTo(this._points[0].x, this._points[0].y);
            _ref = this._points;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              point = _ref[_i];
              ctx.lineTo(point.x, point.y);
            }
            ctx.lineTo(this._points[0].x, this._points[0].y);
            ctx.fill();
            _results = [];
            for (key in oldValues) {
              if (!__hasProp.call(oldValues, key)) continue;
              value = oldValues[key];
              _results.push(ctx[key] = value);
            }
            return _results;
          };

          return Path;

        })();
        this.Text = Text = (function() {
          function Text(point, value) {
            this.point = point;
            this.value = value;
            this.wantedFont = self.fontSize + 'px ' + self.fontFamily;
            if (self.ctx.font !== this.wantedFont) {
              self.ctx.font = self.fontSize + 'px ' + self.fontFamily;
            }
            this._bounds = new Rectangle(this.point.x, this.point.y, self.ctx.measureText(this.value).width, self.fontSize);
          }

          Text.prototype.bounds = function() {
            return this._bounds;
          };

          Text.prototype.contains = function(point) {
            return this._bounds.contains(point);
          };

          Text.prototype.translate = function(vector) {
            this.point.translate(vector);
            return this._bounds.translate(vector);
          };

          Text.prototype.setPosition = function(point) {
            return this.translate(point.from(this.point));
          };

          Text.prototype.draw = function(ctx) {
            ctx.textBaseline = 'top';
            ctx.font = self.fontSize + 'px ' + self.fontFamily;
            ctx.fillStyle = '#000';
            return ctx.fillText(this.value, this.point.x, this.point.y - self.fontAscent);
          };

          return Text;

        })();
      }

      Draw.prototype.refreshFontCapital = function() {
        return this.fontAscent = helper.fontMetrics(this.fontFamily, this.fontSize).prettytop;
      };

      Draw.prototype.setCtx = function(ctx) {
        return this.ctx = ctx;
      };

      Draw.prototype.setGlobalFontSize = function(size) {
        this.fontSize = size;
        return this.refreshFontCapital();
      };

      Draw.prototype.setGlobalFontFamily = function(family) {
        this.fontFamily = family;
        return this.refreshFontCapital();
      };

      Draw.prototype.getGlobalFontSize = function() {
        return this.fontSize;
      };

      return Draw;

    })();
    return exports;
  });

}).call(this);

/*
//@ sourceMappingURL=draw.js.map
*/;
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('ice-model',['ice-helper'], function(helper) {
    var Block, BlockEndToken, BlockStartToken, Container, CursorToken, EndToken, FORBID, Indent, IndentEndToken, IndentStartToken, NO, NORMAL, NewlineToken, Segment, SegmentEndToken, SegmentStartToken, Socket, SocketEndToken, SocketStartToken, StartToken, TextToken, Token, YES, exports, traverseOneLevel, _id;
    exports = {};
    YES = function() {
      return true;
    };
    NO = function() {
      return false;
    };
    NORMAL = function() {
      return helper.NORMAL;
    };
    FORBID = function() {
      return helper.FORBID;
    };
    _id = 0;
    Function.prototype.trigger = function(prop, get, set) {
      return Object.defineProperty(this.prototype, prop, {
        get: get,
        set: set
      });
    };
    exports.Container = Container = (function() {
      function Container() {
        if (!((this.start != null) || (this.end != null))) {
          this.start = new StartToken(this);
          this.end = new EndToken(this);
          this.type = 'container';
        }
        this.id = ++_id;
        this.parent = null;
        this.version = 0;
        this.start.append(this.end);
        this.ephemeral = false;
        this.lineMarkStyles = [];
      }

      Container.prototype._cloneEmpty = function() {
        return new Container();
      };

      Container.prototype.hasParent = function(parent) {
        var head;
        head = this;
        while (head !== parent && head !== null) {
          head = head.parent;
        }
        return head === parent;
      };

      Container.prototype.clone = function() {
        var assembler, selfClone,
          _this = this;
        selfClone = this._cloneEmpty();
        assembler = selfClone.start;
        this.traverseOneLevel(function(head, isContainer) {
          var clone;
          if (isContainer) {
            clone = head.clone();
            assembler.append(clone.start);
            return assembler = clone.end;
          } else if (head.type !== 'cursor') {
            return assembler = assembler.append(head.clone());
          }
        });
        assembler.append(selfClone.end);
        selfClone.correctParentTree();
        return selfClone;
      };

      Container.prototype.stringify = function() {
        var head, state, str;
        str = '';
        head = this.start.next;
        state = {
          indent: ''
        };
        while (head !== this.end) {
          str += head.stringify(state);
          head = head.next;
        }
        return str;
      };

      Container.prototype.serialize = function() {
        var head, str;
        str = '';
        head = this.start.next;
        while (head !== this.end) {
          str += head.serialize();
          head = head.next;
        }
        return str;
      };

      Container.prototype.contents = function() {
        var clone;
        clone = this.clone();
        if (clone.start.next === clone.end) {
          return null;
        } else {
          clone.start.next.prev = null;
          clone.end.prev.next = null;
          return clone.start.next;
        }
      };

      Container.prototype.spliceOut = function() {
        var first, last, _ref, _ref1, _ref2, _ref3;
        first = this.start.previousVisibleToken();
        last = this.end.nextVisibleToken();
        while ((first != null ? first.type : void 0) === 'newline' && ((_ref = last != null ? last.type : void 0) === (void 0) || _ref === 'newline' || _ref === 'indentEnd' || _ref === 'segmentEnd') && !(((_ref1 = first.previousVisibleToken()) != null ? _ref1.type : void 0) === 'indentStart' && first.previousVisibleToken().container.end === last)) {
          first = first.previousVisibleToken();
          first.nextVisibleToken().remove();
        }
        while ((last != null ? last.type : void 0) === 'newline' && ((last != null ? (_ref2 = last.nextVisibleToken()) != null ? _ref2.type : void 0 : void 0) === 'newline' || ((_ref3 = first != null ? first.type : void 0) === (void 0) || _ref3 === 'segmentStart'))) {
          last = last.nextVisibleToken();
          last.previousVisibleToken().remove();
        }
        this.notifyChange();
        if (this.start.prev != null) {
          this.start.prev.append(this.end.next);
        } else if (this.end.next != null) {
          this.end.next.prev = null;
        }
        this.start.prev = this.end.next = null;
        return this.start.parent = this.end.parent = this.parent = null;
      };

      Container.prototype.spliceIn = function(token) {
        var head, last, _ref;
        while (token.type === 'cursor') {
          token = token.prev;
        }
        this.ephemeral = false;
        switch (token.type) {
          case 'indentStart':
            head = token.container.end.prev;
            while ((_ref = head.type) === 'cursor' || _ref === 'segmentEnd' || _ref === 'segmentStart') {
              head = head.prev;
            }
            if (head.type === 'newline') {
              token = token.next;
            } else {
              token = token.insert(new NewlineToken());
            }
            break;
          case 'blockEnd':
            token = token.insert(new NewlineToken());
            break;
          case 'segmentStart':
            if (token.nextVisibleToken() !== token.container.end) {
              token.insert(new NewlineToken());
            }
            break;
          case 'socketStart':
            token.append(token.container.end);
        }
        last = token.next;
        token.append(this.start);
        this.start.parent = this.end.parent = this.parent;
        this.end.append(last);
        return this.notifyChange();
      };

      Container.prototype.moveTo = function(token) {
        if ((this.start.prev != null) || (this.end.next != null)) {
          this.spliceOut();
        }
        if (token != null) {
          return this.spliceIn(token);
        }
      };

      Container.prototype.notifyChange = function() {
        var head, _results;
        head = this;
        _results = [];
        while (head != null) {
          head.version++;
          _results.push(head = head.parent);
        }
        return _results;
      };

      Container.prototype.wrap = function(first, last) {
        var _this = this;
        this.parent = this.start.parent = this.end.parent = first.parent;
        first.prev.append(this.start);
        this.start.append(first);
        this.end.append(last.next);
        last.append(this.end);
        traverseOneLevel(first, function(head, isContainer) {
          return head.parent = _this;
        });
        return this.notifyChange();
      };

      Container.prototype.correctParentTree = function() {
        var _this = this;
        return this.traverseOneLevel(function(head, isContainer) {
          head.parent = _this;
          if (isContainer) {
            head.start.parent = head.end.parent = _this;
            return head.correctParentTree();
          }
        });
      };

      Container.prototype.find = function(fn, excludes) {
        var examined, head, _ref;
        if (excludes == null) {
          excludes = [];
        }
        head = this.start;
        while (head !== this.end) {
          examined = head instanceof StartToken ? head.container : head;
          if (__indexOf.call(excludes, examined) >= 0) {
            head = examined.end;
          }
          if (!(head instanceof EndToken || ((_ref = head.type) === 'newline' || _ref === 'cursor'))) {
            if (fn(examined)) {
              return examined;
            }
          }
          head = head.next;
        }
        if (fn(this)) {
          return this;
        }
      };

      Container.prototype.getTokenAtLocation = function(loc) {
        var count, head;
        if (loc == null) {
          return null;
        } else if (loc === 0) {
          return this.start;
        } else {
          head = this.start;
          count = 1;
          while (!(count === loc || head === this.end)) {
            if ((head != null ? head.type : void 0) !== 'cursor') {
              count++;
            }
            head = head.next;
          }
          while ((head != null ? head.type : void 0) === 'cursor') {
            head = head.next;
          }
          return head;
        }
      };

      Container.prototype.getBlockOnLine = function(line) {
        var head, lineCount, stack, _ref;
        head = this.start;
        lineCount = 0;
        stack = [];
        while (!(lineCount === line || (head == null))) {
          switch (head.type) {
            case 'newline':
              lineCount++;
              break;
            case 'blockStart':
              stack.push(head.container);
              break;
            case 'blockEnd':
              stack.pop();
          }
          head = head.next;
        }
        while ((_ref = head != null ? head.type : void 0) === 'newline' || _ref === 'cursor' || _ref === 'segmentStart' || _ref === 'segmentEnd') {
          head = head.next;
        }
        if ((head != null ? head.type : void 0) === 'blockStart') {
          stack.push(head.container);
        }
        return stack[stack.length - 1];
      };

      Container.prototype.traverseOneLevel = function(fn) {
        return traverseOneLevel(this.start.next, fn);
      };

      Container.prototype.isFirstOnLine = function() {
        var _ref, _ref1;
        return this.start.previousVisibleToken() === ((_ref = this.parent) != null ? _ref.start : void 0) || ((_ref1 = this.start.previousVisibleToken()) != null ? _ref1.type : void 0) === 'newline';
      };

      Container.prototype.isLastOnLine = function() {
        var _ref, _ref1, _ref2;
        return this.end.nextVisibleToken() === ((_ref = this.parent) != null ? _ref.end : void 0) || ((_ref1 = (_ref2 = this.end.nextVisibleToken()) != null ? _ref2.type : void 0) === 'newline' || _ref1 === 'indentStart');
      };

      Container.prototype.addLineMark = function(mark) {
        return this.lineMarkStyles.push(mark);
      };

      Container.prototype.removeLineMark = function(tag) {
        var mark;
        return this.lineMarkStyles = (function() {
          var _i, _len, _ref, _results;
          _ref = this.lineMarkStyles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            mark = _ref[_i];
            if (mark.tag !== tag) {
              _results.push(mark);
            }
          }
          return _results;
        }).call(this);
      };

      Container.prototype.clearLineMarks = function() {
        return this.lineMarkStyles = [];
      };

      return Container;

    })();
    exports.Token = Token = (function() {
      function Token() {
        this.id = ++_id;
        this.prev = this.next = this.parent = null;
        this.version = 0;
      }

      Token.prototype.append = function(token) {
        var _this = this;
        this.next = token;
        if (!token) {
          return;
        }
        token.prev = this;
        if (token.parent !== this.parent) {
          traverseOneLevel(token, function(head) {
            return head.parent = _this.parent;
          });
        }
        return token;
      };

      Token.prototype.insert = function(token) {
        if (token instanceof StartToken || token instanceof EndToken) {
          console.warn('"insert"-ing a container can cause problems');
        }
        token.next = this.next;
        token.prev = this;
        this.next.prev = token;
        this.next = token;
        token.parent = this.parent;
        return token;
      };

      Token.prototype.insertBefore = function(token) {
        if (this.prev != null) {
          return this.prev.insert(token);
        } else {
          this.prev = token;
          token.next = this;
          return token.parent = this.parent;
        }
      };

      Token.prototype.remove = function() {
        if (this.prev != null) {
          this.prev.append(this.next);
        } else {
          this.next.prev = null;
        }
        return this.prev = this.next = this.parent = null;
      };

      Token.prototype.isVisible = YES;

      Token.prototype.previousVisibleToken = function() {
        var head;
        head = this.prev;
        while (!((head == null) || head.isVisible())) {
          head = head.prev;
        }
        return head;
      };

      Token.prototype.nextVisibleToken = function() {
        var head;
        head = this.next;
        while (!((head == null) || head.isVisible())) {
          head = head.next;
        }
        return head;
      };

      Token.prototype.notifyChange = function() {
        var head;
        head = this;
        while (head != null) {
          head.version++;
          head = head.parent;
        }
        return null;
      };

      Token.prototype.isFirstOnLine = function() {
        var _ref, _ref1;
        return this.previousVisibleToken() === ((_ref = this.parent) != null ? _ref.start : void 0) || ((_ref1 = this.previousVisibleToken()) != null ? _ref1.type : void 0) === 'newline';
      };

      Token.prototype.isLastOnLine = function() {
        var _ref, _ref1, _ref2;
        return this.nextVisibleToken() === ((_ref = this.parent) != null ? _ref.end : void 0) || ((_ref1 = (_ref2 = this.nextVisibleToken()) != null ? _ref2.type : void 0) === 'newline' || _ref1 === 'indentStart');
      };

      Token.prototype.getSerializedLocation = function() {
        var count, head;
        head = this;
        count = 0;
        while (head !== null) {
          if (head.type !== 'cursor') {
            count++;
          }
          head = head.prev;
        }
        return count;
      };

      Token.prototype.stringify = function() {
        return '';
      };

      Token.prototype.serialize = function() {
        return '';
      };

      return Token;

    })();
    exports.StartToken = StartToken = (function(_super) {
      __extends(StartToken, _super);

      function StartToken(container) {
        this.container = container;
        StartToken.__super__.constructor.apply(this, arguments);
        this.markup = 'begin';
      }

      StartToken.prototype.append = function(token) {
        var _this = this;
        this.next = token;
        if (token == null) {
          return;
        }
        token.prev = this;
        traverseOneLevel(token, function(head) {
          return head.parent = _this.container;
        });
        return token;
      };

      StartToken.prototype.insert = function(token) {
        if (token instanceof StartToken || token instanceof EndToken) {
          console.warn('"insert"-ing a container can cause problems');
        }
        token.next = this.next;
        token.prev = this;
        this.next.prev = token;
        this.next = token;
        token.parent = this.container;
        return token;
      };

      StartToken.prototype.serialize = function() {
        return '<container>';
      };

      return StartToken;

    })(Token);
    exports.EndToken = EndToken = (function(_super) {
      __extends(EndToken, _super);

      function EndToken(container) {
        this.container = container;
        EndToken.__super__.constructor.apply(this, arguments);
        this.markup = 'end';
      }

      EndToken.prototype.append = function(token) {
        var _this = this;
        this.next = token;
        if (token == null) {
          return;
        }
        token.prev = this;
        traverseOneLevel(token, function(head) {
          return head.parent = _this.container.parent;
        });
        return token;
      };

      EndToken.prototype.insert = function(token) {
        if (token instanceof StartToken || token instanceof EndToken) {
          console.warn('"insert"-ing a container can cause problems');
        }
        token.next = this.next;
        token.prev = this;
        this.next.prev = token;
        this.next = token;
        token.parent = this.container.parent;
        return token;
      };

      EndToken.prototype.serialize = function() {
        return '</container>';
      };

      return EndToken;

    })(Token);
    exports.BlockStartToken = BlockStartToken = (function(_super) {
      __extends(BlockStartToken, _super);

      function BlockStartToken(container) {
        this.container = container;
        BlockStartToken.__super__.constructor.apply(this, arguments);
        this.type = 'blockStart';
      }

      BlockStartToken.prototype.serialize = function() {
        return "<block color=\"" + this.container.color + "\" precedence=\"" + this.container.precedence + "\">";
      };

      return BlockStartToken;

    })(StartToken);
    exports.BlockEndToken = BlockEndToken = (function(_super) {
      __extends(BlockEndToken, _super);

      function BlockEndToken(container) {
        this.container = container;
        BlockEndToken.__super__.constructor.apply(this, arguments);
        this.type = 'blockEnd';
      }

      BlockEndToken.prototype.serialize = function() {
        return "</block>";
      };

      return BlockEndToken;

    })(EndToken);
    exports.Block = Block = (function(_super) {
      __extends(Block, _super);

      function Block(precedence, color, socketLevel, classes) {
        this.precedence = precedence != null ? precedence : 0;
        this.color = color != null ? color : '#ddf';
        this.socketLevel = socketLevel != null ? socketLevel : null;
        this.classes = classes != null ? classes : [];
        this.start = new BlockStartToken(this);
        this.end = new BlockEndToken(this);
        this.type = 'block';
        Block.__super__.constructor.apply(this, arguments);
      }

      Block.prototype._cloneEmpty = function() {
        var clone;
        clone = new Block(this.precedence, this.color, this.socketLevel, this.classes);
        clone.currentlyParenWrapped = this.currentlyParenWrapped;
        return clone;
      };

      Block.prototype.checkParenWrap = function() {
        var _ref;
        if (((_ref = this.parent) != null ? _ref.type : void 0) === 'socket' && this.parent.precedence >= this.precedence) {
          if (!this.currentlyParenWrapped) {
            this.start.insert(new TextToken('('));
            this.end.insertBefore(new TextToken(')'));
            return this.currentlyParenWrapped = true;
          }
        } else if (this.currentlyParenWrapped) {
          this.start.next.value = this.start.next.value.slice(1);
          this.end.prev.value = this.end.prev.value.slice(0, -1);
          if (this.start.next.value.length === 0) {
            this.start.next.remove();
          }
          if (this.end.prev.value.length === 0) {
            this.end.prev.remove();
          }
          return this.currentlyParenWrapped = false;
        }
      };

      Block.prototype.spliceOut = function() {
        Block.__super__.spliceOut.apply(this, arguments);
        return this.checkParenWrap();
      };

      Block.prototype.spliceIn = function() {
        Block.__super__.spliceIn.apply(this, arguments);
        return this.checkParenWrap();
      };

      return Block;

    })(Container);
    exports.SocketStartToken = SocketStartToken = (function(_super) {
      __extends(SocketStartToken, _super);

      function SocketStartToken(container) {
        this.container = container;
        SocketStartToken.__super__.constructor.apply(this, arguments);
        this.type = 'socketStart';
      }

      SocketStartToken.prototype.serialize = function() {
        return "<socket precedence=\"" + this.container.precedence + "\">";
      };

      SocketStartToken.prototype.stringify = function() {
        if (this.next === this.container.end || this.next.type === 'text' && this.next.value === '') {
          return '``';
        } else {
          return '';
        }
      };

      return SocketStartToken;

    })(StartToken);
    exports.SocketEndToken = SocketEndToken = (function(_super) {
      __extends(SocketEndToken, _super);

      function SocketEndToken(container) {
        this.container = container;
        SocketEndToken.__super__.constructor.apply(this, arguments);
        this.type = 'socketEnd';
      }

      SocketEndToken.prototype.serialize = function() {
        return "</socket>";
      };

      return SocketEndToken;

    })(EndToken);
    exports.Socket = Socket = (function(_super) {
      __extends(Socket, _super);

      function Socket(precedence, handwritten, accepts) {
        this.precedence = precedence != null ? precedence : 0;
        this.handwritten = handwritten != null ? handwritten : false;
        this.accepts = accepts != null ? accepts : NORMAL;
        this.start = new SocketStartToken(this);
        this.end = new SocketEndToken(this);
        this.type = 'socket';
        Socket.__super__.constructor.apply(this, arguments);
      }

      Socket.prototype._cloneEmpty = function() {
        return new Socket(this.precedence, this.handwritten, this.accepts);
      };

      return Socket;

    })(Container);
    exports.IndentStartToken = IndentStartToken = (function(_super) {
      __extends(IndentStartToken, _super);

      function IndentStartToken(container) {
        this.container = container;
        IndentStartToken.__super__.constructor.apply(this, arguments);
        this.type = 'indentStart';
      }

      IndentStartToken.prototype.stringify = function(state) {
        state.indent += this.container.prefix;
        return '';
      };

      IndentStartToken.prototype.serialize = function() {
        return "<indent depth=\"" + this.container.depth + "\">";
      };

      return IndentStartToken;

    })(StartToken);
    exports.IndentEndToken = IndentEndToken = (function(_super) {
      __extends(IndentEndToken, _super);

      function IndentEndToken(container) {
        this.container = container;
        IndentEndToken.__super__.constructor.apply(this, arguments);
        this.type = 'indentEnd';
      }

      IndentEndToken.prototype.stringify = function(state) {
        state.indent = state.indent.slice(0, -this.container.depth);
        if (this.previousVisibleToken().previousVisibleToken() === this.container.start) {
          return '``';
        } else {
          return '';
        }
      };

      IndentEndToken.prototype.serialize = function() {
        return "</indent>";
      };

      return IndentEndToken;

    })(EndToken);
    exports.Indent = Indent = (function(_super) {
      __extends(Indent, _super);

      function Indent(prefix) {
        this.prefix = prefix != null ? prefix : '';
        this.start = new IndentStartToken(this);
        this.end = new IndentEndToken(this);
        this.type = 'indent';
        this.depth = this.prefix.length;
        Indent.__super__.constructor.apply(this, arguments);
      }

      Indent.prototype._cloneEmpty = function() {
        return new Indent(this.prefix);
      };

      return Indent;

    })(Container);
    exports.SegmentStartToken = SegmentStartToken = (function(_super) {
      __extends(SegmentStartToken, _super);

      function SegmentStartToken(container) {
        this.container = container;
        SegmentStartToken.__super__.constructor.apply(this, arguments);
        this.type = 'segmentStart';
      }

      SegmentStartToken.prototype.isVisible = function() {
        return this.container.isRoot;
      };

      SegmentStartToken.prototype.serialize = function() {
        return "<segment>";
      };

      return SegmentStartToken;

    })(StartToken);
    exports.SegmentEndToken = SegmentEndToken = (function(_super) {
      __extends(SegmentEndToken, _super);

      function SegmentEndToken(container) {
        this.container = container;
        SegmentEndToken.__super__.constructor.apply(this, arguments);
        this.type = 'segmentEnd';
      }

      SegmentEndToken.prototype.isVisible = function() {
        return this.container.isRoot;
      };

      SegmentEndToken.prototype.serialize = function() {
        return "</segment>";
      };

      return SegmentEndToken;

    })(EndToken);
    exports.Segment = Segment = (function(_super) {
      __extends(Segment, _super);

      function Segment(isLassoSegment) {
        this.isLassoSegment = isLassoSegment != null ? isLassoSegment : false;
        this.start = new SegmentStartToken(this);
        this.end = new SegmentEndToken(this);
        this.isRoot = false;
        this.type = 'segment';
        Segment.__super__.constructor.apply(this, arguments);
      }

      Segment.prototype._cloneEmpty = function() {
        return new Segment(this.isLassoSegment);
      };

      Segment.prototype.unwrap = function() {
        var _this = this;
        this.notifyChange();
        this.traverseOneLevel(function(head, isContainer) {
          return head.parent = _this.parent;
        });
        this.start.remove();
        return this.end.remove();
      };

      return Segment;

    })(Container);
    exports.TextToken = TextToken = (function(_super) {
      __extends(TextToken, _super);

      function TextToken(_value) {
        this._value = _value;
        TextToken.__super__.constructor.apply(this, arguments);
        this.type = 'text';
      }

      TextToken.trigger('value', (function() {
        return this._value;
      }), function(value) {
        this._value = value;
        return this.notifyChange();
      });

      TextToken.prototype.stringify = function(state) {
        return this._value;
      };

      TextToken.prototype.serialize = function() {
        return this._value;
      };

      TextToken.prototype.clone = function() {
        return new TextToken(this._value);
      };

      return TextToken;

    })(Token);
    exports.NewlineToken = NewlineToken = (function(_super) {
      __extends(NewlineToken, _super);

      function NewlineToken(specialIndent) {
        this.specialIndent = specialIndent;
        NewlineToken.__super__.constructor.apply(this, arguments);
        this.type = 'newline';
      }

      NewlineToken.prototype.stringify = function(state) {
        var _ref;
        return '\n' + ((_ref = this.specialIndent) != null ? _ref : state.indent);
      };

      NewlineToken.prototype.serialize = function() {
        return '\n';
      };

      NewlineToken.prototype.clone = function() {
        return new NewlineToken(this.specialIndent);
      };

      return NewlineToken;

    })(Token);
    exports.CursorToken = CursorToken = (function(_super) {
      __extends(CursorToken, _super);

      function CursorToken() {
        CursorToken.__super__.constructor.apply(this, arguments);
        this.type = 'cursor';
      }

      CursorToken.prototype.isVisible = NO;

      CursorToken.prototype.serialize = function() {
        return '<cursor/>';
      };

      CursorToken.prototype.clone = function() {
        return new CursorToken();
      };

      return CursorToken;

    })(Token);
    traverseOneLevel = function(head, fn) {
      var _results;
      _results = [];
      while (true) {
        if (head instanceof EndToken || (head == null)) {
          break;
        } else if (head instanceof StartToken) {
          fn(head.container, true);
          head = head.container.end;
        } else {
          fn(head, false);
        }
        _results.push(head = head.next);
      }
      return _results;
    };
    return exports;
  });

}).call(this);

/*
//@ sourceMappingURL=model.js.map
*/;
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('ice-view',['ice-helper', 'ice-draw', 'ice-model'], function(helper, draw, model) {
    var ANY_DROP, BLOCK_ONLY, DEFAULT_OPTIONS, MOSTLY_BLOCK, MOSTLY_VALUE, MULTILINE_END, MULTILINE_END_START, MULTILINE_MIDDLE, MULTILINE_START, NO, NO_MULTILINE, VALUE_ONLY, View, YES, avgColor, defaultStyleObject, exports, toHex, toRGB, twoDigitHex, zeroPad;
    NO_MULTILINE = 0;
    MULTILINE_START = 1;
    MULTILINE_MIDDLE = 2;
    MULTILINE_END = 3;
    MULTILINE_END_START = 4;
    ANY_DROP = helper.ANY_DROP;
    BLOCK_ONLY = helper.BLOCK_ONLY;
    MOSTLY_BLOCK = helper.MOSTLY_BLOCK;
    MOSTLY_VALUE = helper.MOSTLY_VALUE;
    VALUE_ONLY = helper.VALUE_ONLY;
    DEFAULT_OPTIONS = {
      padding: 5,
      indentWidth: 10,
      indentTongueHeight: 10,
      tabOffset: 10,
      tabWidth: 15,
      tabHeight: 5,
      tabSideWidth: 0.125,
      dropAreaHeight: 20,
      indentDropAreaMinWidth: 50,
      minSocketWidth: 10,
      textHeight: 15,
      textPadding: 1,
      emptyLineWidth: 50,
      highlightAreaHeight: 10,
      bevelClip: 3,
      shadowBlur: 5,
      ctx: document.createElement('canvas').getContext('2d'),
      colors: {
        error: '#ff0000',
        "return": '#ecec79',
        control: '#efcf8f',
        value: '#8cec79',
        command: '#8fbfef',
        red: '#f2a6a6',
        orange: '#efcf8f',
        yellow: '#ecec79',
        green: '#8cec79',
        cyan: '#79ecd9',
        blue: '#8fbfef',
        violet: '#bfa6f2',
        magenta: '#f2a6e5'
      }
    };
    YES = function() {
      return true;
    };
    NO = function() {
      return false;
    };
    exports = {};
    defaultStyleObject = function() {
      return {
        selected: 0,
        grayscale: 0
      };
    };
    exports.View = View = (function() {
      var BlockViewNode, ContainerViewNode, CursorViewNode, GenericViewNode, IndentViewNode, SegmentViewNode, SocketViewNode, TextViewNode;

      function View(opts) {
        var option, _ref;
        this.opts = opts != null ? opts : {};
        this.map = {};
        this.draw = (_ref = this.opts.draw) != null ? _ref : new draw.Draw();
        for (option in DEFAULT_OPTIONS) {
          if (!(option in this.opts)) {
            this.opts[option] = DEFAULT_OPTIONS[option];
          }
        }
        this.draw.setCtx(this.opts.ctx);
      }

      View.prototype.clearCache = function() {
        return this.map = {};
      };

      View.prototype.getViewNodeFor = function(model) {
        if (model.id in this.map) {
          return this.map[model.id];
        } else {
          return this.createView(model);
        }
      };

      View.prototype.hasViewNodeFor = function(model) {
        return (model != null) && model.id in this.map;
      };

      View.prototype.createView = function(model) {
        switch (model.type) {
          case 'text':
            return new TextViewNode(model, this);
          case 'block':
            return new BlockViewNode(model, this);
          case 'indent':
            return new IndentViewNode(model, this);
          case 'socket':
            return new SocketViewNode(model, this);
          case 'segment':
            return new SegmentViewNode(model, this);
          case 'cursor':
            return new CursorViewNode(model, this);
        }
      };

      GenericViewNode = (function() {
        function GenericViewNode(model, view) {
          this.model = model;
          this.view = view;
          this.view.map[this.model.id] = this;
          this.lineLength = 0;
          this.children = [];
          this.lineChildren = [];
          this.multilineChildrenData = [];
          this.margins = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          };
          this.topLineSticksToBottom = false;
          this.bottomLineSticksToTop = false;
          this.minDimensions = [];
          this.minDistanceToBase = [];
          this.dimensions = [];
          this.distanceToBase = [];
          this.bevels = {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
          };
          this.bounds = [];
          this.changedBoundingBox = true;
          this.glue = {};
          this.path = new this.view.draw.Path();
          this.dropArea = this.highlightArea = null;
          this.computedVersion = -1;
        }

        GenericViewNode.prototype.serialize = function(line) {
          var child, i, prop, result, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
          result = [];
          _ref = ['lineLength', 'margins', 'topLineSticksToBottom', 'bottomLineSticksToTop', 'changedBoundingBox', 'path', 'highlightArea', 'computedVersion'];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            prop = _ref[_i];
            result.push(prop + ': ' + JSON.stringify(this[prop]));
          }
          _ref1 = this.children;
          for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
            child = _ref1[i];
            result.push(("child " + i + ": {startLine: " + child.startLine + ", ") + ("endLine: " + child.endLine + "}"));
          }
          if (line !== null) {
            _ref2 = ['multilineChildrenData', 'minDimensions', 'minDistanceToBase', 'dimensions', 'distanceToBase', 'bounds', 'glue'];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              prop = _ref2[_k];
              result.push("" + prop + " " + line + ": " + (JSON.stringify(this[prop][line])));
            }
            _ref3 = this.lineChildren[line];
            for (i = _l = 0, _len3 = _ref3.length; _l < _len3; i = ++_l) {
              child = _ref3[i];
              result.push(("line " + line + " child " + i + ": ") + ("{startLine: " + child.startLine + ", ") + ("endLine: " + child.endLine + "}}"));
            }
          }
          return result.join('\n');
        };

        GenericViewNode.prototype.computeChildren = function() {
          return this.lineLength;
        };

        GenericViewNode.prototype.computeMargins = function() {
          var childObj, left, padding, parenttype, right, _i, _len, _ref, _ref1;
          if (this.computedVersion === this.model.version && ((this.model.parent == null) || this.model.parent.version === this.view.getViewNodeFor(this.model.parent).computedVersion)) {
            return this.margins;
          }
          parenttype = (_ref = this.model.parent) != null ? _ref.type : void 0;
          padding = this.view.opts.padding;
          left = this.model.isFirstOnLine() || this.lineLength > 1 ? padding : 0;
          right = this.model.isLastOnLine() || this.lineLength > 1 ? padding : 0;
          if (parenttype === 'block' && this.model.type === 'indent') {
            this.margins = {
              top: 0,
              bottom: this.view.opts.indentTongueHeight,
              firstLeft: 0,
              midLeft: this.view.opts.indentWidth,
              lastLeft: this.view.opts.indentWidth,
              firstRight: 0,
              midRight: 0,
              lastRight: padding
            };
          } else if (this.model.type === 'text' && parenttype === 'socket') {
            this.margins = {
              top: this.view.opts.textPadding,
              bottom: this.view.opts.textPadding,
              firstLeft: this.view.opts.textPadding,
              midLeft: this.view.opts.textPadding,
              lastLeft: this.view.opts.textPadding,
              firstRight: this.view.opts.textPadding,
              midRight: this.view.opts.textPadding,
              lastRight: this.view.opts.textPadding
            };
          } else if (this.model.type === 'text' && parenttype === 'block') {
            this.margins = {
              top: padding,
              bottom: padding,
              firstLeft: left,
              midLeft: left,
              lastLeft: left,
              firstRight: right,
              midRight: right,
              lastRight: right
            };
          } else if (parenttype === 'block') {
            this.margins = {
              top: padding,
              bottom: padding,
              firstLeft: left,
              midLeft: padding,
              lastLeft: padding,
              firstRight: right,
              midRight: 0,
              lastRight: right
            };
          } else {
            this.margins = {
              firstLeft: 0,
              midLeft: 0,
              lastLeft: 0,
              firstRight: 0,
              midRight: 0,
              lastRight: 0,
              top: 0,
              bottom: 0
            };
          }
          this.firstMargins = {
            left: this.margins.firstLeft,
            right: this.margins.firstRight,
            top: this.margins.top,
            bottom: this.lineLength === 1 ? this.margins.bottom : 0
          };
          this.midMargins = {
            left: this.margins.midLeft,
            right: this.margins.midRight,
            top: 0,
            bottom: 0
          };
          this.lastMargins = {
            left: this.margins.lastLeft,
            right: this.margins.lastRight,
            top: this.lineLength === 1 ? this.margins.top : 0,
            bottom: this.margins.bottom
          };
          _ref1 = this.children;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            childObj = _ref1[_i];
            this.view.getViewNodeFor(childObj.child).computeMargins();
          }
          return null;
        };

        GenericViewNode.prototype.getMargins = function(line) {
          if (line === 0) {
            return this.firstMargins;
          } else if (line === this.lineLength - 1) {
            return this.lastMargins;
          } else {
            return this.midMargins;
          }
        };

        GenericViewNode.prototype.computeBevels = function() {
          return this.bevels = {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
          };
        };

        GenericViewNode.prototype.computeMinDimensions = function() {
          var i, _i, _ref;
          if (this.minDimensions.length > this.lineLength) {
            this.minDimensions.length = this.minDistanceToBase.length = this.lineLength;
          } else {
            while (this.minDimensions.length !== this.lineLength) {
              this.minDimensions.push(new this.view.draw.Size(0, 0));
              this.minDistanceToBase.push({
                above: 0,
                below: 0
              });
            }
          }
          for (i = _i = 0, _ref = this.lineLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            this.minDimensions[i].width = this.minDimensions[i].height = 0;
            this.minDistanceToBase[i].above = this.minDistanceToBase[i].below = 0;
          }
          return null;
        };

        GenericViewNode.prototype.computeDimensions = function(startLine, force, root) {
          var changed, childObj, distance, i, line, lineCount, oldDimensions, oldDistanceToBase, parentNode, size, _i, _j, _k, _len, _len1, _ref, _ref1, _ref2;
          if (root == null) {
            root = false;
          }
          if (this.computedVersion === this.model.version && !force) {
            return;
          }
          oldDimensions = this.dimensions;
          oldDistanceToBase = this.distanceToBase;
          this.dimensions = (function() {
            var _i, _ref, _results;
            _results = [];
            for (_i = 0, _ref = this.lineLength; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
              _results.push(new this.view.draw.Size(0, 0));
            }
            return _results;
          }).call(this);
          this.distanceToBase = (function() {
            var _i, _ref, _results;
            _results = [];
            for (_i = 0, _ref = this.lineLength; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
              _results.push({
                above: 0,
                below: 0
              });
            }
            return _results;
          }).call(this);
          _ref = this.minDimensions;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            size = _ref[i];
            this.dimensions[i].width = size.width;
            this.dimensions[i].height = size.height;
            this.distanceToBase[i].above = this.minDistanceToBase[i].above;
            this.distanceToBase[i].below = this.minDistanceToBase[i].below;
          }
          if ((this.model.parent != null) && !root && (this.topLineSticksToBottom || this.bottomLineSticksToTop)) {
            parentNode = this.view.getViewNodeFor(this.model.parent);
            if (this.topLineSticksToBottom) {
              distance = this.distanceToBase[0];
              distance.below = Math.max(distance.below, parentNode.distanceToBase[startLine].below);
              this.dimensions[0] = new this.view.draw.Size(this.dimensions[0].width, distance.below + distance.above);
            }
            if (this.bottomLineSticksToTop) {
              lineCount = this.distanceToBase.length;
              distance = this.distanceToBase[lineCount - 1];
              distance.above = Math.max(distance.above, parentNode.distanceToBase[startLine + lineCount - 1].above);
              this.dimensions[lineCount - 1] = new this.view.draw.Size(this.dimensions[lineCount - 1].width, distance.below + distance.above);
            }
          }
          changed = oldDimensions.length !== this.lineLength;
          if (!changed) {
            for (line = _j = 0, _ref1 = this.lineLength; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; line = 0 <= _ref1 ? ++_j : --_j) {
              if (!oldDimensions[line].equals(this.dimensions[line]) || oldDistanceToBase[line].above !== this.distanceToBase[line].above || oldDistanceToBase[line].below !== this.distanceToBase[line].below) {
                changed = true;
                break;
              }
            }
          }
          this.changedBoundingBox || (this.changedBoundingBox = changed);
          _ref2 = this.children;
          for (_k = 0, _len1 = _ref2.length; _k < _len1; _k++) {
            childObj = _ref2[_k];
            this.view.getViewNodeFor(childObj.child).computeDimensions(childObj.startLine, changed);
          }
          return null;
        };

        GenericViewNode.prototype.computeBoundingBoxX = function(left, line) {
          var _ref, _ref1, _ref2;
          if (this.computedVersion === this.model.version && left === ((_ref = this.bounds[line]) != null ? _ref.x : void 0) && !this.changedBoundingBox || ((_ref1 = this.bounds[line]) != null ? _ref1.x : void 0) === left && ((_ref2 = this.bounds[line]) != null ? _ref2.width : void 0) === this.dimensions[line].width) {
            return this.bounds[line];
          }
          this.changedBoundingBox = true;
          if (this.bounds[line] != null) {
            this.bounds[line].x = left;
            this.bounds[line].width = this.dimensions[line].width;
          } else {
            this.bounds[line] = new this.view.draw.Rectangle(left, 0, this.dimensions[line].width, 0);
          }
          return this.bounds[line];
        };

        GenericViewNode.prototype.computeAllBoundingBoxX = function(left) {
          var line, size, _i, _len, _ref;
          if (left == null) {
            left = 0;
          }
          _ref = this.dimensions;
          for (line = _i = 0, _len = _ref.length; _i < _len; line = ++_i) {
            size = _ref[line];
            this.computeBoundingBoxX(left, line);
          }
          return this.bounds;
        };

        GenericViewNode.prototype.computeGlue = function() {
          return this.glue = {};
        };

        GenericViewNode.prototype.computeBoundingBoxY = function(top, line) {
          var _ref;
          if (this.computedVersion === this.model.version && top === ((_ref = this.bounds[line]) != null ? _ref.y : void 0) && !this.changedBoundingBox || this.bounds[line].y === top && this.bounds[line].height === this.dimensions[line].height) {
            return this.bounds[line];
          }
          this.changedBoundingBox = true;
          this.bounds[line].y = top;
          this.bounds[line].height = this.dimensions[line].height;
          return this.bounds[line];
        };

        GenericViewNode.prototype.computeAllBoundingBoxY = function(top) {
          var line, size, _i, _len, _ref;
          if (top == null) {
            top = 0;
          }
          _ref = this.dimensions;
          for (line = _i = 0, _len = _ref.length; _i < _len; line = ++_i) {
            size = _ref[line];
            this.computeBoundingBoxY(top, line);
            top += size.height;
            if (line in this.glue) {
              top += this.glue[line].height;
            }
          }
          return this.bounds;
        };

        GenericViewNode.prototype.getBounds = function() {
          return this.totalBounds;
        };

        GenericViewNode.prototype.computeOwnPath = function() {
          return this.path = new this.view.draw.Path();
        };

        GenericViewNode.prototype.computePath = function() {
          var bound, child, childObj, maxRight, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
          if (this.computedVersion === this.model.version && !this.changedBoundingBox) {
            return null;
          }
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            childObj = _ref[_i];
            this.view.getViewNodeFor(childObj.child).computePath();
          }
          if (this.changedBoundingBox) {
            this.computeOwnPath();
            this.totalBounds = new this.view.draw.NoRectangle();
            if (this.bounds.length > 0) {
              this.totalBounds.unite(this.bounds[0]);
              this.totalBounds.unite(this.bounds[this.bounds.length - 1]);
            }
            if (this.bounds.length > this.children.length) {
              _ref1 = this.children;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                child = _ref1[_j];
                this.totalBounds.unite(this.view.getViewNodeFor(child.child).totalBounds);
              }
            } else {
              maxRight = this.totalBounds.right();
              _ref2 = this.bounds;
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                bound = _ref2[_k];
                this.totalBounds.x = Math.min(this.totalBounds.x, bound.x);
                maxRight = Math.max(maxRight, bound.x);
              }
              this.totalBounds.width = maxRight - this.totalBounds.x;
            }
            this.totalBounds.unite(this.path.bounds());
          }
          return null;
        };

        GenericViewNode.prototype.computeOwnDropArea = function() {};

        GenericViewNode.prototype.computeDropAreas = function() {
          var childObj, _i, _len, _ref;
          if (this.computedVersion === this.model.version && !this.changedBoundingBox) {
            return null;
          }
          this.computeOwnDropArea();
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            childObj = _ref[_i];
            this.view.getViewNodeFor(childObj.child).computeDropAreas();
          }
          return null;
        };

        GenericViewNode.prototype.computeNewVersionNumber = function() {
          var childObj, _i, _len, _ref;
          if (this.computedVersion === this.model.version && !this.changedBoundingBox) {
            return null;
          }
          this.changedBoundingBox = false;
          this.computedVersion = this.model.version;
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            childObj = _ref[_i];
            this.view.getViewNodeFor(childObj.child).computeNewVersionNumber();
          }
          return null;
        };

        GenericViewNode.prototype.drawSelf = function(ctx, style) {};

        GenericViewNode.prototype.draw = function(ctx, boundingRect, style) {
          var childObj, _i, _len, _ref;
          if (this.totalBounds.overlap(boundingRect)) {
            if (style == null) {
              style = defaultStyleObject();
            }
            if (this.model.ephemeral && this.view.opts.respectEphemeral) {
              style.grayscale++;
            }
            this.drawSelf(ctx, style);
            _ref = this.children;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              childObj = _ref[_i];
              this.view.getViewNodeFor(childObj.child).draw(ctx, boundingRect, style);
            }
            if (this.model.ephemeral && this.view.opts.respectEphemeral) {
              style.grayscale--;
            }
          }
          return null;
        };

        GenericViewNode.prototype.drawShadow = function(ctx) {};

        GenericViewNode.prototype.debugDimensions = function(x, y, line, ctx) {
          var childObj, childView, _i, _len, _ref, _results;
          ctx.fillStyle = '#00F';
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.fillRect(x, y, this.dimensions[line].width, this.dimensions[line].height);
          ctx.strokeRect(x, y, this.dimensions[line].width, this.dimensions[line].height);
          _ref = this.lineChildren[line];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            childObj = _ref[_i];
            childView = this.view.getViewNodeFor(childObj.child);
            x += childView.getMargins(line).left;
            childView.debugDimensions(x, y, line - childObj.startLine, ctx);
            _results.push(x += childView.dimensions[line - childObj.startLine].width + childView.getMargins(line).right);
          }
          return _results;
        };

        GenericViewNode.prototype.debugAllDimensions = function(ctx) {
          var line, size, y, _i, _len, _ref;
          ctx.globalAlpha = 0.1;
          y = 0;
          _ref = this.dimensions;
          for (line = _i = 0, _len = _ref.length; _i < _len; line = ++_i) {
            size = _ref[line];
            this.debugDimensions(0, y, line, ctx);
            y += size.height;
          }
          return ctx.globalAlpha = 1;
        };

        GenericViewNode.prototype.debugAllBoundingBoxes = function(ctx) {
          var bound, childObj, _i, _j, _len, _len1, _ref, _ref1;
          ctx.globalAlpha = 0.1;
          _ref = this.bounds;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            bound = _ref[_i];
            bound.fill(ctx, '#00F');
            bound.stroke(ctx, '#000');
          }
          _ref1 = this.children;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            childObj = _ref1[_j];
            this.view.getViewNodeFor(childObj.child).debugAllBoundingBoxes(ctx);
          }
          return ctx.globalAlpha = 1;
        };

        return GenericViewNode;

      })();

      ContainerViewNode = (function(_super) {
        __extends(ContainerViewNode, _super);

        function ContainerViewNode(model, view) {
          this.model = model;
          this.view = view;
          ContainerViewNode.__super__.constructor.apply(this, arguments);
        }

        ContainerViewNode.prototype.computeChildren = function() {
          var i, line, _base, _i, _ref,
            _this = this;
          if (this.computedVersion === this.model.version) {
            return this.lineLength;
          }
          this.lineLength = 0;
          this.lineChildren = [[]];
          this.children = [];
          this.multilineChildrenData = [];
          this.topLineSticksToBottom = false;
          this.bottomLineSticksToTop = false;
          line = 0;
          this.model.traverseOneLevel(function(head, isContainer) {
            var childLength, childObject, i, view, _base, _base1, _i, _j, _ref, _ref1, _ref2;
            if (head.type === 'newline') {
              line += 1;
              return (_base = _this.lineChildren)[line] != null ? (_base = _this.lineChildren)[line] : _base[line] = [];
            } else {
              view = _this.view.getViewNodeFor(head);
              childLength = view.computeChildren();
              childObject = {
                child: head,
                startLine: line,
                endLine: line + childLength - 1
              };
              _this.children.push(childObject);
              for (i = _i = line, _ref = line + childLength; line <= _ref ? _i < _ref : _i > _ref; i = line <= _ref ? ++_i : --_i) {
                if ((_base1 = _this.lineChildren)[i] == null) {
                  _base1[i] = [];
                }
                if (head.type !== 'cursor') {
                  _this.lineChildren[i].push(childObject);
                }
              }
              if (view.lineLength > 1) {
                if (_this.multilineChildrenData[line] === MULTILINE_END) {
                  _this.multilineChildrenData[line] = MULTILINE_END_START;
                } else {
                  _this.multilineChildrenData[line] = MULTILINE_START;
                }
                for (i = _j = _ref1 = line + 1, _ref2 = line + childLength - 1; _ref1 <= _ref2 ? _j < _ref2 : _j > _ref2; i = _ref1 <= _ref2 ? ++_j : --_j) {
                  _this.multilineChildrenData[i] = MULTILINE_MIDDLE;
                }
                _this.multilineChildrenData[line + childLength - 1] = MULTILINE_END;
              }
              return line += childLength - 1;
            }
          });
          this.lineLength = line + 1;
          if (this.lineLength > 1) {
            this.topLineSticksToBottom = true;
            this.bottomLineSticksToTop = true;
          }
          if (this.bounds.length !== this.lineLength) {
            this.changedBoundingBox = true;
            this.bounds = this.bounds.slice(0, this.lineLength);
          }
          for (i = _i = 0, _ref = this.lineLength; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            if ((_base = this.multilineChildrenData)[i] == null) {
              _base[i] = NO_MULTILINE;
            }
          }
          return this.lineLength;
        };

        ContainerViewNode.prototype.computeBevels = function() {
          var childObj, _i, _len, _ref, _ref1;
          if (this.computedVersion === this.model.version) {
            return null;
          }
          this.bevels = {
            topLeft: false,
            topRight: true,
            bottomLeft: false,
            bottomRight: true
          };
          if ((this.model.parent == null) || (!this.view.hasViewNodeFor(this.model.parent)) || ((_ref = this.model.parent.type) === 'block' || _ref === 'socket')) {
            this.bevels.topLeft = this.bevels.bottomLeft = this.bevels.topRight = this.bevels.bottomRight = true;
          }
          _ref1 = this.children;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            childObj = _ref1[_i];
            this.view.getViewNodeFor(childObj.child).computeBevels();
          }
          return null;
        };

        ContainerViewNode.prototype.computeMinDimensions = function() {
          var bottomMargin, childNode, childObject, desiredLine, line, linesToExtend, margins, minDimension, minDimensions, minDistanceToBase, preIndentLines, size, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
          if (this.computedVersion === this.model.version) {
            return null;
          }
          ContainerViewNode.__super__.computeMinDimensions.apply(this, arguments);
          linesToExtend = [];
          preIndentLines = [];
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            childObject = _ref[_i];
            childNode = this.view.getViewNodeFor(childObject.child);
            childNode.computeMinDimensions();
            minDimensions = childNode.minDimensions;
            minDistanceToBase = childNode.minDistanceToBase;
            for (line = _j = 0, _len1 = minDimensions.length; _j < _len1; line = ++_j) {
              size = minDimensions[line];
              desiredLine = line + childObject.startLine;
              margins = childNode.getMargins(line);
              this.minDimensions[desiredLine].width += size.width + margins.left + margins.right;
              if (childObject.child.type === 'indent' && line === minDimensions.length - 1 && desiredLine < this.lineLength - 1) {
                bottomMargin = 0;
                linesToExtend.push(desiredLine + 1);
              } else if (childObject.child.type === 'indent' && line === 0) {
                preIndentLines.push(desiredLine);
                bottomMargin = margins.bottom;
              } else {
                bottomMargin = margins.bottom;
              }
              this.minDistanceToBase[desiredLine].above = Math.max(this.minDistanceToBase[desiredLine].above, minDistanceToBase[line].above + margins.top);
              this.minDistanceToBase[desiredLine].below = Math.max(this.minDistanceToBase[desiredLine].below, minDistanceToBase[line].below + bottomMargin);
            }
          }
          _ref1 = this.minDimensions;
          for (line = _k = 0, _len2 = _ref1.length; _k < _len2; line = ++_k) {
            minDimension = _ref1[line];
            if (this.lineChildren[line].length === 0) {
              if (this.model.type === 'socket') {
                this.minDistanceToBase[line].above = this.view.opts.textHeight * this.view.opts.textPadding;
                this.minDistanceToBase[line].above = this.view.opts.textPadding;
              } else {
                this.minDistanceToBase[line].above = this.view.opts.textHeight + this.view.opts.padding;
                this.minDistanceToBase[line].below = this.view.opts.padding;
              }
            }
            minDimension.height = this.minDistanceToBase[line].above + this.minDistanceToBase[line].below;
          }
          for (_l = 0, _len3 = linesToExtend.length; _l < _len3; _l++) {
            line = linesToExtend[_l];
            this.minDimensions[line].width = Math.max(this.minDimensions[line].width, this.minDimensions[line - 1].width);
          }
          for (_m = 0, _len4 = preIndentLines.length; _m < _len4; _m++) {
            line = preIndentLines[_m];
            this.minDimensions[line].width = Math.max(this.minDimensions[line].width, this.view.opts.indentWidth + this.view.opts.tabWidth + this.view.opts.tabOffset + this.view.opts.bevelClip);
          }
          return null;
        };

        ContainerViewNode.prototype.computeBoundingBoxX = function(left, line) {
          var childLeft, childLine, childMargins, childView, i, lineChild, _i, _len, _ref, _ref1, _ref2, _ref3;
          if (this.computedVersion === this.model.version && left === ((_ref = this.bounds[line]) != null ? _ref.x : void 0) && !this.changedBoundingBox) {
            return this.bounds[line];
          }
          if (!(((_ref1 = this.bounds[line]) != null ? _ref1.x : void 0) === left && ((_ref2 = this.bounds[line]) != null ? _ref2.width : void 0) === this.dimensions[line].width)) {
            if (this.bounds[line] != null) {
              this.bounds[line].x = left;
              this.bounds[line].width = this.dimensions[line].width;
            } else {
              this.bounds[line] = new this.view.draw.Rectangle(left, 0, this.dimensions[line].width, 0);
            }
            this.changedBoundingBox = true;
          }
          childLeft = left;
          _ref3 = this.lineChildren[line];
          for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
            lineChild = _ref3[i];
            childView = this.view.getViewNodeFor(lineChild.child);
            childLine = line - lineChild.startLine;
            childMargins = childView.getMargins(childLine);
            childLeft += childMargins.left;
            childView.computeBoundingBoxX(childLeft, childLine);
            childLeft += childView.dimensions[childLine].width + childMargins.right;
          }
          return this.bounds[line];
        };

        ContainerViewNode.prototype.computeGlue = function() {
          var box, childLine, childObj, childView, line, lineChild, overlap, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
          if (this.computedVersion === this.model.version && !this.changedBoundingBox) {
            return this.glue;
          }
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            childObj = _ref[_i];
            this.view.getViewNodeFor(childObj.child).computeGlue();
          }
          this.glue = {};
          _ref1 = this.bounds;
          for (line = _j = 0, _len1 = _ref1.length; _j < _len1; line = ++_j) {
            box = _ref1[line];
            if (!(line < this.bounds.length - 1)) {
              continue;
            }
            this.glue[line] = {
              height: 0,
              draw: false
            };
            _ref2 = this.lineChildren[line];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              lineChild = _ref2[_k];
              childView = this.view.getViewNodeFor(lineChild.child);
              childLine = line - lineChild.startLine;
              if (childLine in childView.glue) {
                this.glue[line].height = Math.max(this.glue[line].height, childView.glue[childLine].height);
              }
            }
            if (!(this.multilineChildrenData[line] === MULTILINE_MIDDLE || this.model.type === 'segment')) {
              overlap = Math.min(this.bounds[line].right() - this.bounds[line + 1].x, this.bounds[line + 1].right() - this.bounds[line].x);
              if ((_ref3 = this.multilineChildrenData[line]) === MULTILINE_START || _ref3 === MULTILINE_END_START) {
                overlap = Math.min(overlap, this.bounds[line + 1].x + this.view.opts.indentWidth - this.bounds[line].x);
              }
              if (overlap < this.view.opts.padding && this.model.type !== 'indent') {
                this.glue[line].height += this.view.opts.padding;
                this.glue[line].draw = true;
              }
            }
          }
          return this.glue;
        };

        ContainerViewNode.prototype.computeBoundingBoxY = function(top, line) {
          var above, childAbove, childLine, childView, i, lineChild, _i, _len, _ref, _ref1, _ref2, _ref3;
          if (this.computedVersion === this.model.version && top === ((_ref = this.bounds[line]) != null ? _ref.y : void 0) && !this.changedBoundingBox) {
            return this.bounds[line];
          }
          if (!(((_ref1 = this.bounds[line]) != null ? _ref1.y : void 0) === top && ((_ref2 = this.bounds[line]) != null ? _ref2.height : void 0) === this.dimensions[line].height)) {
            this.bounds[line].y = top;
            this.bounds[line].height = this.dimensions[line].height;
            this.changedBoundingBox = true;
          }
          above = this.distanceToBase[line].above;
          _ref3 = this.lineChildren[line];
          for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
            lineChild = _ref3[i];
            childView = this.view.getViewNodeFor(lineChild.child);
            childLine = line - lineChild.startLine;
            childAbove = childView.distanceToBase[childLine].above;
            childView.computeBoundingBoxY(top + above - childAbove, childLine);
          }
          return this.bounds[line];
        };

        ContainerViewNode.prototype.layout = function(left, top) {
          var changedBoundingBox;
          if (left == null) {
            left = 0;
          }
          if (top == null) {
            top = 0;
          }
          this.computeChildren();
          this.computeMargins();
          this.computeBevels();
          this.computeMinDimensions();
          this.computeDimensions(0, false, true);
          this.computeAllBoundingBoxX(left);
          this.computeGlue();
          this.computeAllBoundingBoxY(top);
          this.computePath();
          this.computeDropAreas();
          changedBoundingBox = this.changedBoundingBox;
          this.computeNewVersionNumber();
          return changedBoundingBox;
        };

        ContainerViewNode.prototype.computeOwnPath = function() {
          var bounds, el, glueTop, innerLeft, innerRight, left, leftmost, line, multilineBounds, multilineChild, multilineNode, multilineView, path, right, rightmost, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
          left = [];
          right = [];
          if (this.shouldAddTab()) {
            this.addTab(left, new this.view.draw.Point(this.bounds[0].x + this.view.opts.tabOffset, this.bounds[0].y));
          }
          _ref = this.bounds;
          for (line = _i = 0, _len = _ref.length; _i < _len; line = ++_i) {
            bounds = _ref[line];
            if (this.multilineChildrenData[line] === NO_MULTILINE) {
              if (this.bevels.topLeft && line === 0) {
                left.push(new this.view.draw.Point(bounds.x + this.view.opts.bevelClip, bounds.y));
                left.push(new this.view.draw.Point(bounds.x, bounds.y + this.view.opts.bevelClip));
              } else {
                left.push(new this.view.draw.Point(bounds.x, bounds.y));
              }
              if (this.bevels.bottomLeft && line === this.lineLength - 1) {
                left.push(new this.view.draw.Point(bounds.x, bounds.bottom() - this.view.opts.bevelClip));
                left.push(new this.view.draw.Point(bounds.x + this.view.opts.bevelClip, bounds.bottom()));
              } else {
                left.push(new this.view.draw.Point(bounds.x, bounds.bottom()));
              }
              if (this.bevels.topRight) {
                right.push(new this.view.draw.Point(bounds.right() - this.view.opts.bevelClip, bounds.y));
                right.push(new this.view.draw.Point(bounds.right(), bounds.y + this.view.opts.bevelClip));
              } else {
                right.push(new this.view.draw.Point(bounds.right(), bounds.y));
              }
              if (this.bevels.bottomRight) {
                right.push(new this.view.draw.Point(bounds.right(), bounds.bottom() - this.view.opts.bevelClip));
                right.push(new this.view.draw.Point(bounds.right() - this.view.opts.bevelClip, bounds.bottom()));
              } else {
                right.push(new this.view.draw.Point(bounds.right(), bounds.bottom()));
              }
            }
            if (this.multilineChildrenData[line] === MULTILINE_START) {
              if (this.bevels.topLeft && line === 0) {
                left.push(new this.view.draw.Point(bounds.x + this.view.opts.bevelClip, bounds.y));
                left.push(new this.view.draw.Point(bounds.x, bounds.y + this.view.opts.bevelClip));
              } else {
                left.push(new this.view.draw.Point(bounds.x, bounds.y));
              }
              if (this.bevels.bottomLeft && line === this.lineLength - 1) {
                left.push(new this.view.draw.Point(bounds.x, bounds.bottom() - this.view.opts.bevelClip));
                left.push(new this.view.draw.Point(bounds.x + this.view.opts.bevelClip, bounds.bottom()));
              } else {
                left.push(new this.view.draw.Point(bounds.x, bounds.bottom()));
              }
              multilineChild = this.lineChildren[line][this.lineChildren[line].length - 1];
              multilineView = this.view.getViewNodeFor(multilineChild.child);
              multilineBounds = multilineView.bounds[line - multilineChild.startLine];
              if (multilineBounds.width === 0) {
                if (this.bevels.topRight) {
                  right.push(new this.view.draw.Point(bounds.right() - this.view.opts.bevelClip, bounds.y));
                  right.push(new this.view.draw.Point(bounds.right(), bounds.y + this.view.opts.bevelClip));
                } else {
                  right.push(new this.view.draw.Point(bounds.right(), bounds.y));
                }
              } else {
                right.push(new this.view.draw.Point(bounds.right(), bounds.y));
                right.push(new this.view.draw.Point(bounds.right(), multilineBounds.y));
                right.push(new this.view.draw.Point(multilineBounds.x + this.view.opts.bevelClip, multilineBounds.y));
                right.push(new this.view.draw.Point(multilineBounds.x, multilineBounds.y + this.view.opts.bevelClip));
                right.push(new this.view.draw.Point(multilineBounds.x, multilineBounds.bottom()));
              }
            }
            if (this.multilineChildrenData[line] === MULTILINE_MIDDLE) {
              multilineChild = this.lineChildren[line][0];
              multilineBounds = this.view.getViewNodeFor(multilineChild.child).bounds[line - multilineChild.startLine];
              left.push(new this.view.draw.Point(bounds.x, bounds.y));
              left.push(new this.view.draw.Point(bounds.x, bounds.bottom()));
              right.push(new this.view.draw.Point(multilineBounds.x, bounds.y));
              right.push(new this.view.draw.Point(multilineBounds.x, bounds.bottom()));
            }
            if ((_ref1 = this.multilineChildrenData[line]) === MULTILINE_END || _ref1 === MULTILINE_END_START) {
              left.push(new this.view.draw.Point(bounds.x, bounds.y));
              left.push(new this.view.draw.Point(bounds.x, bounds.bottom()));
              multilineChild = this.lineChildren[line][0];
              multilineBounds = this.view.getViewNodeFor(multilineChild.child).bounds[line - multilineChild.startLine];
              right.push(new this.view.draw.Point(multilineBounds.x, multilineBounds.y));
              right.push(new this.view.draw.Point(multilineBounds.x, multilineBounds.bottom()));
              if (multilineChild.child.type === 'indent') {
                this.addTabReverse(right, new this.view.draw.Point(multilineBounds.x + this.view.opts.tabOffset, multilineBounds.bottom()));
              }
              right.push(new this.view.draw.Point(multilineBounds.right(), multilineBounds.bottom()));
              if (this.lineChildren[line].length > 1) {
                right.push(new this.view.draw.Point(multilineBounds.right(), multilineBounds.y));
                if (this.multilineChildrenData[line] === MULTILINE_END) {
                  right.push(new this.view.draw.Point(bounds.right(), bounds.y));
                  right.push(new this.view.draw.Point(bounds.right(), bounds.bottom()));
                } else {
                  multilineChild = this.lineChildren[line][this.lineChildren[line].length - 1];
                  multilineView = this.view.getViewNodeFor(multilineChild.child);
                  multilineBounds = multilineView.bounds[line - multilineChild.startLine];
                  right.push(new this.view.draw.Point(bounds.right(), bounds.y));
                  if (multilineBounds.width === 0) {
                    if (this.bevels.topRight) {
                      right.push(new this.view.draw.Point(bounds.right() - this.view.opts.bevelClip, bounds.y));
                      right.push(new this.view.draw.Point(bounds.right(), bounds.y + this.view.opts.bevelClip));
                    } else {
                      right.push(new this.view.draw.Point(bounds.right(), bounds.y));
                    }
                    if (this.bevels.bottomRight && !((_ref2 = this.glue[line]) != null ? _ref2.draw : void 0)) {
                      right.push(new this.view.draw.Point(bounds.right(), bounds.bottom() - this.view.opts.bevelClip));
                      right.push(new this.view.draw.Point(bounds.right() - this.view.opts.bevelClip, bounds.bottom()));
                    } else {
                      right.push(new this.view.draw.Point(bounds.right(), bounds.bottom()));
                    }
                  } else {
                    right.push(new this.view.draw.Point(bounds.right(), multilineBounds.y));
                    right.push(new this.view.draw.Point(multilineBounds.x + this.view.opts.bevelClip, multilineBounds.y));
                    right.push(new this.view.draw.Point(multilineBounds.x, multilineBounds.y + this.view.opts.bevelClip));
                    right.push(new this.view.draw.Point(multilineBounds.x, multilineBounds.bottom()));
                  }
                }
              } else if (line === this.lineLength - 1) {
                right.push(new this.view.draw.Point(bounds.right() - this.view.opts.bevelClip, multilineBounds.bottom()));
                right.push(new this.view.draw.Point(bounds.right(), multilineBounds.bottom() + this.view.opts.bevelClip));
                right.push(new this.view.draw.Point(bounds.right(), bounds.bottom() - this.view.opts.bevelClip));
                right.push(new this.view.draw.Point(bounds.right() - this.view.opts.bevelClip, bounds.bottom()));
              } else {
                right.push(new this.view.draw.Point(bounds.right(), multilineBounds.bottom()));
                right.push(new this.view.draw.Point(bounds.right(), bounds.bottom()));
              }
            }
            if (line in this.glue && this.glue[line].draw) {
              glueTop = this.bounds[line + 1].y - this.glue[line].height;
              leftmost = Math.min(this.bounds[line + 1].x, this.bounds[line].x);
              rightmost = Math.max(this.bounds[line + 1].right(), this.bounds[line].right());
              left.push(new this.view.draw.Point(this.bounds[line].x, glueTop));
              left.push(new this.view.draw.Point(leftmost, glueTop));
              left.push(new this.view.draw.Point(leftmost, glueTop + this.view.opts.padding));
              if (this.multilineChildrenData[line] !== MULTILINE_START) {
                right.push(new this.view.draw.Point(this.bounds[line].right(), glueTop));
                right.push(new this.view.draw.Point(rightmost, glueTop));
                right.push(new this.view.draw.Point(rightmost, glueTop + this.view.opts.padding));
              }
            } else if ((this.bounds[line + 1] != null) && this.multilineChildrenData[line] !== MULTILINE_MIDDLE) {
              innerLeft = Math.max(this.bounds[line + 1].x, this.bounds[line].x);
              innerRight = Math.min(this.bounds[line + 1].right(), this.bounds[line].right());
              left.push(new this.view.draw.Point(innerLeft, this.bounds[line].bottom()));
              left.push(new this.view.draw.Point(innerLeft, this.bounds[line + 1].y));
              if ((_ref3 = this.multilineChildrenData[line]) !== MULTILINE_START && _ref3 !== MULTILINE_END_START) {
                right.push(new this.view.draw.Point(innerRight, this.bounds[line].bottom()));
                right.push(new this.view.draw.Point(innerRight, this.bounds[line + 1].y));
              }
            }
            if ((_ref4 = this.multilineChildrenData[line]) === MULTILINE_START || _ref4 === MULTILINE_END_START) {
              multilineChild = this.lineChildren[line][this.lineChildren[line].length - 1];
              multilineNode = this.view.getViewNodeFor(multilineChild.child);
              multilineBounds = multilineNode.bounds[line - multilineChild.startLine];
              if ((_ref5 = this.glue[line]) != null ? _ref5.draw : void 0) {
                glueTop = this.bounds[line + 1].y - this.glue[line].height + this.view.opts.padding;
              } else {
                glueTop = this.bounds[line].bottom();
              }
              if (multilineChild.child.type === 'indent') {
                right.push(new this.view.draw.Point(this.bounds[line].right(), glueTop - this.view.opts.bevelClip));
                right.push(new this.view.draw.Point(this.bounds[line].right() - this.view.opts.bevelClip, glueTop));
                this.addTab(right, new this.view.draw.Point(this.bounds[line + 1].x + this.view.opts.indentWidth + this.view.opts.tabOffset, this.bounds[line + 1].y), true);
              } else {
                right.push(new this.view.draw.Point(multilineBounds.x, glueTop));
              }
              right.push(new this.view.draw.Point(multilineNode.bounds[line - multilineChild.startLine + 1].x, glueTop));
              right.push(new this.view.draw.Point(multilineNode.bounds[line - multilineChild.startLine + 1].x, this.bounds[line + 1].y));
            }
          }
          if (this.shouldAddTab()) {
            this.addTab(right, new this.view.draw.Point(this.bounds[this.lineLength - 1].x + this.view.opts.tabOffset, this.bounds[this.lineLength - 1].bottom()));
          }
          path = left.reverse().concat(right);
          this.path = new this.view.draw.Path();
          for (_j = 0, _len1 = path.length; _j < _len1; _j++) {
            el = path[_j];
            this.path.push(el);
          }
          return this.path;
        };

        ContainerViewNode.prototype.addTab = function(array, point) {
          array.push(new this.view.draw.Point(point.x + this.view.opts.tabWidth, point.y));
          array.push(new this.view.draw.Point(point.x + this.view.opts.tabWidth * (1 - this.view.opts.tabSideWidth), point.y + this.view.opts.tabHeight));
          array.push(new this.view.draw.Point(point.x + this.view.opts.tabWidth * this.view.opts.tabSideWidth, point.y + this.view.opts.tabHeight));
          array.push(new this.view.draw.Point(point.x, point.y));
          return array.push(point);
        };

        ContainerViewNode.prototype.addTabReverse = function(array, point) {
          array.push(point);
          array.push(new this.view.draw.Point(point.x, point.y));
          array.push(new this.view.draw.Point(point.x + this.view.opts.tabWidth * this.view.opts.tabSideWidth, point.y + this.view.opts.tabHeight));
          array.push(new this.view.draw.Point(point.x + this.view.opts.tabWidth * (1 - this.view.opts.tabSideWidth), point.y + this.view.opts.tabHeight));
          return array.push(new this.view.draw.Point(point.x + this.view.opts.tabWidth, point.y));
        };

        ContainerViewNode.prototype.computeOwnDropArea = function() {
          return this.dropArea = this.highlightArea = null;
        };

        ContainerViewNode.prototype.shouldAddTab = NO;

        ContainerViewNode.prototype.drawSelf = function(ctx, style) {
          var oldFill, oldStroke;
          oldFill = this.path.style.fillColor;
          oldStroke = this.path.style.strokeColor;
          if (style.grayscale > 0) {
            this.path.style.fillColor = avgColor(this.path.style.fillColor, 0.5, '#888');
            this.path.style.strokeColor = avgColor(this.path.style.strokeColor, 0.5, '#888');
          }
          if (style.selected > 0) {
            this.path.style.fillColor = avgColor(this.path.style.fillColor, 0.7, '#00F');
            this.path.style.strokeColor = avgColor(this.path.style.strokeColor, 0.7, '#00F');
          }
          this.path.draw(ctx);
          this.path.style.fillColor = oldFill;
          this.path.style.strokeColor = oldStroke;
          return null;
        };

        ContainerViewNode.prototype.drawShadow = function(ctx, x, y) {
          var childObj, _i, _len, _ref;
          this.path.drawShadow(ctx, x, y, this.view.opts.shadowBlur);
          _ref = this.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            childObj = _ref[_i];
            this.view.getViewNodeFor(childObj.child).drawShadow(ctx, x, y);
          }
          return null;
        };

        return ContainerViewNode;

      })(GenericViewNode);

      BlockViewNode = (function(_super) {
        __extends(BlockViewNode, _super);

        function BlockViewNode() {
          BlockViewNode.__super__.constructor.apply(this, arguments);
        }

        BlockViewNode.prototype.computeMinDimensions = function() {
          var i, size, _i, _len, _ref;
          if (this.computedVersion === this.model.version) {
            return null;
          }
          BlockViewNode.__super__.computeMinDimensions.apply(this, arguments);
          _ref = this.minDimensions;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            size = _ref[i];
            size.width = Math.max(size.width, this.view.opts.tabWidth + this.view.opts.tabOffset);
          }
          return null;
        };

        BlockViewNode.prototype.shouldAddTab = function() {
          var parent, _ref;
          if (this.model.parent != null) {
            parent = this.model.parent;
            while ((parent != null ? parent.type : void 0) === 'segment') {
              parent = parent.parent;
            }
            return (parent != null ? parent.type : void 0) !== 'socket';
          } else {
            return !((_ref = this.model.socketLevel) === MOSTLY_VALUE || _ref === VALUE_ONLY);
          }
        };

        BlockViewNode.prototype.computeOwnPath = function() {
          var _ref;
          BlockViewNode.__super__.computeOwnPath.apply(this, arguments);
          this.path.style.fillColor = (_ref = this.view.opts.colors[this.model.color]) != null ? _ref : '#ffffff';
          this.path.style.strokeColor = '#888';
          this.path.bevel = true;
          return this.path;
        };

        BlockViewNode.prototype.computeOwnDropArea = function() {
          var highlightAreaPoints, lastBounds, point, _i, _len;
          this.dropPoint = new this.view.draw.Point(this.bounds[this.lineLength - 1].x, this.bounds[this.lineLength - 1].bottom());
          this.highlightArea = new this.view.draw.Path();
          highlightAreaPoints = [];
          lastBounds = this.bounds[this.lineLength - 1];
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x, lastBounds.bottom() - this.view.opts.highlightAreaHeight / 2 + this.view.opts.bevelClip));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x + this.view.opts.bevelClip, lastBounds.bottom() - this.view.opts.highlightAreaHeight / 2));
          this.addTabReverse(highlightAreaPoints, new this.view.draw.Point(lastBounds.x + this.view.opts.tabOffset, lastBounds.bottom() - this.view.opts.highlightAreaHeight / 2));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right() - this.view.opts.bevelClip, lastBounds.bottom() - this.view.opts.highlightAreaHeight / 2));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right(), lastBounds.bottom() - this.view.opts.highlightAreaHeight / 2 + this.view.opts.bevelClip));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right(), lastBounds.bottom() + this.view.opts.highlightAreaHeight / 2 - this.view.opts.bevelClip));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right() - this.view.opts.bevelClip, lastBounds.bottom() + this.view.opts.highlightAreaHeight / 2));
          this.addTab(highlightAreaPoints, new this.view.draw.Point(lastBounds.x + this.view.opts.tabOffset, lastBounds.bottom() + this.view.opts.highlightAreaHeight / 2));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x + this.view.opts.bevelClip, lastBounds.bottom() + this.view.opts.highlightAreaHeight / 2));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x, lastBounds.bottom() + this.view.opts.highlightAreaHeight / 2 - this.view.opts.bevelClip));
          for (_i = 0, _len = highlightAreaPoints.length; _i < _len; _i++) {
            point = highlightAreaPoints[_i];
            this.highlightArea.push(point);
          }
          this.highlightArea.style.lineWidth = 1;
          this.highlightArea.style.strokeColor = '#ff0';
          return this.highlightArea.style.fillColor = '#ff0';
        };

        return BlockViewNode;

      })(ContainerViewNode);

      SocketViewNode = (function(_super) {
        __extends(SocketViewNode, _super);

        function SocketViewNode() {
          SocketViewNode.__super__.constructor.apply(this, arguments);
        }

        SocketViewNode.prototype.shouldAddTab = NO;

        SocketViewNode.prototype.computeMinDimensions = function() {
          var dimension, _i, _len, _ref;
          if (this.computedVersion === this.model.version) {
            return null;
          }
          SocketViewNode.__super__.computeMinDimensions.apply(this, arguments);
          this.minDistanceToBase[0].above = Math.max(this.minDistanceToBase[0].above, this.view.opts.textHeight + this.view.opts.textPadding);
          this.minDistanceToBase[0].below = Math.max(this.minDistanceToBase[0].below, this.view.opts.textPadding);
          this.minDimensions[0].height = this.minDistanceToBase[0].above + this.minDistanceToBase[0].below;
          _ref = this.minDimensions;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            dimension = _ref[_i];
            dimension.width = Math.max(dimension.width, this.view.opts.minSocketWidth);
          }
          return null;
        };

        SocketViewNode.prototype.computeGlue = function() {
          var view;
          if (this.computedVersion === this.model.version && !this.changedBoundingBox) {
            return this.glue;
          }
          if (this.model.start.nextVisibleToken().type === 'blockStart') {
            view = this.view.getViewNodeFor(this.model.start.next.container);
            return this.glue = view.computeGlue();
          } else {
            return SocketViewNode.__super__.computeGlue.apply(this, arguments);
          }
        };

        SocketViewNode.prototype.computeOwnPath = function() {
          var view;
          if (this.computedVersion === this.model.version && !this.changedBoundingBox) {
            return this.path;
          }
          if (this.model.start.next.type === 'blockStart') {
            view = this.view.getViewNodeFor(this.model.start.next.container);
            this.path = view.computeOwnPath().clone();
          } else {
            SocketViewNode.__super__.computeOwnPath.apply(this, arguments);
          }
          this.path.style.fillColor = '#FFF';
          this.path.style.strokeColor = '#FFF';
          return this.path;
        };

        SocketViewNode.prototype.computeOwnDropArea = function() {
          if (this.model.start.next.type === 'blockStart') {
            return this.dropArea = this.highlightArea = null;
          } else {
            this.dropPoint = this.bounds[0].upperLeftCorner();
            this.highlightArea = this.path.clone();
            this.highlightArea.noclip = true;
            this.highlightArea.style.strokeColor = '#FF0';
            return this.highlightArea.style.lineWidth = this.view.opts.padding;
          }
        };

        return SocketViewNode;

      })(ContainerViewNode);

      IndentViewNode = (function(_super) {
        __extends(IndentViewNode, _super);

        function IndentViewNode() {
          IndentViewNode.__super__.constructor.apply(this, arguments);
        }

        IndentViewNode.prototype.computeOwnPath = function() {
          return this.path = new this.view.draw.Path();
        };

        IndentViewNode.prototype.computeChildren = function() {
          var childRef, childView, _i, _j, _len, _len1, _ref, _ref1;
          IndentViewNode.__super__.computeChildren.apply(this, arguments);
          _ref = this.lineChildren[0];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            childRef = _ref[_i];
            childView = this.view.getViewNodeFor(childRef.child);
            childView.topLineSticksToBottom = true;
          }
          _ref1 = this.lineChildren[this.lineChildren.length - 1];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            childRef = _ref1[_j];
            childView = this.view.getViewNodeFor(childRef.child);
            childView.bottomLineSticksToTop = true;
          }
          return this.lineLength;
        };

        IndentViewNode.prototype.computeMinDimensions = function() {
          var line, size, _i, _len, _ref, _results;
          IndentViewNode.__super__.computeMinDimensions.apply(this, arguments);
          _ref = this.minDimensions.slice(1);
          _results = [];
          for (line = _i = 0, _len = _ref.length; _i < _len; line = ++_i) {
            size = _ref[line];
            if (size.width === 0) {
              _results.push(size.width = this.view.opts.emptyLineWidth);
            }
          }
          return _results;
        };

        IndentViewNode.prototype.drawSelf = function() {
          return null;
        };

        IndentViewNode.prototype.computeOwnDropArea = function() {
          var highlightAreaPoints, lastBounds, point, _i, _len;
          this.dropPoint = this.bounds[1].upperLeftCorner();
          this.highlightArea = new this.view.draw.Path();
          highlightAreaPoints = [];
          lastBounds = new this.view.draw.NoRectangle();
          lastBounds.copy(this.bounds[1]);
          lastBounds.width = Math.max(lastBounds.width, this.view.opts.indentDropAreaMinWidth);
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x, lastBounds.y - this.view.opts.highlightAreaHeight / 2 + this.view.opts.bevelClip));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x + this.view.opts.bevelClip, lastBounds.y - this.view.opts.highlightAreaHeight / 2));
          this.addTabReverse(highlightAreaPoints, new this.view.draw.Point(lastBounds.x + this.view.opts.tabOffset, lastBounds.y - this.view.opts.highlightAreaHeight / 2));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right() - this.view.opts.bevelClip, lastBounds.y - this.view.opts.highlightAreaHeight / 2));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right(), lastBounds.y - this.view.opts.highlightAreaHeight / 2 + this.view.opts.bevelClip));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right(), lastBounds.y + this.view.opts.highlightAreaHeight / 2 - this.view.opts.bevelClip));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right() - this.view.opts.bevelClip, lastBounds.y + this.view.opts.highlightAreaHeight / 2));
          this.addTab(highlightAreaPoints, new this.view.draw.Point(lastBounds.x + this.view.opts.tabOffset, lastBounds.y + this.view.opts.highlightAreaHeight / 2));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x + this.view.opts.bevelClip, lastBounds.y + this.view.opts.highlightAreaHeight / 2));
          highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x, lastBounds.y + this.view.opts.highlightAreaHeight / 2 - this.view.opts.bevelClip));
          for (_i = 0, _len = highlightAreaPoints.length; _i < _len; _i++) {
            point = highlightAreaPoints[_i];
            this.highlightArea.push(point);
          }
          this.highlightArea.style.lineWidth = 1;
          this.highlightArea.style.strokeColor = '#ff0';
          return this.highlightArea.style.fillColor = '#ff0';
        };

        return IndentViewNode;

      })(ContainerViewNode);

      SegmentViewNode = (function(_super) {
        __extends(SegmentViewNode, _super);

        function SegmentViewNode() {
          SegmentViewNode.__super__.constructor.apply(this, arguments);
        }

        SegmentViewNode.prototype.computeOwnPath = function() {
          return this.path = new this.view.draw.Path();
        };

        SegmentViewNode.prototype.computeOwnDropArea = function() {
          var highlightAreaPoints, lastBounds, point, _i, _len;
          if (this.model.isLassoSegment) {
            return this.dropArea = null;
          } else {
            this.dropPoint = this.bounds[0].upperLeftCorner();
            this.highlightArea = new this.view.draw.Path();
            highlightAreaPoints = [];
            lastBounds = new this.view.draw.NoRectangle();
            lastBounds.copy(this.bounds[0]);
            lastBounds.width = Math.max(lastBounds.width, this.view.opts.indentDropAreaMinWidth);
            highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x, lastBounds.y - this.view.opts.highlightAreaHeight / 2 + this.view.opts.bevelClip));
            highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x + this.view.opts.bevelClip, lastBounds.y - this.view.opts.highlightAreaHeight / 2));
            this.addTabReverse(highlightAreaPoints, new this.view.draw.Point(lastBounds.x + this.view.opts.tabOffset, lastBounds.y - this.view.opts.highlightAreaHeight / 2));
            highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right() - this.view.opts.bevelClip, lastBounds.y - this.view.opts.highlightAreaHeight / 2));
            highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right(), lastBounds.y - this.view.opts.highlightAreaHeight / 2 + this.view.opts.bevelClip));
            highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right(), lastBounds.y + this.view.opts.highlightAreaHeight / 2 - this.view.opts.bevelClip));
            highlightAreaPoints.push(new this.view.draw.Point(lastBounds.right() - this.view.opts.bevelClip, lastBounds.y + this.view.opts.highlightAreaHeight / 2));
            this.addTab(highlightAreaPoints, new this.view.draw.Point(lastBounds.x + this.view.opts.tabOffset, lastBounds.y + this.view.opts.highlightAreaHeight / 2));
            highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x + this.view.opts.bevelClip, lastBounds.y + this.view.opts.highlightAreaHeight / 2));
            highlightAreaPoints.push(new this.view.draw.Point(lastBounds.x, lastBounds.y + this.view.opts.highlightAreaHeight / 2 - this.view.opts.bevelClip));
            for (_i = 0, _len = highlightAreaPoints.length; _i < _len; _i++) {
              point = highlightAreaPoints[_i];
              this.highlightArea.push(point);
            }
            this.highlightArea.style.fillColor = '#ff0';
            this.highlightArea.style.strokeColor = '#ff0';
            return null;
          }
        };

        SegmentViewNode.prototype.drawSelf = function(ctx, style) {
          return null;
        };

        SegmentViewNode.prototype.draw = function(ctx, boundingRect, style) {
          if (style == null) {
            style = defaultStyleObject();
          }
          if (this.model.isLassoSegment) {
            style.selected++;
          }
          SegmentViewNode.__super__.draw.apply(this, arguments);
          if (this.model.isLassoSegment) {
            return style.selected--;
          }
        };

        return SegmentViewNode;

      })(ContainerViewNode);

      TextViewNode = (function(_super) {
        __extends(TextViewNode, _super);

        function TextViewNode(model, view) {
          this.model = model;
          this.view = view;
          TextViewNode.__super__.constructor.apply(this, arguments);
        }

        TextViewNode.prototype.computeChildren = function() {
          this.multilineChildrenData = [NO_MULTILINE];
          return this.lineLength = 1;
        };

        TextViewNode.prototype.computeMinDimensions = function() {
          var height;
          if (this.computedVersion === this.model.version) {
            return null;
          }
          this.textElement = new this.view.draw.Text(new this.view.draw.Point(0, 0), this.model.value);
          height = this.view.opts.textHeight;
          this.minDimensions[0] = new this.view.draw.Size(this.textElement.bounds().width, height);
          this.minDistanceToBase[0] = {
            above: height,
            below: 0
          };
          return null;
        };

        TextViewNode.prototype.computeBoundingBoxX = function(left, line) {
          this.textElement.point.x = left;
          return TextViewNode.__super__.computeBoundingBoxX.apply(this, arguments);
        };

        TextViewNode.prototype.computeBoundingBoxY = function(top, line) {
          this.textElement.point.y = top;
          return TextViewNode.__super__.computeBoundingBoxY.apply(this, arguments);
        };

        TextViewNode.prototype.drawSelf = function(ctx, style) {
          if (!style.noText) {
            this.textElement.draw(ctx);
          }
          return null;
        };

        TextViewNode.prototype.debugDimensions = function(x, y, line, ctx) {
          var oldPoint;
          ctx.globalAlpha = 1;
          oldPoint = this.textElement.point;
          this.textElement.point = new this.view.draw.Point(x, y);
          this.textElement.draw(ctx);
          this.textElement.point = oldPoint;
          return ctx.globalAlpha = 0.1;
        };

        TextViewNode.prototype.debugAllBoundingBoxes = function(ctx) {
          ctx.globalAlpha = 1;
          this.computeOwnPath();
          this.textElement.draw(ctx);
          return ctx.globalAlpha = 0.1;
        };

        return TextViewNode;

      })(GenericViewNode);

      CursorViewNode = (function(_super) {
        __extends(CursorViewNode, _super);

        function CursorViewNode(model, view) {
          this.model = model;
          this.view = view;
          CursorViewNode.__super__.constructor.apply(this, arguments);
        }

        CursorViewNode.prototype.computeChildren = function() {
          this.multilineChildrenData = [0];
          return 1;
        };

        CursorViewNode.prototype.computeBoundingBox = function() {};

        return CursorViewNode;

      })(GenericViewNode);

      return View;

    })();
    toRGB = function(hex) {
      var b, c, g, r;
      if (hex.length === 4) {
        hex = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = hex.length; _i < _len; _i++) {
            c = hex[_i];
            _results.push(c + c);
          }
          return _results;
        })()).join('').slice(1);
      }
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    zeroPad = function(str, len) {
      if (str.length < len) {
        return ((function() {
          var _i, _ref, _results;
          _results = [];
          for (_i = _ref = str.length; _ref <= len ? _i < len : _i > len; _ref <= len ? _i++ : _i--) {
            _results.push('0');
          }
          return _results;
        })()).join('') + str;
      } else {
        return str;
      }
    };
    twoDigitHex = function(n) {
      return zeroPad(Math.round(n).toString(16), 2);
    };
    toHex = function(rgb) {
      var k;
      return '#' + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = rgb.length; _i < _len; _i++) {
          k = rgb[_i];
          _results.push(twoDigitHex(k));
        }
        return _results;
      })()).join('');
    };
    avgColor = function(a, factor, b) {
      var i, k, newRGB;
      a = toRGB(a);
      b = toRGB(b);
      newRGB = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
          k = a[i];
          _results.push(a[i] * factor + b[i] * (1 - factor));
        }
        return _results;
      })();
      return toHex(newRGB);
    };
    return exports;
  });

}).call(this);

/*
//@ sourceMappingURL=view.js.map
*/;
(function() {
  define('ice-parser',['ice-helper', 'ice-model'], function(helper, model) {
    var Parser, YES, applyMarkup, exports, hasSomeTextAfter, parseObj, regenerateMarkup, sortMarkup, stripFlaggedBlocks;
    exports = {};
    YES = function() {
      return true;
    };
    exports.Parser = Parser = (function() {
      function Parser(parseFn) {
        this.parseFn = parseFn;
      }

      Parser.prototype.parse = function(text, opts) {
        var error, marks, markup, segment, _ref;
        _ref = this.parseFn(text), marks = _ref.tokens, text = _ref.text, error = _ref.error;
        if (error && opts.throwError) {
          throw error;
        }
        markup = regenerateMarkup(marks);
        sortMarkup(markup);
        segment = applyMarkup(text, markup, opts);
        stripFlaggedBlocks(segment);
        segment.correctParentTree();
        segment.isRoot = true;
        return segment;
      };

      return Parser;

    })();
    exports.parseObj = parseObj = function(object) {
      var block, button, child, contents, head, segment, socket, subBlock, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (object == null) {
        return null;
      }
      if (typeof object === 'string' || object instanceof String) {
        if (object === '\n') {
          return new model.NewlineToken();
        } else {
          return new model.TextToken(object);
        }
      } else {
        switch (object.type) {
          case 'block':
            block = new model.Block(object.precedence, object.color, (_ref = object.nodeType) != null ? _ref : 'Unknown', object.socketLevel);
            head = block.start;
            _ref1 = object.children;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              child = _ref1[_i];
              subBlock = parseObj(child);
              if ((_ref2 = subBlock.type) === 'text' || _ref2 === 'newline' || _ref2 === 'mutationButton') {
                head = head.append(subBlock);
              } else {
                head.append(subBlock.start);
                head = subBlock.end;
              }
            }
            head.append(block.end);
            return block;
          case 'socket':
            socket = new model.Socket(object.precedence, false, (_ref3 = object.accepts) != null ? _ref3 : YES);
            contents = parseObj(object.contents);
            if (contents instanceof model.Container) {
              contents.spliceIn(socket.start);
            } else {
              socket.start.append(contents);
              contents.append(socket.end);
            }
            return socket;
          case 'indent':
            block = new model.Indent(((function() {
              var _j, _ref4, _results;
              _results = [];
              for (_j = 1, _ref4 = object.depth; 1 <= _ref4 ? _j <= _ref4 : _j >= _ref4; 1 <= _ref4 ? _j++ : _j--) {
                _results.push(' ');
              }
              return _results;
            })()).join(''));
            head = block.start;
            _ref4 = object.children;
            for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
              child = _ref4[_j];
              subBlock = parseObj(child);
              if ((_ref5 = subBlock.type) === 'text' || _ref5 === 'newline') {
                head = head.append(subBlock);
              } else {
                head.append(subBlock.start);
                head = subBlock.end;
              }
            }
            head.append(block.end);
            return block;
          case 'mutationButton':
            segment = new model.Segment();
            button = new model.MutationButtonToken(segment);
            head = segment.start;
            _ref6 = object.expand;
            for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
              child = _ref6[_k];
              if (child === 0) {
                subBlock = new model.MutationButtonToken(segment);
              } else {
                subBlock = parseObj(child);
              }
              if ((_ref7 = subBlock.type) === 'text' || _ref7 === 'newline' || _ref7 === 'mutationButton') {
                head = head.append(subBlock);
              } else {
                head.append(subBlock.start);
                head = subBlock.end;
              }
            }
            head.append(segment.end);
            return button;
        }
      }
    };
    sortMarkup = function(unsortedMarkup) {
      unsortedMarkup.sort(function(a, b) {
        if (a.location.line > b.location.line) {
          return 1;
        }
        if (b.location.line > a.location.line) {
          return -1;
        }
        if (a.location.column > b.location.column) {
          return 1;
        }
        if (b.location.column > a.location.column) {
          return -1;
        }
        if (a.start && !b.start) {
          return 1;
        }
        if (b.start && !a.start) {
          return -1;
        }
        if (a.start && b.start) {
          if (a.depth > b.depth) {
            return 1;
          } else {
            return -1;
          }
        }
        if ((!a.start) && (!b.start)) {
          if (a.depth > b.depth) {
            return -1;
          } else {
            return 1;
          }
        }
      });
      return unsortedMarkup;
    };
    hasSomeTextAfter = function(lines, i) {
      while (i !== lines.length) {
        if (lines[i].length > 0) {
          return true;
        }
        i += 1;
      }
      return false;
    };
    applyMarkup = function(text, sortedMarkup, opts) {
      var block, document, head, i, indentDepth, lastIndex, line, lines, mark, markupOnLines, socket, stack, _i, _j, _k, _len, _len1, _len2, _name, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      markupOnLines = {};
      for (_i = 0, _len = sortedMarkup.length; _i < _len; _i++) {
        mark = sortedMarkup[_i];
        if (markupOnLines[_name = mark.location.line] == null) {
          markupOnLines[_name] = [];
        }
        markupOnLines[mark.location.line].push(mark);
      }
      lines = text.split('\n');
      indentDepth = 0;
      stack = [];
      document = new model.Segment();
      head = document.start;
      for (i = _j = 0, _len1 = lines.length; _j < _len1; i = ++_j) {
        line = lines[i];
        if (!(i in markupOnLines)) {
          if (indentDepth >= line.length || line.slice(0, +indentDepth + 1 || 9e9).trim().length > 0) {
            head.specialIndent = ((function() {
              var _k, _ref, _results;
              _results = [];
              for (_k = 0, _ref = line.length - line.trimLeft().length; 0 <= _ref ? _k < _ref : _k > _ref; 0 <= _ref ? _k++ : _k--) {
                _results.push(' ');
              }
              return _results;
            })()).join('');
            line = line.trimLeft();
          } else {
            line = line.slice(indentDepth);
          }
          if (line.length > 0) {
            if ((opts.wrapAtRoot && stack.length === 0) || ((_ref = stack[stack.length - 1]) != null ? _ref.type : void 0) === 'indent') {
              block = new model.Block(0, 'blank', helper.ANY_DROP);
              socket = new model.Socket();
              socket.handwritten = true;
              head = head.append(block.start);
              head = head.append(socket.start);
              head = head.append(new model.TextToken(line));
              head = head.append(socket.end);
              head = head.append(block.end);
              if (block.stringify().match(/^\s*#.*$/) != null) {
                block.socketLevel = helper.BLOCK_ONLY;
              }
            } else {
              head = head.append(new model.TextToken(line));
            }
          } else if (((_ref1 = (_ref2 = stack[stack.length - 1]) != null ? _ref2.type : void 0) === 'indent' || _ref1 === 'segment' || _ref1 === (void 0)) && hasSomeTextAfter(lines, i)) {
            block = new model.Block(0, 'yellow', helper.BLOCK_ONLY);
            head = head.append(block.start);
            head = head.append(block.end);
          }
          head = head.append(new model.NewlineToken());
        } else {
          lastIndex = indentDepth;
          _ref3 = markupOnLines[i];
          for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
            mark = _ref3[_k];
            if (!(lastIndex >= mark.location.column || lastIndex >= line.length)) {
              if ((opts.wrapAtRoot && stack.length === 0) || ((_ref4 = stack[stack.length - 1]) != null ? _ref4.type : void 0) === 'indent') {
                block = new model.Block(0, 'blank', helper.ANY_DROP);
                socket = new model.Socket();
                socket.handwritten = true;
                head = head.append(block.start);
                head = head.append(socket.start);
                head = head.append(new model.TextToken(line.slice(lastIndex, mark.location.column)));
                head = head.append(socket.end);
                head = head.append(block.end);
                if (block.stringify().match(/^\s*#.*$/) != null) {
                  block.socketLevel = helper.BLOCK_ONLY;
                }
              } else {
                head = head.append(new model.TextToken(line.slice(lastIndex, mark.location.column)));
              }
            }
            switch (mark.token.type) {
              case 'indentStart':
                if ((stack != null ? (_ref5 = stack[stack.length - 1]) != null ? _ref5.type : void 0 : void 0) !== 'block') {
                  throw new Error('Improper parser: indent must be inside block, but is inside ' + (stack != null ? (_ref6 = stack[stack.length - 1]) != null ? _ref6.type : void 0 : void 0));
                }
                stack.push(mark.token.container);
                indentDepth += mark.token.container.depth;
                head = head.append(mark.token);
                break;
              case 'blockStart':
                if (((_ref7 = stack[stack.length - 1]) != null ? _ref7.type : void 0) === 'block') {
                  throw new Error('Improper parser: block cannot nest immediately inside another block.');
                }
                stack.push(mark.token.container);
                head = head.append(mark.token);
                break;
              case 'socketStart':
                if (((_ref8 = stack[stack.length - 1]) != null ? _ref8.type : void 0) !== 'block') {
                  throw new Error('Improper parser: socket must be immediately insode a block.');
                }
                stack.push(mark.token.container);
                head = head.append(mark.token);
                break;
              case 'indentEnd':
                if (mark.token.container !== stack[stack.length - 1]) {
                  throw new Error('Improper parser: indent ended too early.');
                }
                stack.pop();
                indentDepth -= mark.token.container.depth;
                head = head.append(mark.token);
                break;
              case 'blockEnd':
                if (mark.token.container !== stack[stack.length - 1]) {
                  debugger;
                  throw new Error('Improper parser: block ended too early.');
                }
                stack.pop();
                head = head.append(mark.token);
                break;
              case 'socketEnd':
                if (mark.token.container !== stack[stack.length - 1]) {
                  throw new Error('Improper parser: socket ended too early.');
                }
                stack.pop();
                head = head.append(mark.token);
            }
            lastIndex = mark.location.column;
          }
          if (!(lastIndex >= line.length)) {
            head = head.append(new model.TextToken(line.slice(lastIndex, line.length)));
          }
          head = head.append(new model.NewlineToken());
        }
      }
      head = head.prev;
      head.next.remove();
      head = head.append(document.end);
      return document;
    };
    stripFlaggedBlocks = function(segment) {
      var container, head, text, _ref, _results;
      head = segment.start;
      _results = [];
      while (head !== segment.end) {
        if (head instanceof model.StartToken && head.container.flagToRemove) {
          container = head.container;
          head = container.end.next;
          _results.push(container.spliceOut());
        } else if (head instanceof model.StartToken && head.container.flagToStrip) {
          console.log(head.container);
          if ((_ref = head.container.parent) != null) {
            _ref.color = 'error';
          }
          text = head.next;
          text.value = text.value.substring(head.container.flagToStrip.left, text.value.length - head.container.flagToStrip.right);
          _results.push(head = text.next);
        } else {
          _results.push(head = head.next);
        }
      }
      return _results;
    };
    regenerateMarkup = function(markup, newtext) {
      var mark, tags, _i, _len;
      tags = [];
      for (_i = 0, _len = markup.length; _i < _len; _i++) {
        mark = markup[_i];
        tags.push({
          token: mark.container.start,
          location: mark.bounds.start,
          depth: mark.depth,
          start: true
        });
        tags.push({
          token: mark.container.end,
          location: mark.bounds.end,
          depth: mark.depth,
          start: false
        });
      }
      return tags;
    };
    return exports;
  });

}).call(this);

/*
//@ sourceMappingURL=parser.js.map
*/;
/**
 * CoffeeScript Compiler v1.7.1
 * http://coffeescript.org
 *
 * Copyright 2011, Jeremy Ashkenas
 * Released under the MIT License
 */
(function(root){var CoffeeScript=function(){function require(e){return require[e]}return require["./helpers"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,o,s,a;e.starts=function(e,t,n){return t===e.substr(n,t.length)},e.ends=function(e,t,n){var i;return i=t.length,t===e.substr(e.length-i-(n||0),i)},e.repeat=o=function(e,t){var n;for(n="";t>0;)1&t&&(n+=e),t>>>=1,e+=e;return n},e.compact=function(e){var t,n,i,r;for(r=[],n=0,i=e.length;i>n;n++)t=e[n],t&&r.push(t);return r},e.count=function(e,t){var n,i;if(n=i=0,!t.length)return 1/0;for(;i=1+e.indexOf(t,i);)n++;return n},e.merge=function(e,t){return n(n({},e),t)},n=e.extend=function(e,t){var n,i;for(n in t)i=t[n],e[n]=i;return e},e.flatten=i=function(e){var t,n,r,o;for(n=[],r=0,o=e.length;o>r;r++)t=e[r],t instanceof Array?n=n.concat(i(t)):n.push(t);return n},e.del=function(e,t){var n;return n=e[t],delete e[t],n},e.last=r=function(e,t){return e[e.length-(t||0)-1]},e.some=null!=(a=Array.prototype.some)?a:function(e){var t,n,i;for(n=0,i=this.length;i>n;n++)if(t=this[n],e(t))return!0;return!1},e.invertLiterate=function(e){var t,n,i;return i=!0,n=function(){var n,r,o,s;for(o=e.split("\n"),s=[],n=0,r=o.length;r>n;n++)t=o[n],i&&/^([ ]{4}|[ ]{0,3}\t)/.test(t)?s.push(t):(i=/^\s*$/.test(t))?s.push(t):s.push("# "+t);return s}(),n.join("\n")},t=function(e,t){return t?{first_line:e.first_line,first_column:e.first_column,last_line:t.last_line,last_column:t.last_column}:e},e.addLocationDataFn=function(e,n){return function(i){return"object"==typeof i&&i.updateLocationDataIfMissing&&i.updateLocationDataIfMissing(t(e,n)),i}},e.locationDataToString=function(e){var t;return"2"in e&&"first_line"in e[2]?t=e[2]:"first_line"in e&&(t=e),t?""+(t.first_line+1)+":"+(t.first_column+1)+"-"+(""+(t.last_line+1)+":"+(t.last_column+1)):"No location data"},e.baseFileName=function(e,t,n){var i,r;return null==t&&(t=!1),null==n&&(n=!1),r=n?/\\|\//:/\//,i=e.split(r),e=i[i.length-1],t&&e.indexOf(".")>=0?(i=e.split("."),i.pop(),"coffee"===i[i.length-1]&&i.length>1&&i.pop(),i.join(".")):e},e.isCoffee=function(e){return/\.((lit)?coffee|coffee\.md)$/.test(e)},e.isLiterate=function(e){return/\.(litcoffee|coffee\.md)$/.test(e)},e.throwSyntaxError=function(e,t){var n;throw n=new SyntaxError(e),n.location=t,n.toString=s,n.stack=""+n,n},e.updateSyntaxError=function(e,t,n){return e.toString===s&&(e.code||(e.code=t),e.filename||(e.filename=n),e.stack=""+e),e},s=function(){var e,t,n,i,r,s,a,c,h,u,l,p,d;return this.code&&this.location?(p=this.location,a=p.first_line,s=p.first_column,h=p.last_line,c=p.last_column,null==h&&(h=a),null==c&&(c=s),r=this.filename||"[stdin]",e=this.code.split("\n")[a],l=s,i=a===h?c+1:e.length,u=e.slice(0,l).replace(/[^\s]/g," ")+o("^",i-l),"undefined"!=typeof process&&null!==process&&(n=process.stdout.isTTY&&!process.env.NODE_DISABLE_COLORS),(null!=(d=this.colorful)?d:n)&&(t=function(e){return"[1;31m"+e+"[0m"},e=e.slice(0,l)+t(e.slice(l,i))+e.slice(i),u=t(u)),""+r+":"+(a+1)+":"+(s+1)+": error: "+this.message+"\n"+e+"\n"+u):Error.prototype.toString.call(this)},e.nameWhitespaceCharacter=function(e){switch(e){case" ":return"space";case"\n":return"newline";case"\r":return"carriage return";case"	":return"tab";default:return e}}}.call(this),t.exports}(),require["./rewriter"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,o,s,a,c,h,u,l,p,d,f,m,y,b,g,k,v=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},w=[].slice;for(f=function(e,t,n){var i;return i=[e,t],i.generated=!0,n&&(i.origin=n),i},e.Rewriter=function(){function e(){}return e.prototype.rewrite=function(e){return this.tokens=e,this.removeLeadingNewlines(),this.closeOpenCalls(),this.closeOpenIndexes(),this.normalizeLines(),this.tagPostfixConditionals(),this.addImplicitBracesAndParens(),this.addLocationDataToGeneratedTokens(),this.tokens},e.prototype.scanTokens=function(e){var t,n,i;for(i=this.tokens,t=0;n=i[t];)t+=e.call(this,n,t,i);return!0},e.prototype.detectEnd=function(e,t,n){var i,s,a,c,h;for(a=this.tokens,i=0;s=a[e];){if(0===i&&t.call(this,s,e))return n.call(this,s,e);if(!s||0>i)return n.call(this,s,e-1);c=s[0],v.call(o,c)>=0?i+=1:(h=s[0],v.call(r,h)>=0&&(i-=1)),e+=1}return e-1},e.prototype.removeLeadingNewlines=function(){var e,t,n,i,r;for(r=this.tokens,e=n=0,i=r.length;i>n&&(t=r[e][0],"TERMINATOR"===t);e=++n);return e?this.tokens.splice(0,e):void 0},e.prototype.closeOpenCalls=function(){var e,t;return t=function(e,t){var n;return")"===(n=e[0])||"CALL_END"===n||"OUTDENT"===e[0]&&")"===this.tag(t-1)},e=function(e,t){return this.tokens["OUTDENT"===e[0]?t-1:t][0]="CALL_END"},this.scanTokens(function(n,i){return"CALL_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.closeOpenIndexes=function(){var e,t;return t=function(e){var t;return"]"===(t=e[0])||"INDEX_END"===t},e=function(e){return e[0]="INDEX_END"},this.scanTokens(function(n,i){return"INDEX_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.matchTags=function(){var e,t,n,i,r,o,s;for(t=arguments[0],i=arguments.length>=2?w.call(arguments,1):[],e=0,n=r=0,o=i.length;o>=0?o>r:r>o;n=o>=0?++r:--r){for(;"HERECOMMENT"===this.tag(t+n+e);)e+=2;if(null!=i[n]&&("string"==typeof i[n]&&(i[n]=[i[n]]),s=this.tag(t+n+e),0>v.call(i[n],s)))return!1}return!0},e.prototype.looksObjectish=function(e){return this.matchTags(e,"@",null,":")||this.matchTags(e,null,":")},e.prototype.findTagsBackwards=function(e,t){var n,i,s,a,c,h,u;for(n=[];e>=0&&(n.length||(a=this.tag(e),0>v.call(t,a)&&(c=this.tag(e),0>v.call(o,c)||this.tokens[e].generated)&&(h=this.tag(e),0>v.call(l,h))));)i=this.tag(e),v.call(r,i)>=0&&n.push(this.tag(e)),s=this.tag(e),v.call(o,s)>=0&&n.length&&n.pop(),e-=1;return u=this.tag(e),v.call(t,u)>=0},e.prototype.addImplicitBracesAndParens=function(){var e;return e=[],this.scanTokens(function(t,i,u){var p,d,m,y,b,g,k,w,T,C,F,L,N,E,x,D,S,R,A,I,_,$,O,j,M,B,V,P;if($=t[0],F=(L=i>0?u[i-1]:[])[0],T=(u.length-1>i?u[i+1]:[])[0],S=function(){return e[e.length-1]},R=i,m=function(e){return i-R+e},y=function(){var e,t;return null!=(e=S())?null!=(t=e[2])?t.ours:void 0:void 0},b=function(){var e;return y()&&"("===(null!=(e=S())?e[0]:void 0)},k=function(){var e;return y()&&"{"===(null!=(e=S())?e[0]:void 0)},g=function(){var e;return y&&"CONTROL"===(null!=(e=S())?e[0]:void 0)},A=function(t){var n;return n=null!=t?t:i,e.push(["(",n,{ours:!0}]),u.splice(n,0,f("CALL_START","(")),null==t?i+=1:void 0},p=function(){return e.pop(),u.splice(i,0,f("CALL_END",")")),i+=1},I=function(n,r){var o;return null==r&&(r=!0),o=null!=n?n:i,e.push(["{",o,{sameLine:!0,startsLine:r,ours:!0}]),u.splice(o,0,f("{",f(new String("{")),t)),null==n?i+=1:void 0},d=function(n){return n=null!=n?n:i,e.pop(),u.splice(n,0,f("}","}",t)),i+=1},b()&&("IF"===$||"TRY"===$||"FINALLY"===$||"CATCH"===$||"CLASS"===$||"SWITCH"===$))return e.push(["CONTROL",i,{ours:!0}]),m(1);if("INDENT"===$&&y()){if("=>"!==F&&"->"!==F&&"["!==F&&"("!==F&&","!==F&&"{"!==F&&"TRY"!==F&&"ELSE"!==F&&"="!==F)for(;b();)p();return g()&&e.pop(),e.push([$,i]),m(1)}if(v.call(o,$)>=0)return e.push([$,i]),m(1);if(v.call(r,$)>=0){for(;y();)b()?p():k()?d():e.pop();e.pop()}if((v.call(c,$)>=0&&t.spaced&&!t.stringEnd||"?"===$&&i>0&&!u[i-1].spaced)&&(v.call(s,T)>=0||v.call(h,T)>=0&&!(null!=(O=u[i+1])?O.spaced:void 0)&&!(null!=(j=u[i+1])?j.newLine:void 0)))return"?"===$&&($=t[0]="FUNC_EXIST"),A(i+1),m(2);if(v.call(c,$)>=0&&this.matchTags(i+1,"INDENT",null,":")&&!this.findTagsBackwards(i,["CLASS","EXTENDS","IF","CATCH","SWITCH","LEADING_WHEN","FOR","WHILE","UNTIL"]))return A(i+1),e.push(["INDENT",i+2]),m(3);if(":"===$){for(N="@"===this.tag(i-2)?i-2:i-1;"HERECOMMENT"===this.tag(N-2);)N-=2;return this.insideForDeclaration="FOR"===T,_=0===N||(M=this.tag(N-1),v.call(l,M)>=0)||u[N-1].newLine,S()&&(B=S(),D=B[0],x=B[1],("{"===D||"INDENT"===D&&"{"===this.tag(x-1))&&(_||","===this.tag(N-1)||"{"===this.tag(N-1)))?m(1):(I(N,!!_),m(2))}if(k()&&v.call(l,$)>=0&&(S()[2].sameLine=!1),w="OUTDENT"===F||L.newLine,v.call(a,$)>=0||v.call(n,$)>=0&&w)for(;y();)if(V=S(),D=V[0],x=V[1],P=V[2],E=P.sameLine,_=P.startsLine,b()&&","!==F)p();else if(k()&&!this.insideForDeclaration&&E&&"TERMINATOR"!==$&&":"!==F&&d());else{if(!k()||"TERMINATOR"!==$||","===F||_&&this.looksObjectish(i+1))break;d()}if(!(","!==$||this.looksObjectish(i+1)||!k()||this.insideForDeclaration||"TERMINATOR"===T&&this.looksObjectish(i+2)))for(C="OUTDENT"===T?1:0;k();)d(i+C);return m(1)})},e.prototype.addLocationDataToGeneratedTokens=function(){return this.scanTokens(function(e,t,n){var i,r,o,s,a,c;return e[2]?1:e.generated||e.explicit?("{"===e[0]&&(o=null!=(a=n[t+1])?a[2]:void 0)?(r=o.first_line,i=o.first_column):(s=null!=(c=n[t-1])?c[2]:void 0)?(r=s.last_line,i=s.last_column):r=i=0,e[2]={first_line:r,first_column:i,last_line:r,last_column:i},1):1})},e.prototype.normalizeLines=function(){var e,t,r,o,s;return s=r=o=null,t=function(e,t){var r,o,a,c;return";"!==e[1]&&(r=e[0],v.call(p,r)>=0)&&!("TERMINATOR"===e[0]&&(o=this.tag(t+1),v.call(i,o)>=0))&&!("ELSE"===e[0]&&"THEN"!==s)&&!!("CATCH"!==(a=e[0])&&"FINALLY"!==a||"->"!==s&&"=>"!==s)||(c=e[0],v.call(n,c)>=0&&this.tokens[t-1].newLine)},e=function(e,t){return this.tokens.splice(","===this.tag(t-1)?t-1:t,0,o)},this.scanTokens(function(n,a,c){var h,u,l,p,f,m;if(u=n[0],"TERMINATOR"===u){if("ELSE"===this.tag(a+1)&&"OUTDENT"!==this.tag(a-1))return c.splice.apply(c,[a,1].concat(w.call(this.indentation()))),1;if(p=this.tag(a+1),v.call(i,p)>=0)return c.splice(a,1),0}if("CATCH"===u)for(h=l=1;2>=l;h=++l)if("OUTDENT"===(f=this.tag(a+h))||"TERMINATOR"===f||"FINALLY"===f)return c.splice.apply(c,[a+h,0].concat(w.call(this.indentation()))),2+h;return v.call(d,u)>=0&&"INDENT"!==this.tag(a+1)&&("ELSE"!==u||"IF"!==this.tag(a+1))?(s=u,m=this.indentation(c[a]),r=m[0],o=m[1],"THEN"===s&&(r.fromThen=!0),c.splice(a+1,0,r),this.detectEnd(a+2,t,e),"THEN"===u&&c.splice(a,1),1):1})},e.prototype.tagPostfixConditionals=function(){var e,t,n;return n=null,t=function(e,t){var n,i;return i=e[0],n=this.tokens[t-1][0],"TERMINATOR"===i||"INDENT"===i&&0>v.call(d,n)},e=function(e){return"INDENT"!==e[0]||e.generated&&!e.fromThen?n[0]="POST_"+n[0]:void 0},this.scanTokens(function(i,r){return"IF"!==i[0]?1:(n=i,this.detectEnd(r+1,t,e),1)})},e.prototype.indentation=function(e){var t,n;return t=["INDENT",2],n=["OUTDENT",2],e?(t.generated=n.generated=!0,t.origin=n.origin=e):t.explicit=n.explicit=!0,[t,n]},e.prototype.generate=f,e.prototype.tag=function(e){var t;return null!=(t=this.tokens[e])?t[0]:void 0},e}(),t=[["(",")"],["[","]"],["{","}"],["INDENT","OUTDENT"],["CALL_START","CALL_END"],["PARAM_START","PARAM_END"],["INDEX_START","INDEX_END"]],e.INVERSES=u={},o=[],r=[],b=0,g=t.length;g>b;b++)k=t[b],m=k[0],y=k[1],o.push(u[y]=m),r.push(u[m]=y);i=["CATCH","THEN","ELSE","FINALLY"].concat(r),c=["IDENTIFIER","SUPER",")","CALL_END","]","INDEX_END","@","THIS"],s=["IDENTIFIER","NUMBER","STRING","JS","REGEX","NEW","PARAM_START","CLASS","IF","TRY","SWITCH","THIS","BOOL","NULL","UNDEFINED","UNARY","UNARY_MATH","SUPER","THROW","@","->","=>","[","(","{","--","++"],h=["+","-"],a=["POST_IF","FOR","WHILE","UNTIL","WHEN","BY","LOOP","TERMINATOR"],d=["ELSE","->","=>","TRY","FINALLY","THEN"],p=["TERMINATOR","CATCH","FINALLY","ELSE","OUTDENT","LEADING_WHEN"],l=["TERMINATOR","INDENT","OUTDENT"],n=[".","?.","::","?::"]}.call(this),t.exports}(),require["./lexer"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,o,s,a,c,h,u,l,p,d,f,m,y,b,g,k,v,w,T,C,F,L,N,E,x,D,S,R,A,I,_,$,O,j,M,B,V,P,U,H,q,G,W,X,Y,z,K,J,Z,Q,et,tt,nt=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};et=require("./rewriter"),j=et.Rewriter,k=et.INVERSES,tt=require("./helpers"),W=tt.count,Z=tt.starts,G=tt.compact,z=tt.last,J=tt.repeat,X=tt.invertLiterate,K=tt.locationDataToString,Q=tt.throwSyntaxError,e.Lexer=N=function(){function e(){}return e.prototype.tokenize=function(e,t){var n,i,r,o,s;for(null==t&&(t={}),this.literate=t.literate,this.preserveComments=null!=(o=t.preserveComments)?o:!1,this.indent=0,this.baseIndent=0,this.indebt=0,this.outdebt=0,this.indents=[],this.ends=[],this.tokens=[],this.chunkLine=t.line||0,this.chunkColumn=t.column||0,e=this.clean(e),i=0;this.chunk=e.slice(i);)n=this.identifierToken()||this.commentToken()||this.whitespaceToken()||this.lineToken()||this.heredocToken()||this.stringToken()||this.numberToken()||this.regexToken()||this.jsToken()||this.literalToken(),s=this.getLineAndColumnFromChunk(n),this.chunkLine=s[0],this.chunkColumn=s[1],i+=n;return this.closeIndentation(),(r=this.ends.pop())&&this.error("missing "+r),t.rewrite===!1?this.tokens:(new j).rewrite(this.tokens)},e.prototype.clean=function(e){return e.charCodeAt(0)===t&&(e=e.slice(1)),e=e.replace(/\r/g,"").replace(P,""),q.test(e)&&(e="\n"+e,this.chunkLine--),this.literate&&(e=X(e)),e},e.prototype.identifierToken=function(){var e,t,n,i,r,c,h,u,l,p,d,f,m,b;return(h=y.exec(this.chunk))?(c=h[0],i=h[1],e=h[2],r=i.length,u=void 0,"own"===i&&"FOR"===this.tag()?(this.token("OWN",i),i.length):(n=e||(l=z(this.tokens))&&("."===(f=l[0])||"?."===f||"::"===f||"?::"===f||!l.spaced&&"@"===l[0]),p="IDENTIFIER",!n&&(nt.call(T,i)>=0||nt.call(a,i)>=0)&&(p=i.toUpperCase(),"WHEN"===p&&(m=this.tag(),nt.call(C,m)>=0)?p="LEADING_WHEN":"FOR"===p?this.seenFor=!0:"UNLESS"===p?p="IF":nt.call(U,p)>=0?p="UNARY":nt.call($,p)>=0&&("INSTANCEOF"!==p&&this.seenFor?(p="FOR"+p,this.seenFor=!1):(p="RELATION","!"===this.value()&&(u=this.tokens.pop(),i="!"+i)))),nt.call(w,i)>=0&&(n?(p="IDENTIFIER",i=new String(i),i.reserved=!0):nt.call(O,i)>=0&&this.error('reserved word "'+i+'"')),n||(nt.call(o,i)>=0&&(i=s[i]),p=function(){switch(i){case"!":return"UNARY";case"==":case"!=":return"COMPARE";case"&&":case"||":return"LOGIC";case"true":case"false":return"BOOL";case"break":case"continue":return"STATEMENT";default:return p}}()),d=this.token(p,i,0,r),u&&(b=[u[2].first_line,u[2].first_column],d[2].first_line=b[0],d[2].first_column=b[1]),e&&(t=c.lastIndexOf(":"),this.token(":",":",t,e.length)),c.length)):0},e.prototype.numberToken=function(){var e,t,n,i,r;return(n=A.exec(this.chunk))?(i=n[0],/^0[BOX]/.test(i)?this.error("radix prefix '"+i+"' must be lowercase"):/E/.test(i)&&!/^0x/.test(i)?this.error("exponential notation '"+i+"' must be indicated with a lowercase 'e'"):/^0\d*[89]/.test(i)?this.error("decimal literal '"+i+"' must not be prefixed with '0'"):/^0\d+/.test(i)&&this.error("octal literal '"+i+"' must be prefixed with '0o'"),t=i.length,(r=/^0o([0-7]+)/.exec(i))&&(i="0x"+parseInt(r[1],8).toString(16)),(e=/^0b([01]+)/.exec(i))&&(i="0x"+parseInt(e[1],2).toString(16)),this.token("NUMBER",i,0,t),t):0},e.prototype.stringToken=function(){var e,t,n,i,r,o,s,a;switch(o=this.chunk.charAt(0)){case"'":s=(B.exec(this.chunk)||[])[0];break;case'"':s=this.balancedString(this.chunk,'"')}if(!s)return 0;if(e=s.slice(1,-1),a=this.removeNewlines(e),'"'===o&&s.indexOf("#{",1)>0){for(n=r=0,t=e.length;"\n"===e.charAt(r++)&&t>r;)n++;this.interpolateString(a,{strOffset:1+n,lexedLength:s.length})}else this.token("STRING",o+this.escapeLines(a)+o,0,s.length);return(i=/^(?:\\.|[^\\])*\\(?:0[0-7]|[1-7])/.test(s))&&this.error("octal escape sequences "+s+" are not allowed"),s.length},e.prototype.heredocToken=function(){var e,t,n,i,r;return(n=l.exec(this.chunk))?(t=n[0],i=t.charAt(0),e=this.sanitizeHeredoc(n[2],{quote:i,indent:null}),'"'===i&&e.indexOf("#{")>=0?(r="\n"===n[2].charAt(0)?4:3,this.interpolateString(e,{heredoc:!0,strOffset:r,lexedLength:t.length})):this.token("STRING",this.makeString(e,i,!0),0,t.length),t.length):0},e.prototype.commentToken=function(){var e,t,n;return(n=this.chunk.match(c))?(e=n[0],t=n[1],t?this.token("HERECOMMENT",this.sanitizeHeredoc(t,{herecomment:!0,indent:J(" ",this.indent)}),0,e.length):this.preserveComments&&this.token("COMMENT",e,0,e.length),e.length):0},e.prototype.jsToken=function(){var e,t;return"`"===this.chunk.charAt(0)&&(e=v.exec(this.chunk))?(this.token("JS",(t=e[0]).slice(1,-1),0,t.length),t.length):0},e.prototype.regexToken=function(){var e,t,n,i,r,o,s;return"/"!==this.chunk.charAt(0)?0:(t=this.heregexToken())?t:(i=z(this.tokens),i&&(o=i[0],nt.call(i.spaced?S:R,o)>=0)?0:(n=_.exec(this.chunk))?(s=n,n=s[0],r=s[1],e=s[2],"//"===r?0:("/*"===r.slice(0,2)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX",""+r+e,0,n.length),n.length)):0)},e.prototype.heregexToken=function(){var e,t,n,i,r,o,s,a,c,h,u,l,p,d,y,b,g;if(!(r=f.exec(this.chunk)))return 0;if(i=r[0],e=r[1],t=r[2],0>e.indexOf("#{"))return a=this.escapeLines(e.replace(m,"$1$2").replace(/\//g,"\\/"),!0),a.match(/^\*/)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX","/"+(a||"(?:)")+"/"+t,0,i.length),i.length;for(this.token("IDENTIFIER","RegExp",0,0),this.token("CALL_START","(",0,0),u=[],y=this.interpolateString(e,{regex:!0,strOffset:3}),p=0,d=y.length;d>p;p++){if(h=y[p],c=h[0],l=h[1],"TOKENS"===c)u.push.apply(u,l);else if("NEOSTRING"===c){if(!(l=l.replace(m,"$1$2")))continue;l=l.replace(/\\/g,"\\\\"),h[0]="STRING",h[1]=this.makeString(l,'"',!0),u.push(h)}else this.error("Unexpected "+c);s=z(this.tokens),o=["+","+"],o[2]=s[2],u.push(o)}return u.pop(),"STRING"!==(null!=(b=u[0])?b[0]:void 0)&&(this.token("STRING",'""',0,0),this.token("+","+",0,0)),(g=this.tokens).push.apply(g,u),t&&(n=i.lastIndexOf(t),this.token(",",",",n,0),this.token("STRING",'"'+t+'"',n,t.length)),this.token(")",")",i.length-1,0),i.length},e.prototype.lineToken=function(){var e,t,n,i,r;if(!(n=D.exec(this.chunk)))return 0;if(t=n[0],this.seenFor=!1,r=t.length-1-t.lastIndexOf("\n"),i=this.unfinished(),r-this.indebt===this.indent)return i?this.suppressNewlines():this.newlineToken(0),t.length;if(r>this.indent){if(i)return this.indebt=r-this.indent,this.suppressNewlines(),t.length;if(!this.tokens.length)return this.baseIndent=this.indent=r,t.length;e=r-this.indent+this.outdebt,this.token("INDENT",e,t.length-r,r),this.indents.push(e),this.ends.push("OUTDENT"),this.outdebt=this.indebt=0,this.indent=r}else this.baseIndent>r?this.error("missing indentation",t.length):(this.indebt=0,this.outdentToken(this.indent-r,i,t.length));return t.length},e.prototype.outdentToken=function(e,t,n){var i,r,o,s;for(i=this.indent-e;e>0;)o=this.indents[this.indents.length-1],o?o===this.outdebt?(e-=this.outdebt,this.outdebt=0):this.outdebt>o?(this.outdebt-=o,e-=o):(r=this.indents.pop()+this.outdebt,n&&(s=this.chunk[n],nt.call(b,s)>=0)&&(i-=r-e,e=r),this.outdebt=0,this.pair("OUTDENT"),this.token("OUTDENT",e,0,1),e-=r):e=0;for(r&&(this.outdebt-=e);";"===this.value();)this.tokens.pop();return"TERMINATOR"===this.tag()||t||this.token("TERMINATOR","\n",n,0),this.indent=i,this},e.prototype.whitespaceToken=function(){var e,t,n;return(e=q.exec(this.chunk))||(t="\n"===this.chunk.charAt(0))?(n=z(this.tokens),n&&(n[e?"spaced":"newLine"]=!0),e?e[0].length:0):0},e.prototype.newlineToken=function(e){for(;";"===this.value();)this.tokens.pop();return"TERMINATOR"!==this.tag()&&this.token("TERMINATOR","\n",e,0),this},e.prototype.suppressNewlines=function(){return"\\"===this.value()&&this.tokens.pop(),this},e.prototype.literalToken=function(){var e,t,n,o,s,a,c,l;if((e=I.exec(this.chunk))?(o=e[0],r.test(o)&&this.tagParameters()):o=this.chunk.charAt(0),n=o,t=z(this.tokens),"="===o&&t&&(!t[1].reserved&&(s=t[1],nt.call(w,s)>=0)&&this.error('reserved word "'+this.value()+"\" can't be assigned"),"||"===(a=t[1])||"&&"===a))return t[0]="COMPOUND_ASSIGN",t[1]+="=",o.length;if(";"===o)this.seenFor=!1,n="TERMINATOR";else if(nt.call(E,o)>=0)n="MATH";else if(nt.call(h,o)>=0)n="COMPARE";else if(nt.call(u,o)>=0)n="COMPOUND_ASSIGN";else if(nt.call(U,o)>=0)n="UNARY";else if(nt.call(H,o)>=0)n="UNARY_MATH";else if(nt.call(M,o)>=0)n="SHIFT";else if(nt.call(L,o)>=0||"?"===o&&(null!=t?t.spaced:void 0))n="LOGIC";else if(t&&!t.spaced)if("("===o&&(c=t[0],nt.call(i,c)>=0))"?"===t[0]&&(t[0]="FUNC_EXIST"),n="CALL_START";else if("["===o&&(l=t[0],nt.call(g,l)>=0))switch(n="INDEX_START",t[0]){case"?":t[0]="INDEX_SOAK"}switch(o){case"(":case"{":case"[":this.ends.push(k[o]);break;case")":case"}":case"]":this.pair(o)}return this.token(n,o),o.length},e.prototype.sanitizeHeredoc=function(e,t){var n,i,r,o,s;if(r=t.indent,i=t.herecomment){if(p.test(e)&&this.error('block comment cannot contain "*/", starting'),0>e.indexOf("\n"))return e}else for(;o=d.exec(e);)n=o[1],(null===r||(s=n.length)>0&&r.length>s)&&(r=n);return r&&(e=e.replace(RegExp("\\n"+r,"g"),"\n")),i||(e=e.replace(/^\n/,"")),e},e.prototype.tagParameters=function(){var e,t,n,i;if(")"!==this.tag())return this;for(t=[],i=this.tokens,e=i.length,i[--e][0]="PARAM_END";n=i[--e];)switch(n[0]){case")":t.push(n);break;case"(":case"CALL_START":if(!t.length)return"("===n[0]?(n[0]="PARAM_START",this):this;t.pop()}return this},e.prototype.closeIndentation=function(){return this.outdentToken(this.indent)},e.prototype.balancedString=function(e,t){var n,i,r,o,s,a,c,h;for(n=0,a=[t],i=c=1,h=e.length;h>=1?h>c:c>h;i=h>=1?++c:--c)if(n)--n;else{switch(r=e.charAt(i)){case"\\":++n;continue;case t:if(a.pop(),!a.length)return e.slice(0,+i+1||9e9);t=a[a.length-1];continue}"}"!==t||'"'!==r&&"'"!==r?"}"===t&&"/"===r&&(o=f.exec(e.slice(i))||_.exec(e.slice(i)))?n+=o[0].length-1:"}"===t&&"{"===r?a.push(t="}"):'"'===t&&"#"===s&&"{"===r&&a.push(t="}"):a.push(t=r),s=r}return this.error("missing "+a.pop()+", starting")},e.prototype.interpolateString=function(t,n){var i,r,o,s,a,c,h,u,l,p,d,f,m,y,b,g,k,v,w,T,C,F,L,N,E,x,D,S,R;for(null==n&&(n={}),s=n.heredoc,v=n.regex,y=n.offsetInChunk,T=n.strOffset,p=n.lexedLength,y||(y=0),T||(T=0),p||(p=t.length),L=[],b=0,a=-1;l=t.charAt(a+=1);)"\\"!==l?"#"===l&&"{"===t.charAt(a+1)&&(o=this.balancedString(t.slice(a+1),"}"))&&(a>b&&L.push(this.makeToken("NEOSTRING",t.slice(b,a),T+b)),r||(r=this.makeToken("","string interpolation",y+a+1,2)),c=o.slice(1,-1),c.length&&(D=this.getLineAndColumnFromChunk(T+a+2),d=D[0],i=D[1],m=(new e).tokenize(c,{line:d,column:i,rewrite:!1}),k=m.pop(),"TERMINATOR"===(null!=(S=m[0])?S[0]:void 0)&&(k=m.shift()),(u=m.length)&&(u>1&&(m.unshift(this.makeToken("(","(",T+a+1,0)),m.push(this.makeToken(")",")",T+a+1+c.length,0))),L.push(["TOKENS",m]))),a+=o.length,b=a+1):a+=1;if(a>b&&t.length>b&&L.push(this.makeToken("NEOSTRING",t.slice(b),T+b)),v)return L;if(!L.length)return this.token("STRING",'""',y,p);for("NEOSTRING"!==L[0][0]&&L.unshift(this.makeToken("NEOSTRING","",y)),(h=L.length>1)&&this.token("(","(",y,0,r),a=E=0,x=L.length;x>E;a=++E)F=L[a],C=F[0],N=F[1],a&&(a&&(g=this.token("+","+")),f="TOKENS"===C?N[0]:F,g[2]={first_line:f[2].first_line,first_column:f[2].first_column,last_line:f[2].first_line,last_column:f[2].first_column}),"TOKENS"===C?(R=this.tokens).push.apply(R,N):"NEOSTRING"===C?(F[0]="STRING",F[1]=this.makeString(N,'"',s),this.tokens.push(F)):this.error("Unexpected "+C);return h&&(w=this.makeToken(")",")",y+p,0),w.stringEnd=!0,this.tokens.push(w)),L},e.prototype.pair=function(e){var t;return e!==(t=z(this.ends))?("OUTDENT"!==t&&this.error("unmatched "+e),this.outdentToken(z(this.indents),!0),this.pair(e)):this.ends.pop()},e.prototype.getLineAndColumnFromChunk=function(e){var t,n,i,r;return 0===e?[this.chunkLine,this.chunkColumn]:(r=e>=this.chunk.length?this.chunk:this.chunk.slice(0,+(e-1)+1||9e9),n=W(r,"\n"),t=this.chunkColumn,n>0?(i=r.split("\n"),t=z(i).length):t+=r.length,[this.chunkLine+n,t])},e.prototype.makeToken=function(e,t,n,i){var r,o,s,a,c;return null==n&&(n=0),null==i&&(i=t.length),o={},a=this.getLineAndColumnFromChunk(n),o.first_line=a[0],o.first_column=a[1],r=Math.max(0,i-1),c=this.getLineAndColumnFromChunk(n+r),o.last_line=c[0],o.last_column=c[1],s=[e,t,o]},e.prototype.token=function(e,t,n,i,r){var o;return o=this.makeToken(e,t,n,i),r&&(o.origin=r),this.tokens.push(o),o},e.prototype.tag=function(e,t){var n;return(n=z(this.tokens,e))&&(t?n[0]=t:n[0])},e.prototype.value=function(e,t){var n;return(n=z(this.tokens,e))&&(t?n[1]=t:n[1])},e.prototype.unfinished=function(){var e;return F.test(this.chunk)||"\\"===(e=this.tag())||"."===e||"?."===e||"?::"===e||"UNARY"===e||"MATH"===e||"UNARY_MATH"===e||"+"===e||"-"===e||"**"===e||"SHIFT"===e||"RELATION"===e||"COMPARE"===e||"LOGIC"===e||"THROW"===e||"EXTENDS"===e},e.prototype.removeNewlines=function(e){return e.replace(/^\s*\n\s*/,"").replace(/([^\\]|\\\\)\s*\n\s*$/,"$1")},e.prototype.escapeLines=function(e,t){return e=e.replace(/\\[^\S\n]*(\n|\\)\s*/g,function(e,t){return"\n"===t?"":e}),t?e.replace(x,"\\n"):e.replace(/\s*\n\s*/g," ")},e.prototype.makeString=function(e,t,n){return e?(e=e.replace(RegExp("\\\\("+t+"|\\\\)","g"),function(e,n){return n===t?n:e}),e=e.replace(RegExp(""+t,"g"),"\\$&"),t+this.escapeLines(e,n)+t):t+t},e.prototype.error=function(e,t){var n,i,r;return null==t&&(t=0),r=this.getLineAndColumnFromChunk(t),i=r[0],n=r[1],Q(e,{first_line:i,first_column:n})},e}(),T=["true","false","null","this","new","delete","typeof","in","instanceof","return","throw","break","continue","debugger","if","else","switch","for","while","do","try","catch","finally","class","extends","super"],a=["undefined","then","unless","until","loop","of","by","when"],s={and:"&&",or:"||",is:"==",isnt:"!=",not:"!",yes:"true",no:"false",on:"true",off:"false"},o=function(){var e;e=[];for(Y in s)e.push(Y);return e}(),a=a.concat(o),O=["case","default","function","var","void","with","const","let","enum","export","import","native","__hasProp","__extends","__slice","__bind","__indexOf","implements","interface","package","private","protected","public","static","yield"],V=["arguments","eval"],w=T.concat(O).concat(V),e.RESERVED=O.concat(T).concat(a).concat(V),e.STRICT_PROSCRIBED=V,t=65279,y=/^([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)([^\n\S]*:(?!:))?/,A=/^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i,l=/^("""|''')((?:\\[\s\S]|[^\\])*?)(?:\n[^\n\S]*)?\1/,I=/^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>*\/%])\2=?|\?(\.|::)|\.{2,3})/,q=/^[^\n\S]+/,c=/^###([^#][\s\S]*?)(?:###[^\n\S]*|###$)|^(?:\s*#(?!##[^#]).*)+/,r=/^[-=]>/,D=/^(?:\n[^\n\S]*)+/,B=/^'[^\\']*(?:\\[\s\S][^\\']*)*'/,v=/^`[^\\`]*(?:\\.[^\\`]*)*`/,_=/^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/,f=/^\/{3}((?:\\?[\s\S])+?)\/{3}([imgy]{0,4})(?!\w)/,m=/((?:\\\\)+)|\\(\s|\/)|\s+(?:#.*)?/g,x=/\n/g,d=/\n+([^\n\S]*)/g,p=/\*\//,F=/^\s*(?:,|\??\.(?![.\d])|::)/,P=/\s+$/,u=["-=","+=","/=","*=","%=","||=","&&=","?=","<<=",">>=",">>>=","&=","^=","|=","**=","//=","%%="],U=["NEW","TYPEOF","DELETE","DO"],H=["!","~"],L=["&&","||","&","|","^"],M=["<<",">>",">>>"],h=["==","!=","<",">","<=",">="],E=["*","/","%","//","%%"],$=["IN","OF","INSTANCEOF"],n=["TRUE","FALSE"],S=["NUMBER","REGEX","BOOL","NULL","UNDEFINED","++","--"],R=S.concat(")","}","THIS","IDENTIFIER","STRING","]"),i=["IDENTIFIER","STRING","REGEX",")","]","}","?","::","@","THIS","SUPER"],g=i.concat("NUMBER","BOOL","NULL","UNDEFINED"),C=["INDENT","OUTDENT","TERMINATOR"],b=[")","}","]"]}.call(this),t.exports}(),require["./parser"]=function(){var e={},t={exports:e},n=function(){function e(){this.yy={}}var t={trace:function(){},yy:{},symbols_:{error:2,Root:3,Body:4,Line:5,TERMINATOR:6,Expression:7,Statement:8,Return:9,Comment:10,STATEMENT:11,Value:12,Invocation:13,Code:14,Operation:15,Assign:16,If:17,Try:18,While:19,For:20,Switch:21,Class:22,Throw:23,Block:24,INDENT:25,OUTDENT:26,Identifier:27,IDENTIFIER:28,AlphaNumeric:29,NUMBER:30,STRING:31,Literal:32,JS:33,REGEX:34,DEBUGGER:35,UNDEFINED:36,NULL:37,BOOL:38,Assignable:39,"=":40,AssignObj:41,ObjAssignable:42,":":43,ThisProperty:44,RETURN:45,HERECOMMENT:46,PARAM_START:47,ParamList:48,PARAM_END:49,FuncGlyph:50,"->":51,"=>":52,OptComma:53,",":54,Param:55,ParamVar:56,"...":57,Array:58,Object:59,Splat:60,SimpleAssignable:61,Accessor:62,Parenthetical:63,Range:64,This:65,".":66,"?.":67,"::":68,"?::":69,Index:70,INDEX_START:71,IndexValue:72,INDEX_END:73,INDEX_SOAK:74,Slice:75,"{":76,AssignList:77,"}":78,CLASS:79,EXTENDS:80,OptFuncExist:81,Arguments:82,SUPER:83,FUNC_EXIST:84,CALL_START:85,CALL_END:86,ArgList:87,THIS:88,"@":89,"[":90,"]":91,RangeDots:92,"..":93,Arg:94,SimpleArgs:95,TRY:96,Catch:97,FINALLY:98,CATCH:99,THROW:100,"(":101,")":102,WhileSource:103,WHILE:104,WHEN:105,UNTIL:106,Loop:107,LOOP:108,ForBody:109,FOR:110,ForStart:111,ForSource:112,ForVariables:113,OWN:114,ForValue:115,FORIN:116,FOROF:117,BY:118,SWITCH:119,Whens:120,ELSE:121,When:122,LEADING_WHEN:123,IfBlock:124,IF:125,POST_IF:126,UNARY:127,UNARY_MATH:128,"-":129,"+":130,"--":131,"++":132,"?":133,MATH:134,"**":135,SHIFT:136,COMPARE:137,LOGIC:138,RELATION:139,COMPOUND_ASSIGN:140,$accept:0,$end:1},terminals_:{2:"error",6:"TERMINATOR",11:"STATEMENT",25:"INDENT",26:"OUTDENT",28:"IDENTIFIER",30:"NUMBER",31:"STRING",33:"JS",34:"REGEX",35:"DEBUGGER",36:"UNDEFINED",37:"NULL",38:"BOOL",40:"=",43:":",45:"RETURN",46:"HERECOMMENT",47:"PARAM_START",49:"PARAM_END",51:"->",52:"=>",54:",",57:"...",66:".",67:"?.",68:"::",69:"?::",71:"INDEX_START",73:"INDEX_END",74:"INDEX_SOAK",76:"{",78:"}",79:"CLASS",80:"EXTENDS",83:"SUPER",84:"FUNC_EXIST",85:"CALL_START",86:"CALL_END",88:"THIS",89:"@",90:"[",91:"]",93:"..",96:"TRY",98:"FINALLY",99:"CATCH",100:"THROW",101:"(",102:")",104:"WHILE",105:"WHEN",106:"UNTIL",108:"LOOP",110:"FOR",114:"OWN",116:"FORIN",117:"FOROF",118:"BY",119:"SWITCH",121:"ELSE",123:"LEADING_WHEN",125:"IF",126:"POST_IF",127:"UNARY",128:"UNARY_MATH",129:"-",130:"+",131:"--",132:"++",133:"?",134:"MATH",135:"**",136:"SHIFT",137:"COMPARE",138:"LOGIC",139:"RELATION",140:"COMPOUND_ASSIGN"},productions_:[0,[3,0],[3,1],[4,1],[4,3],[4,2],[5,1],[5,1],[8,1],[8,1],[8,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[24,2],[24,3],[27,1],[29,1],[29,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[16,3],[16,4],[16,5],[41,1],[41,3],[41,5],[41,1],[42,1],[42,1],[42,1],[9,2],[9,1],[10,1],[14,5],[14,2],[50,1],[50,1],[53,0],[53,1],[48,0],[48,1],[48,3],[48,4],[48,6],[55,1],[55,2],[55,3],[55,1],[56,1],[56,1],[56,1],[56,1],[60,2],[61,1],[61,2],[61,2],[61,1],[39,1],[39,1],[39,1],[12,1],[12,1],[12,1],[12,1],[12,1],[62,2],[62,2],[62,2],[62,2],[62,1],[62,1],[70,3],[70,2],[72,1],[72,1],[59,4],[77,0],[77,1],[77,3],[77,4],[77,6],[22,1],[22,2],[22,3],[22,4],[22,2],[22,3],[22,4],[22,5],[13,3],[13,3],[13,1],[13,2],[81,0],[81,1],[82,2],[82,4],[65,1],[65,1],[44,2],[58,2],[58,4],[92,1],[92,1],[64,5],[75,3],[75,2],[75,2],[75,1],[87,1],[87,3],[87,4],[87,4],[87,6],[94,1],[94,1],[94,1],[95,1],[95,3],[18,2],[18,3],[18,4],[18,5],[97,3],[97,3],[97,2],[23,2],[63,3],[63,5],[103,2],[103,4],[103,2],[103,4],[19,2],[19,2],[19,2],[19,1],[107,2],[107,2],[20,2],[20,2],[20,2],[109,2],[109,2],[111,2],[111,3],[115,1],[115,1],[115,1],[115,1],[113,1],[113,3],[112,2],[112,2],[112,4],[112,4],[112,4],[112,6],[112,6],[21,5],[21,7],[21,4],[21,6],[120,1],[120,2],[122,3],[122,4],[124,3],[124,5],[17,1],[17,3],[17,3],[17,3],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,5],[15,4],[15,3]],performAction:function(e,t,n,i,r,o,s){var a=o.length-1;switch(r){case 1:return this.$=i.addLocationDataFn(s[a],s[a])(new i.Block);case 2:return this.$=o[a];case 3:this.$=i.addLocationDataFn(s[a],s[a])(i.Block.wrap([o[a]]));break;case 4:this.$=i.addLocationDataFn(s[a-2],s[a])(o[a-2].push(o[a]));break;case 5:this.$=o[a-1];break;case 6:this.$=o[a];break;case 7:this.$=o[a];break;case 8:this.$=o[a];break;case 9:this.$=o[a];break;case 10:this.$=i.addLocationDataFn(s[a],s[a])(new i.Literal(o[a]));break;case 11:this.$=o[a];break;case 12:this.$=o[a];break;case 13:this.$=o[a];break;case 14:this.$=o[a];break;case 15:this.$=o[a];break;case 16:this.$=o[a];break;case 17:this.$=o[a];break;case 18:this.$=o[a];break;case 19:this.$=o[a];break;case 20:this.$=o[a];break;case 21:this.$=o[a];break;case 22:this.$=o[a];break;case 23:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Block);break;case 24:this.$=i.addLocationDataFn(s[a-2],s[a])(o[a-1]);break;case 25:this.$=i.addLocationDataFn(s[a],s[a])(new i.Literal(o[a]));break;case 26:this.$=i.addLocationDataFn(s[a],s[a])(new i.Literal(o[a]));break;case 27:this.$=i.addLocationDataFn(s[a],s[a])(new i.Literal(o[a]));break;case 28:this.$=o[a];break;
case 29:this.$=i.addLocationDataFn(s[a],s[a])(new i.Literal(o[a]));break;case 30:this.$=i.addLocationDataFn(s[a],s[a])(new i.Literal(o[a]));break;case 31:this.$=i.addLocationDataFn(s[a],s[a])(new i.Literal(o[a]));break;case 32:this.$=i.addLocationDataFn(s[a],s[a])(new i.Undefined);break;case 33:this.$=i.addLocationDataFn(s[a],s[a])(new i.Null);break;case 34:this.$=i.addLocationDataFn(s[a],s[a])(new i.Bool(o[a]));break;case 35:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Assign(o[a-2],o[a]));break;case 36:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.Assign(o[a-3],o[a]));break;case 37:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Assign(o[a-4],o[a-1]));break;case 38:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 39:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Assign(i.addLocationDataFn(s[a-2])(new i.Value(o[a-2])),o[a],"object"));break;case 40:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Assign(i.addLocationDataFn(s[a-4])(new i.Value(o[a-4])),o[a-1],"object"));break;case 41:this.$=o[a];break;case 42:this.$=o[a];break;case 43:this.$=o[a];break;case 44:this.$=o[a];break;case 45:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Return(o[a]));break;case 46:this.$=i.addLocationDataFn(s[a],s[a])(new i.Return);break;case 47:this.$=i.addLocationDataFn(s[a],s[a])(new i.Comment(o[a]));break;case 48:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Code(o[a-3],o[a],o[a-1]));break;case 49:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Code([],o[a],o[a-1]));break;case 50:this.$=i.addLocationDataFn(s[a],s[a])("func");break;case 51:this.$=i.addLocationDataFn(s[a],s[a])("boundfunc");break;case 52:this.$=o[a];break;case 53:this.$=o[a];break;case 54:this.$=i.addLocationDataFn(s[a],s[a])([]);break;case 55:this.$=i.addLocationDataFn(s[a],s[a])([o[a]]);break;case 56:this.$=i.addLocationDataFn(s[a-2],s[a])(o[a-2].concat(o[a]));break;case 57:this.$=i.addLocationDataFn(s[a-3],s[a])(o[a-3].concat(o[a]));break;case 58:this.$=i.addLocationDataFn(s[a-5],s[a])(o[a-5].concat(o[a-2]));break;case 59:this.$=i.addLocationDataFn(s[a],s[a])(new i.Param(o[a]));break;case 60:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Param(o[a-1],null,!0));break;case 61:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Param(o[a-2],o[a]));break;case 62:this.$=i.addLocationDataFn(s[a],s[a])(new i.Expansion);break;case 63:this.$=o[a];break;case 64:this.$=o[a];break;case 65:this.$=o[a];break;case 66:this.$=o[a];break;case 67:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Splat(o[a-1]));break;case 68:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 69:this.$=i.addLocationDataFn(s[a-1],s[a])(o[a-1].add(o[a]));break;case 70:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Value(o[a-1],[].concat(o[a])));break;case 71:this.$=o[a];break;case 72:this.$=o[a];break;case 73:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 74:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 75:this.$=o[a];break;case 76:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 77:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 78:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 79:this.$=o[a];break;case 80:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Access(o[a]));break;case 81:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Access(o[a],"soak"));break;case 82:this.$=i.addLocationDataFn(s[a-1],s[a])([i.addLocationDataFn(s[a-1])(new i.Access(new i.Literal("prototype"))),i.addLocationDataFn(s[a])(new i.Access(o[a]))]);break;case 83:this.$=i.addLocationDataFn(s[a-1],s[a])([i.addLocationDataFn(s[a-1])(new i.Access(new i.Literal("prototype"),"soak")),i.addLocationDataFn(s[a])(new i.Access(o[a]))]);break;case 84:this.$=i.addLocationDataFn(s[a],s[a])(new i.Access(new i.Literal("prototype")));break;case 85:this.$=o[a];break;case 86:this.$=i.addLocationDataFn(s[a-2],s[a])(o[a-1].wipeLocationData());break;case 87:this.$=i.addLocationDataFn(s[a-1],s[a])(i.extend(o[a],{soak:!0}));break;case 88:this.$=i.addLocationDataFn(s[a],s[a])(new i.Index(o[a]));break;case 89:this.$=i.addLocationDataFn(s[a],s[a])(new i.Slice(o[a]));break;case 90:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.Obj(o[a-2],o[a-3].generated));break;case 91:this.$=i.addLocationDataFn(s[a],s[a])([]);break;case 92:this.$=i.addLocationDataFn(s[a],s[a])([o[a]]);break;case 93:this.$=i.addLocationDataFn(s[a-2],s[a])(o[a-2].concat(o[a]));break;case 94:this.$=i.addLocationDataFn(s[a-3],s[a])(o[a-3].concat(o[a]));break;case 95:this.$=i.addLocationDataFn(s[a-5],s[a])(o[a-5].concat(o[a-2]));break;case 96:this.$=i.addLocationDataFn(s[a],s[a])(new i.Class);break;case 97:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Class(null,null,o[a]));break;case 98:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Class(null,o[a]));break;case 99:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.Class(null,o[a-1],o[a]));break;case 100:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Class(o[a]));break;case 101:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Class(o[a-1],null,o[a]));break;case 102:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.Class(o[a-2],o[a]));break;case 103:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Class(o[a-3],o[a-1],o[a]));break;case 104:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Call(o[a-2],o[a],o[a-1]));break;case 105:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Call(o[a-2],o[a],o[a-1]));break;case 106:this.$=i.addLocationDataFn(s[a],s[a])(new i.Call("super",[new i.Splat(new i.Literal("arguments"))]));break;case 107:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Call("super",o[a]));break;case 108:this.$=i.addLocationDataFn(s[a],s[a])(!1);break;case 109:this.$=i.addLocationDataFn(s[a],s[a])(!0);break;case 110:this.$=i.addLocationDataFn(s[a-1],s[a])([]);break;case 111:this.$=i.addLocationDataFn(s[a-3],s[a])(o[a-2]);break;case 112:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(new i.Literal("this")));break;case 113:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(new i.Literal("this")));break;case 114:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Value(i.addLocationDataFn(s[a-1])(new i.Literal("this")),[i.addLocationDataFn(s[a])(new i.Access(o[a]))],"this"));break;case 115:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Arr([]));break;case 116:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.Arr(o[a-2]));break;case 117:this.$=i.addLocationDataFn(s[a],s[a])("inclusive");break;case 118:this.$=i.addLocationDataFn(s[a],s[a])("exclusive");break;case 119:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Range(o[a-3],o[a-1],o[a-2]));break;case 120:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Range(o[a-2],o[a],o[a-1]));break;case 121:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Range(o[a-1],null,o[a]));break;case 122:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Range(null,o[a],o[a-1]));break;case 123:this.$=i.addLocationDataFn(s[a],s[a])(new i.Range(null,null,o[a]));break;case 124:this.$=i.addLocationDataFn(s[a],s[a])([o[a]]);break;case 125:this.$=i.addLocationDataFn(s[a-2],s[a])(o[a-2].concat(o[a]));break;case 126:this.$=i.addLocationDataFn(s[a-3],s[a])(o[a-3].concat(o[a]));break;case 127:this.$=i.addLocationDataFn(s[a-3],s[a])(o[a-2]);break;case 128:this.$=i.addLocationDataFn(s[a-5],s[a])(o[a-5].concat(o[a-2]));break;case 129:this.$=o[a];break;case 130:this.$=o[a];break;case 131:this.$=i.addLocationDataFn(s[a],s[a])(new i.Expansion);break;case 132:this.$=o[a];break;case 133:this.$=i.addLocationDataFn(s[a-2],s[a])([].concat(o[a-2],o[a]));break;case 134:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Try(o[a]));break;case 135:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Try(o[a-1],o[a][0],o[a][1]));break;case 136:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.Try(o[a-2],null,null,o[a]));break;case 137:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Try(o[a-3],o[a-2][0],o[a-2][1],o[a]));break;case 138:this.$=i.addLocationDataFn(s[a-2],s[a])([o[a-1],o[a]]);break;case 139:this.$=i.addLocationDataFn(s[a-2],s[a])([i.addLocationDataFn(s[a-1])(new i.Value(o[a-1])),o[a]]);break;case 140:this.$=i.addLocationDataFn(s[a-1],s[a])([null,o[a]]);break;case 141:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Throw(o[a]));break;case 142:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Parens(o[a-1]));break;case 143:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Parens(o[a-2]));break;case 144:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.While(o[a]));break;case 145:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.While(o[a-2],{guard:o[a]}));break;case 146:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.While(o[a],{invert:!0}));break;case 147:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.While(o[a-2],{invert:!0,guard:o[a]}));break;case 148:this.$=i.addLocationDataFn(s[a-1],s[a])(o[a-1].addBody(o[a]));break;case 149:this.$=i.addLocationDataFn(s[a-1],s[a])(o[a].addBody(i.addLocationDataFn(s[a-1])(i.Block.wrap([o[a-1]]))));break;case 150:this.$=i.addLocationDataFn(s[a-1],s[a])(o[a].addBody(i.addLocationDataFn(s[a-1])(i.Block.wrap([o[a-1]]))));break;case 151:this.$=i.addLocationDataFn(s[a],s[a])(o[a]);break;case 152:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.While(i.addLocationDataFn(s[a-1])(new i.Literal("true"))).addBody(o[a]));break;case 153:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.While(i.addLocationDataFn(s[a-1])(new i.Literal("true"))).addBody(i.addLocationDataFn(s[a])(i.Block.wrap([o[a]]))));break;case 154:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.For(o[a-1],o[a]));break;case 155:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.For(o[a-1],o[a]));break;case 156:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.For(o[a],o[a-1]));break;case 157:this.$=i.addLocationDataFn(s[a-1],s[a])({source:i.addLocationDataFn(s[a])(new i.Value(o[a]))});break;case 158:this.$=i.addLocationDataFn(s[a-1],s[a])(function(){return o[a].own=o[a-1].own,o[a].name=o[a-1][0],o[a].index=o[a-1][1],o[a]}());break;case 159:this.$=i.addLocationDataFn(s[a-1],s[a])(o[a]);break;case 160:this.$=i.addLocationDataFn(s[a-2],s[a])(function(){return o[a].own=!0,o[a]}());break;case 161:this.$=o[a];break;case 162:this.$=o[a];break;case 163:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 164:this.$=i.addLocationDataFn(s[a],s[a])(new i.Value(o[a]));break;case 165:this.$=i.addLocationDataFn(s[a],s[a])([o[a]]);break;case 166:this.$=i.addLocationDataFn(s[a-2],s[a])([o[a-2],o[a]]);break;case 167:this.$=i.addLocationDataFn(s[a-1],s[a])({source:o[a]});break;case 168:this.$=i.addLocationDataFn(s[a-1],s[a])({source:o[a],object:!0});break;case 169:this.$=i.addLocationDataFn(s[a-3],s[a])({source:o[a-2],guard:o[a]});break;case 170:this.$=i.addLocationDataFn(s[a-3],s[a])({source:o[a-2],guard:o[a],object:!0});break;case 171:this.$=i.addLocationDataFn(s[a-3],s[a])({source:o[a-2],step:o[a]});break;case 172:this.$=i.addLocationDataFn(s[a-5],s[a])({source:o[a-4],guard:o[a-2],step:o[a]});break;case 173:this.$=i.addLocationDataFn(s[a-5],s[a])({source:o[a-4],step:o[a-2],guard:o[a]});break;case 174:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Switch(o[a-3],o[a-1]));break;case 175:this.$=i.addLocationDataFn(s[a-6],s[a])(new i.Switch(o[a-5],o[a-3],o[a-1]));break;case 176:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.Switch(null,o[a-1]));break;case 177:this.$=i.addLocationDataFn(s[a-5],s[a])(new i.Switch(null,o[a-3],o[a-1]));break;case 178:this.$=o[a];break;case 179:this.$=i.addLocationDataFn(s[a-1],s[a])(o[a-1].concat(o[a]));break;case 180:this.$=i.addLocationDataFn(s[a-2],s[a])([[o[a-1],o[a]]]);break;case 181:this.$=i.addLocationDataFn(s[a-3],s[a])([[o[a-2],o[a-1]]]);break;case 182:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.If(o[a-1],o[a],{type:o[a-2]}));break;case 183:this.$=i.addLocationDataFn(s[a-4],s[a])(o[a-4].addElse(i.addLocationDataFn(s[a-2],s[a])(new i.If(o[a-1],o[a],{type:o[a-2]})),s[a-3]));break;case 184:this.$=o[a];break;case 185:this.$=i.addLocationDataFn(s[a-2],s[a])(o[a-2].addElse(o[a],s[a-1]));break;case 186:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.If(o[a],i.addLocationDataFn(s[a-2])(i.Block.wrap([o[a-2]])),{type:o[a-1],statement:!0}));break;case 187:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.If(o[a],i.addLocationDataFn(s[a-2])(i.Block.wrap([o[a-2]])),{type:o[a-1],statement:!0}));break;case 188:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Op(o[a-1],o[a]));break;case 189:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Op(o[a-1],o[a]));break;case 190:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Op("-",o[a]));break;case 191:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Op("+",o[a]));break;case 192:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Op("--",o[a]));break;case 193:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Op("++",o[a]));break;case 194:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Op("--",o[a-1],null,!0));break;case 195:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Op("++",o[a-1],null,!0));break;case 196:this.$=i.addLocationDataFn(s[a-1],s[a])(new i.Existence(o[a-1]));break;case 197:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Op("+",o[a-2],o[a]));break;case 198:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Op("-",o[a-2],o[a]));break;case 199:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Op(o[a-1],o[a-2],o[a]));break;case 200:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Op(o[a-1],o[a-2],o[a]));break;case 201:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Op(o[a-1],o[a-2],o[a]));break;case 202:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Op(o[a-1],o[a-2],o[a]));break;case 203:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Op(o[a-1],o[a-2],o[a]));break;case 204:this.$=i.addLocationDataFn(s[a-2],s[a])(function(){return"!"===o[a-1].charAt(0)?new i.Op(o[a-1].slice(1),o[a-2],o[a]).invert():new i.Op(o[a-1],o[a-2],o[a])}());break;case 205:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Assign(o[a-2],o[a],o[a-1]));break;case 206:this.$=i.addLocationDataFn(s[a-4],s[a])(new i.Assign(o[a-4],o[a-1],o[a-3]));break;case 207:this.$=i.addLocationDataFn(s[a-3],s[a])(new i.Assign(o[a-3],o[a],o[a-2]));break;case 208:this.$=i.addLocationDataFn(s[a-2],s[a])(new i.Extends(o[a-2],o[a]))}},table:[{1:[2,1],3:1,4:2,5:3,7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[3]},{1:[2,2],6:[1,73]},{1:[2,3],6:[2,3],26:[2,3],102:[2,3]},{1:[2,6],6:[2,6],26:[2,6],102:[2,6],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,7],6:[2,7],26:[2,7],102:[2,7],103:87,104:[1,64],106:[1,65],109:88,110:[1,67],111:68,126:[1,86]},{1:[2,11],6:[2,11],25:[2,11],26:[2,11],49:[2,11],54:[2,11],57:[2,11],62:90,66:[1,92],67:[1,93],68:[1,94],69:[1,95],70:96,71:[1,97],73:[2,11],74:[1,98],78:[2,11],81:89,84:[1,91],85:[2,108],86:[2,11],91:[2,11],93:[2,11],102:[2,11],104:[2,11],105:[2,11],106:[2,11],110:[2,11],118:[2,11],126:[2,11],129:[2,11],130:[2,11],133:[2,11],134:[2,11],135:[2,11],136:[2,11],137:[2,11],138:[2,11],139:[2,11]},{1:[2,12],6:[2,12],25:[2,12],26:[2,12],49:[2,12],54:[2,12],57:[2,12],62:100,66:[1,92],67:[1,93],68:[1,94],69:[1,95],70:96,71:[1,97],73:[2,12],74:[1,98],78:[2,12],81:99,84:[1,91],85:[2,108],86:[2,12],91:[2,12],93:[2,12],102:[2,12],104:[2,12],105:[2,12],106:[2,12],110:[2,12],118:[2,12],126:[2,12],129:[2,12],130:[2,12],133:[2,12],134:[2,12],135:[2,12],136:[2,12],137:[2,12],138:[2,12],139:[2,12]},{1:[2,13],6:[2,13],25:[2,13],26:[2,13],49:[2,13],54:[2,13],57:[2,13],73:[2,13],78:[2,13],86:[2,13],91:[2,13],93:[2,13],102:[2,13],104:[2,13],105:[2,13],106:[2,13],110:[2,13],118:[2,13],126:[2,13],129:[2,13],130:[2,13],133:[2,13],134:[2,13],135:[2,13],136:[2,13],137:[2,13],138:[2,13],139:[2,13]},{1:[2,14],6:[2,14],25:[2,14],26:[2,14],49:[2,14],54:[2,14],57:[2,14],73:[2,14],78:[2,14],86:[2,14],91:[2,14],93:[2,14],102:[2,14],104:[2,14],105:[2,14],106:[2,14],110:[2,14],118:[2,14],126:[2,14],129:[2,14],130:[2,14],133:[2,14],134:[2,14],135:[2,14],136:[2,14],137:[2,14],138:[2,14],139:[2,14]},{1:[2,15],6:[2,15],25:[2,15],26:[2,15],49:[2,15],54:[2,15],57:[2,15],73:[2,15],78:[2,15],86:[2,15],91:[2,15],93:[2,15],102:[2,15],104:[2,15],105:[2,15],106:[2,15],110:[2,15],118:[2,15],126:[2,15],129:[2,15],130:[2,15],133:[2,15],134:[2,15],135:[2,15],136:[2,15],137:[2,15],138:[2,15],139:[2,15]},{1:[2,16],6:[2,16],25:[2,16],26:[2,16],49:[2,16],54:[2,16],57:[2,16],73:[2,16],78:[2,16],86:[2,16],91:[2,16],93:[2,16],102:[2,16],104:[2,16],105:[2,16],106:[2,16],110:[2,16],118:[2,16],126:[2,16],129:[2,16],130:[2,16],133:[2,16],134:[2,16],135:[2,16],136:[2,16],137:[2,16],138:[2,16],139:[2,16]},{1:[2,17],6:[2,17],25:[2,17],26:[2,17],49:[2,17],54:[2,17],57:[2,17],73:[2,17],78:[2,17],86:[2,17],91:[2,17],93:[2,17],102:[2,17],104:[2,17],105:[2,17],106:[2,17],110:[2,17],118:[2,17],126:[2,17],129:[2,17],130:[2,17],133:[2,17],134:[2,17],135:[2,17],136:[2,17],137:[2,17],138:[2,17],139:[2,17]},{1:[2,18],6:[2,18],25:[2,18],26:[2,18],49:[2,18],54:[2,18],57:[2,18],73:[2,18],78:[2,18],86:[2,18],91:[2,18],93:[2,18],102:[2,18],104:[2,18],105:[2,18],106:[2,18],110:[2,18],118:[2,18],126:[2,18],129:[2,18],130:[2,18],133:[2,18],134:[2,18],135:[2,18],136:[2,18],137:[2,18],138:[2,18],139:[2,18]},{1:[2,19],6:[2,19],25:[2,19],26:[2,19],49:[2,19],54:[2,19],57:[2,19],73:[2,19],78:[2,19],86:[2,19],91:[2,19],93:[2,19],102:[2,19],104:[2,19],105:[2,19],106:[2,19],110:[2,19],118:[2,19],126:[2,19],129:[2,19],130:[2,19],133:[2,19],134:[2,19],135:[2,19],136:[2,19],137:[2,19],138:[2,19],139:[2,19]},{1:[2,20],6:[2,20],25:[2,20],26:[2,20],49:[2,20],54:[2,20],57:[2,20],73:[2,20],78:[2,20],86:[2,20],91:[2,20],93:[2,20],102:[2,20],104:[2,20],105:[2,20],106:[2,20],110:[2,20],118:[2,20],126:[2,20],129:[2,20],130:[2,20],133:[2,20],134:[2,20],135:[2,20],136:[2,20],137:[2,20],138:[2,20],139:[2,20]},{1:[2,21],6:[2,21],25:[2,21],26:[2,21],49:[2,21],54:[2,21],57:[2,21],73:[2,21],78:[2,21],86:[2,21],91:[2,21],93:[2,21],102:[2,21],104:[2,21],105:[2,21],106:[2,21],110:[2,21],118:[2,21],126:[2,21],129:[2,21],130:[2,21],133:[2,21],134:[2,21],135:[2,21],136:[2,21],137:[2,21],138:[2,21],139:[2,21]},{1:[2,22],6:[2,22],25:[2,22],26:[2,22],49:[2,22],54:[2,22],57:[2,22],73:[2,22],78:[2,22],86:[2,22],91:[2,22],93:[2,22],102:[2,22],104:[2,22],105:[2,22],106:[2,22],110:[2,22],118:[2,22],126:[2,22],129:[2,22],130:[2,22],133:[2,22],134:[2,22],135:[2,22],136:[2,22],137:[2,22],138:[2,22],139:[2,22]},{1:[2,8],6:[2,8],26:[2,8],102:[2,8],104:[2,8],106:[2,8],110:[2,8],126:[2,8]},{1:[2,9],6:[2,9],26:[2,9],102:[2,9],104:[2,9],106:[2,9],110:[2,9],126:[2,9]},{1:[2,10],6:[2,10],26:[2,10],102:[2,10],104:[2,10],106:[2,10],110:[2,10],126:[2,10]},{1:[2,75],6:[2,75],25:[2,75],26:[2,75],40:[1,101],49:[2,75],54:[2,75],57:[2,75],66:[2,75],67:[2,75],68:[2,75],69:[2,75],71:[2,75],73:[2,75],74:[2,75],78:[2,75],84:[2,75],85:[2,75],86:[2,75],91:[2,75],93:[2,75],102:[2,75],104:[2,75],105:[2,75],106:[2,75],110:[2,75],118:[2,75],126:[2,75],129:[2,75],130:[2,75],133:[2,75],134:[2,75],135:[2,75],136:[2,75],137:[2,75],138:[2,75],139:[2,75]},{1:[2,76],6:[2,76],25:[2,76],26:[2,76],49:[2,76],54:[2,76],57:[2,76],66:[2,76],67:[2,76],68:[2,76],69:[2,76],71:[2,76],73:[2,76],74:[2,76],78:[2,76],84:[2,76],85:[2,76],86:[2,76],91:[2,76],93:[2,76],102:[2,76],104:[2,76],105:[2,76],106:[2,76],110:[2,76],118:[2,76],126:[2,76],129:[2,76],130:[2,76],133:[2,76],134:[2,76],135:[2,76],136:[2,76],137:[2,76],138:[2,76],139:[2,76]},{1:[2,77],6:[2,77],25:[2,77],26:[2,77],49:[2,77],54:[2,77],57:[2,77],66:[2,77],67:[2,77],68:[2,77],69:[2,77],71:[2,77],73:[2,77],74:[2,77],78:[2,77],84:[2,77],85:[2,77],86:[2,77],91:[2,77],93:[2,77],102:[2,77],104:[2,77],105:[2,77],106:[2,77],110:[2,77],118:[2,77],126:[2,77],129:[2,77],130:[2,77],133:[2,77],134:[2,77],135:[2,77],136:[2,77],137:[2,77],138:[2,77],139:[2,77]},{1:[2,78],6:[2,78],25:[2,78],26:[2,78],49:[2,78],54:[2,78],57:[2,78],66:[2,78],67:[2,78],68:[2,78],69:[2,78],71:[2,78],73:[2,78],74:[2,78],78:[2,78],84:[2,78],85:[2,78],86:[2,78],91:[2,78],93:[2,78],102:[2,78],104:[2,78],105:[2,78],106:[2,78],110:[2,78],118:[2,78],126:[2,78],129:[2,78],130:[2,78],133:[2,78],134:[2,78],135:[2,78],136:[2,78],137:[2,78],138:[2,78],139:[2,78]},{1:[2,79],6:[2,79],25:[2,79],26:[2,79],49:[2,79],54:[2,79],57:[2,79],66:[2,79],67:[2,79],68:[2,79],69:[2,79],71:[2,79],73:[2,79],74:[2,79],78:[2,79],84:[2,79],85:[2,79],86:[2,79],91:[2,79],93:[2,79],102:[2,79],104:[2,79],105:[2,79],106:[2,79],110:[2,79],118:[2,79],126:[2,79],129:[2,79],130:[2,79],133:[2,79],134:[2,79],135:[2,79],136:[2,79],137:[2,79],138:[2,79],139:[2,79]},{1:[2,106],6:[2,106],25:[2,106],26:[2,106],49:[2,106],54:[2,106],57:[2,106],66:[2,106],67:[2,106],68:[2,106],69:[2,106],71:[2,106],73:[2,106],74:[2,106],78:[2,106],82:102,84:[2,106],85:[1,103],86:[2,106],91:[2,106],93:[2,106],102:[2,106],104:[2,106],105:[2,106],106:[2,106],110:[2,106],118:[2,106],126:[2,106],129:[2,106],130:[2,106],133:[2,106],134:[2,106],135:[2,106],136:[2,106],137:[2,106],138:[2,106],139:[2,106]},{6:[2,54],25:[2,54],27:108,28:[1,72],44:109,48:104,49:[2,54],54:[2,54],55:105,56:106,57:[1,107],58:110,59:111,76:[1,69],89:[1,112],90:[1,113]},{24:114,25:[1,115]},{7:116,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:118,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:119,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:120,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{12:122,13:123,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:124,44:62,58:46,59:47,61:121,63:23,64:24,65:25,76:[1,69],83:[1,26],88:[1,57],89:[1,58],90:[1,56],101:[1,55]},{12:122,13:123,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:124,44:62,58:46,59:47,61:125,63:23,64:24,65:25,76:[1,69],83:[1,26],88:[1,57],89:[1,58],90:[1,56],101:[1,55]},{1:[2,72],6:[2,72],25:[2,72],26:[2,72],40:[2,72],49:[2,72],54:[2,72],57:[2,72],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,72],74:[2,72],78:[2,72],80:[1,129],84:[2,72],85:[2,72],86:[2,72],91:[2,72],93:[2,72],102:[2,72],104:[2,72],105:[2,72],106:[2,72],110:[2,72],118:[2,72],126:[2,72],129:[2,72],130:[2,72],131:[1,126],132:[1,127],133:[2,72],134:[2,72],135:[2,72],136:[2,72],137:[2,72],138:[2,72],139:[2,72],140:[1,128]},{1:[2,184],6:[2,184],25:[2,184],26:[2,184],49:[2,184],54:[2,184],57:[2,184],73:[2,184],78:[2,184],86:[2,184],91:[2,184],93:[2,184],102:[2,184],104:[2,184],105:[2,184],106:[2,184],110:[2,184],118:[2,184],121:[1,130],126:[2,184],129:[2,184],130:[2,184],133:[2,184],134:[2,184],135:[2,184],136:[2,184],137:[2,184],138:[2,184],139:[2,184]},{24:131,25:[1,115]},{24:132,25:[1,115]},{1:[2,151],6:[2,151],25:[2,151],26:[2,151],49:[2,151],54:[2,151],57:[2,151],73:[2,151],78:[2,151],86:[2,151],91:[2,151],93:[2,151],102:[2,151],104:[2,151],105:[2,151],106:[2,151],110:[2,151],118:[2,151],126:[2,151],129:[2,151],130:[2,151],133:[2,151],134:[2,151],135:[2,151],136:[2,151],137:[2,151],138:[2,151],139:[2,151]},{24:133,25:[1,115]},{7:134,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,135],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,96],6:[2,96],12:122,13:123,24:136,25:[1,115],26:[2,96],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:124,44:62,49:[2,96],54:[2,96],57:[2,96],58:46,59:47,61:138,63:23,64:24,65:25,73:[2,96],76:[1,69],78:[2,96],80:[1,137],83:[1,26],86:[2,96],88:[1,57],89:[1,58],90:[1,56],91:[2,96],93:[2,96],101:[1,55],102:[2,96],104:[2,96],105:[2,96],106:[2,96],110:[2,96],118:[2,96],126:[2,96],129:[2,96],130:[2,96],133:[2,96],134:[2,96],135:[2,96],136:[2,96],137:[2,96],138:[2,96],139:[2,96]},{7:139,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,46],6:[2,46],7:140,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[2,46],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],102:[2,46],103:38,104:[2,46],106:[2,46],107:39,108:[1,66],109:40,110:[2,46],111:68,119:[1,41],124:36,125:[1,63],126:[2,46],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,47],6:[2,47],25:[2,47],26:[2,47],54:[2,47],78:[2,47],102:[2,47],104:[2,47],106:[2,47],110:[2,47],126:[2,47]},{1:[2,73],6:[2,73],25:[2,73],26:[2,73],40:[2,73],49:[2,73],54:[2,73],57:[2,73],66:[2,73],67:[2,73],68:[2,73],69:[2,73],71:[2,73],73:[2,73],74:[2,73],78:[2,73],84:[2,73],85:[2,73],86:[2,73],91:[2,73],93:[2,73],102:[2,73],104:[2,73],105:[2,73],106:[2,73],110:[2,73],118:[2,73],126:[2,73],129:[2,73],130:[2,73],133:[2,73],134:[2,73],135:[2,73],136:[2,73],137:[2,73],138:[2,73],139:[2,73]},{1:[2,74],6:[2,74],25:[2,74],26:[2,74],40:[2,74],49:[2,74],54:[2,74],57:[2,74],66:[2,74],67:[2,74],68:[2,74],69:[2,74],71:[2,74],73:[2,74],74:[2,74],78:[2,74],84:[2,74],85:[2,74],86:[2,74],91:[2,74],93:[2,74],102:[2,74],104:[2,74],105:[2,74],106:[2,74],110:[2,74],118:[2,74],126:[2,74],129:[2,74],130:[2,74],133:[2,74],134:[2,74],135:[2,74],136:[2,74],137:[2,74],138:[2,74],139:[2,74]},{1:[2,28],6:[2,28],25:[2,28],26:[2,28],49:[2,28],54:[2,28],57:[2,28],66:[2,28],67:[2,28],68:[2,28],69:[2,28],71:[2,28],73:[2,28],74:[2,28],78:[2,28],84:[2,28],85:[2,28],86:[2,28],91:[2,28],93:[2,28],102:[2,28],104:[2,28],105:[2,28],106:[2,28],110:[2,28],118:[2,28],126:[2,28],129:[2,28],130:[2,28],133:[2,28],134:[2,28],135:[2,28],136:[2,28],137:[2,28],138:[2,28],139:[2,28]},{1:[2,29],6:[2,29],25:[2,29],26:[2,29],49:[2,29],54:[2,29],57:[2,29],66:[2,29],67:[2,29],68:[2,29],69:[2,29],71:[2,29],73:[2,29],74:[2,29],78:[2,29],84:[2,29],85:[2,29],86:[2,29],91:[2,29],93:[2,29],102:[2,29],104:[2,29],105:[2,29],106:[2,29],110:[2,29],118:[2,29],126:[2,29],129:[2,29],130:[2,29],133:[2,29],134:[2,29],135:[2,29],136:[2,29],137:[2,29],138:[2,29],139:[2,29]},{1:[2,30],6:[2,30],25:[2,30],26:[2,30],49:[2,30],54:[2,30],57:[2,30],66:[2,30],67:[2,30],68:[2,30],69:[2,30],71:[2,30],73:[2,30],74:[2,30],78:[2,30],84:[2,30],85:[2,30],86:[2,30],91:[2,30],93:[2,30],102:[2,30],104:[2,30],105:[2,30],106:[2,30],110:[2,30],118:[2,30],126:[2,30],129:[2,30],130:[2,30],133:[2,30],134:[2,30],135:[2,30],136:[2,30],137:[2,30],138:[2,30],139:[2,30]},{1:[2,31],6:[2,31],25:[2,31],26:[2,31],49:[2,31],54:[2,31],57:[2,31],66:[2,31],67:[2,31],68:[2,31],69:[2,31],71:[2,31],73:[2,31],74:[2,31],78:[2,31],84:[2,31],85:[2,31],86:[2,31],91:[2,31],93:[2,31],102:[2,31],104:[2,31],105:[2,31],106:[2,31],110:[2,31],118:[2,31],126:[2,31],129:[2,31],130:[2,31],133:[2,31],134:[2,31],135:[2,31],136:[2,31],137:[2,31],138:[2,31],139:[2,31]},{1:[2,32],6:[2,32],25:[2,32],26:[2,32],49:[2,32],54:[2,32],57:[2,32],66:[2,32],67:[2,32],68:[2,32],69:[2,32],71:[2,32],73:[2,32],74:[2,32],78:[2,32],84:[2,32],85:[2,32],86:[2,32],91:[2,32],93:[2,32],102:[2,32],104:[2,32],105:[2,32],106:[2,32],110:[2,32],118:[2,32],126:[2,32],129:[2,32],130:[2,32],133:[2,32],134:[2,32],135:[2,32],136:[2,32],137:[2,32],138:[2,32],139:[2,32]},{1:[2,33],6:[2,33],25:[2,33],26:[2,33],49:[2,33],54:[2,33],57:[2,33],66:[2,33],67:[2,33],68:[2,33],69:[2,33],71:[2,33],73:[2,33],74:[2,33],78:[2,33],84:[2,33],85:[2,33],86:[2,33],91:[2,33],93:[2,33],102:[2,33],104:[2,33],105:[2,33],106:[2,33],110:[2,33],118:[2,33],126:[2,33],129:[2,33],130:[2,33],133:[2,33],134:[2,33],135:[2,33],136:[2,33],137:[2,33],138:[2,33],139:[2,33]},{1:[2,34],6:[2,34],25:[2,34],26:[2,34],49:[2,34],54:[2,34],57:[2,34],66:[2,34],67:[2,34],68:[2,34],69:[2,34],71:[2,34],73:[2,34],74:[2,34],78:[2,34],84:[2,34],85:[2,34],86:[2,34],91:[2,34],93:[2,34],102:[2,34],104:[2,34],105:[2,34],106:[2,34],110:[2,34],118:[2,34],126:[2,34],129:[2,34],130:[2,34],133:[2,34],134:[2,34],135:[2,34],136:[2,34],137:[2,34],138:[2,34],139:[2,34]},{4:141,5:3,7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,142],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:143,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],87:145,88:[1,57],89:[1,58],90:[1,56],91:[1,144],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,112],6:[2,112],25:[2,112],26:[2,112],49:[2,112],54:[2,112],57:[2,112],66:[2,112],67:[2,112],68:[2,112],69:[2,112],71:[2,112],73:[2,112],74:[2,112],78:[2,112],84:[2,112],85:[2,112],86:[2,112],91:[2,112],93:[2,112],102:[2,112],104:[2,112],105:[2,112],106:[2,112],110:[2,112],118:[2,112],126:[2,112],129:[2,112],130:[2,112],133:[2,112],134:[2,112],135:[2,112],136:[2,112],137:[2,112],138:[2,112],139:[2,112]},{1:[2,113],6:[2,113],25:[2,113],26:[2,113],27:150,28:[1,72],49:[2,113],54:[2,113],57:[2,113],66:[2,113],67:[2,113],68:[2,113],69:[2,113],71:[2,113],73:[2,113],74:[2,113],78:[2,113],84:[2,113],85:[2,113],86:[2,113],91:[2,113],93:[2,113],102:[2,113],104:[2,113],105:[2,113],106:[2,113],110:[2,113],118:[2,113],126:[2,113],129:[2,113],130:[2,113],133:[2,113],134:[2,113],135:[2,113],136:[2,113],137:[2,113],138:[2,113],139:[2,113]},{25:[2,50]},{25:[2,51]},{1:[2,68],6:[2,68],25:[2,68],26:[2,68],40:[2,68],49:[2,68],54:[2,68],57:[2,68],66:[2,68],67:[2,68],68:[2,68],69:[2,68],71:[2,68],73:[2,68],74:[2,68],78:[2,68],80:[2,68],84:[2,68],85:[2,68],86:[2,68],91:[2,68],93:[2,68],102:[2,68],104:[2,68],105:[2,68],106:[2,68],110:[2,68],118:[2,68],126:[2,68],129:[2,68],130:[2,68],131:[2,68],132:[2,68],133:[2,68],134:[2,68],135:[2,68],136:[2,68],137:[2,68],138:[2,68],139:[2,68],140:[2,68]},{1:[2,71],6:[2,71],25:[2,71],26:[2,71],40:[2,71],49:[2,71],54:[2,71],57:[2,71],66:[2,71],67:[2,71],68:[2,71],69:[2,71],71:[2,71],73:[2,71],74:[2,71],78:[2,71],80:[2,71],84:[2,71],85:[2,71],86:[2,71],91:[2,71],93:[2,71],102:[2,71],104:[2,71],105:[2,71],106:[2,71],110:[2,71],118:[2,71],126:[2,71],129:[2,71],130:[2,71],131:[2,71],132:[2,71],133:[2,71],134:[2,71],135:[2,71],136:[2,71],137:[2,71],138:[2,71],139:[2,71],140:[2,71]},{7:151,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:152,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:153,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:155,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:154,25:[1,115],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{27:160,28:[1,72],44:161,58:162,59:163,64:156,76:[1,69],89:[1,112],90:[1,56],113:157,114:[1,158],115:159},{112:164,116:[1,165],117:[1,166]},{6:[2,91],10:170,25:[2,91],27:171,28:[1,72],29:172,30:[1,70],31:[1,71],41:168,42:169,44:173,46:[1,45],54:[2,91],77:167,78:[2,91],89:[1,112]},{1:[2,26],6:[2,26],25:[2,26],26:[2,26],43:[2,26],49:[2,26],54:[2,26],57:[2,26],66:[2,26],67:[2,26],68:[2,26],69:[2,26],71:[2,26],73:[2,26],74:[2,26],78:[2,26],84:[2,26],85:[2,26],86:[2,26],91:[2,26],93:[2,26],102:[2,26],104:[2,26],105:[2,26],106:[2,26],110:[2,26],118:[2,26],126:[2,26],129:[2,26],130:[2,26],133:[2,26],134:[2,26],135:[2,26],136:[2,26],137:[2,26],138:[2,26],139:[2,26]},{1:[2,27],6:[2,27],25:[2,27],26:[2,27],43:[2,27],49:[2,27],54:[2,27],57:[2,27],66:[2,27],67:[2,27],68:[2,27],69:[2,27],71:[2,27],73:[2,27],74:[2,27],78:[2,27],84:[2,27],85:[2,27],86:[2,27],91:[2,27],93:[2,27],102:[2,27],104:[2,27],105:[2,27],106:[2,27],110:[2,27],118:[2,27],126:[2,27],129:[2,27],130:[2,27],133:[2,27],134:[2,27],135:[2,27],136:[2,27],137:[2,27],138:[2,27],139:[2,27]},{1:[2,25],6:[2,25],25:[2,25],26:[2,25],40:[2,25],43:[2,25],49:[2,25],54:[2,25],57:[2,25],66:[2,25],67:[2,25],68:[2,25],69:[2,25],71:[2,25],73:[2,25],74:[2,25],78:[2,25],80:[2,25],84:[2,25],85:[2,25],86:[2,25],91:[2,25],93:[2,25],102:[2,25],104:[2,25],105:[2,25],106:[2,25],110:[2,25],116:[2,25],117:[2,25],118:[2,25],126:[2,25],129:[2,25],130:[2,25],131:[2,25],132:[2,25],133:[2,25],134:[2,25],135:[2,25],136:[2,25],137:[2,25],138:[2,25],139:[2,25],140:[2,25]},{1:[2,5],5:174,6:[2,5],7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[2,5],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],102:[2,5],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,196],6:[2,196],25:[2,196],26:[2,196],49:[2,196],54:[2,196],57:[2,196],73:[2,196],78:[2,196],86:[2,196],91:[2,196],93:[2,196],102:[2,196],104:[2,196],105:[2,196],106:[2,196],110:[2,196],118:[2,196],126:[2,196],129:[2,196],130:[2,196],133:[2,196],134:[2,196],135:[2,196],136:[2,196],137:[2,196],138:[2,196],139:[2,196]},{7:175,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:176,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:177,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:178,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:179,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:180,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:181,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:182,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:183,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,150],6:[2,150],25:[2,150],26:[2,150],49:[2,150],54:[2,150],57:[2,150],73:[2,150],78:[2,150],86:[2,150],91:[2,150],93:[2,150],102:[2,150],104:[2,150],105:[2,150],106:[2,150],110:[2,150],118:[2,150],126:[2,150],129:[2,150],130:[2,150],133:[2,150],134:[2,150],135:[2,150],136:[2,150],137:[2,150],138:[2,150],139:[2,150]},{1:[2,155],6:[2,155],25:[2,155],26:[2,155],49:[2,155],54:[2,155],57:[2,155],73:[2,155],78:[2,155],86:[2,155],91:[2,155],93:[2,155],102:[2,155],104:[2,155],105:[2,155],106:[2,155],110:[2,155],118:[2,155],126:[2,155],129:[2,155],130:[2,155],133:[2,155],134:[2,155],135:[2,155],136:[2,155],137:[2,155],138:[2,155],139:[2,155]},{7:184,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,149],6:[2,149],25:[2,149],26:[2,149],49:[2,149],54:[2,149],57:[2,149],73:[2,149],78:[2,149],86:[2,149],91:[2,149],93:[2,149],102:[2,149],104:[2,149],105:[2,149],106:[2,149],110:[2,149],118:[2,149],126:[2,149],129:[2,149],130:[2,149],133:[2,149],134:[2,149],135:[2,149],136:[2,149],137:[2,149],138:[2,149],139:[2,149]},{1:[2,154],6:[2,154],25:[2,154],26:[2,154],49:[2,154],54:[2,154],57:[2,154],73:[2,154],78:[2,154],86:[2,154],91:[2,154],93:[2,154],102:[2,154],104:[2,154],105:[2,154],106:[2,154],110:[2,154],118:[2,154],126:[2,154],129:[2,154],130:[2,154],133:[2,154],134:[2,154],135:[2,154],136:[2,154],137:[2,154],138:[2,154],139:[2,154]},{82:185,85:[1,103]},{1:[2,69],6:[2,69],25:[2,69],26:[2,69],40:[2,69],49:[2,69],54:[2,69],57:[2,69],66:[2,69],67:[2,69],68:[2,69],69:[2,69],71:[2,69],73:[2,69],74:[2,69],78:[2,69],80:[2,69],84:[2,69],85:[2,69],86:[2,69],91:[2,69],93:[2,69],102:[2,69],104:[2,69],105:[2,69],106:[2,69],110:[2,69],118:[2,69],126:[2,69],129:[2,69],130:[2,69],131:[2,69],132:[2,69],133:[2,69],134:[2,69],135:[2,69],136:[2,69],137:[2,69],138:[2,69],139:[2,69],140:[2,69]},{85:[2,109]},{27:186,28:[1,72]},{27:187,28:[1,72]},{1:[2,84],6:[2,84],25:[2,84],26:[2,84],27:188,28:[1,72],40:[2,84],49:[2,84],54:[2,84],57:[2,84],66:[2,84],67:[2,84],68:[2,84],69:[2,84],71:[2,84],73:[2,84],74:[2,84],78:[2,84],80:[2,84],84:[2,84],85:[2,84],86:[2,84],91:[2,84],93:[2,84],102:[2,84],104:[2,84],105:[2,84],106:[2,84],110:[2,84],118:[2,84],126:[2,84],129:[2,84],130:[2,84],131:[2,84],132:[2,84],133:[2,84],134:[2,84],135:[2,84],136:[2,84],137:[2,84],138:[2,84],139:[2,84],140:[2,84]},{27:189,28:[1,72]},{1:[2,85],6:[2,85],25:[2,85],26:[2,85],40:[2,85],49:[2,85],54:[2,85],57:[2,85],66:[2,85],67:[2,85],68:[2,85],69:[2,85],71:[2,85],73:[2,85],74:[2,85],78:[2,85],80:[2,85],84:[2,85],85:[2,85],86:[2,85],91:[2,85],93:[2,85],102:[2,85],104:[2,85],105:[2,85],106:[2,85],110:[2,85],118:[2,85],126:[2,85],129:[2,85],130:[2,85],131:[2,85],132:[2,85],133:[2,85],134:[2,85],135:[2,85],136:[2,85],137:[2,85],138:[2,85],139:[2,85],140:[2,85]},{7:191,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,195],58:46,59:47,61:35,63:23,64:24,65:25,72:190,75:192,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],92:193,93:[1,194],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{70:196,71:[1,97],74:[1,98]},{82:197,85:[1,103]},{1:[2,70],6:[2,70],25:[2,70],26:[2,70],40:[2,70],49:[2,70],54:[2,70],57:[2,70],66:[2,70],67:[2,70],68:[2,70],69:[2,70],71:[2,70],73:[2,70],74:[2,70],78:[2,70],80:[2,70],84:[2,70],85:[2,70],86:[2,70],91:[2,70],93:[2,70],102:[2,70],104:[2,70],105:[2,70],106:[2,70],110:[2,70],118:[2,70],126:[2,70],129:[2,70],130:[2,70],131:[2,70],132:[2,70],133:[2,70],134:[2,70],135:[2,70],136:[2,70],137:[2,70],138:[2,70],139:[2,70],140:[2,70]},{6:[1,199],7:198,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,200],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,107],6:[2,107],25:[2,107],26:[2,107],49:[2,107],54:[2,107],57:[2,107],66:[2,107],67:[2,107],68:[2,107],69:[2,107],71:[2,107],73:[2,107],74:[2,107],78:[2,107],84:[2,107],85:[2,107],86:[2,107],91:[2,107],93:[2,107],102:[2,107],104:[2,107],105:[2,107],106:[2,107],110:[2,107],118:[2,107],126:[2,107],129:[2,107],130:[2,107],133:[2,107],134:[2,107],135:[2,107],136:[2,107],137:[2,107],138:[2,107],139:[2,107]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],86:[1,201],87:202,88:[1,57],89:[1,58],90:[1,56],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,52],25:[2,52],49:[1,204],53:206,54:[1,205]},{6:[2,55],25:[2,55],26:[2,55],49:[2,55],54:[2,55]},{6:[2,59],25:[2,59],26:[2,59],40:[1,208],49:[2,59],54:[2,59],57:[1,207]},{6:[2,62],25:[2,62],26:[2,62],49:[2,62],54:[2,62]},{6:[2,63],25:[2,63],26:[2,63],40:[2,63],49:[2,63],54:[2,63],57:[2,63]},{6:[2,64],25:[2,64],26:[2,64],40:[2,64],49:[2,64],54:[2,64],57:[2,64]},{6:[2,65],25:[2,65],26:[2,65],40:[2,65],49:[2,65],54:[2,65],57:[2,65]},{6:[2,66],25:[2,66],26:[2,66],40:[2,66],49:[2,66],54:[2,66],57:[2,66]},{27:150,28:[1,72]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],87:145,88:[1,57],89:[1,58],90:[1,56],91:[1,144],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,49],6:[2,49],25:[2,49],26:[2,49],49:[2,49],54:[2,49],57:[2,49],73:[2,49],78:[2,49],86:[2,49],91:[2,49],93:[2,49],102:[2,49],104:[2,49],105:[2,49],106:[2,49],110:[2,49],118:[2,49],126:[2,49],129:[2,49],130:[2,49],133:[2,49],134:[2,49],135:[2,49],136:[2,49],137:[2,49],138:[2,49],139:[2,49]},{4:210,5:3,7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[1,209],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,188],6:[2,188],25:[2,188],26:[2,188],49:[2,188],54:[2,188],57:[2,188],73:[2,188],78:[2,188],86:[2,188],91:[2,188],93:[2,188],102:[2,188],103:84,104:[2,188],105:[2,188],106:[2,188],109:85,110:[2,188],111:68,118:[2,188],126:[2,188],129:[2,188],130:[2,188],133:[1,74],134:[2,188],135:[2,188],136:[2,188],137:[2,188],138:[2,188],139:[2,188]},{103:87,104:[1,64],106:[1,65],109:88,110:[1,67],111:68,126:[1,86]},{1:[2,189],6:[2,189],25:[2,189],26:[2,189],49:[2,189],54:[2,189],57:[2,189],73:[2,189],78:[2,189],86:[2,189],91:[2,189],93:[2,189],102:[2,189],103:84,104:[2,189],105:[2,189],106:[2,189],109:85,110:[2,189],111:68,118:[2,189],126:[2,189],129:[2,189],130:[2,189],133:[1,74],134:[2,189],135:[1,78],136:[2,189],137:[2,189],138:[2,189],139:[2,189]},{1:[2,190],6:[2,190],25:[2,190],26:[2,190],49:[2,190],54:[2,190],57:[2,190],73:[2,190],78:[2,190],86:[2,190],91:[2,190],93:[2,190],102:[2,190],103:84,104:[2,190],105:[2,190],106:[2,190],109:85,110:[2,190],111:68,118:[2,190],126:[2,190],129:[2,190],130:[2,190],133:[1,74],134:[2,190],135:[1,78],136:[2,190],137:[2,190],138:[2,190],139:[2,190]},{1:[2,191],6:[2,191],25:[2,191],26:[2,191],49:[2,191],54:[2,191],57:[2,191],73:[2,191],78:[2,191],86:[2,191],91:[2,191],93:[2,191],102:[2,191],103:84,104:[2,191],105:[2,191],106:[2,191],109:85,110:[2,191],111:68,118:[2,191],126:[2,191],129:[2,191],130:[2,191],133:[1,74],134:[2,191],135:[1,78],136:[2,191],137:[2,191],138:[2,191],139:[2,191]},{1:[2,192],6:[2,192],25:[2,192],26:[2,192],49:[2,192],54:[2,192],57:[2,192],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,192],74:[2,72],78:[2,192],84:[2,72],85:[2,72],86:[2,192],91:[2,192],93:[2,192],102:[2,192],104:[2,192],105:[2,192],106:[2,192],110:[2,192],118:[2,192],126:[2,192],129:[2,192],130:[2,192],133:[2,192],134:[2,192],135:[2,192],136:[2,192],137:[2,192],138:[2,192],139:[2,192]},{62:90,66:[1,92],67:[1,93],68:[1,94],69:[1,95],70:96,71:[1,97],74:[1,98],81:89,84:[1,91],85:[2,108]},{62:100,66:[1,92],67:[1,93],68:[1,94],69:[1,95],70:96,71:[1,97],74:[1,98],81:99,84:[1,91],85:[2,108]},{66:[2,75],67:[2,75],68:[2,75],69:[2,75],71:[2,75],74:[2,75],84:[2,75],85:[2,75]},{1:[2,193],6:[2,193],25:[2,193],26:[2,193],49:[2,193],54:[2,193],57:[2,193],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,193],74:[2,72],78:[2,193],84:[2,72],85:[2,72],86:[2,193],91:[2,193],93:[2,193],102:[2,193],104:[2,193],105:[2,193],106:[2,193],110:[2,193],118:[2,193],126:[2,193],129:[2,193],130:[2,193],133:[2,193],134:[2,193],135:[2,193],136:[2,193],137:[2,193],138:[2,193],139:[2,193]},{1:[2,194],6:[2,194],25:[2,194],26:[2,194],49:[2,194],54:[2,194],57:[2,194],73:[2,194],78:[2,194],86:[2,194],91:[2,194],93:[2,194],102:[2,194],104:[2,194],105:[2,194],106:[2,194],110:[2,194],118:[2,194],126:[2,194],129:[2,194],130:[2,194],133:[2,194],134:[2,194],135:[2,194],136:[2,194],137:[2,194],138:[2,194],139:[2,194]},{1:[2,195],6:[2,195],25:[2,195],26:[2,195],49:[2,195],54:[2,195],57:[2,195],73:[2,195],78:[2,195],86:[2,195],91:[2,195],93:[2,195],102:[2,195],104:[2,195],105:[2,195],106:[2,195],110:[2,195],118:[2,195],126:[2,195],129:[2,195],130:[2,195],133:[2,195],134:[2,195],135:[2,195],136:[2,195],137:[2,195],138:[2,195],139:[2,195]},{6:[1,213],7:211,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,212],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:214,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{24:215,25:[1,115],125:[1,216]},{1:[2,134],6:[2,134],25:[2,134],26:[2,134],49:[2,134],54:[2,134],57:[2,134],73:[2,134],78:[2,134],86:[2,134],91:[2,134],93:[2,134],97:217,98:[1,218],99:[1,219],102:[2,134],104:[2,134],105:[2,134],106:[2,134],110:[2,134],118:[2,134],126:[2,134],129:[2,134],130:[2,134],133:[2,134],134:[2,134],135:[2,134],136:[2,134],137:[2,134],138:[2,134],139:[2,134]},{1:[2,148],6:[2,148],25:[2,148],26:[2,148],49:[2,148],54:[2,148],57:[2,148],73:[2,148],78:[2,148],86:[2,148],91:[2,148],93:[2,148],102:[2,148],104:[2,148],105:[2,148],106:[2,148],110:[2,148],118:[2,148],126:[2,148],129:[2,148],130:[2,148],133:[2,148],134:[2,148],135:[2,148],136:[2,148],137:[2,148],138:[2,148],139:[2,148]},{1:[2,156],6:[2,156],25:[2,156],26:[2,156],49:[2,156],54:[2,156],57:[2,156],73:[2,156],78:[2,156],86:[2,156],91:[2,156],93:[2,156],102:[2,156],104:[2,156],105:[2,156],106:[2,156],110:[2,156],118:[2,156],126:[2,156],129:[2,156],130:[2,156],133:[2,156],134:[2,156],135:[2,156],136:[2,156],137:[2,156],138:[2,156],139:[2,156]},{25:[1,220],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{120:221,122:222,123:[1,223]},{1:[2,97],6:[2,97],25:[2,97],26:[2,97],49:[2,97],54:[2,97],57:[2,97],73:[2,97],78:[2,97],86:[2,97],91:[2,97],93:[2,97],102:[2,97],104:[2,97],105:[2,97],106:[2,97],110:[2,97],118:[2,97],126:[2,97],129:[2,97],130:[2,97],133:[2,97],134:[2,97],135:[2,97],136:[2,97],137:[2,97],138:[2,97],139:[2,97]},{7:224,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,100],6:[2,100],24:225,25:[1,115],26:[2,100],49:[2,100],54:[2,100],57:[2,100],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,100],74:[2,72],78:[2,100],80:[1,226],84:[2,72],85:[2,72],86:[2,100],91:[2,100],93:[2,100],102:[2,100],104:[2,100],105:[2,100],106:[2,100],110:[2,100],118:[2,100],126:[2,100],129:[2,100],130:[2,100],133:[2,100],134:[2,100],135:[2,100],136:[2,100],137:[2,100],138:[2,100],139:[2,100]},{1:[2,141],6:[2,141],25:[2,141],26:[2,141],49:[2,141],54:[2,141],57:[2,141],73:[2,141],78:[2,141],86:[2,141],91:[2,141],93:[2,141],102:[2,141],103:84,104:[2,141],105:[2,141],106:[2,141],109:85,110:[2,141],111:68,118:[2,141],126:[2,141],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,45],6:[2,45],26:[2,45],102:[2,45],103:84,104:[2,45],106:[2,45],109:85,110:[2,45],111:68,126:[2,45],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,73],102:[1,227]},{4:228,5:3,7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,129],25:[2,129],54:[2,129],57:[1,230],91:[2,129],92:229,93:[1,194],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,115],6:[2,115],25:[2,115],26:[2,115],40:[2,115],49:[2,115],54:[2,115],57:[2,115],66:[2,115],67:[2,115],68:[2,115],69:[2,115],71:[2,115],73:[2,115],74:[2,115],78:[2,115],84:[2,115],85:[2,115],86:[2,115],91:[2,115],93:[2,115],102:[2,115],104:[2,115],105:[2,115],106:[2,115],110:[2,115],116:[2,115],117:[2,115],118:[2,115],126:[2,115],129:[2,115],130:[2,115],133:[2,115],134:[2,115],135:[2,115],136:[2,115],137:[2,115],138:[2,115],139:[2,115]},{6:[2,52],25:[2,52],53:231,54:[1,232],91:[2,52]},{6:[2,124],25:[2,124],26:[2,124],54:[2,124],86:[2,124],91:[2,124]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],87:233,88:[1,57],89:[1,58],90:[1,56],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,130],25:[2,130],26:[2,130],54:[2,130],86:[2,130],91:[2,130]},{6:[2,131],25:[2,131],26:[2,131],54:[2,131],86:[2,131],91:[2,131]},{1:[2,114],6:[2,114],25:[2,114],26:[2,114],40:[2,114],43:[2,114],49:[2,114],54:[2,114],57:[2,114],66:[2,114],67:[2,114],68:[2,114],69:[2,114],71:[2,114],73:[2,114],74:[2,114],78:[2,114],80:[2,114],84:[2,114],85:[2,114],86:[2,114],91:[2,114],93:[2,114],102:[2,114],104:[2,114],105:[2,114],106:[2,114],110:[2,114],116:[2,114],117:[2,114],118:[2,114],126:[2,114],129:[2,114],130:[2,114],131:[2,114],132:[2,114],133:[2,114],134:[2,114],135:[2,114],136:[2,114],137:[2,114],138:[2,114],139:[2,114],140:[2,114]},{24:234,25:[1,115],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,144],6:[2,144],25:[2,144],26:[2,144],49:[2,144],54:[2,144],57:[2,144],73:[2,144],78:[2,144],86:[2,144],91:[2,144],93:[2,144],102:[2,144],103:84,104:[1,64],105:[1,235],106:[1,65],109:85,110:[1,67],111:68,118:[2,144],126:[2,144],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,146],6:[2,146],25:[2,146],26:[2,146],49:[2,146],54:[2,146],57:[2,146],73:[2,146],78:[2,146],86:[2,146],91:[2,146],93:[2,146],102:[2,146],103:84,104:[1,64],105:[1,236],106:[1,65],109:85,110:[1,67],111:68,118:[2,146],126:[2,146],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,152],6:[2,152],25:[2,152],26:[2,152],49:[2,152],54:[2,152],57:[2,152],73:[2,152],78:[2,152],86:[2,152],91:[2,152],93:[2,152],102:[2,152],104:[2,152],105:[2,152],106:[2,152],110:[2,152],118:[2,152],126:[2,152],129:[2,152],130:[2,152],133:[2,152],134:[2,152],135:[2,152],136:[2,152],137:[2,152],138:[2,152],139:[2,152]},{1:[2,153],6:[2,153],25:[2,153],26:[2,153],49:[2,153],54:[2,153],57:[2,153],73:[2,153],78:[2,153],86:[2,153],91:[2,153],93:[2,153],102:[2,153],103:84,104:[1,64],105:[2,153],106:[1,65],109:85,110:[1,67],111:68,118:[2,153],126:[2,153],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,157],6:[2,157],25:[2,157],26:[2,157],49:[2,157],54:[2,157],57:[2,157],73:[2,157],78:[2,157],86:[2,157],91:[2,157],93:[2,157],102:[2,157],104:[2,157],105:[2,157],106:[2,157],110:[2,157],118:[2,157],126:[2,157],129:[2,157],130:[2,157],133:[2,157],134:[2,157],135:[2,157],136:[2,157],137:[2,157],138:[2,157],139:[2,157]},{116:[2,159],117:[2,159]},{27:160,28:[1,72],44:161,58:162,59:163,76:[1,69],89:[1,112],90:[1,113],113:237,115:159},{54:[1,238],116:[2,165],117:[2,165]},{54:[2,161],116:[2,161],117:[2,161]},{54:[2,162],116:[2,162],117:[2,162]},{54:[2,163],116:[2,163],117:[2,163]},{54:[2,164],116:[2,164],117:[2,164]},{1:[2,158],6:[2,158],25:[2,158],26:[2,158],49:[2,158],54:[2,158],57:[2,158],73:[2,158],78:[2,158],86:[2,158],91:[2,158],93:[2,158],102:[2,158],104:[2,158],105:[2,158],106:[2,158],110:[2,158],118:[2,158],126:[2,158],129:[2,158],130:[2,158],133:[2,158],134:[2,158],135:[2,158],136:[2,158],137:[2,158],138:[2,158],139:[2,158]},{7:239,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:240,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,52],25:[2,52],53:241,54:[1,242],78:[2,52]},{6:[2,92],25:[2,92],26:[2,92],54:[2,92],78:[2,92]},{6:[2,38],25:[2,38],26:[2,38],43:[1,243],54:[2,38],78:[2,38]},{6:[2,41],25:[2,41],26:[2,41],54:[2,41],78:[2,41]},{6:[2,42],25:[2,42],26:[2,42],43:[2,42],54:[2,42],78:[2,42]},{6:[2,43],25:[2,43],26:[2,43],43:[2,43],54:[2,43],78:[2,43]},{6:[2,44],25:[2,44],26:[2,44],43:[2,44],54:[2,44],78:[2,44]},{1:[2,4],6:[2,4],26:[2,4],102:[2,4]},{1:[2,197],6:[2,197],25:[2,197],26:[2,197],49:[2,197],54:[2,197],57:[2,197],73:[2,197],78:[2,197],86:[2,197],91:[2,197],93:[2,197],102:[2,197],103:84,104:[2,197],105:[2,197],106:[2,197],109:85,110:[2,197],111:68,118:[2,197],126:[2,197],129:[2,197],130:[2,197],133:[1,74],134:[1,77],135:[1,78],136:[2,197],137:[2,197],138:[2,197],139:[2,197]},{1:[2,198],6:[2,198],25:[2,198],26:[2,198],49:[2,198],54:[2,198],57:[2,198],73:[2,198],78:[2,198],86:[2,198],91:[2,198],93:[2,198],102:[2,198],103:84,104:[2,198],105:[2,198],106:[2,198],109:85,110:[2,198],111:68,118:[2,198],126:[2,198],129:[2,198],130:[2,198],133:[1,74],134:[1,77],135:[1,78],136:[2,198],137:[2,198],138:[2,198],139:[2,198]},{1:[2,199],6:[2,199],25:[2,199],26:[2,199],49:[2,199],54:[2,199],57:[2,199],73:[2,199],78:[2,199],86:[2,199],91:[2,199],93:[2,199],102:[2,199],103:84,104:[2,199],105:[2,199],106:[2,199],109:85,110:[2,199],111:68,118:[2,199],126:[2,199],129:[2,199],130:[2,199],133:[1,74],134:[2,199],135:[1,78],136:[2,199],137:[2,199],138:[2,199],139:[2,199]},{1:[2,200],6:[2,200],25:[2,200],26:[2,200],49:[2,200],54:[2,200],57:[2,200],73:[2,200],78:[2,200],86:[2,200],91:[2,200],93:[2,200],102:[2,200],103:84,104:[2,200],105:[2,200],106:[2,200],109:85,110:[2,200],111:68,118:[2,200],126:[2,200],129:[2,200],130:[2,200],133:[1,74],134:[2,200],135:[1,78],136:[2,200],137:[2,200],138:[2,200],139:[2,200]},{1:[2,201],6:[2,201],25:[2,201],26:[2,201],49:[2,201],54:[2,201],57:[2,201],73:[2,201],78:[2,201],86:[2,201],91:[2,201],93:[2,201],102:[2,201],103:84,104:[2,201],105:[2,201],106:[2,201],109:85,110:[2,201],111:68,118:[2,201],126:[2,201],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[2,201],137:[2,201],138:[2,201],139:[2,201]},{1:[2,202],6:[2,202],25:[2,202],26:[2,202],49:[2,202],54:[2,202],57:[2,202],73:[2,202],78:[2,202],86:[2,202],91:[2,202],93:[2,202],102:[2,202],103:84,104:[2,202],105:[2,202],106:[2,202],109:85,110:[2,202],111:68,118:[2,202],126:[2,202],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[2,202],138:[2,202],139:[1,82]},{1:[2,203],6:[2,203],25:[2,203],26:[2,203],49:[2,203],54:[2,203],57:[2,203],73:[2,203],78:[2,203],86:[2,203],91:[2,203],93:[2,203],102:[2,203],103:84,104:[2,203],105:[2,203],106:[2,203],109:85,110:[2,203],111:68,118:[2,203],126:[2,203],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[2,203],139:[1,82]},{1:[2,204],6:[2,204],25:[2,204],26:[2,204],49:[2,204],54:[2,204],57:[2,204],73:[2,204],78:[2,204],86:[2,204],91:[2,204],93:[2,204],102:[2,204],103:84,104:[2,204],105:[2,204],106:[2,204],109:85,110:[2,204],111:68,118:[2,204],126:[2,204],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[2,204],138:[2,204],139:[2,204]},{1:[2,187],6:[2,187],25:[2,187],26:[2,187],49:[2,187],54:[2,187],57:[2,187],73:[2,187],78:[2,187],86:[2,187],91:[2,187],93:[2,187],102:[2,187],103:84,104:[1,64],105:[2,187],106:[1,65],109:85,110:[1,67],111:68,118:[2,187],126:[2,187],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,186],6:[2,186],25:[2,186],26:[2,186],49:[2,186],54:[2,186],57:[2,186],73:[2,186],78:[2,186],86:[2,186],91:[2,186],93:[2,186],102:[2,186],103:84,104:[1,64],105:[2,186],106:[1,65],109:85,110:[1,67],111:68,118:[2,186],126:[2,186],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,104],6:[2,104],25:[2,104],26:[2,104],49:[2,104],54:[2,104],57:[2,104],66:[2,104],67:[2,104],68:[2,104],69:[2,104],71:[2,104],73:[2,104],74:[2,104],78:[2,104],84:[2,104],85:[2,104],86:[2,104],91:[2,104],93:[2,104],102:[2,104],104:[2,104],105:[2,104],106:[2,104],110:[2,104],118:[2,104],126:[2,104],129:[2,104],130:[2,104],133:[2,104],134:[2,104],135:[2,104],136:[2,104],137:[2,104],138:[2,104],139:[2,104]},{1:[2,80],6:[2,80],25:[2,80],26:[2,80],40:[2,80],49:[2,80],54:[2,80],57:[2,80],66:[2,80],67:[2,80],68:[2,80],69:[2,80],71:[2,80],73:[2,80],74:[2,80],78:[2,80],80:[2,80],84:[2,80],85:[2,80],86:[2,80],91:[2,80],93:[2,80],102:[2,80],104:[2,80],105:[2,80],106:[2,80],110:[2,80],118:[2,80],126:[2,80],129:[2,80],130:[2,80],131:[2,80],132:[2,80],133:[2,80],134:[2,80],135:[2,80],136:[2,80],137:[2,80],138:[2,80],139:[2,80],140:[2,80]},{1:[2,81],6:[2,81],25:[2,81],26:[2,81],40:[2,81],49:[2,81],54:[2,81],57:[2,81],66:[2,81],67:[2,81],68:[2,81],69:[2,81],71:[2,81],73:[2,81],74:[2,81],78:[2,81],80:[2,81],84:[2,81],85:[2,81],86:[2,81],91:[2,81],93:[2,81],102:[2,81],104:[2,81],105:[2,81],106:[2,81],110:[2,81],118:[2,81],126:[2,81],129:[2,81],130:[2,81],131:[2,81],132:[2,81],133:[2,81],134:[2,81],135:[2,81],136:[2,81],137:[2,81],138:[2,81],139:[2,81],140:[2,81]},{1:[2,82],6:[2,82],25:[2,82],26:[2,82],40:[2,82],49:[2,82],54:[2,82],57:[2,82],66:[2,82],67:[2,82],68:[2,82],69:[2,82],71:[2,82],73:[2,82],74:[2,82],78:[2,82],80:[2,82],84:[2,82],85:[2,82],86:[2,82],91:[2,82],93:[2,82],102:[2,82],104:[2,82],105:[2,82],106:[2,82],110:[2,82],118:[2,82],126:[2,82],129:[2,82],130:[2,82],131:[2,82],132:[2,82],133:[2,82],134:[2,82],135:[2,82],136:[2,82],137:[2,82],138:[2,82],139:[2,82],140:[2,82]},{1:[2,83],6:[2,83],25:[2,83],26:[2,83],40:[2,83],49:[2,83],54:[2,83],57:[2,83],66:[2,83],67:[2,83],68:[2,83],69:[2,83],71:[2,83],73:[2,83],74:[2,83],78:[2,83],80:[2,83],84:[2,83],85:[2,83],86:[2,83],91:[2,83],93:[2,83],102:[2,83],104:[2,83],105:[2,83],106:[2,83],110:[2,83],118:[2,83],126:[2,83],129:[2,83],130:[2,83],131:[2,83],132:[2,83],133:[2,83],134:[2,83],135:[2,83],136:[2,83],137:[2,83],138:[2,83],139:[2,83],140:[2,83]},{73:[1,244]},{57:[1,195],73:[2,88],92:245,93:[1,194],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{73:[2,89]},{7:246,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,73:[2,123],76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{11:[2,117],28:[2,117],30:[2,117],31:[2,117],33:[2,117],34:[2,117],35:[2,117],36:[2,117],37:[2,117],38:[2,117],45:[2,117],46:[2,117],47:[2,117],51:[2,117],52:[2,117],73:[2,117],76:[2,117],79:[2,117],83:[2,117],88:[2,117],89:[2,117],90:[2,117],96:[2,117],100:[2,117],101:[2,117],104:[2,117],106:[2,117],108:[2,117],110:[2,117],119:[2,117],125:[2,117],127:[2,117],128:[2,117],129:[2,117],130:[2,117],131:[2,117],132:[2,117]},{11:[2,118],28:[2,118],30:[2,118],31:[2,118],33:[2,118],34:[2,118],35:[2,118],36:[2,118],37:[2,118],38:[2,118],45:[2,118],46:[2,118],47:[2,118],51:[2,118],52:[2,118],73:[2,118],76:[2,118],79:[2,118],83:[2,118],88:[2,118],89:[2,118],90:[2,118],96:[2,118],100:[2,118],101:[2,118],104:[2,118],106:[2,118],108:[2,118],110:[2,118],119:[2,118],125:[2,118],127:[2,118],128:[2,118],129:[2,118],130:[2,118],131:[2,118],132:[2,118]},{1:[2,87],6:[2,87],25:[2,87],26:[2,87],40:[2,87],49:[2,87],54:[2,87],57:[2,87],66:[2,87],67:[2,87],68:[2,87],69:[2,87],71:[2,87],73:[2,87],74:[2,87],78:[2,87],80:[2,87],84:[2,87],85:[2,87],86:[2,87],91:[2,87],93:[2,87],102:[2,87],104:[2,87],105:[2,87],106:[2,87],110:[2,87],118:[2,87],126:[2,87],129:[2,87],130:[2,87],131:[2,87],132:[2,87],133:[2,87],134:[2,87],135:[2,87],136:[2,87],137:[2,87],138:[2,87],139:[2,87],140:[2,87]},{1:[2,105],6:[2,105],25:[2,105],26:[2,105],49:[2,105],54:[2,105],57:[2,105],66:[2,105],67:[2,105],68:[2,105],69:[2,105],71:[2,105],73:[2,105],74:[2,105],78:[2,105],84:[2,105],85:[2,105],86:[2,105],91:[2,105],93:[2,105],102:[2,105],104:[2,105],105:[2,105],106:[2,105],110:[2,105],118:[2,105],126:[2,105],129:[2,105],130:[2,105],133:[2,105],134:[2,105],135:[2,105],136:[2,105],137:[2,105],138:[2,105],139:[2,105]},{1:[2,35],6:[2,35],25:[2,35],26:[2,35],49:[2,35],54:[2,35],57:[2,35],73:[2,35],78:[2,35],86:[2,35],91:[2,35],93:[2,35],102:[2,35],103:84,104:[2,35],105:[2,35],106:[2,35],109:85,110:[2,35],111:68,118:[2,35],126:[2,35],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{7:247,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:248,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,110],6:[2,110],25:[2,110],26:[2,110],49:[2,110],54:[2,110],57:[2,110],66:[2,110],67:[2,110],68:[2,110],69:[2,110],71:[2,110],73:[2,110],74:[2,110],78:[2,110],84:[2,110],85:[2,110],86:[2,110],91:[2,110],93:[2,110],102:[2,110],104:[2,110],105:[2,110],106:[2,110],110:[2,110],118:[2,110],126:[2,110],129:[2,110],130:[2,110],133:[2,110],134:[2,110],135:[2,110],136:[2,110],137:[2,110],138:[2,110],139:[2,110]},{6:[2,52],25:[2,52],53:249,54:[1,232],86:[2,52]},{6:[2,129],25:[2,129],26:[2,129],54:[2,129],57:[1,250],86:[2,129],91:[2,129],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{50:251,51:[1,59],52:[1,60]},{6:[2,53],25:[2,53],26:[2,53],27:108,28:[1,72],44:109,55:252,56:106,57:[1,107],58:110,59:111,76:[1,69],89:[1,112],90:[1,113]},{6:[1,253],25:[1,254]},{6:[2,60],25:[2,60],26:[2,60],49:[2,60],54:[2,60]},{7:255,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,23],6:[2,23],25:[2,23],26:[2,23],49:[2,23],54:[2,23],57:[2,23],73:[2,23],78:[2,23],86:[2,23],91:[2,23],93:[2,23],98:[2,23],99:[2,23],102:[2,23],104:[2,23],105:[2,23],106:[2,23],110:[2,23],118:[2,23],121:[2,23],123:[2,23],126:[2,23],129:[2,23],130:[2,23],133:[2,23],134:[2,23],135:[2,23],136:[2,23],137:[2,23],138:[2,23],139:[2,23]},{6:[1,73],26:[1,256]},{1:[2,205],6:[2,205],25:[2,205],26:[2,205],49:[2,205],54:[2,205],57:[2,205],73:[2,205],78:[2,205],86:[2,205],91:[2,205],93:[2,205],102:[2,205],103:84,104:[2,205],105:[2,205],106:[2,205],109:85,110:[2,205],111:68,118:[2,205],126:[2,205],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{7:257,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:258,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,208],6:[2,208],25:[2,208],26:[2,208],49:[2,208],54:[2,208],57:[2,208],73:[2,208],78:[2,208],86:[2,208],91:[2,208],93:[2,208],102:[2,208],103:84,104:[2,208],105:[2,208],106:[2,208],109:85,110:[2,208],111:68,118:[2,208],126:[2,208],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,185],6:[2,185],25:[2,185],26:[2,185],49:[2,185],54:[2,185],57:[2,185],73:[2,185],78:[2,185],86:[2,185],91:[2,185],93:[2,185],102:[2,185],104:[2,185],105:[2,185],106:[2,185],110:[2,185],118:[2,185],126:[2,185],129:[2,185],130:[2,185],133:[2,185],134:[2,185],135:[2,185],136:[2,185],137:[2,185],138:[2,185],139:[2,185]},{7:259,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,135],6:[2,135],25:[2,135],26:[2,135],49:[2,135],54:[2,135],57:[2,135],73:[2,135],78:[2,135],86:[2,135],91:[2,135],93:[2,135],98:[1,260],102:[2,135],104:[2,135],105:[2,135],106:[2,135],110:[2,135],118:[2,135],126:[2,135],129:[2,135],130:[2,135],133:[2,135],134:[2,135],135:[2,135],136:[2,135],137:[2,135],138:[2,135],139:[2,135]},{24:261,25:[1,115]},{24:264,25:[1,115],27:262,28:[1,72],59:263,76:[1,69]},{120:265,122:222,123:[1,223]},{26:[1,266],121:[1,267],122:268,123:[1,223]},{26:[2,178],121:[2,178],123:[2,178]},{7:270,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],95:269,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,98],6:[2,98],24:271,25:[1,115],26:[2,98],49:[2,98],54:[2,98],57:[2,98],73:[2,98],78:[2,98],86:[2,98],91:[2,98],93:[2,98],102:[2,98],103:84,104:[1,64],105:[2,98],106:[1,65],109:85,110:[1,67],111:68,118:[2,98],126:[2,98],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,101],6:[2,101],25:[2,101],26:[2,101],49:[2,101],54:[2,101],57:[2,101],73:[2,101],78:[2,101],86:[2,101],91:[2,101],93:[2,101],102:[2,101],104:[2,101],105:[2,101],106:[2,101],110:[2,101],118:[2,101],126:[2,101],129:[2,101],130:[2,101],133:[2,101],134:[2,101],135:[2,101],136:[2,101],137:[2,101],138:[2,101],139:[2,101]},{7:272,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,142],6:[2,142],25:[2,142],26:[2,142],49:[2,142],54:[2,142],57:[2,142],66:[2,142],67:[2,142],68:[2,142],69:[2,142],71:[2,142],73:[2,142],74:[2,142],78:[2,142],84:[2,142],85:[2,142],86:[2,142],91:[2,142],93:[2,142],102:[2,142],104:[2,142],105:[2,142],106:[2,142],110:[2,142],118:[2,142],126:[2,142],129:[2,142],130:[2,142],133:[2,142],134:[2,142],135:[2,142],136:[2,142],137:[2,142],138:[2,142],139:[2,142]},{6:[1,73],26:[1,273]},{7:274,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,67],11:[2,118],25:[2,67],28:[2,118],30:[2,118],31:[2,118],33:[2,118],34:[2,118],35:[2,118],36:[2,118],37:[2,118],38:[2,118],45:[2,118],46:[2,118],47:[2,118],51:[2,118],52:[2,118],54:[2,67],76:[2,118],79:[2,118],83:[2,118],88:[2,118],89:[2,118],90:[2,118],91:[2,67],96:[2,118],100:[2,118],101:[2,118],104:[2,118],106:[2,118],108:[2,118],110:[2,118],119:[2,118],125:[2,118],127:[2,118],128:[2,118],129:[2,118],130:[2,118],131:[2,118],132:[2,118]},{6:[1,276],25:[1,277],91:[1,275]},{6:[2,53],7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[2,53],26:[2,53],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],86:[2,53],88:[1,57],89:[1,58],90:[1,56],91:[2,53],94:278,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,52],25:[2,52],26:[2,52],53:279,54:[1,232]},{1:[2,182],6:[2,182],25:[2,182],26:[2,182],49:[2,182],54:[2,182],57:[2,182],73:[2,182],78:[2,182],86:[2,182],91:[2,182],93:[2,182],102:[2,182],104:[2,182],105:[2,182],106:[2,182],110:[2,182],118:[2,182],121:[2,182],126:[2,182],129:[2,182],130:[2,182],133:[2,182],134:[2,182],135:[2,182],136:[2,182],137:[2,182],138:[2,182],139:[2,182]},{7:280,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:281,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{116:[2,160],117:[2,160]},{27:160,28:[1,72],44:161,58:162,59:163,76:[1,69],89:[1,112],90:[1,113],115:282},{1:[2,167],6:[2,167],25:[2,167],26:[2,167],49:[2,167],54:[2,167],57:[2,167],73:[2,167],78:[2,167],86:[2,167],91:[2,167],93:[2,167],102:[2,167],103:84,104:[2,167],105:[1,283],106:[2,167],109:85,110:[2,167],111:68,118:[1,284],126:[2,167],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,168],6:[2,168],25:[2,168],26:[2,168],49:[2,168],54:[2,168],57:[2,168],73:[2,168],78:[2,168],86:[2,168],91:[2,168],93:[2,168],102:[2,168],103:84,104:[2,168],105:[1,285],106:[2,168],109:85,110:[2,168],111:68,118:[2,168],126:[2,168],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,287],25:[1,288],78:[1,286]},{6:[2,53],10:170,25:[2,53],26:[2,53],27:171,28:[1,72],29:172,30:[1,70],31:[1,71],41:289,42:169,44:173,46:[1,45],78:[2,53],89:[1,112]},{7:290,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,291],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,86],6:[2,86],25:[2,86],26:[2,86],40:[2,86],49:[2,86],54:[2,86],57:[2,86],66:[2,86],67:[2,86],68:[2,86],69:[2,86],71:[2,86],73:[2,86],74:[2,86],78:[2,86],80:[2,86],84:[2,86],85:[2,86],86:[2,86],91:[2,86],93:[2,86],102:[2,86],104:[2,86],105:[2,86],106:[2,86],110:[2,86],118:[2,86],126:[2,86],129:[2,86],130:[2,86],131:[2,86],132:[2,86],133:[2,86],134:[2,86],135:[2,86],136:[2,86],137:[2,86],138:[2,86],139:[2,86],140:[2,86]},{7:292,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,73:[2,121],76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{73:[2,122],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,36],6:[2,36],25:[2,36],26:[2,36],49:[2,36],54:[2,36],57:[2,36],73:[2,36],78:[2,36],86:[2,36],91:[2,36],93:[2,36],102:[2,36],103:84,104:[2,36],105:[2,36],106:[2,36],109:85,110:[2,36],111:68,118:[2,36],126:[2,36],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{26:[1,293],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,276],25:[1,277],86:[1,294]},{6:[2,67],25:[2,67],26:[2,67],54:[2,67],86:[2,67],91:[2,67]},{24:295,25:[1,115]},{6:[2,56],25:[2,56],26:[2,56],49:[2,56],54:[2,56]},{27:108,28:[1,72],44:109,55:296,56:106,57:[1,107],58:110,59:111,76:[1,69],89:[1,112],90:[1,113]},{6:[2,54],25:[2,54],26:[2,54],27:108,28:[1,72],44:109,48:297,54:[2,54],55:105,56:106,57:[1,107],58:110,59:111,76:[1,69],89:[1,112],90:[1,113]},{6:[2,61],25:[2,61],26:[2,61],49:[2,61],54:[2,61],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,24],6:[2,24],25:[2,24],26:[2,24],49:[2,24],54:[2,24],57:[2,24],73:[2,24],78:[2,24],86:[2,24],91:[2,24],93:[2,24],98:[2,24],99:[2,24],102:[2,24],104:[2,24],105:[2,24],106:[2,24],110:[2,24],118:[2,24],121:[2,24],123:[2,24],126:[2,24],129:[2,24],130:[2,24],133:[2,24],134:[2,24],135:[2,24],136:[2,24],137:[2,24],138:[2,24],139:[2,24]},{26:[1,298],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,207],6:[2,207],25:[2,207],26:[2,207],49:[2,207],54:[2,207],57:[2,207],73:[2,207],78:[2,207],86:[2,207],91:[2,207],93:[2,207],102:[2,207],103:84,104:[2,207],105:[2,207],106:[2,207],109:85,110:[2,207],111:68,118:[2,207],126:[2,207],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{24:299,25:[1,115],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{24:300,25:[1,115]},{1:[2,136],6:[2,136],25:[2,136],26:[2,136],49:[2,136],54:[2,136],57:[2,136],73:[2,136],78:[2,136],86:[2,136],91:[2,136],93:[2,136],102:[2,136],104:[2,136],105:[2,136],106:[2,136],110:[2,136],118:[2,136],126:[2,136],129:[2,136],130:[2,136],133:[2,136],134:[2,136],135:[2,136],136:[2,136],137:[2,136],138:[2,136],139:[2,136]},{24:301,25:[1,115]},{24:302,25:[1,115]},{1:[2,140],6:[2,140],25:[2,140],26:[2,140],49:[2,140],54:[2,140],57:[2,140],73:[2,140],78:[2,140],86:[2,140],91:[2,140],93:[2,140],98:[2,140],102:[2,140],104:[2,140],105:[2,140],106:[2,140],110:[2,140],118:[2,140],126:[2,140],129:[2,140],130:[2,140],133:[2,140],134:[2,140],135:[2,140],136:[2,140],137:[2,140],138:[2,140],139:[2,140]},{26:[1,303],121:[1,304],122:268,123:[1,223]},{1:[2,176],6:[2,176],25:[2,176],26:[2,176],49:[2,176],54:[2,176],57:[2,176],73:[2,176],78:[2,176],86:[2,176],91:[2,176],93:[2,176],102:[2,176],104:[2,176],105:[2,176],106:[2,176],110:[2,176],118:[2,176],126:[2,176],129:[2,176],130:[2,176],133:[2,176],134:[2,176],135:[2,176],136:[2,176],137:[2,176],138:[2,176],139:[2,176]},{24:305,25:[1,115]},{26:[2,179],121:[2,179],123:[2,179]},{24:306,25:[1,115],54:[1,307]},{25:[2,132],54:[2,132],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,99],6:[2,99],25:[2,99],26:[2,99],49:[2,99],54:[2,99],57:[2,99],73:[2,99],78:[2,99],86:[2,99],91:[2,99],93:[2,99],102:[2,99],104:[2,99],105:[2,99],106:[2,99],110:[2,99],118:[2,99],126:[2,99],129:[2,99],130:[2,99],133:[2,99],134:[2,99],135:[2,99],136:[2,99],137:[2,99],138:[2,99],139:[2,99]},{1:[2,102],6:[2,102],24:308,25:[1,115],26:[2,102],49:[2,102],54:[2,102],57:[2,102],73:[2,102],78:[2,102],86:[2,102],91:[2,102],93:[2,102],102:[2,102],103:84,104:[1,64],105:[2,102],106:[1,65],109:85,110:[1,67],111:68,118:[2,102],126:[2,102],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{102:[1,309]},{91:[1,310],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,116],6:[2,116],25:[2,116],26:[2,116],40:[2,116],49:[2,116],54:[2,116],57:[2,116],66:[2,116],67:[2,116],68:[2,116],69:[2,116],71:[2,116],73:[2,116],74:[2,116],78:[2,116],84:[2,116],85:[2,116],86:[2,116],91:[2,116],93:[2,116],102:[2,116],104:[2,116],105:[2,116],106:[2,116],110:[2,116],116:[2,116],117:[2,116],118:[2,116],126:[2,116],129:[2,116],130:[2,116],133:[2,116],134:[2,116],135:[2,116],136:[2,116],137:[2,116],138:[2,116],139:[2,116]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],94:311,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],87:312,88:[1,57],89:[1,58],90:[1,56],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,125],25:[2,125],26:[2,125],54:[2,125],86:[2,125],91:[2,125]},{6:[1,276],25:[1,277],26:[1,313]},{1:[2,145],6:[2,145],25:[2,145],26:[2,145],49:[2,145],54:[2,145],57:[2,145],73:[2,145],78:[2,145],86:[2,145],91:[2,145],93:[2,145],102:[2,145],103:84,104:[1,64],105:[2,145],106:[1,65],109:85,110:[1,67],111:68,118:[2,145],126:[2,145],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,147],6:[2,147],25:[2,147],26:[2,147],49:[2,147],54:[2,147],57:[2,147],73:[2,147],78:[2,147],86:[2,147],91:[2,147],93:[2,147],102:[2,147],103:84,104:[1,64],105:[2,147],106:[1,65],109:85,110:[1,67],111:68,118:[2,147],126:[2,147],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{116:[2,166],117:[2,166]},{7:314,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:315,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:316,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,90],6:[2,90],25:[2,90],26:[2,90],40:[2,90],49:[2,90],54:[2,90],57:[2,90],66:[2,90],67:[2,90],68:[2,90],69:[2,90],71:[2,90],73:[2,90],74:[2,90],78:[2,90],84:[2,90],85:[2,90],86:[2,90],91:[2,90],93:[2,90],102:[2,90],104:[2,90],105:[2,90],106:[2,90],110:[2,90],116:[2,90],117:[2,90],118:[2,90],126:[2,90],129:[2,90],130:[2,90],133:[2,90],134:[2,90],135:[2,90],136:[2,90],137:[2,90],138:[2,90],139:[2,90]},{10:170,27:171,28:[1,72],29:172,30:[1,70],31:[1,71],41:317,42:169,44:173,46:[1,45],89:[1,112]},{6:[2,91],10:170,25:[2,91],26:[2,91],27:171,28:[1,72],29:172,30:[1,70],31:[1,71],41:168,42:169,44:173,46:[1,45],54:[2,91],77:318,89:[1,112]},{6:[2,93],25:[2,93],26:[2,93],54:[2,93],78:[2,93]},{6:[2,39],25:[2,39],26:[2,39],54:[2,39],78:[2,39],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{7:319,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{73:[2,120],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,37],6:[2,37],25:[2,37],26:[2,37],49:[2,37],54:[2,37],57:[2,37],73:[2,37],78:[2,37],86:[2,37],91:[2,37],93:[2,37],102:[2,37],104:[2,37],105:[2,37],106:[2,37],110:[2,37],118:[2,37],126:[2,37],129:[2,37],130:[2,37],133:[2,37],134:[2,37],135:[2,37],136:[2,37],137:[2,37],138:[2,37],139:[2,37]},{1:[2,111],6:[2,111],25:[2,111],26:[2,111],49:[2,111],54:[2,111],57:[2,111],66:[2,111],67:[2,111],68:[2,111],69:[2,111],71:[2,111],73:[2,111],74:[2,111],78:[2,111],84:[2,111],85:[2,111],86:[2,111],91:[2,111],93:[2,111],102:[2,111],104:[2,111],105:[2,111],106:[2,111],110:[2,111],118:[2,111],126:[2,111],129:[2,111],130:[2,111],133:[2,111],134:[2,111],135:[2,111],136:[2,111],137:[2,111],138:[2,111],139:[2,111]},{1:[2,48],6:[2,48],25:[2,48],26:[2,48],49:[2,48],54:[2,48],57:[2,48],73:[2,48],78:[2,48],86:[2,48],91:[2,48],93:[2,48],102:[2,48],104:[2,48],105:[2,48],106:[2,48],110:[2,48],118:[2,48],126:[2,48],129:[2,48],130:[2,48],133:[2,48],134:[2,48],135:[2,48],136:[2,48],137:[2,48],138:[2,48],139:[2,48]},{6:[2,57],25:[2,57],26:[2,57],49:[2,57],54:[2,57]},{6:[2,52],25:[2,52],26:[2,52],53:320,54:[1,205]},{1:[2,206],6:[2,206],25:[2,206],26:[2,206],49:[2,206],54:[2,206],57:[2,206],73:[2,206],78:[2,206],86:[2,206],91:[2,206],93:[2,206],102:[2,206],104:[2,206],105:[2,206],106:[2,206],110:[2,206],118:[2,206],126:[2,206],129:[2,206],130:[2,206],133:[2,206],134:[2,206],135:[2,206],136:[2,206],137:[2,206],138:[2,206],139:[2,206]},{1:[2,183],6:[2,183],25:[2,183],26:[2,183],49:[2,183],54:[2,183],57:[2,183],73:[2,183],78:[2,183],86:[2,183],91:[2,183],93:[2,183],102:[2,183],104:[2,183],105:[2,183],106:[2,183],110:[2,183],118:[2,183],121:[2,183],126:[2,183],129:[2,183],130:[2,183],133:[2,183],134:[2,183],135:[2,183],136:[2,183],137:[2,183],138:[2,183],139:[2,183]},{1:[2,137],6:[2,137],25:[2,137],26:[2,137],49:[2,137],54:[2,137],57:[2,137],73:[2,137],78:[2,137],86:[2,137],91:[2,137],93:[2,137],102:[2,137],104:[2,137],105:[2,137],106:[2,137],110:[2,137],118:[2,137],126:[2,137],129:[2,137],130:[2,137],133:[2,137],134:[2,137],135:[2,137],136:[2,137],137:[2,137],138:[2,137],139:[2,137]},{1:[2,138],6:[2,138],25:[2,138],26:[2,138],49:[2,138],54:[2,138],57:[2,138],73:[2,138],78:[2,138],86:[2,138],91:[2,138],93:[2,138],98:[2,138],102:[2,138],104:[2,138],105:[2,138],106:[2,138],110:[2,138],118:[2,138],126:[2,138],129:[2,138],130:[2,138],133:[2,138],134:[2,138],135:[2,138],136:[2,138],137:[2,138],138:[2,138],139:[2,138]},{1:[2,139],6:[2,139],25:[2,139],26:[2,139],49:[2,139],54:[2,139],57:[2,139],73:[2,139],78:[2,139],86:[2,139],91:[2,139],93:[2,139],98:[2,139],102:[2,139],104:[2,139],105:[2,139],106:[2,139],110:[2,139],118:[2,139],126:[2,139],129:[2,139],130:[2,139],133:[2,139],134:[2,139],135:[2,139],136:[2,139],137:[2,139],138:[2,139],139:[2,139]},{1:[2,174],6:[2,174],25:[2,174],26:[2,174],49:[2,174],54:[2,174],57:[2,174],73:[2,174],78:[2,174],86:[2,174],91:[2,174],93:[2,174],102:[2,174],104:[2,174],105:[2,174],106:[2,174],110:[2,174],118:[2,174],126:[2,174],129:[2,174],130:[2,174],133:[2,174],134:[2,174],135:[2,174],136:[2,174],137:[2,174],138:[2,174],139:[2,174]},{24:321,25:[1,115]},{26:[1,322]},{6:[1,323],26:[2,180],121:[2,180],123:[2,180]},{7:324,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,103],6:[2,103],25:[2,103],26:[2,103],49:[2,103],54:[2,103],57:[2,103],73:[2,103],78:[2,103],86:[2,103],91:[2,103],93:[2,103],102:[2,103],104:[2,103],105:[2,103],106:[2,103],110:[2,103],118:[2,103],126:[2,103],129:[2,103],130:[2,103],133:[2,103],134:[2,103],135:[2,103],136:[2,103],137:[2,103],138:[2,103],139:[2,103]},{1:[2,143],6:[2,143],25:[2,143],26:[2,143],49:[2,143],54:[2,143],57:[2,143],66:[2,143],67:[2,143],68:[2,143],69:[2,143],71:[2,143],73:[2,143],74:[2,143],78:[2,143],84:[2,143],85:[2,143],86:[2,143],91:[2,143],93:[2,143],102:[2,143],104:[2,143],105:[2,143],106:[2,143],110:[2,143],118:[2,143],126:[2,143],129:[2,143],130:[2,143],133:[2,143],134:[2,143],135:[2,143],136:[2,143],137:[2,143],138:[2,143],139:[2,143]},{1:[2,119],6:[2,119],25:[2,119],26:[2,119],49:[2,119],54:[2,119],57:[2,119],66:[2,119],67:[2,119],68:[2,119],69:[2,119],71:[2,119],73:[2,119],74:[2,119],78:[2,119],84:[2,119],85:[2,119],86:[2,119],91:[2,119],93:[2,119],102:[2,119],104:[2,119],105:[2,119],106:[2,119],110:[2,119],118:[2,119],126:[2,119],129:[2,119],130:[2,119],133:[2,119],134:[2,119],135:[2,119],136:[2,119],137:[2,119],138:[2,119],139:[2,119]},{6:[2,126],25:[2,126],26:[2,126],54:[2,126],86:[2,126],91:[2,126]},{6:[2,52],25:[2,52],26:[2,52],53:325,54:[1,232]},{6:[2,127],25:[2,127],26:[2,127],54:[2,127],86:[2,127],91:[2,127]},{1:[2,169],6:[2,169],25:[2,169],26:[2,169],49:[2,169],54:[2,169],57:[2,169],73:[2,169],78:[2,169],86:[2,169],91:[2,169],93:[2,169],102:[2,169],103:84,104:[2,169],105:[2,169],106:[2,169],109:85,110:[2,169],111:68,118:[1,326],126:[2,169],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,171],6:[2,171],25:[2,171],26:[2,171],49:[2,171],54:[2,171],57:[2,171],73:[2,171],78:[2,171],86:[2,171],91:[2,171],93:[2,171],102:[2,171],103:84,104:[2,171],105:[1,327],106:[2,171],109:85,110:[2,171],111:68,118:[2,171],126:[2,171],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,170],6:[2,170],25:[2,170],26:[2,170],49:[2,170],54:[2,170],57:[2,170],73:[2,170],78:[2,170],86:[2,170],91:[2,170],93:[2,170],102:[2,170],103:84,104:[2,170],105:[2,170],106:[2,170],109:85,110:[2,170],111:68,118:[2,170],126:[2,170],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[2,94],25:[2,94],26:[2,94],54:[2,94],78:[2,94]},{6:[2,52],25:[2,52],26:[2,52],53:328,54:[1,242]},{26:[1,329],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,253],25:[1,254],26:[1,330]},{26:[1,331]},{1:[2,177],6:[2,177],25:[2,177],26:[2,177],49:[2,177],54:[2,177],57:[2,177],73:[2,177],78:[2,177],86:[2,177],91:[2,177],93:[2,177],102:[2,177],104:[2,177],105:[2,177],106:[2,177],110:[2,177],118:[2,177],126:[2,177],129:[2,177],130:[2,177],133:[2,177],134:[2,177],135:[2,177],136:[2,177],137:[2,177],138:[2,177],139:[2,177]},{26:[2,181],121:[2,181],123:[2,181]},{25:[2,133],54:[2,133],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,276],25:[1,277],26:[1,332]},{7:333,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:334,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[1,287],25:[1,288],26:[1,335]},{6:[2,40],25:[2,40],26:[2,40],54:[2,40],78:[2,40]},{6:[2,58],25:[2,58],26:[2,58],49:[2,58],54:[2,58]},{1:[2,175],6:[2,175],25:[2,175],26:[2,175],49:[2,175],54:[2,175],57:[2,175],73:[2,175],78:[2,175],86:[2,175],91:[2,175],93:[2,175],102:[2,175],104:[2,175],105:[2,175],106:[2,175],110:[2,175],118:[2,175],126:[2,175],129:[2,175],130:[2,175],133:[2,175],134:[2,175],135:[2,175],136:[2,175],137:[2,175],138:[2,175],139:[2,175]},{6:[2,128],25:[2,128],26:[2,128],54:[2,128],86:[2,128],91:[2,128]},{1:[2,172],6:[2,172],25:[2,172],26:[2,172],49:[2,172],54:[2,172],57:[2,172],73:[2,172],78:[2,172],86:[2,172],91:[2,172],93:[2,172],102:[2,172],103:84,104:[2,172],105:[2,172],106:[2,172],109:85,110:[2,172],111:68,118:[2,172],126:[2,172],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,173],6:[2,173],25:[2,173],26:[2,173],49:[2,173],54:[2,173],57:[2,173],73:[2,173],78:[2,173],86:[2,173],91:[2,173],93:[2,173],102:[2,173],103:84,104:[2,173],105:[2,173],106:[2,173],109:85,110:[2,173],111:68,118:[2,173],126:[2,173],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[2,95],25:[2,95],26:[2,95],54:[2,95],78:[2,95]}],defaultActions:{59:[2,50],60:[2,51],91:[2,109],192:[2,89]},parseError:function(e,t){if(!t.recoverable)throw Error(e);
this.trace(e)},parse:function(e){function t(){var e;return e=n.lexer.lex()||p,"number"!=typeof e&&(e=n.symbols_[e]||e),e}var n=this,i=[0],r=[null],o=[],s=this.table,a="",c=0,h=0,u=0,l=2,p=1,d=o.slice.call(arguments,1);this.lexer.setInput(e),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,this.lexer.yylloc===void 0&&(this.lexer.yylloc={});var f=this.lexer.yylloc;o.push(f);var m=this.lexer.options&&this.lexer.options.ranges;this.parseError="function"==typeof this.yy.parseError?this.yy.parseError:Object.getPrototypeOf(this).parseError;for(var y,b,g,k,v,w,T,C,F,L={};;){if(g=i[i.length-1],this.defaultActions[g]?k=this.defaultActions[g]:((null===y||y===void 0)&&(y=t()),k=s[g]&&s[g][y]),k===void 0||!k.length||!k[0]){var N="";F=[];for(w in s[g])this.terminals_[w]&&w>l&&F.push("'"+this.terminals_[w]+"'");N=this.lexer.showPosition?"Parse error on line "+(c+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+F.join(", ")+", got '"+(this.terminals_[y]||y)+"'":"Parse error on line "+(c+1)+": Unexpected "+(y==p?"end of input":"'"+(this.terminals_[y]||y)+"'"),this.parseError(N,{text:this.lexer.match,token:this.terminals_[y]||y,line:this.lexer.yylineno,loc:f,expected:F})}if(k[0]instanceof Array&&k.length>1)throw Error("Parse Error: multiple actions possible at state: "+g+", token: "+y);switch(k[0]){case 1:i.push(y),r.push(this.lexer.yytext),o.push(this.lexer.yylloc),i.push(k[1]),y=null,b?(y=b,b=null):(h=this.lexer.yyleng,a=this.lexer.yytext,c=this.lexer.yylineno,f=this.lexer.yylloc,u>0&&u--);break;case 2:if(T=this.productions_[k[1]][1],L.$=r[r.length-T],L._$={first_line:o[o.length-(T||1)].first_line,last_line:o[o.length-1].last_line,first_column:o[o.length-(T||1)].first_column,last_column:o[o.length-1].last_column},m&&(L._$.range=[o[o.length-(T||1)].range[0],o[o.length-1].range[1]]),v=this.performAction.apply(L,[a,h,c,this.yy,k[1],r,o].concat(d)),v!==void 0)return v;T&&(i=i.slice(0,2*-1*T),r=r.slice(0,-1*T),o=o.slice(0,-1*T)),i.push(this.productions_[k[1]][0]),r.push(L.$),o.push(L._$),C=s[i[i.length-2]][i[i.length-1]],i.push(C);break;case 3:return!0}}return!0}};return e.prototype=t,t.Parser=e,new e}();return require!==void 0&&e!==void 0&&(e.parser=n,e.Parser=n.Parser,e.parse=function(){return n.parse.apply(n,arguments)},e.main=function(t){t[1]||(console.log("Usage: "+t[0]+" FILE"),process.exit(1));var n=require("fs").readFileSync(require("path").normalize(t[1]),"utf8");return e.parser.parse(n)},t!==void 0&&require.main===t&&e.main(process.argv.slice(1))),t.exports}(),require["./scope"]=function(){var e={},t={exports:e};return function(){var t,n,i,r;r=require("./helpers"),n=r.extend,i=r.last,e.Scope=t=function(){function e(t,n,i){this.parent=t,this.expressions=n,this.method=i,this.variables=[{name:"arguments",type:"arguments"}],this.positions={},this.parent||(e.root=this)}return e.root=null,e.prototype.add=function(e,t,n){return this.shared&&!n?this.parent.add(e,t,n):Object.prototype.hasOwnProperty.call(this.positions,e)?this.variables[this.positions[e]].type=t:this.positions[e]=this.variables.push({name:e,type:t})-1},e.prototype.namedMethod=function(){var e;return(null!=(e=this.method)?e.name:void 0)||!this.parent?this.method:this.parent.namedMethod()},e.prototype.find=function(e){return this.check(e)?!0:(this.add(e,"var"),!1)},e.prototype.parameter=function(e){return this.shared&&this.parent.check(e,!0)?void 0:this.add(e,"param")},e.prototype.check=function(e){var t;return!!(this.type(e)||(null!=(t=this.parent)?t.check(e):void 0))},e.prototype.temporary=function(e,t){return e.length>1?"_"+e+(t>1?t-1:""):"_"+(t+parseInt(e,36)).toString(36).replace(/\d/g,"a")},e.prototype.type=function(e){var t,n,i,r;for(r=this.variables,n=0,i=r.length;i>n;n++)if(t=r[n],t.name===e)return t.type;return null},e.prototype.freeVariable=function(e,t){var n,i;for(null==t&&(t=!0),n=0;this.check(i=this.temporary(e,n));)n++;return t&&this.add(i,"var",!0),i},e.prototype.assign=function(e,t){return this.add(e,{value:t,assigned:!0},!0),this.hasAssignments=!0},e.prototype.hasDeclarations=function(){return!!this.declaredVariables().length},e.prototype.declaredVariables=function(){var e,t,n,i,r,o;for(e=[],t=[],o=this.variables,i=0,r=o.length;r>i;i++)n=o[i],"var"===n.type&&("_"===n.name.charAt(0)?t:e).push(n.name);return e.sort().concat(t.sort())},e.prototype.assignedVariables=function(){var e,t,n,i,r;for(i=this.variables,r=[],t=0,n=i.length;n>t;t++)e=i[t],e.type.assigned&&r.push(""+e.name+" = "+e.type.value);return r},e}()}.call(this),t.exports}(),require["./nodes"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,o,s,a,c,h,u,l,p,d,f,m,y,b,g,k,v,w,T,C,F,L,N,E,x,D,S,R,A,I,_,$,O,j,M,B,V,P,U,H,q,G,W,X,Y,z,K,J,Z,Q,et,tt,nt,it,rt,ot,st,at,ct,ht,ut,lt,pt,dt,ft,mt,yt,bt,gt,kt,vt,wt,Tt={}.hasOwnProperty,Ct=function(e,t){function n(){this.constructor=e}for(var i in t)Tt.call(t,i)&&(e[i]=t[i]);return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e},Ft=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},Lt=[].slice;Error.stackTraceLimit=1/0,H=require("./scope").Scope,vt=require("./lexer"),M=vt.RESERVED,U=vt.STRICT_PROSCRIBED,wt=require("./helpers"),nt=wt.compact,st=wt.flatten,ot=wt.extend,pt=wt.merge,it=wt.del,yt=wt.starts,rt=wt.ends,ut=wt.last,mt=wt.some,tt=wt.addLocationDataFn,lt=wt.locationDataToString,bt=wt.throwSyntaxError,e.extend=ot,e.addLocationDataFn=tt,et=function(){return!0},A=function(){return!1},Y=function(){return this},R=function(){return this.negated=!this.negated,this},e.CodeFragment=h=function(){function e(e,t){var n;this.code=""+t,this.locationData=null!=e?e.locationData:void 0,this.type=(null!=e?null!=(n=e.constructor)?n.name:void 0:void 0)||"unknown"}return e.prototype.nodeType=function(){return"CodeFragment"},e.prototype.toString=function(){return""+this.code+(this.locationData?": "+lt(this.locationData):"")},e}(),at=function(e){var t;return function(){var n,i,r;for(r=[],n=0,i=e.length;i>n;n++)t=e[n],r.push(t.code);return r}().join("")},e.Base=r=function(){function e(){}return e.prototype.nodeType=function(){return"Base"},e.prototype.compile=function(e,t){return at(this.compileToFragments(e,t))},e.prototype.wipeLocationData=function(){return this.locationData=void 0,this},e.prototype.compileToFragments=function(e,t){var n;return e=ot({},e),t&&(e.level=t),n=this.unfoldSoak(e)||this,n.tab=e.indent,e.level!==x&&n.isStatement(e)?n.compileClosure(e):n.compileNode(e)},e.prototype.compileClosure=function(e){var n,i,r,a,h;return(a=this.jumps())&&a.error("cannot use a pure statement in an expression"),e.sharedScope=!0,r=new c([],o.wrap([this])),n=[],((i=this.contains(ct))||this.contains(ht))&&(n=[new D("this")],i?(h="apply",n.push(new D("arguments"))):h="call",r=new Z(r,[new t(new D(h))])),new s(r,n).compileNode(e)},e.prototype.cache=function(e,t,n){var r,o;return this.isComplex()?(r=new D(n||e.scope.freeVariable("ref")),o=new i(r,this),t?[o.compileToFragments(e,t),[this.makeCode(r.value)]]:[o,r]):(r=t?this.compileToFragments(e,t):this,[r,r])},e.prototype.cacheToCodeFragments=function(e){return[at(e[0]),at(e[1])]},e.prototype.makeReturn=function(e){var t;return t=this.unwrapAll(),e?new s(new D(""+e+".push"),[t]):new V(t)},e.prototype.contains=function(e){var t;return t=void 0,this.traverseChildren(!1,function(n){return e(n)?(t=n,!1):void 0}),t},e.prototype.lastNonComment=function(e){var t;for(t=e.length;t--;)if(!(e[t]instanceof u))return e[t];return null},e.prototype.toString=function(e,t){var n;return null==e&&(e=""),null==t&&(t=this.constructor.name),n="\n"+e+t,this.soak&&(n+="?"),this.eachChild(function(t){return n+=t.toString(e+X)}),n},e.prototype.eachChild=function(e){var t,n,i,r,o,s,a,c;if(!this.children)return this;for(a=this.children,i=0,o=a.length;o>i;i++)if(t=a[i],this[t])for(c=st([this[t]]),r=0,s=c.length;s>r;r++)if(n=c[r],e(n)===!1)return this;return this},e.prototype.traverseChildren=function(e,t){return this.eachChild(function(n){var i;return i=t(n),i!==!1?n.traverseChildren(e,t):void 0})},e.prototype.invert=function(){return new $("!",this)},e.prototype.unwrapAll=function(){var e;for(e=this;e!==(e=e.unwrap()););return e},e.prototype.children=[],e.prototype.isStatement=A,e.prototype.jumps=A,e.prototype.isComplex=et,e.prototype.isChainable=A,e.prototype.isAssignable=A,e.prototype.unwrap=Y,e.prototype.unfoldSoak=A,e.prototype.assigns=A,e.prototype.updateLocationDataIfMissing=function(e){return this.locationData?this:(this.locationData=e,this.eachChild(function(t){return t.updateLocationDataIfMissing(e)}))},e.prototype.error=function(e){return bt(e,this.locationData)},e.prototype.makeCode=function(e){return new h(this,e)},e.prototype.wrapInBraces=function(e){return[].concat(this.makeCode("("),e,this.makeCode(")"))},e.prototype.joinFragmentArrays=function(e,t){var n,i,r,o,s;for(n=[],r=o=0,s=e.length;s>o;r=++o)i=e[r],r&&n.push(this.makeCode(t)),n=n.concat(i);return n},e}(),e.Block=o=function(e){function t(e){this.expressions=nt(st(e||[]))}return Ct(t,e),t.prototype.nodeType=function(){return"Block"},t.prototype.children=["expressions"],t.prototype.push=function(e){return this.expressions.push(e),this},t.prototype.pop=function(){return this.expressions.pop()},t.prototype.unshift=function(e){return this.expressions.unshift(e),this},t.prototype.unwrap=function(){return 1===this.expressions.length?this.expressions[0]:this},t.prototype.isEmpty=function(){return!this.expressions.length},t.prototype.isStatement=function(e){var t,n,i,r;for(r=this.expressions,n=0,i=r.length;i>n;n++)if(t=r[n],t.isStatement(e))return!0;return!1},t.prototype.jumps=function(e){var t,n,i,r,o;for(o=this.expressions,i=0,r=o.length;r>i;i++)if(t=o[i],n=t.jumps(e))return n},t.prototype.makeReturn=function(e){var t,n;for(n=this.expressions.length;n--;)if(t=this.expressions[n],!(t instanceof u)){this.expressions[n]=t.makeReturn(e),t instanceof V&&!t.expression&&this.expressions.splice(n,1);break}return this},t.prototype.compileToFragments=function(e,n){return null==e&&(e={}),e.scope?t.__super__.compileToFragments.call(this,e,n):this.compileRoot(e)},t.prototype.compileNode=function(e){var n,i,r,o,s,a,c,h,u;for(this.tab=e.indent,a=e.level===x,i=[],u=this.expressions,o=c=0,h=u.length;h>c;o=++c)s=u[o],s=s.unwrapAll(),s=s.unfoldSoak(e)||s,s instanceof t?i.push(s.compileNode(e)):a?(s.front=!0,r=s.compileToFragments(e),s.isStatement(e)||(r.unshift(this.makeCode(""+this.tab)),r.push(this.makeCode(";"))),i.push(r)):i.push(s.compileToFragments(e,L));return a?this.spaced?[].concat(this.joinFragmentArrays(i,"\n\n"),this.makeCode("\n")):this.joinFragmentArrays(i,"\n"):(n=i.length?this.joinFragmentArrays(i,", "):[this.makeCode("void 0")],i.length>1&&e.level>=L?this.wrapInBraces(n):n)},t.prototype.compileRoot=function(e){var t,n,i,r,o,s,a,c,h,l;for(e.indent=e.bare?"":X,e.level=x,this.spaced=!0,e.scope=new H(null,this,null),l=e.locals||[],c=0,h=l.length;h>c;c++)r=l[c],e.scope.parameter(r);return o=[],e.bare||(s=function(){var e,n,r,o;for(r=this.expressions,o=[],i=e=0,n=r.length;n>e&&(t=r[i],t.unwrap()instanceof u);i=++e)o.push(t);return o}.call(this),a=this.expressions.slice(s.length),this.expressions=s,s.length&&(o=this.compileNode(pt(e,{indent:""})),o.push(this.makeCode("\n"))),this.expressions=a),n=this.compileWithDeclarations(e),e.bare?n:[].concat(o,this.makeCode("(function() {\n"),n,this.makeCode("\n}).call(this);\n"))},t.prototype.compileWithDeclarations=function(e){var t,n,i,r,o,s,a,c,h,l,p,d,f,m;for(r=[],s=[],d=this.expressions,o=l=0,p=d.length;p>l&&(i=d[o],i=i.unwrap(),i instanceof u||i instanceof D);o=++l);return e=pt(e,{level:x}),o&&(a=this.expressions.splice(o,9e9),f=[this.spaced,!1],h=f[0],this.spaced=f[1],m=[this.compileNode(e),h],r=m[0],this.spaced=m[1],this.expressions=a),s=this.compileNode(e),c=e.scope,c.expressions===this&&(n=e.scope.hasDeclarations(),t=c.hasAssignments,n||t?(o&&r.push(this.makeCode("\n")),r.push(this.makeCode(""+this.tab+"var ")),n&&r.push(this.makeCode(c.declaredVariables().join(", "))),t&&(n&&r.push(this.makeCode(",\n"+(this.tab+X))),r.push(this.makeCode(c.assignedVariables().join(",\n"+(this.tab+X))))),r.push(this.makeCode(";\n"+(this.spaced?"\n":"")))):r.length&&s.length&&r.push(this.makeCode("\n"))),r.concat(s)},t.wrap=function(e){return 1===e.length&&e[0]instanceof t?e[0]:new t(e)},t}(r),e.Literal=D=function(e){function t(e){this.value=e}return Ct(t,e),t.prototype.nodeType=function(){return"Literal"},t.prototype.makeReturn=function(){return this.isStatement()?this:t.__super__.makeReturn.apply(this,arguments)},t.prototype.isAssignable=function(){return y.test(this.value)},t.prototype.isStatement=function(){var e;return"break"===(e=this.value)||"continue"===e||"debugger"===e},t.prototype.isComplex=A,t.prototype.assigns=function(e){return e===this.value},t.prototype.jumps=function(e){return"break"!==this.value||(null!=e?e.loop:void 0)||(null!=e?e.block:void 0)?"continue"!==this.value||(null!=e?e.loop:void 0)?void 0:this:this},t.prototype.compileNode=function(e){var t,n,i;return n="this"===this.value?(null!=(i=e.scope.method)?i.bound:void 0)?e.scope.method.context:this.value:this.value.reserved?'"'+this.value+'"':this.value,t=this.isStatement()?""+this.tab+n+";":n,[this.makeCode(t)]},t.prototype.toString=function(){return' "'+this.value+'"'},t}(r),e.Undefined=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return Ct(t,e),t.prototype.isAssignable=A,t.prototype.isComplex=A,t.prototype.compileNode=function(e){return[this.makeCode(e.level>=C?"(void 0)":"void 0")]},t}(r),e.Null=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return Ct(t,e),t.prototype.isAssignable=A,t.prototype.isComplex=A,t.prototype.compileNode=function(){return[this.makeCode("null")]},t}(r),e.Bool=function(e){function t(e){this.val=e}return Ct(t,e),t.prototype.isAssignable=A,t.prototype.isComplex=A,t.prototype.compileNode=function(){return[this.makeCode(this.val)]},t}(r),e.Return=V=function(e){function t(e){this.expression=e}return Ct(t,e),t.prototype.nodeType=function(){return"Return"},t.prototype.children=["expression"],t.prototype.isStatement=et,t.prototype.makeReturn=Y,t.prototype.jumps=Y,t.prototype.compileToFragments=function(e,n){var i,r;return i=null!=(r=this.expression)?r.makeReturn():void 0,!i||i instanceof t?t.__super__.compileToFragments.call(this,e,n):i.compileToFragments(e,n)},t.prototype.compileNode=function(e){var t;return t=[],t.push(this.makeCode(this.tab+("return"+(this.expression?" ":"")))),this.expression&&(t=t.concat(this.expression.compileToFragments(e,E))),t.push(this.makeCode(";")),t},t}(r),e.Value=Z=function(e){function t(e,n,i){return!n&&e instanceof t?e:(this.base=e,this.properties=n||[],i&&(this[i]=!0),this)}return Ct(t,e),t.prototype.nodeType=function(){return"Value"},t.prototype.children=["base","properties"],t.prototype.add=function(e){return this.properties=this.properties.concat(e),this},t.prototype.hasProperties=function(){return!!this.properties.length},t.prototype.bareLiteral=function(e){return!this.properties.length&&this.base instanceof e},t.prototype.isArray=function(){return this.bareLiteral(n)},t.prototype.isRange=function(){return this.bareLiteral(B)},t.prototype.isComplex=function(){return this.hasProperties()||this.base.isComplex()},t.prototype.isAssignable=function(){return this.hasProperties()||this.base.isAssignable()},t.prototype.isSimpleNumber=function(){return this.bareLiteral(D)&&P.test(this.base.value)},t.prototype.isString=function(){return this.bareLiteral(D)&&k.test(this.base.value)},t.prototype.isRegex=function(){return this.bareLiteral(D)&&g.test(this.base.value)},t.prototype.isAtomic=function(){var e,t,n,i;for(i=this.properties.concat(this.base),t=0,n=i.length;n>t;t++)if(e=i[t],e.soak||e instanceof s)return!1;return!0},t.prototype.isNotCallable=function(){return this.isSimpleNumber()||this.isString()||this.isRegex()||this.isArray()||this.isRange()||this.isSplice()||this.isObject()},t.prototype.isStatement=function(e){return!this.properties.length&&this.base.isStatement(e)},t.prototype.assigns=function(e){return!this.properties.length&&this.base.assigns(e)},t.prototype.jumps=function(e){return!this.properties.length&&this.base.jumps(e)},t.prototype.isObject=function(e){return this.properties.length?!1:this.base instanceof _&&(!e||this.base.generated)},t.prototype.isSplice=function(){return ut(this.properties)instanceof q},t.prototype.looksStatic=function(e){var t;return this.base.value===e&&this.properties.length&&"prototype"!==(null!=(t=this.properties[0].name)?t.value:void 0)},t.prototype.unwrap=function(){return this.properties.length?this:this.base},t.prototype.cacheReference=function(e){var n,r,o,s;return o=ut(this.properties),2>this.properties.length&&!this.base.isComplex()&&!(null!=o?o.isComplex():void 0)?[this,this]:(n=new t(this.base,this.properties.slice(0,-1)),n.isComplex()&&(r=new D(e.scope.freeVariable("base")),n=new t(new j(new i(r,n)))),o?(o.isComplex()&&(s=new D(e.scope.freeVariable("name")),o=new T(new i(s,o.index)),s=new T(s)),[n.add(o),new t(r||n.base,[s||o])]):[n,r])},t.prototype.compileNode=function(e){var t,n,i,r,o;for(this.base.front=this.front,i=this.properties,t=this.base.compileToFragments(e,i.length?C:null),(this.base instanceof j||i.length)&&P.test(at(t))&&t.push(this.makeCode(".")),r=0,o=i.length;o>r;r++)n=i[r],t.push.apply(t,n.compileToFragments(e));return t},t.prototype.unfoldSoak=function(e){return null!=this.unfoldedSoak?this.unfoldedSoak:this.unfoldedSoak=function(n){return function(){var r,o,s,a,c,h,u,p,d,f;if(s=n.base.unfoldSoak(e))return(d=s.body.properties).push.apply(d,n.properties),s;for(f=n.properties,o=u=0,p=f.length;p>u;o=++u)if(a=f[o],a.soak)return a.soak=!1,r=new t(n.base,n.properties.slice(0,o)),h=new t(n.base,n.properties.slice(o)),r.isComplex()&&(c=new D(e.scope.freeVariable("ref")),r=new j(new i(c,r)),h.base=c),new v(new l(r),h,{soak:!0});return!1}}(this)()},t}(r),e.Comment=u=function(e){function t(e){this.comment=e}return Ct(t,e),t.prototype.nodeType=function(){return"Comment"},t.prototype.isStatement=et,t.prototype.makeReturn=Y,t.prototype.compileNode=function(e,t){var n,i;return i=this.comment.replace(/^(\s*)#/gm,"$1 *"),n="/*"+dt(i,this.tab)+(Ft.call(i,"\n")>=0?"\n"+this.tab:"")+" */",(t||e.level)===x&&(n=e.indent+n),[this.makeCode("\n"),this.makeCode(n)]},t}(r),e.Call=s=function(e){function n(e,t,n){this.args=null!=t?t:[],this.soak=n,this.isNew=!1,this.isSuper="super"===e,this.variable=this.isSuper?null:e,e instanceof Z&&e.isNotCallable()&&e.error("literal is not a function")}return Ct(n,e),n.prototype.nodeType=function(){return"Call"},n.prototype.children=["variable","args"],n.prototype.newInstance=function(){var e,t;return e=(null!=(t=this.variable)?t.base:void 0)||this.variable,e instanceof n&&!e.isNew?e.newInstance():this.isNew=!0,this},n.prototype.superReference=function(e){var n,i;return i=e.scope.namedMethod(),(null!=i?i.klass:void 0)?(n=[new t(new D("__super__"))],i["static"]&&n.push(new t(new D("constructor"))),n.push(new t(new D(i.name))),new Z(new D(i.klass),n).compile(e)):(null!=i?i.ctor:void 0)?""+i.name+".__super__.constructor":this.error("cannot call super outside of an instance method.")},n.prototype.superThis=function(e){var t;return t=e.scope.method,t&&!t.klass&&t.context||"this"},n.prototype.unfoldSoak=function(e){var t,i,r,o,s,a,c,h,u;if(this.soak){if(this.variable){if(i=gt(e,this,"variable"))return i;h=new Z(this.variable).cacheReference(e),r=h[0],s=h[1]}else r=new D(this.superReference(e)),s=new Z(r);return s=new n(s,this.args),s.isNew=this.isNew,r=new D("typeof "+r.compile(e)+' === "function"'),new v(r,new Z(s),{soak:!0})}for(t=this,o=[];;)if(t.variable instanceof n)o.push(t),t=t.variable;else{if(!(t.variable instanceof Z))break;if(o.push(t),!((t=t.variable.base)instanceof n))break}for(u=o.reverse(),a=0,c=u.length;c>a;a++)t=u[a],i&&(t.variable instanceof n?t.variable=i:t.variable.base=i),i=gt(e,t,"variable");return i},n.prototype.compileNode=function(e){var t,n,i,r,o,s,a,c,h,u;if(null!=(h=this.variable)&&(h.front=this.front),r=G.compileSplattedArray(e,this.args,!0),r.length)return this.compileSplat(e,r);for(i=[],u=this.args,n=a=0,c=u.length;c>a;n=++a)t=u[n],n&&i.push(this.makeCode(", ")),i.push.apply(i,t.compileToFragments(e,L));return o=[],this.isSuper?(s=this.superReference(e)+(".call("+this.superThis(e)),i.length&&(s+=", "),o.push(this.makeCode(s))):(this.isNew&&o.push(this.makeCode("new ")),o.push.apply(o,this.variable.compileToFragments(e,C)),o.push(this.makeCode("("))),o.push.apply(o,i),o.push(this.makeCode(")")),o},n.prototype.compileSplat=function(e,t){var n,i,r,o,s,a;return this.isSuper?[].concat(this.makeCode(""+this.superReference(e)+".apply("+this.superThis(e)+", "),t,this.makeCode(")")):this.isNew?(o=this.tab+X,[].concat(this.makeCode("(function(func, args, ctor) {\n"+o+"ctor.prototype = func.prototype;\n"+o+"var child = new ctor, result = func.apply(child, args);\n"+o+"return Object(result) === result ? result : child;\n"+this.tab+"})("),this.variable.compileToFragments(e,L),this.makeCode(", "),t,this.makeCode(", function(){})"))):(n=[],i=new Z(this.variable),(s=i.properties.pop())&&i.isComplex()?(a=e.scope.freeVariable("ref"),n=n.concat(this.makeCode("("+a+" = "),i.compileToFragments(e,L),this.makeCode(")"),s.compileToFragments(e))):(r=i.compileToFragments(e,C),P.test(at(r))&&(r=this.wrapInBraces(r)),s?(a=at(r),r.push.apply(r,s.compileToFragments(e))):a="null",n=n.concat(r)),n=n.concat(this.makeCode(".apply("+a+", "),t,this.makeCode(")")))},n}(r),e.Extends=d=function(e){function t(e,t){this.child=e,this.parent=t}return Ct(t,e),t.prototype.nodeType=function(){return"Extends"},t.prototype.children=["child","parent"],t.prototype.compileToFragments=function(e){return new s(new Z(new D(kt("extends"))),[this.child,this.parent]).compileToFragments(e)},t}(r),e.Access=t=function(e){function t(e,t){this.name=e,this.name.asKey=!0,this.soak="soak"===t}return Ct(t,e),t.prototype.nodeType=function(){return"Access"},t.prototype.children=["name"],t.prototype.compileToFragments=function(e){var t;return t=this.name.compileToFragments(e),y.test(at(t))?t.unshift(this.makeCode(".")):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.isComplex=A,t}(r),e.Index=T=function(e){function t(e){this.index=e}return Ct(t,e),t.prototype.nodeType=function(){return"Index"},t.prototype.children=["index"],t.prototype.compileToFragments=function(e){return[].concat(this.makeCode("["),this.index.compileToFragments(e,E),this.makeCode("]"))},t.prototype.isComplex=function(){return this.index.isComplex()},t}(r),e.Range=B=function(e){function t(e,t,n){this.from=e,this.to=t,this.exclusive="exclusive"===n,this.equals=this.exclusive?"":"="}return Ct(t,e),t.prototype.nodeType=function(){return"Range"},t.prototype.children=["from","to"],t.prototype.compileVariables=function(e){var t,n,i,r,o;return e=pt(e,{top:!0}),n=this.cacheToCodeFragments(this.from.cache(e,L)),this.fromC=n[0],this.fromVar=n[1],i=this.cacheToCodeFragments(this.to.cache(e,L)),this.toC=i[0],this.toVar=i[1],(t=it(e,"step"))&&(r=this.cacheToCodeFragments(t.cache(e,L)),this.step=r[0],this.stepVar=r[1]),o=[this.fromVar.match(I),this.toVar.match(I)],this.fromNum=o[0],this.toNum=o[1],this.stepVar?this.stepNum=this.stepVar.match(I):void 0},t.prototype.compileNode=function(e){var t,n,i,r,o,s,a,c,h,u,l,p,d,f;return this.fromVar||this.compileVariables(e),e.index?(a=this.fromNum&&this.toNum,o=it(e,"index"),s=it(e,"name"),h=s&&s!==o,p=""+o+" = "+this.fromC,this.toC!==this.toVar&&(p+=", "+this.toC),this.step!==this.stepVar&&(p+=", "+this.step),d=[""+o+" <"+this.equals,""+o+" >"+this.equals],c=d[0],r=d[1],n=this.stepNum?ft(this.stepNum[0])>0?""+c+" "+this.toVar:""+r+" "+this.toVar:a?(f=[ft(this.fromNum[0]),ft(this.toNum[0])],i=f[0],l=f[1],f,l>=i?""+c+" "+l:""+r+" "+l):(t=this.stepVar?""+this.stepVar+" > 0":""+this.fromVar+" <= "+this.toVar,""+t+" ? "+c+" "+this.toVar+" : "+r+" "+this.toVar),u=this.stepVar?""+o+" += "+this.stepVar:a?h?l>=i?"++"+o:"--"+o:l>=i?""+o+"++":""+o+"--":h?""+t+" ? ++"+o+" : --"+o:""+t+" ? "+o+"++ : "+o+"--",h&&(p=""+s+" = "+p),h&&(u=""+s+" = "+u),[this.makeCode(""+p+"; "+n+"; "+u)]):this.compileArray(e)},t.prototype.compileArray=function(e){var t,n,i,r,o,s,a,c,h,u,l,p,d;return this.fromNum&&this.toNum&&20>=Math.abs(this.fromNum-this.toNum)?(h=function(){d=[];for(var e=p=+this.fromNum,t=+this.toNum;t>=p?t>=e:e>=t;t>=p?e++:e--)d.push(e);return d}.apply(this),this.exclusive&&h.pop(),[this.makeCode("["+h.join(", ")+"]")]):(s=this.tab+X,o=e.scope.freeVariable("i"),u=e.scope.freeVariable("results"),c="\n"+s+u+" = [];",this.fromNum&&this.toNum?(e.index=o,n=at(this.compileNode(e))):(l=""+o+" = "+this.fromC+(this.toC!==this.toVar?", "+this.toC:""),i=""+this.fromVar+" <= "+this.toVar,n="var "+l+"; "+i+" ? "+o+" <"+this.equals+" "+this.toVar+" : "+o+" >"+this.equals+" "+this.toVar+"; "+i+" ? "+o+"++ : "+o+"--"),a="{ "+u+".push("+o+"); }\n"+s+"return "+u+";\n"+e.indent,r=function(e){return null!=e?e.contains(ct):void 0},(r(this.from)||r(this.to))&&(t=", arguments"),[this.makeCode("(function() {"+c+"\n"+s+"for ("+n+")"+a+"}).apply(this"+(null!=t?t:"")+")")])},t}(r),e.Slice=q=function(e){function t(e){this.range=e,t.__super__.constructor.call(this)}return Ct(t,e),t.prototype.nodeType=function(){return"Slice"},t.prototype.children=["range"],t.prototype.compileNode=function(e){var t,n,i,r,o,s,a;return a=this.range,o=a.to,i=a.from,r=i&&i.compileToFragments(e,E)||[this.makeCode("0")],o&&(t=o.compileToFragments(e,E),n=at(t),(this.range.exclusive||-1!==+n)&&(s=", "+(this.range.exclusive?n:P.test(n)?""+(+n+1):(t=o.compileToFragments(e,C),"+"+at(t)+" + 1 || 9e9")))),[this.makeCode(".slice("+at(r)+(s||"")+")")]},t}(r),e.Obj=_=function(e){function t(e,t){this.generated=null!=t?t:!1,this.objects=this.properties=e||[]}return Ct(t,e),t.prototype.nodeType=function(){return"Obj"},t.prototype.children=["properties"],t.prototype.compileNode=function(e){var t,n,r,o,s,a,c,h,l,p,d,f,m;if(l=this.properties,!l.length)return[this.makeCode(this.front?"({})":"{}")];if(this.generated)for(p=0,f=l.length;f>p;p++)c=l[p],c instanceof Z&&c.error("cannot have an implicit value in an implicit object");for(r=e.indent+=X,a=this.lastNonComment(this.properties),t=[],n=d=0,m=l.length;m>d;n=++d)h=l[n],s=n===l.length-1?"":h===a||h instanceof u?"\n":",\n",o=h instanceof u?"":r,h instanceof i&&h.variable instanceof Z&&h.variable.hasProperties()&&h.variable.error("Invalid object key"),h instanceof Z&&h["this"]&&(h=new i(h.properties[0].name,h,"object")),h instanceof u||(h instanceof i||(h=new i(h,h,"object")),(h.variable.base||h.variable).asKey=!0),o&&t.push(this.makeCode(o)),t.push.apply(t,h.compileToFragments(e,x)),s&&t.push(this.makeCode(s));return t.unshift(this.makeCode("{"+(l.length&&"\n"))),t.push(this.makeCode(""+(l.length&&"\n"+this.tab)+"}")),this.front?this.wrapInBraces(t):t},t.prototype.assigns=function(e){var t,n,i,r;for(r=this.properties,n=0,i=r.length;i>n;n++)if(t=r[n],t.assigns(e))return!0;return!1},t}(r),e.Arr=n=function(e){function t(e){this.objects=e||[]}return Ct(t,e),t.prototype.nodeType=function(){return"Arr"},t.prototype.children=["objects"],t.prototype.compileNode=function(e){var t,n,i,r,o,s,a;if(!this.objects.length)return[this.makeCode("[]")];if(e.indent+=X,t=G.compileSplattedArray(e,this.objects),t.length)return t;for(t=[],n=function(){var t,n,i,r;for(i=this.objects,r=[],t=0,n=i.length;n>t;t++)o=i[t],r.push(o.compileToFragments(e,L));return r}.call(this),r=s=0,a=n.length;a>s;r=++s)i=n[r],r&&t.push(this.makeCode(", ")),t.push.apply(t,i);return at(t).indexOf("\n")>=0?(t.unshift(this.makeCode("[\n"+e.indent)),t.push(this.makeCode("\n"+this.tab+"]"))):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.assigns=function(e){var t,n,i,r;for(r=this.objects,n=0,i=r.length;i>n;n++)if(t=r[n],t.assigns(e))return!0;return!1},t}(r),e.Class=a=function(e){function n(e,t,n){this.variable=e,this.parent=t,this.body=null!=n?n:new o,this.boundFuncs=[],this.body.classBody=!0}return Ct(n,e),n.prototype.nodeType=function(){return"Class"},n.prototype.children=["variable","parent","body"],n.prototype.determineName=function(){var e,n;return this.variable?(e=(n=ut(this.variable.properties))?n instanceof t&&n.name.value:this.variable.base.value,Ft.call(U,e)>=0&&this.variable.error("class variable name may not be "+e),e&&(e=y.test(e)&&e)):null},n.prototype.setContext=function(e){return this.body.traverseChildren(!1,function(t){return t.classBody?!1:t instanceof D&&"this"===t.value?t.value=e:t instanceof c&&(t.klass=e,t.bound)?t.context=e:void 0})},n.prototype.addBoundFunctions=function(e){var n,i,r,o,s;for(s=this.boundFuncs,r=0,o=s.length;o>r;r++)n=s[r],i=new Z(new D("this"),[new t(n)]).compile(e),this.ctor.body.unshift(new D(""+i+" = "+kt("bind")+"("+i+", this)"))},n.prototype.addProperties=function(e,n,r){var o,s,a,h,u;return u=e.base.properties.slice(0),a=function(){var e;for(e=[];o=u.shift();)o instanceof i&&(s=o.variable.base,delete o.context,h=o.value,"constructor"===s.value?(this.ctor&&o.error("cannot define more than one constructor in a class"),h.bound&&o.error("cannot define a constructor as a bound function"),h instanceof c?o=this.ctor=h:(this.externalCtor=r.classScope.freeVariable("class"),o=new i(new D(this.externalCtor),h))):o.variable["this"]?h["static"]=!0:(o.variable=new Z(new D(n),[new t(new D("prototype")),new t(s)]),h instanceof c&&h.bound&&(this.boundFuncs.push(s),h.bound=!1))),e.push(o);return e}.call(this),nt(a)},n.prototype.walkBody=function(e,t){return this.traverseChildren(!1,function(r){return function(s){var a,c,h,u,l,p,d;if(a=!0,s instanceof n)return!1;if(s instanceof o){for(d=c=s.expressions,h=l=0,p=d.length;p>l;h=++l)u=d[h],u instanceof i&&u.variable.looksStatic(e)?u.value["static"]=!0:u instanceof Z&&u.isObject(!0)&&(a=!1,c[h]=r.addProperties(u,e,t));s.expressions=c=st(c)}return a&&!(s instanceof n)}}(this))},n.prototype.hoistDirectivePrologue=function(){var e,t,n;for(t=0,e=this.body.expressions;(n=e[t])&&n instanceof u||n instanceof Z&&n.isString();)++t;return this.directives=e.splice(0,t)},n.prototype.ensureConstructor=function(e){return this.ctor||(this.ctor=new c,this.externalCtor?this.ctor.body.push(new D(""+this.externalCtor+".apply(this, arguments)")):this.parent&&this.ctor.body.push(new D(""+e+".__super__.constructor.apply(this, arguments)")),this.ctor.body.makeReturn(),this.body.expressions.unshift(this.ctor)),this.ctor.ctor=this.ctor.name=e,this.ctor.klass=null,this.ctor.noReturn=!0},n.prototype.compileNode=function(e){var t,n,r,a,h,u,l,p,f;return(a=this.body.jumps())&&a.error("Class bodies cannot contain pure statements"),(n=this.body.contains(ct))&&n.error("Class bodies shouldn't reference arguments"),l=this.determineName()||"_Class",l.reserved&&(l="_"+l),u=new D(l),r=new c([],o.wrap([this.body])),t=[],e.classScope=r.makeScope(e.scope),this.hoistDirectivePrologue(),this.setContext(l),this.walkBody(l,e),this.ensureConstructor(l),this.addBoundFunctions(e),this.body.spaced=!0,this.body.expressions.push(u),this.parent&&(p=new D(e.classScope.freeVariable("super",!1)),this.body.expressions.unshift(new d(u,p)),r.params.push(new O(p)),t.push(this.parent)),(f=this.body.expressions).unshift.apply(f,this.directives),h=new j(new s(r,t)),this.variable&&(h=new i(this.variable,h)),h.compileToFragments(e)},n}(r),e.Assign=i=function(e){function n(e,t,n,i){var r,o,s;this.variable=e,this.value=t,this.context=n,this.param=i&&i.param,this.subpattern=i&&i.subpattern,s=o=this.variable.unwrapAll().value,r=Ft.call(U,s)>=0,r&&"object"!==this.context&&this.variable.error('variable name may not be "'+o+'"')}return Ct(n,e),n.prototype.nodeType=function(){return"Assign"},n.prototype.children=["variable","value"],n.prototype.isStatement=function(e){return(null!=e?e.level:void 0)===x&&null!=this.context&&Ft.call(this.context,"?")>=0},n.prototype.assigns=function(e){return this["object"===this.context?"value":"variable"].assigns(e)},n.prototype.unfoldSoak=function(e){return gt(e,this,"variable")},n.prototype.compileNode=function(e){var t,n,i,r,o,s,a,h,u,l,p;
if(i=this.variable instanceof Z){if(this.variable.isArray()||this.variable.isObject())return this.compilePatternMatch(e);if(this.variable.isSplice())return this.compileSplice(e);if("||="===(h=this.context)||"&&="===h||"?="===h)return this.compileConditional(e);if("**="===(u=this.context)||"//="===u||"%%="===u)return this.compileSpecialMath(e)}return n=this.variable.compileToFragments(e,L),o=at(n),this.context||(a=this.variable.unwrapAll(),a.isAssignable()||this.variable.error('"'+this.variable.compile(e)+'" cannot be assigned'),("function"==typeof a.hasProperties?a.hasProperties():void 0)||(this.param?e.scope.add(o,"var"):e.scope.find(o))),this.value instanceof c&&(r=S.exec(o))&&(r[2]&&(this.value.klass=r[1]),this.value.name=null!=(l=null!=(p=r[3])?p:r[4])?l:r[5]),s=this.value.compileToFragments(e,L),"object"===this.context?n.concat(this.makeCode(": "),s):(t=n.concat(this.makeCode(" "+(this.context||"=")+" "),s),L>=e.level?t:this.wrapInBraces(t))},n.prototype.compilePatternMatch=function(e){var i,r,o,s,a,c,h,u,l,d,f,m,b,g,k,v,w,C,F,E,S,R,A,I,_,$,O,B;if(v=e.level===x,C=this.value,m=this.variable.base.objects,!(b=m.length))return o=C.compileToFragments(e),e.level>=N?this.wrapInBraces(o):o;if(u=this.variable.isObject(),v&&1===b&&!((f=m[0])instanceof G))return f instanceof n?(A=f,I=A.variable,h=I.base,f=A.value):h=u?f["this"]?f.properties[0].name:f:new D(0),i=y.test(h.unwrap().value||0),C=new Z(C),C.properties.push(new(i?t:T)(h)),_=f.unwrap().value,Ft.call(M,_)>=0&&f.error("assignment to a reserved word: "+f.compile(e)),new n(f,C,null,{param:this.param}).compileToFragments(e,x);for(F=C.compileToFragments(e,L),E=at(F),r=[],s=!1,(!y.test(E)||this.variable.assigns(E))&&(r.push([this.makeCode(""+(g=e.scope.freeVariable("ref"))+" = ")].concat(Lt.call(F))),F=[this.makeCode(g)],E=g),c=S=0,R=m.length;R>S;c=++S){if(f=m[c],h=c,u&&(f instanceof n?($=f,O=$.variable,h=O.base,f=$.value):f.base instanceof j?(B=new Z(f.unwrapAll()).cacheReference(e),f=B[0],h=B[1]):h=f["this"]?f.properties[0].name:f),!s&&f instanceof G)d=f.name.unwrap().value,f=f.unwrap(),w=""+b+" <= "+E+".length ? "+kt("slice")+".call("+E+", "+c,(k=b-c-1)?(l=e.scope.freeVariable("i"),w+=", "+l+" = "+E+".length - "+k+") : ("+l+" = "+c+", [])"):w+=") : []",w=new D(w),s=""+l+"++";else{if(!s&&f instanceof p){(k=b-c-1)&&(1===k?s=""+E+".length - 1":(l=e.scope.freeVariable("i"),w=new D(""+l+" = "+E+".length - "+k),s=""+l+"++",r.push(w.compileToFragments(e,L))));continue}d=f.unwrap().value,(f instanceof G||f instanceof p)&&f.error("multiple splats/expansions are disallowed in an assignment"),"number"==typeof h?(h=new D(s||h),i=!1):i=u&&y.test(h.unwrap().value||0),w=new Z(new D(E),[new(i?t:T)(h)])}null!=d&&Ft.call(M,d)>=0&&f.error("assignment to a reserved word: "+f.compile(e)),r.push(new n(f,w,null,{param:this.param,subpattern:!0}).compileToFragments(e,L))}return v||this.subpattern||r.push(F),a=this.joinFragmentArrays(r,", "),L>e.level?a:this.wrapInBraces(a)},n.prototype.compileConditional=function(e){var t,i,r,o;return o=this.variable.cacheReference(e),i=o[0],r=o[1],!i.properties.length&&i.base instanceof D&&"this"!==i.base.value&&!e.scope.check(i.base.value)&&this.variable.error('the variable "'+i.base.value+"\" can't be assigned with "+this.context+" because it has not been declared before"),Ft.call(this.context,"?")>=0?(e.isExistentialEquals=!0,new v(new l(i),r,{type:"if"}).addElse(new n(r,this.value,"=")).compileToFragments(e)):(t=new $(this.context.slice(0,-1),i,new n(r,this.value,"=")).compileToFragments(e),L>=e.level?t:this.wrapInBraces(t))},n.prototype.compileSpecialMath=function(e){var t,i,r;return r=this.variable.cacheReference(e),t=r[0],i=r[1],new n(t,new $(this.context.slice(0,-1),i,this.value)).compileToFragments(e)},n.prototype.compileSplice=function(e){var t,n,i,r,o,s,a,c,h,u,l,p;return u=this.variable.properties.pop().range,i=u.from,a=u.to,n=u.exclusive,s=this.variable.compile(e),i?(l=this.cacheToCodeFragments(i.cache(e,N)),r=l[0],o=l[1]):r=o="0",a?i instanceof Z&&i.isSimpleNumber()&&a instanceof Z&&a.isSimpleNumber()?(a=a.compile(e)-o,n||(a+=1)):(a=a.compile(e,C)+" - "+o,n||(a+=" + 1")):a="9e9",p=this.value.cache(e,L),c=p[0],h=p[1],t=[].concat(this.makeCode("[].splice.apply("+s+", ["+r+", "+a+"].concat("),c,this.makeCode(")), "),h),e.level>x?this.wrapInBraces(t):t},n}(r),e.Code=c=function(e){function t(e,t,n){this.params=e||[],this.body=t||new o,this.bound="boundfunc"===n}return Ct(t,e),t.prototype.nodeType=function(){return"Code"},t.prototype.children=["params","body"],t.prototype.isStatement=function(){return!!this.ctor},t.prototype.jumps=A,t.prototype.makeScope=function(e){return new H(e,this.body,this)},t.prototype.compileNode=function(e){var r,a,c,h,u,l,d,f,m,y,b,g,k,w,T,F,L,N,E,x,S,R,A,I,_,j,M,B,V,P,U,H,q;if(this.bound&&(null!=(B=e.scope.method)?B.bound:void 0)&&(this.context=e.scope.method.context),this.bound&&!this.context)return this.context="_this",T=new t([new O(new D(this.context))],new o([this])),a=new s(T,[new D("this")]),a.updateLocationDataIfMissing(this.locationData),a.compileNode(e);for(e.scope=it(e,"classScope")||this.makeScope(e.scope),e.scope.shared=it(e,"sharedScope"),e.indent+=X,delete e.bare,delete e.isExistentialEquals,m=[],h=[],V=this.params,F=0,x=V.length;x>F;F++)f=V[F],f instanceof p||e.scope.parameter(f.asReference(e));for(P=this.params,L=0,S=P.length;S>L;L++)if(f=P[L],f.splat||f instanceof p){for(U=this.params,N=0,R=U.length;R>N;N++)d=U[N].name,f instanceof p||(d["this"]&&(d=d.properties[0].name),d.value&&e.scope.add(d.value,"var",!0));b=new i(new Z(new n(function(){var t,n,i,r;for(i=this.params,r=[],t=0,n=i.length;n>t;t++)d=i[t],r.push(d.asReference(e));return r}.call(this))),new Z(new D("arguments")));break}for(H=this.params,E=0,A=H.length;A>E;E++)f=H[E],f.isComplex()?(k=y=f.asReference(e),f.value&&(k=new $("?",y,f.value)),h.push(new i(new Z(f.name),k,"=",{param:!0}))):(y=f,f.value&&(l=new D(y.name.value+" == null"),k=new i(new Z(f.name),f.value,"="),h.push(new v(l,k)))),b||m.push(y);for(w=this.body.isEmpty(),b&&h.unshift(b),h.length&&(q=this.body.expressions).unshift.apply(q,h),u=j=0,I=m.length;I>j;u=++j)d=m[u],m[u]=d.compileToFragments(e),e.scope.parameter(at(m[u]));for(g=[],this.eachParamName(function(e,t){return Ft.call(g,e)>=0&&t.error("multiple parameters named '"+e+"'"),g.push(e)}),w||this.noReturn||this.body.makeReturn(),c="function",this.ctor&&(c+=" "+this.name),c+="(",r=[this.makeCode(c)],u=M=0,_=m.length;_>M;u=++M)d=m[u],u&&r.push(this.makeCode(", ")),r.push.apply(r,d);return r.push(this.makeCode(") {")),this.body.isEmpty()||(r=r.concat(this.makeCode("\n"),this.body.compileWithDeclarations(e),this.makeCode("\n"+this.tab))),r.push(this.makeCode("}")),this.ctor?[this.makeCode(this.tab)].concat(Lt.call(r)):this.front||e.level>=C?this.wrapInBraces(r):r},t.prototype.eachParamName=function(e){var t,n,i,r,o;for(r=this.params,o=[],n=0,i=r.length;i>n;n++)t=r[n],o.push(t.eachName(e));return o},t.prototype.traverseChildren=function(e,n){return e?t.__super__.traverseChildren.call(this,e,n):void 0},t}(r),e.Param=O=function(e){function t(e,t,n){var i;this.name=e,this.value=t,this.splat=n,i=e=this.name.unwrapAll().value,Ft.call(U,i)>=0&&this.name.error('parameter name "'+e+'" is not allowed')}return Ct(t,e),t.prototype.nodeType=function(){return"Param"},t.prototype.children=["name","value"],t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e,L)},t.prototype.asReference=function(e){var t;return this.reference?this.reference:(t=this.name,t["this"]?(t=t.properties[0].name,t.value.reserved&&(t=new D(e.scope.freeVariable(t.value)))):t.isComplex()&&(t=new D(e.scope.freeVariable("arg"))),t=new Z(t),this.splat&&(t=new G(t)),t.updateLocationDataIfMissing(this.locationData),this.reference=t)},t.prototype.isComplex=function(){return this.name.isComplex()},t.prototype.eachName=function(e,t){var n,r,o,s,a,c;if(null==t&&(t=this.name),n=function(t){var n;return n=t.properties[0].name,n.value.reserved?void 0:e(n.value,n)},t instanceof D)return e(t.value,t);if(t instanceof Z)return n(t);for(c=t.objects,s=0,a=c.length;a>s;s++)o=c[s],o instanceof i?this.eachName(e,o.value.unwrap()):o instanceof G?(r=o.name.unwrap(),e(r.value,r)):o instanceof Z?o.isArray()||o.isObject()?this.eachName(e,o.base):o["this"]?n(o):e(o.base.value,o.base):o instanceof p||o.error("illegal parameter "+o.compile())},t}(r),e.Splat=G=function(e){function t(e){this.name=e.compile?e:new D(e)}return Ct(t,e),t.prototype.nodeType=function(){return"Splat"},t.prototype.children=["name"],t.prototype.isAssignable=et,t.prototype.assigns=function(e){return this.name.assigns(e)},t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e)},t.prototype.unwrap=function(){return this.name},t.compileSplattedArray=function(e,n,i){var r,o,s,a,c,h,u,l,p,d;for(u=-1;(l=n[++u])&&!(l instanceof t););if(u>=n.length)return[];if(1===n.length)return l=n[0],c=l.compileToFragments(e,L),i?c:[].concat(l.makeCode(""+kt("slice")+".call("),c,l.makeCode(")"));for(r=n.slice(u),h=p=0,d=r.length;d>p;h=++p)l=r[h],s=l.compileToFragments(e,L),r[h]=l instanceof t?[].concat(l.makeCode(""+kt("slice")+".call("),s,l.makeCode(")")):[].concat(l.makeCode("["),s,l.makeCode("]"));return 0===u?(l=n[0],a=l.joinFragmentArrays(r.slice(1),", "),r[0].concat(l.makeCode(".concat("),a,l.makeCode(")"))):(o=function(){var t,i,r,o;for(r=n.slice(0,u),o=[],t=0,i=r.length;i>t;t++)l=r[t],o.push(l.compileToFragments(e,L));return o}(),o=n[0].joinFragmentArrays(o,", "),a=n[u].joinFragmentArrays(r,", "),[].concat(n[0].makeCode("["),o,n[u].makeCode("].concat("),a,ut(n).makeCode(")")))},t}(r),e.Expansion=p=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return Ct(t,e),t.prototype.nodeType=function(){return"Expansion"},t.prototype.isComplex=A,t.prototype.compileNode=function(){return this.error("Expansion must be used inside a destructuring assignment or parameter list")},t.prototype.asReference=function(){return this},t.prototype.eachName=function(){},t}(r),e.While=Q=function(e){function t(e,t){this.rawCondition=e,this.condition=(null!=t?t.invert:void 0)?e.invert():e,this.guard=null!=t?t.guard:void 0}return Ct(t,e),t.prototype.nodeType=function(){return"While"},t.prototype.children=["condition","guard","body"],t.prototype.isStatement=et,t.prototype.makeReturn=function(e){return e?t.__super__.makeReturn.apply(this,arguments):(this.returns=!this.jumps({loop:!0}),this)},t.prototype.addBody=function(e){return this.body=e,this},t.prototype.jumps=function(){var e,t,n,i,r;if(e=this.body.expressions,!e.length)return!1;for(i=0,r=e.length;r>i;i++)if(n=e[i],t=n.jumps({loop:!0}))return t;return!1},t.prototype.compileNode=function(e){var t,n,i,r;return e.indent+=X,r="",n=this.body,n.isEmpty()?n=this.makeCode(""):(this.returns&&(n.makeReturn(i=e.scope.freeVariable("results")),r=""+this.tab+i+" = [];\n"),this.guard&&(n.expressions.length>1?n.expressions.unshift(new v(new j(this.guard).invert(),new D("continue"))):this.guard&&(n=o.wrap([new v(this.guard,n)]))),n=[].concat(this.makeCode("\n"),n.compileToFragments(e,x),this.makeCode("\n"+this.tab))),t=[].concat(this.makeCode(r+this.tab+"while ("),this.condition.compileToFragments(e,E),this.makeCode(") {"),n,this.makeCode("}")),this.returns&&t.push(this.makeCode("\n"+this.tab+"return "+i+";")),t},t}(r),e.Op=$=function(e){function n(e,t,n,i){if("in"===e)return new w(t,n);if("do"===e)return this.generateDo(t);if("new"===e){if(t instanceof s&&!t["do"]&&!t.isNew)return t.locationData=void 0,t.newInstance();(t instanceof c&&t.bound||t["do"])&&(t=new j(t))}return this.operator=r[e]||e,this.first=t,this.second=n,this.flip=!!i,this}var r,o;return Ct(n,e),n.prototype.nodeType=function(){return"Op"},r={"==":"===","!=":"!==",of:"in"},o={"!==":"===","===":"!=="},n.prototype.children=["first","second"],n.prototype.isSimpleNumber=A,n.prototype.isUnary=function(){return!this.second},n.prototype.isComplex=function(){var e;return!(this.isUnary()&&("+"===(e=this.operator)||"-"===e))||this.first.isComplex()},n.prototype.isChainable=function(){var e;return"<"===(e=this.operator)||">"===e||">="===e||"<="===e||"==="===e||"!=="===e},n.prototype.invert=function(){var e,t,i,r,s;if(this.isChainable()&&this.first.isChainable()){for(e=!0,t=this;t&&t.operator;)e&&(e=t.operator in o),t=t.first;if(!e)return new j(this).invert();for(t=this;t&&t.operator;)t.invert=!t.invert,t.operator=o[t.operator],t=t.first;return this}return(r=o[this.operator])?(this.operator=r,this.first.unwrap()instanceof n&&this.first.invert(),this):this.second?new j(this).invert():"!"===this.operator&&(i=this.first.unwrap())instanceof n&&("!"===(s=i.operator)||"in"===s||"instanceof"===s)?i:new n("!",this)},n.prototype.unfoldSoak=function(e){var t;return("++"===(t=this.operator)||"--"===t||"delete"===t)&&gt(e,this,"first")},n.prototype.generateDo=function(e){var t,n,r,o,a,h,u,l;for(o=[],n=e instanceof i&&(a=e.value.unwrap())instanceof c?a:e,l=n.params||[],h=0,u=l.length;u>h;h++)r=l[h],r.value?(o.push(r.value),delete r.value):o.push(r);return t=new s(e,o),t["do"]=!0,t},n.prototype.compileNode=function(e){var t,n,i,r,o,s;if(n=this.isChainable()&&this.first.isChainable(),n||(this.first.front=this.front),"delete"===this.operator&&e.scope.check(this.first.unwrapAll().value)&&this.error("delete operand may not be argument or var"),("--"===(o=this.operator)||"++"===o)&&(s=this.first.unwrapAll().value,Ft.call(U,s)>=0)&&this.error('cannot increment/decrement "'+this.first.unwrapAll().value+'"'),this.isUnary())return this.compileUnary(e);if(n)return this.compileChain(e);switch(this.operator){case"?":return this.compileExistence(e);case"**":return this.compilePower(e);case"//":return this.compileFloorDivision(e);case"%%":return this.compileModulo(e);default:return i=this.first.compileToFragments(e,N),r=this.second.compileToFragments(e,N),t=[].concat(i,this.makeCode(" "+this.operator+" "),r),N>=e.level?t:this.wrapInBraces(t)}},n.prototype.compileChain=function(e){var t,n,i,r;return r=this.first.second.cache(e),this.first.second=r[0],i=r[1],n=this.first.compileToFragments(e,N),t=n.concat(this.makeCode(" "+(this.invert?"&&":"||")+" "),i.compileToFragments(e),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,N)),this.wrapInBraces(t)},n.prototype.compileExistence=function(e){var t,n;return this.first.isComplex()?(n=new D(e.scope.freeVariable("ref")),t=new j(new i(n,this.first))):(t=this.first,n=t),new v(new l(t),n,{type:"if"}).addElse(this.second).compileToFragments(e)},n.prototype.compileUnary=function(e){var t,i,r;return i=[],t=this.operator,i.push([this.makeCode(t)]),"!"===t&&this.first instanceof l?(this.first.negated=!this.first.negated,this.first.compileToFragments(e)):e.level>=C?new j(this).compileToFragments(e):(r="+"===t||"-"===t,("new"===t||"typeof"===t||"delete"===t||r&&this.first instanceof n&&this.first.operator===t)&&i.push([this.makeCode(" ")]),(r&&this.first instanceof n||"new"===t&&this.first.isStatement(e))&&(this.first=new j(this.first)),i.push(this.first.compileToFragments(e,N)),this.flip&&i.reverse(),this.joinFragmentArrays(i,""))},n.prototype.compilePower=function(e){var n;return n=new Z(new D("Math"),[new t(new D("pow"))]),new s(n,[this.first,this.second]).compileToFragments(e)},n.prototype.compileFloorDivision=function(e){var i,r;return r=new Z(new D("Math"),[new t(new D("floor"))]),i=new n("/",this.first,this.second),new s(r,[i]).compileToFragments(e)},n.prototype.compileModulo=function(e){var t;return t=new Z(new D(kt("modulo"))),new s(t,[this.first,this.second]).compileToFragments(e)},n.prototype.toString=function(e){return n.__super__.toString.call(this,e,this.constructor.name+" "+this.operator)},n}(r),e.In=w=function(e){function t(e,t){this.object=e,this.array=t}return Ct(t,e),t.prototype.nodeType=function(){return"In"},t.prototype.children=["object","array"],t.prototype.invert=R,t.prototype.compileNode=function(e){var t,n,i,r,o;if(this.array instanceof Z&&this.array.isArray()&&this.array.base.objects.length){for(o=this.array.base.objects,i=0,r=o.length;r>i;i++)if(n=o[i],n instanceof G){t=!0;break}if(!t)return this.compileOrTest(e)}return this.compileLoopTest(e)},t.prototype.compileOrTest=function(e){var t,n,i,r,o,s,a,c,h,u,l,p;for(u=this.object.cache(e,N),s=u[0],o=u[1],l=this.negated?[" !== "," && "]:[" === "," || "],t=l[0],n=l[1],a=[],p=this.array.base.objects,i=c=0,h=p.length;h>c;i=++c)r=p[i],i&&a.push(this.makeCode(n)),a=a.concat(i?o:s,this.makeCode(t),r.compileToFragments(e,C));return N>e.level?a:this.wrapInBraces(a)},t.prototype.compileLoopTest=function(e){var t,n,i,r;return r=this.object.cache(e,L),i=r[0],n=r[1],t=[].concat(this.makeCode(kt("indexOf")+".call("),this.array.compileToFragments(e,L),this.makeCode(", "),n,this.makeCode(") "+(this.negated?"< 0":">= 0"))),at(i)===at(n)?t:(t=i.concat(this.makeCode(", "),t),L>e.level?t:this.wrapInBraces(t))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+(this.negated?"!":""))},t}(r),e.Try=K=function(e){function t(e,t,n,i){this.attempt=e,this.errorVariable=t,this.recovery=n,this.ensure=i}return Ct(t,e),t.prototype.nodeType=function(){return"Try"},t.prototype.children=["attempt","recovery","ensure"],t.prototype.isStatement=et,t.prototype.jumps=function(e){var t;return this.attempt.jumps(e)||(null!=(t=this.recovery)?t.jumps(e):void 0)},t.prototype.makeReturn=function(e){return this.attempt&&(this.attempt=this.attempt.makeReturn(e)),this.recovery&&(this.recovery=this.recovery.makeReturn(e)),this},t.prototype.compileNode=function(e){var t,n,r,o;return e.indent+=X,o=this.attempt.compileToFragments(e,x),t=this.recovery?(r=new D("_error"),this.errorVariable?this.recovery.unshift(new i(this.errorVariable,r)):void 0,[].concat(this.makeCode(" catch ("),r.compileToFragments(e),this.makeCode(") {\n"),this.recovery.compileToFragments(e,x),this.makeCode("\n"+this.tab+"}"))):this.ensure||this.recovery?[]:[this.makeCode(" catch (_error) {}")],n=this.ensure?[].concat(this.makeCode(" finally {\n"),this.ensure.compileToFragments(e,x),this.makeCode("\n"+this.tab+"}")):[],[].concat(this.makeCode(""+this.tab+"try {\n"),o,this.makeCode("\n"+this.tab+"}"),t,n)},t}(r),e.Throw=z=function(e){function t(e){this.expression=e}return Ct(t,e),t.prototype.nodeType=function(){return"Throw"},t.prototype.children=["expression"],t.prototype.isStatement=et,t.prototype.jumps=A,t.prototype.makeReturn=Y,t.prototype.compileNode=function(e){return[].concat(this.makeCode(this.tab+"throw "),this.expression.compileToFragments(e),this.makeCode(";"))},t}(r),e.Existence=l=function(e){function t(e){this.expression=e}return Ct(t,e),t.prototype.nodeType=function(){return"Existence"},t.prototype.children=["expression"],t.prototype.invert=R,t.prototype.compileNode=function(e){var t,n,i,r;return this.expression.front=this.front,i=this.expression.compile(e,N),y.test(i)&&!e.scope.check(i)?(r=this.negated?["===","||"]:["!==","&&"],t=r[0],n=r[1],i="typeof "+i+" "+t+' "undefined" '+n+" "+i+" "+t+" null"):i=""+i+" "+(this.negated?"==":"!=")+" null",[this.makeCode(F>=e.level?i:"("+i+")")]},t}(r),e.Parens=j=function(e){function t(e){this.body=e}return Ct(t,e),t.prototype.nodeType=function(){return"Parens"},t.prototype.children=["body"],t.prototype.unwrap=function(){return this.body},t.prototype.isComplex=function(){return this.body.isComplex()},t.prototype.compileNode=function(e){var t,n,i;return n=this.body.unwrap(),n instanceof Z&&n.isAtomic()?(n.front=this.front,n.compileToFragments(e)):(i=n.compileToFragments(e,E),t=N>e.level&&(n instanceof $||n instanceof s||n instanceof f&&n.returns),t?i:this.wrapInBraces(i))},t}(r),e.For=f=function(e){function t(e,t){var n;this.source=t.source,this.guard=t.guard,this.step=t.step,this.name=t.name,this.index=t.index,this.body=o.wrap([e]),this.own=!!t.own,this.object=!!t.object,this.object&&(n=[this.index,this.name],this.name=n[0],this.index=n[1]),this.index instanceof Z&&this.index.error("index cannot be a pattern matching expression"),this.range=this.source instanceof Z&&this.source.base instanceof B&&!this.source.properties.length,this.pattern=this.name instanceof Z,this.range&&this.index&&this.index.error("indexes do not apply to range loops"),this.range&&this.pattern&&this.name.error("cannot pattern match over range loops"),this.own&&!this.object&&this.name.error("cannot use own with for-in"),this.returns=!1}return Ct(t,e),t.prototype.nodeType=function(){return"For"},t.prototype.children=["body","source","guard","step"],t.prototype.compileNode=function(e){var t,n,r,s,a,c,h,u,l,p,d,f,m,b,g,k,w,T,C,F,N,E,S,R,A,_,$,O,M,B,P,U,H,q;return t=o.wrap([this.body]),T=null!=(H=ut(t.expressions))?H.jumps():void 0,T&&T instanceof V&&(this.returns=!1),$=this.range?this.source.base:this.source,_=e.scope,this.pattern||(F=this.name&&this.name.compile(e,L)),b=this.index&&this.index.compile(e,L),F&&!this.pattern&&_.find(F),b&&_.find(b),this.returns&&(A=_.freeVariable("results")),g=this.object&&b||_.freeVariable("i"),k=this.range&&F||b||g,w=k!==g?""+k+" = ":"",this.step&&!this.range&&(q=this.cacheToCodeFragments(this.step.cache(e,L)),O=q[0],B=q[1],M=B.match(I)),this.pattern&&(F=g),U="",d="",h="",f=this.tab+X,this.range?p=$.compileToFragments(pt(e,{index:g,name:F,step:this.step})):(P=this.source.compile(e,L),!F&&!this.own||y.test(P)||(h+=""+this.tab+(E=_.freeVariable("ref"))+" = "+P+";\n",P=E),F&&!this.pattern&&(N=""+F+" = "+P+"["+k+"]"),this.object||(O!==B&&(h+=""+this.tab+O+";\n"),this.step&&M&&(l=0>ft(M[0]))||(C=_.freeVariable("len")),a=""+w+g+" = 0, "+C+" = "+P+".length",c=""+w+g+" = "+P+".length - 1",r=""+g+" < "+C,s=""+g+" >= 0",this.step?(M?l&&(r=s,a=c):(r=""+B+" > 0 ? "+r+" : "+s,a="("+B+" > 0 ? ("+a+") : "+c+")"),m=""+g+" += "+B):m=""+(k!==g?"++"+g:""+g+"++"),p=[this.makeCode(""+a+"; "+r+"; "+w+m)])),this.returns&&(S=""+this.tab+A+" = [];\n",R="\n"+this.tab+"return "+A+";",t.makeReturn(A)),this.guard&&(t.expressions.length>1?t.expressions.unshift(new v(new j(this.guard).invert(),new D("continue"))):this.guard&&(t=o.wrap([new v(this.guard,t)]))),this.pattern&&t.expressions.unshift(new i(this.name,new D(""+P+"["+k+"]"))),u=[].concat(this.makeCode(h),this.pluckDirectCall(e,t)),N&&(U="\n"+f+N+";"),this.object&&(p=[this.makeCode(""+k+" in "+P)],this.own&&(d="\n"+f+"if (!"+kt("hasProp")+".call("+P+", "+k+")) continue;")),n=t.compileToFragments(pt(e,{indent:f}),x),n&&n.length>0&&(n=[].concat(this.makeCode("\n"),n,this.makeCode("\n"))),[].concat(u,this.makeCode(""+(S||"")+this.tab+"for ("),p,this.makeCode(") {"+d+U),n,this.makeCode(""+this.tab+"}"+(R||"")))},t.prototype.pluckDirectCall=function(e,t){var n,r,o,a,h,u,l,p,d,f,m,y,b,g,k,v;for(r=[],f=t.expressions,h=p=0,d=f.length;d>p;h=++p)o=f[h],o=o.unwrapAll(),o instanceof s&&(l=null!=(m=o.variable)?m.unwrapAll():void 0,(l instanceof c||l instanceof Z&&(null!=(y=l.base)?y.unwrapAll():void 0)instanceof c&&1===l.properties.length&&("call"===(b=null!=(g=l.properties[0].name)?g.value:void 0)||"apply"===b))&&(a=(null!=(k=l.base)?k.unwrapAll():void 0)||l,u=new D(e.scope.freeVariable("fn")),n=new Z(u),l.base&&(v=[n,l],l.base=v[0],n=v[1]),t.expressions[h]=new s(n,o.args),r=r.concat(this.makeCode(this.tab),new i(u,a).compileToFragments(e,x),this.makeCode(";\n"))));return r},t}(Q),e.Switch=W=function(e){function t(e,t,n){this.subject=e,this.cases=t,this.otherwise=n}return Ct(t,e),t.prototype.nodeType=function(){return"Switch"},t.prototype.children=["subject","cases","otherwise"],t.prototype.isStatement=et,t.prototype.jumps=function(e){var t,n,i,r,o,s,a,c;for(null==e&&(e={block:!0}),s=this.cases,r=0,o=s.length;o>r;r++)if(a=s[r],n=a[0],t=a[1],i=t.jumps(e))return i;return null!=(c=this.otherwise)?c.jumps(e):void 0},t.prototype.makeReturn=function(e){var t,n,i,r,s;for(r=this.cases,n=0,i=r.length;i>n;n++)t=r[n],t[1].makeReturn(e);return e&&(this.otherwise||(this.otherwise=new o([new D("void 0")]))),null!=(s=this.otherwise)&&s.makeReturn(e),this},t.prototype.compileNode=function(e){var t,n,i,r,o,s,a,c,h,u,l,p,d,f,m,y;for(c=e.indent+X,h=e.indent=c+X,s=[].concat(this.makeCode(this.tab+"switch ("),this.subject?this.subject.compileToFragments(e,E):this.makeCode("false"),this.makeCode(") {\n")),f=this.cases,a=u=0,p=f.length;p>u;a=++u){for(m=f[a],r=m[0],t=m[1],y=st([r]),l=0,d=y.length;d>l;l++)i=y[l],this.subject||(i=i.invert()),s=s.concat(this.makeCode(c+"case "),i.compileToFragments(e,E),this.makeCode(":\n"));if((n=t.compileToFragments(e,x)).length>0&&(s=s.concat(n,this.makeCode("\n"))),a===this.cases.length-1&&!this.otherwise)break;o=this.lastNonComment(t.expressions),o instanceof V||o instanceof D&&o.jumps()&&"debugger"!==o.value||s.push(i.makeCode(h+"break;\n"))}return this.otherwise&&this.otherwise.expressions.length&&s.push.apply(s,[this.makeCode(c+"default:\n")].concat(Lt.call(this.otherwise.compileToFragments(e,x)),[this.makeCode("\n")])),s.push(this.makeCode(this.tab+"}")),s},t}(r),e.If=v=function(e){function t(e,t,n){this.body=t,null==n&&(n={}),this.rawCondition=e,this.condition="unless"===n.type?e.invert():e,this.elseBody=null,this.elseToken=null,this.isChain=!1,this.soak=n.soak}return Ct(t,e),t.prototype.nodeType=function(){return"If"},t.prototype.children=["condition","body","elseBody"],t.prototype.bodyNode=function(){var e;return null!=(e=this.body)?e.unwrap():void 0},t.prototype.elseBodyNode=function(){var e;return null!=(e=this.elseBody)?e.unwrap():void 0},t.prototype.addElse=function(e,n){return this.isChain?this.elseBodyNode().addElse(e,n):(this.isChain=e instanceof t,this.elseBody=this.ensureBlock(e),this.elseBody.updateLocationDataIfMissing(e.locationData),this.elseToken=n),this},t.prototype.isStatement=function(e){var t;return(null!=e?e.level:void 0)===x||this.bodyNode().isStatement(e)||(null!=(t=this.elseBodyNode())?t.isStatement(e):void 0)},t.prototype.jumps=function(e){var t;return this.body.jumps(e)||(null!=(t=this.elseBody)?t.jumps(e):void 0)},t.prototype.compileNode=function(e){return this.isStatement(e)?this.compileStatement(e):this.compileExpression(e)},t.prototype.makeReturn=function(e){return e&&(this.elseBody||(this.elseBody=new o([new D("void 0")]))),this.body&&(this.body=new o([this.body.makeReturn(e)])),this.elseBody&&(this.elseBody=new o([this.elseBody.makeReturn(e)])),this},t.prototype.ensureBlock=function(e){return e instanceof o?e:new o([e])},t.prototype.compileStatement=function(e){var n,i,r,o,s,a,c;return r=it(e,"chainChild"),(s=it(e,"isExistentialEquals"))?new t(this.condition.invert(),this.elseBodyNode(),{type:"if"}).compileToFragments(e):(c=e.indent+X,o=this.condition.compileToFragments(e,E),i=this.ensureBlock(this.body).compileToFragments(pt(e,{indent:c})),a=[].concat(this.makeCode("if ("),o,this.makeCode(") {\n"),i,this.makeCode("\n"+this.tab+"}")),r||a.unshift(this.makeCode(this.tab)),this.elseBody?(n=a.concat(this.makeCode(" else ")),this.isChain?(e.chainChild=!0,n=n.concat(this.elseBody.unwrap().compileToFragments(e,x))):n=n.concat(this.makeCode("{\n"),this.elseBody.compileToFragments(pt(e,{indent:c}),x),this.makeCode("\n"+this.tab+"}")),n):a)},t.prototype.compileExpression=function(e){var t,n,i,r;return i=this.condition.compileToFragments(e,F),n=this.bodyNode().compileToFragments(e,L),t=this.elseBodyNode()?this.elseBodyNode().compileToFragments(e,L):[this.makeCode("void 0")],r=i.concat(this.makeCode(" ? "),n,this.makeCode(" : "),t),e.level>=F?this.wrapInBraces(r):r},t.prototype.unfoldSoak=function(){return this.soak&&this},t}(r),J={"extends":function(){return"function(child, parent) { for (var key in parent) { if ("+kt("hasProp")+".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }"},bind:function(){return"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }"},indexOf:function(){return"[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }"},modulo:function(){return"function(a, b) { return (+a % (b = +b) + b) % b; }"},hasProp:function(){return"{}.hasOwnProperty"},slice:function(){return"[].slice"}},x=1,E=2,L=3,F=4,N=5,C=6,X="  ",b="[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",y=RegExp("^"+b+"$"),P=/^[+-]?\d+$/,m=/^[+-]?0x[\da-f]+/i,I=/^[+-]?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)$/i,S=RegExp("^("+b+")(\\.prototype)?(?:\\.("+b+")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\])$"),k=/^['"]/,g=/^\//,kt=function(e){var t;return t="__"+e,H.root.assign(t,J[e]()),t},dt=function(e,t){return e=e.replace(/\n/g,"$&"+t),e.replace(/\s+$/,"")},ft=function(e){return null==e?0:e.match(m)?parseInt(e,16):parseFloat(e)},ct=function(e){return e instanceof D&&"arguments"===e.value&&!e.asKey},ht=function(e){return e instanceof D&&"this"===e.value&&!e.asKey||e instanceof c&&e.bound||e instanceof s&&e.isSuper},gt=function(e,t,n){var i;if(i=t[n].unfoldSoak(e))return t[n]=i.body,i.body=new Z(t),i}}.call(this),t.exports}(),require["./sourcemap"]=function(){var e={},t={exports:e};return function(){var e,n;e=function(){function e(e){this.line=e,this.columns=[]}return e.prototype.add=function(e,t,n){var i,r;return r=t[0],i=t[1],null==n&&(n={}),this.columns[e]&&n.noReplace?void 0:this.columns[e]={line:this.line,column:e,sourceLine:r,sourceColumn:i}},e.prototype.sourceLocation=function(e){for(var t;!((t=this.columns[e])||0>=e);)e--;return t&&[t.sourceLine,t.sourceColumn]},e}(),n=function(){function t(){this.lines=[]}var n,i,r,o;return t.prototype.add=function(t,n,i){var r,o,s,a;return null==i&&(i={}),o=n[0],r=n[1],s=(a=this.lines)[o]||(a[o]=new e(o)),s.add(r,t,i)},t.prototype.sourceLocation=function(e){var t,n,i;for(n=e[0],t=e[1];!((i=this.lines[n])||0>=n);)n--;return i&&i.sourceLocation(t)},t.prototype.generate=function(e,t){var n,i,r,o,s,a,c,h,u,l,p,d,f,m,y,b;for(null==e&&(e={}),null==t&&(t=null),l=0,i=0,o=0,r=0,h=!1,n="",y=this.lines,a=p=0,f=y.length;f>p;a=++p)if(s=y[a])for(b=s.columns,d=0,m=b.length;m>d;d++)if(c=b[d]){for(;c.line>l;)i=0,h=!1,n+=";",l++;h&&(n+=",",h=!1),n+=this.encodeVlq(c.column-i),i=c.column,n+=this.encodeVlq(0),n+=this.encodeVlq(c.sourceLine-o),o=c.sourceLine,n+=this.encodeVlq(c.sourceColumn-r),r=c.sourceColumn,h=!0}return u={version:3,file:e.generatedFile||"",sourceRoot:e.sourceRoot||"",sources:e.sourceFiles||[""],names:[],mappings:n},e.inline&&(u.sourcesContent=[t]),JSON.stringify(u,null,2)},r=5,i=1<<r,o=i-1,t.prototype.encodeVlq=function(e){var t,n,s,a;for(t="",s=0>e?1:0,a=(Math.abs(e)<<1)+s;a||!t;)n=a&o,a>>=r,a&&(n|=i),t+=this.encodeBase64(n);return t},n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t.prototype.encodeBase64=function(e){return n[e]||function(){throw Error("Cannot Base64 encode value: "+e)}()},t}(),t.exports=n}.call(this),t.exports}(),require["./coffee-script"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,o,s,a,c,h,u,l,p,d,f,m,y,b,g,k={}.hasOwnProperty,v=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};if(s=require("fs"),d=require("vm"),l=require("path"),t=require("./lexer").Lexer,u=require("./parser").parser,c=require("./helpers"),n=require("./sourcemap"),e.VERSION="1.7.1",e.FILE_EXTENSIONS=[".coffee",".litcoffee",".coffee.md"],e.helpers=c,f=function(e){return function(t,n){var i;null==n&&(n={});try{return e.call(this,t,n)}catch(r){throw i=r,c.updateSyntaxError(i,t,n.filename)}}},e.compile=i=f(function(e,t){var i,r,o,s,a,l,p,d,f,m,y,b,g;for(m=c.merge,s=c.extend,t=s({},t),t.sourceMap&&(f=new n),l=u.parse(h.tokenize(e,t)).compileToFragments(t),o=0,t.header&&(o+=1),t.shiftLine&&(o+=1),r=0,d="",b=0,g=l.length;g>b;b++)a=l[b],t.sourceMap&&(a.locationData&&f.add([a.locationData.first_line,a.locationData.first_column],[o,r],{noReplace:!0}),y=c.count(a.code,"\n"),o+=y,y?r=a.code.length-(a.code.lastIndexOf("\n")+1):r+=a.code.length),d+=a.code;return t.header&&(p="Generated by CoffeeScript "+this.VERSION,d="// "+p+"\n"+d),t.sourceMap?(i={js:d},i.sourceMap=f,i.v3SourceMap=f.generate(t,e),i):d
}),e.tokens=f(function(e,t){return h.tokenize(e,t)}),e.nodes=f(function(e,t){return"string"==typeof e?u.parse(h.tokenize(e,t)):u.parse(e)}),e.run=function(e,t){var n,r,o,a;return null==t&&(t={}),o=require.main,o.filename=process.argv[1]=t.filename?s.realpathSync(t.filename):".",o.moduleCache&&(o.moduleCache={}),r=t.filename?l.dirname(s.realpathSync(t.filename)):s.realpathSync("."),o.paths=require("module")._nodeModulePaths(r),(!c.isCoffee(o.filename)||require.extensions)&&(n=i(e,t),e=null!=(a=n.js)?a:n),o._compile(e,o.filename)},e.eval=function(e,t){var n,r,o,s,a,c,h,u,p,f,m,y,b,g;if(null==t&&(t={}),e=e.trim()){if(r=d.Script){if(null!=t.sandbox){if(t.sandbox instanceof r.createContext().constructor)h=t.sandbox;else{h=r.createContext(),y=t.sandbox;for(s in y)k.call(y,s)&&(u=y[s],h[s]=u)}h.global=h.root=h.GLOBAL=h}else h=global;if(h.__filename=t.filename||"eval",h.__dirname=l.dirname(h.__filename),h===global&&!h.module&&!h.require){for(n=require("module"),h.module=m=new n(t.modulename||"eval"),h.require=g=function(e){return n._load(e,m,!0)},m.filename=h.__filename,b=Object.getOwnPropertyNames(require),p=0,f=b.length;f>p;p++)c=b[p],"paths"!==c&&(g[c]=require[c]);g.paths=m.paths=n._nodeModulePaths(process.cwd()),g.resolve=function(e){return n._resolveFilename(e,m)}}}a={};for(s in t)k.call(t,s)&&(u=t[s],a[s]=u);return a.bare=!0,o=i(e,a),h===global?d.runInThisContext(o):d.runInContext(o,h)}},e.register=function(){return require("./register")},require.extensions)for(g=this.FILE_EXTENSIONS,y=0,b=g.length;b>y;y++)r=g[y],null==(m=require.extensions)[r]&&(m[r]=function(){throw Error("Use CoffeeScript.register() or require the coffee-script/register module to require "+r+" files.")});e._compileFile=function(e,t){var n,r,o,a;null==t&&(t=!1),o=s.readFileSync(e,"utf8"),a=65279===o.charCodeAt(0)?o.substring(1):o;try{n=i(a,{filename:e,sourceMap:t,literate:c.isLiterate(e)})}catch(h){throw r=h,c.updateSyntaxError(r,a,e)}return n},h=new t,u.lexer={lex:function(){var e,t;return t=this.tokens[this.pos++],t?(e=t[0],this.yytext=t[1],this.yylloc=t[2],this.errorToken=t.origin||t,this.yylineno=this.yylloc.first_line):e="",e},setInput:function(e){return this.tokens=e,this.pos=0},upcomingInput:function(){return""}},u.yy=require("./nodes"),u.yy.parseError=function(e,t){var n,i,r,o,s,a,h;return s=t.token,h=u.lexer,o=h.errorToken,a=h.tokens,i=o[0],r=o[1],n=o[2],r=o===a[a.length-1]?"end of input":"INDENT"===i||"OUTDENT"===i?"indentation":c.nameWhitespaceCharacter(r),c.throwSyntaxError("unexpected "+r,n)},o=function(e,t){var n,i,r,o,s,a,c,h,u,l,p,d;return o=void 0,r="",e.isNative()?r="native":(e.isEval()?(o=e.getScriptNameOrSourceURL(),o||(r=""+e.getEvalOrigin()+", ")):o=e.getFileName(),o||(o="<anonymous>"),h=e.getLineNumber(),i=e.getColumnNumber(),l=t(o,h,i),r=l?""+o+":"+l[0]+":"+l[1]:""+o+":"+h+":"+i),s=e.getFunctionName(),a=e.isConstructor(),c=!(e.isToplevel()||a),c?(u=e.getMethodName(),d=e.getTypeName(),s?(p=n="",d&&s.indexOf(d)&&(p=""+d+"."),u&&s.indexOf("."+u)!==s.length-u.length-1&&(n=" [as "+u+"]"),""+p+s+n+" ("+r+")"):""+d+"."+(u||"<anonymous>")+" ("+r+")"):a?"new "+(s||"<anonymous>")+" ("+r+")":s?""+s+" ("+r+")":r},p={},a=function(t){var n,i;if(p[t])return p[t];if(i=null!=l?l.extname(t):void 0,!(0>v.call(e.FILE_EXTENSIONS,i)))return n=e._compileFile(t,!0),p[t]=n.sourceMap},Error.prepareStackTrace=function(t,n){var i,r,s;return s=function(e,t,n){var i,r;return r=a(e),r&&(i=r.sourceLocation([t-1,n-1])),i?[i[0]+1,i[1]+1]:null},r=function(){var t,r,a;for(a=[],t=0,r=n.length;r>t&&(i=n[t],i.getFunction()!==e.run);t++)a.push("  at "+o(i,s));return a}(),""+(""+t)+"\n"+r.join("\n")+"\n"}}.call(this),t.exports}(),require["./browser"]=function(){var exports={},module={exports:exports};return function(){var CoffeeScript,compile,runScripts,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};CoffeeScript=require("./coffee-script"),CoffeeScript.require=require,compile=CoffeeScript.compile,CoffeeScript.eval=function(code,options){return null==options&&(options={}),null==options.bare&&(options.bare=!0),eval(compile(code,options))},CoffeeScript.run=function(e,t){return null==t&&(t={}),t.bare=!0,t.shiftLine=!0,Function(compile(e,t))()},"undefined"!=typeof window&&null!==window&&("undefined"!=typeof btoa&&null!==btoa&&"undefined"!=typeof JSON&&null!==JSON&&"undefined"!=typeof unescape&&null!==unescape&&"undefined"!=typeof encodeURIComponent&&null!==encodeURIComponent&&(compile=function(e,t){var n,i,r;return null==t&&(t={}),t.sourceMap=!0,t.inline=!0,r=CoffeeScript.compile(e,t),n=r.js,i=r.v3SourceMap,""+n+"\n//# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(i)))+"\n//# sourceURL=coffeescript"}),CoffeeScript.load=function(e,t,n,i){var r;return null==n&&(n={}),null==i&&(i=!1),n.sourceFiles=[e],r=window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):new window.XMLHttpRequest,r.open("GET",e,!0),"overrideMimeType"in r&&r.overrideMimeType("text/plain"),r.onreadystatechange=function(){var o,s;if(4===r.readyState){if(0!==(s=r.status)&&200!==s)throw Error("Could not load "+e);if(o=[r.responseText,n],i||CoffeeScript.run.apply(CoffeeScript,o),t)return t(o)}},r.send(null)},runScripts=function(){var e,t,n,i,r,o,s,a,c,h,u;for(a=window.document.getElementsByTagName("script"),t=["text/coffeescript","text/literate-coffeescript"],e=function(){var e,n,i,r;for(r=[],e=0,n=a.length;n>e;e++)o=a[e],i=o.type,__indexOf.call(t,i)>=0&&r.push(o);return r}(),r=0,n=function(){var t;return t=e[r],t instanceof Array?(CoffeeScript.run.apply(CoffeeScript,t),r++,n()):void 0},c=function(i,r){var o;return o={literate:i.type===t[1]},i.src?CoffeeScript.load(i.src,function(t){return e[r]=t,n()},o,!0):(o.sourceFiles=["embedded"],e[r]=[i.innerHTML,o])},i=h=0,u=e.length;u>h;i=++h)s=e[i],c(s,i);return n()},window.addEventListener?window.addEventListener("DOMContentLoaded",runScripts,!1):window.attachEvent("onload",runScripts))}.call(this),module.exports}(),require["./coffee-script"]}();"function"==typeof define&&define.amd?define('coffee-script',[],function(){return CoffeeScript}):root.CoffeeScript=CoffeeScript})(this);
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('ice-coffee',['ice-helper', 'ice-model', 'ice-parser', 'coffee-script'], function(helper, model, parser, CoffeeScript) {
    var ANY_DROP, BLOCK_FUNCTIONS, BLOCK_ONLY, CoffeeScriptTranspiler, EITHER_FUNCTIONS, MOSTLY_BLOCK, MOSTLY_VALUE, NO, OPERATOR_PRECEDENCES, SAY_FORBID, SAY_NORMAL, STATEMENT_KEYWORDS, VALUE_FUNCTIONS, VALUE_ONLY, YES, addEmptyBackTickLineAfter, backTickLine, coffeeScriptParser, exports, findUnmatchedLine, fixCoffeeScriptError, getClassesFor, spacestring;
    exports = {};
    ANY_DROP = helper.ANY_DROP;
    BLOCK_ONLY = helper.BLOCK_ONLY;
    MOSTLY_BLOCK = helper.MOSTLY_BLOCK;
    MOSTLY_VALUE = helper.MOSTLY_VALUE;
    VALUE_ONLY = helper.VALUE_ONLY;
    BLOCK_FUNCTIONS = ['fd', 'bk', 'rt', 'lt', 'slide', 'movexy', 'moveto', 'jump', 'jumpto', 'turnto', 'home', 'pen', 'fill', 'dot', 'box', 'mirror', 'twist', 'scale', 'pause', 'st', 'ht', 'pu', 'pd', 'pe', 'pf', 'play', 'tone', 'silence', 'speed', 'wear', 'drawon', 'label', 'reload', 'see', 'sync', 'send', 'recv', 'click', 'mousemove', 'mouseup', 'mousedown', 'keyup', 'keydown', 'keypress'];
    VALUE_FUNCTIONS = ['abs', 'acos', 'asin', 'atan', 'atan2', 'cos', 'sin', 'tan', 'ceil', 'floor', 'round', 'exp', 'ln', 'log10', 'pow', 'sqrt', 'max', 'min', 'random', 'pagexy', 'getxy', 'direction', 'distance', 'shown', 'hidden', 'inside', 'touches', 'within', 'notwithin', 'nearest', 'pressed', 'canvas', 'hsl', 'hsla', 'rgb', 'rgba', 'cell'];
    EITHER_FUNCTIONS = ['button', 'read', 'readstr', 'readnum', 'write', 'table', 'append', 'finish', 'loadscript'];
    STATEMENT_KEYWORDS = ['break', 'continue'];
    OPERATOR_PRECEDENCES = {
      '||': 1,
      '&&': 2,
      'instanceof': 3,
      '===': 3,
      '!==': 3,
      '>': 3,
      '<': 3,
      '>=': 3,
      '<=': 3,
      '+': 4,
      '-': 4,
      '*': 5,
      '/': 5,
      '%': 6,
      '**': 7,
      '%%': 7
    };
    SAY_NORMAL = function() {
      return helper.NORMAL;
    };
    SAY_FORBID = function() {
      return helper.FORBID;
    };
    YES = function() {
      return true;
    };
    NO = function() {
      return false;
    };
    spacestring = function(n) {
      return ((function() {
        var _i, _ref, _results;
        _results = [];
        for (_i = 0, _ref = Math.max(0, n); 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--) {
          _results.push(' ');
        }
        return _results;
      })()).join('');
    };
    getClassesFor = function(node) {
      var classes;
      classes = [];
      classes.push(node.nodeType());
      if (node.nodeType() === 'Call' && (!node["do"]) && (!node.isNew)) {
        classes.push('works-as-method-call');
      }
      return classes;
    };
    CoffeeScriptTranspiler = (function() {
      function CoffeeScriptTranspiler(text) {
        var i, line, _i, _len, _ref;
        this.text = text;
        this.markup = [];
        this.lines = this.text.split('\n');
        this.hasLineBeenMarked = {};
        _ref = this.lines;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          line = _ref[i];
          this.hasLineBeenMarked[i] = false;
        }
      }

      CoffeeScriptTranspiler.prototype.transpile = function() {
        var node, nodes, _i, _len;
        this.stripComments();
        nodes = CoffeeScript.nodes(this.text).expressions;
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          node = nodes[_i];
          this.mark(node, 3, 0, null, 0);
        }
        this.wrapSemicolons(nodes, 0);
        return this.markup;
      };

      CoffeeScriptTranspiler.prototype.stripComments = function() {
        var i, line, token, tokens, _i, _j, _len, _ref, _ref1;
        tokens = CoffeeScript.tokens(this.text, {
          rewrite: false,
          preserveComments: true
        });
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          token = tokens[_i];
          if (token[0] === 'COMMENT') {
            if (token[2].first_line === token[2].last_line) {
              line = this.lines[token[2].first_line];
              this.lines[token[2].first_line] = line.slice(0, token[2].first_column) + spacestring(token[2].last_column - token[2].first_column + 1) + line.slice(token[2].last_column);
            } else {
              line = this.lines[token[2].first_line];
              this.lines[token[2].first_line] = line.slice(0, token[2].first_column) + spacestring(line.length - token[2].first_column);
              this.lines[token[2].last_line] = spacestring(token[2].last_column + 1) + this.lines[token[2].last_line].slice(token[2].last_column + 1);
              for (i = _j = _ref = token[2].first_line + 1, _ref1 = token[2].last_line; _ref <= _ref1 ? _j < _ref1 : _j > _ref1; i = _ref <= _ref1 ? ++_j : --_j) {
                this.lines[i] = spacestring(this.lines[i].length);
              }
            }
          }
        }
        return null;
      };

      CoffeeScriptTranspiler.prototype.mark = function(node, depth, precedence, wrappingParen, indentDepth) {
        var arg, bounds, childName, condition, errorSocket, expr, fakeBlock, firstBounds, indent, index, infix, line, lines, methodname, object, param, property, secondBounds, shouldBeOneLine, switchCase, textLine, trueIndentDepth, unrecognized, _i, _j, _k, _l, _len, _len1, _len10, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _results1, _results2, _results3, _results4, _s, _t;
        switch (node.nodeType()) {
          case 'Block':
            if (node.expressions.length === 0) {
              return;
            }
            bounds = this.getBounds(node);
            shouldBeOneLine = false;
            for (line = _i = _ref = bounds.start.line, _ref1 = bounds.end.line; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; line = _ref <= _ref1 ? ++_i : --_i) {
              shouldBeOneLine || (shouldBeOneLine = this.hasLineBeenMarked[line]);
            }
            if (this.lines[bounds.start.line].slice(0, bounds.start.column).trim().length !== 0) {
              shouldBeOneLine = true;
            }
            if (shouldBeOneLine) {
              this.addSocket(node, depth, 0);
            } else {
              textLine = this.lines[node.locationData.first_line];
              trueIndentDepth = textLine.length - textLine.trimLeft().length;
              indent = new model.Indent(this.lines[node.locationData.first_line].slice(indentDepth, trueIndentDepth));
              indentDepth = trueIndentDepth;
              while (bounds.start.line > 0 && this.lines[bounds.start.line - 1].trim().length === 0) {
                bounds.start.line -= 1;
                bounds.start.column = this.lines[bounds.start.line].length + 1;
              }
              bounds.start.line -= 1;
              bounds.start.column = this.lines[bounds.start.line].length + 1;
              this.addMarkupAtLocation(indent, bounds, depth);
            }
            _ref2 = node.expressions;
            for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
              expr = _ref2[_j];
              this.mark(expr, depth + 3, 0, null, indentDepth);
            }
            return this.wrapSemicolons(node.expressions, depth);
          case 'Parens':
            if (node.body != null) {
              if (node.body.nodeType() !== 'Block') {
                return this.mark(node.body, depth + 1, 0, wrappingParen != null ? wrappingParen : node, indentDepth);
              } else {
                if (node.body.unwrap() === node.body) {
                  this.addBlock(node, depth, 0, 'command', null, MOSTLY_BLOCK);
                  _ref3 = node.body.expressions;
                  _results = [];
                  for (_k = 0, _len1 = _ref3.length; _k < _len1; _k++) {
                    expr = _ref3[_k];
                    _results.push(this.addSocketAndMark(expr, depth + 1, 0, indentDepth));
                  }
                  return _results;
                } else {
                  return this.mark(node.body.unwrap(), depth + 1, 0, wrappingParen != null ? wrappingParen : node, indentDepth);
                }
              }
            }
            break;
          case 'Op':
            if ((node.first != null) && (node.second != null) && node.operator === '+') {
              firstBounds = this.getBounds(node.first);
              secondBounds = this.getBounds(node.second);
              lines = this.lines.slice(firstBounds.end.line, +secondBounds.start.line + 1 || 9e9).join('\n');
              infix = lines.slice(firstBounds.end.column, -(this.lines[secondBounds.start.line].length - secondBounds.start.column));
              if (infix.indexOf('+') === -1) {
                return;
              }
            }
            if (node.first && !node.second && ((_ref4 = node.operator) === '+' || _ref4 === '-') && ((_ref5 = node.first) != null ? (_ref6 = _ref5.base) != null ? typeof _ref6.nodeType === "function" ? _ref6.nodeType() : void 0 : void 0 : void 0) === 'Literal') {
              return;
            }
            this.addBlock(node, depth, OPERATOR_PRECEDENCES[node.operator], 'value', wrappingParen, VALUE_ONLY);
            this.addSocketAndMark(node.first, depth + 1, OPERATOR_PRECEDENCES[node.operator], indentDepth);
            if (node.second != null) {
              return this.addSocketAndMark(node.second, depth + 1, OPERATOR_PRECEDENCES[node.operator], indentDepth);
            }
            break;
          case 'Existence':
            this.addBlock(node, depth, 100, 'value', wrappingParen, VALUE_ONLY);
            return this.addSocketAndMark(node.expression, depth + 1, 101, indentDepth);
          case 'In':
            this.addBlock(node, depth, 0, 'value', wrappingParen, VALUE_ONLY);
            this.addSocketAndMark(node.object, depth + 1, 0, indentDepth);
            return this.addSocketAndMark(node.array, depth + 1, 0, indentDepth);
          case 'Value':
            if ((node.properties != null) && node.properties.length > 0) {
              this.addBlock(node, depth, 0, 'value', wrappingParen, MOSTLY_VALUE);
              this.addSocketAndMark(node.base, depth + 1, precedence, indentDepth);
              _ref7 = node.properties;
              _results1 = [];
              for (_l = 0, _len2 = _ref7.length; _l < _len2; _l++) {
                property = _ref7[_l];
                if (property.nodeType() === 'Access') {
                  _results1.push(this.addSocketAndMark(property.name, depth + 1, -2, indentDepth, function(block) {
                    if (__indexOf.call(block.classes, 'works-as-method-call') >= 0) {
                      return helper.ENCOURAGE_ALL;
                    } else {
                      return helper.FORBID;
                    }
                  }));
                } else if (property.nodeType() === 'Index') {
                  _results1.push(this.addSocketAndMark(property.index, depth + 1, precedence, indentDepth));
                } else {
                  _results1.push(void 0);
                }
              }
              return _results1;
            } else if (node.base.nodeType() === 'Literal' && node.base.value === '') {
              fakeBlock = this.addBlock(node.base, depth, 0, 'value', wrappingParen, ANY_DROP);
              return fakeBlock.flagToRemove = true;
            } else if (node.base.nodeType() === 'Literal' && /^#/.test(node.base.value)) {
              this.addBlock(node.base, depth, 0, 'blank', wrappingParen, ANY_DROP);
              errorSocket = this.addSocket(node.base, depth + 1, -2);
              return errorSocket.flagToStrip = {
                left: 2,
                right: 1
              };
            } else {
              return this.mark(node.base, depth + 1, precedence, wrappingParen, indentDepth);
            }
            break;
          case 'Literal':
            if (_ref8 = node.value, __indexOf.call(STATEMENT_KEYWORDS, _ref8) >= 0) {
              return this.addBlock(node, depth, 0, 'return', wrappingParen, BLOCK_ONLY);
            } else {
              return 0;
            }
            break;
          case 'Literal':
          case 'Bool':
          case 'Undefined':
          case 'Null':
            return 0;
          case 'Call':
            if (node.variable != null) {
              methodname = null;
              unrecognized = false;
              if (((_ref9 = node.variable.properties) != null ? _ref9.length : void 0) > 0) {
                methodname = (_ref10 = node.variable.properties[node.variable.properties.length - 1].name) != null ? _ref10.value : void 0;
              } else if ((_ref11 = node.variable.base) != null ? _ref11.value : void 0) {
                methodname = node.variable.base.value;
              }
              if (__indexOf.call(BLOCK_FUNCTIONS, methodname) >= 0) {
                this.addBlock(node, depth, 0, 'command', wrappingParen, MOSTLY_BLOCK);
              } else if (__indexOf.call(VALUE_FUNCTIONS, methodname) >= 0) {
                this.addBlock(node, depth, 0, 'value', wrappingParen, MOSTLY_VALUE);
              } else {
                this.addBlock(node, depth, 0, 'command', wrappingParen, ANY_DROP);
                unrecognized = !(__indexOf.call(EITHER_FUNCTIONS, methodname) >= 0);
              }
              if ((methodname != null ? methodname.length : void 0) > 1 && (node != null ? (_ref12 = node.variable) != null ? _ref12.locationData : void 0 : void 0) && node.variable.locationData.first_column === node.variable.locationData.last_column && node.variable.locationData.first_line === node.variable.locationData.last_line) {
                unrecognized = false;
              }
              if (unrecognized || ((_ref13 = node.variable.base) != null ? _ref13.nodeType() : void 0) !== 'Literal') {
                this.addSocketAndMark(node.variable, depth + 1, 0, indentDepth);
              } else if (((_ref14 = node.variable.properties) != null ? _ref14.length : void 0) > 0) {
                this.addSocketAndMark(node.variable.base, depth + 1, 0, indentDepth);
              }
            } else {
              this.addBlock(node, depth, precedence, 'command', wrappingParen, ANY_DROP);
            }
            if (!node["do"]) {
              _ref15 = node.args;
              _results2 = [];
              for (index = _m = 0, _len3 = _ref15.length; _m < _len3; index = ++_m) {
                arg = _ref15[index];
                precedence = 0;
                if (index === node.args.length - 1) {
                  precedence = -1;
                }
                _results2.push(this.addSocketAndMark(arg, depth + 1, precedence, indentDepth));
              }
              return _results2;
            }
            break;
          case 'Code':
            this.addBlock(node, depth, precedence, 'value', wrappingParen, VALUE_ONLY);
            _ref16 = node.params;
            for (_n = 0, _len4 = _ref16.length; _n < _len4; _n++) {
              param = _ref16[_n];
              this.addSocketAndMark(param, depth + 1, 0, indentDepth, SAY_FORBID);
            }
            return this.mark(node.body, depth + 1, 0, null, indentDepth);
          case 'Assign':
            this.addBlock(node, depth, precedence, 'command', wrappingParen, MOSTLY_BLOCK);
            this.addSocketAndMark(node.variable, depth + 1, 0, indentDepth, function(block) {
              return block.nodeType === 'Value';
            });
            return this.addSocketAndMark(node.value, depth + 1, 0, indentDepth);
          case 'For':
            this.addBlock(node, depth, precedence, 'control', wrappingParen, MOSTLY_BLOCK);
            _ref17 = ['source', 'from', 'guard', 'step'];
            for (_o = 0, _len5 = _ref17.length; _o < _len5; _o++) {
              childName = _ref17[_o];
              if (node[childName] != null) {
                this.addSocketAndMark(node[childName], depth + 1, 0, indentDepth);
              }
            }
            _ref18 = ['index', 'name'];
            for (_p = 0, _len6 = _ref18.length; _p < _len6; _p++) {
              childName = _ref18[_p];
              if (node[childName] != null) {
                this.addSocketAndMark(node[childName], depth + 1, 0, indentDepth, SAY_FORBID);
              }
            }
            return this.mark(node.body, depth + 1, 0, null, indentDepth);
          case 'Range':
            this.addBlock(node, depth, 100, 'value', wrappingParen, VALUE_ONLY);
            this.addSocketAndMark(node.from, depth, 0, indentDepth);
            return this.addSocketAndMark(node.to, depth, 0, indentDepth);
          case 'If':
            this.addBlock(node, depth, precedence, 'control', wrappingParen, MOSTLY_BLOCK);
            /*
            bounds = @getBounds node
            if @lines[bounds.start.line].indexOf('unless') >= 0 and
                @locationsAreIdentical(bounds.start, @getBounds(node.condition).start) and
                node.condition.nodeType() is 'Op'
            
              @addSocketAndMark node.condition.first, depth + 1, 0, indentDepth
            else
            */

            this.addSocketAndMark(node.rawCondition, depth + 1, 0, indentDepth);
            this.mark(node.body, depth + 1, 0, null, indentDepth);
            if (node.elseBody != null) {
              this.flagLineAsMarked(node.elseToken.first_line);
              return this.mark(node.elseBody, depth + 1, 0, null, indentDepth);
            }
            break;
          case 'Arr':
            this.addBlock(node, depth, 100, 'value', wrappingParen, VALUE_ONLY);
            _ref19 = node.objects;
            _results3 = [];
            for (_q = 0, _len7 = _ref19.length; _q < _len7; _q++) {
              object = _ref19[_q];
              _results3.push(this.addSocketAndMark(object, depth + 1, 0, indentDepth));
            }
            return _results3;
            break;
          case 'Return':
            this.addBlock(node, depth, precedence, 'return', wrappingParen, BLOCK_ONLY);
            if (node.expression != null) {
              return this.addSocketAndMark(node.expression, depth + 1, 0, indentDepth);
            }
            break;
          case 'While':
            this.addBlock(node, depth, precedence, 'control', wrappingParen, MOSTLY_BLOCK);
            this.addSocketAndMark(node.rawCondition, depth + 1, 0, indentDepth);
            if (node.guard != null) {
              this.addSocketAndMark(node.guard, depth + 1, 0, indentDepth);
            }
            return this.mark(node.body, depth + 1, 0, null, indentDepth);
          case 'Switch':
            this.addBlock(node, depth, 0, 'control', wrappingParen, MOSTLY_BLOCK);
            if (node.subject != null) {
              this.addSocketAndMark(node.subject, depth + 1, 0, indentDepth);
            }
            _ref20 = node.cases;
            for (_r = 0, _len8 = _ref20.length; _r < _len8; _r++) {
              switchCase = _ref20[_r];
              if (switchCase[0].constructor === Array) {
                _ref21 = switchCase[0];
                for (_s = 0, _len9 = _ref21.length; _s < _len9; _s++) {
                  condition = _ref21[_s];
                  this.addSocketAndMark(condition, depth + 1, 0, indentDepth);
                }
              } else {
                this.addSocketAndMark(switchCase[0], depth + 1, 0, indentDepth);
              }
              this.mark(switchCase[1], depth + 1, 0, null, indentDepth);
            }
            if (node.otherwise != null) {
              return this.mark(node.otherwise, depth + 1, 0, null, indentDepth);
            }
            break;
          case 'Class':
            this.addBlock(node, depth, 0, 'control', wrappingParen, ANY_DROP);
            if (node.variable != null) {
              this.addSocketAndMark(node.variable, depth + 1, 0, indentDepth, SAY_FORBID);
            }
            if (node.parent != null) {
              this.addSocketAndMark(node.parent, depth + 1, 0, indentDepth);
            }
            if (node.body != null) {
              return this.mark(node.body, depth + 1, 0, null, indentDepth);
            }
            break;
          case 'Obj':
            this.addBlock(node, depth, 0, 'value', wrappingParen, VALUE_ONLY);
            _ref22 = node.properties;
            _results4 = [];
            for (_t = 0, _len10 = _ref22.length; _t < _len10; _t++) {
              property = _ref22[_t];
              if (property.nodeType() === 'Assign') {
                this.addSocketAndMark(property.variable, depth + 1, 0, indentDepth, SAY_FORBID);
                _results4.push(this.addSocketAndMark(property.value, depth + 1, 0, indentDepth));
              } else {
                _results4.push(void 0);
              }
            }
            return _results4;
        }
      };

      CoffeeScriptTranspiler.prototype.locationsAreIdentical = function(a, b) {
        return a.line === b.line && a.column === b.column;
      };

      CoffeeScriptTranspiler.prototype.boundMin = function(a, b) {
        if (a.line < b.line) {
          return a;
        } else if (b.line < a.line) {
          return b;
        } else if (a.column < b.column) {
          return a;
        } else {
          return b;
        }
      };

      CoffeeScriptTranspiler.prototype.boundMax = function(a, b) {
        if (a.line < b.line) {
          return b;
        } else if (b.line < a.line) {
          return a;
        } else if (a.column < b.column) {
          return b;
        } else {
          return a;
        }
      };

      CoffeeScriptTranspiler.prototype.getBounds = function(node) {
        var bounds, property, _i, _len, _ref;
        bounds = {
          start: {
            line: node.locationData.first_line,
            column: node.locationData.first_column
          },
          end: {
            line: node.locationData.last_line,
            column: node.locationData.last_column + 1
          }
        };
        if (node.nodeType() === 'Block') {
          if (node.expressions.length > 0) {
            bounds.end = this.getBounds(node.expressions[node.expressions.length - 1]).end;
          } else {
            bounds.start = bounds.end;
          }
        }
        if (node.nodeType() === 'If') {
          bounds.start = this.boundMin(bounds.start, this.getBounds(node.body).start);
          bounds.end = this.boundMax(this.getBounds(node.rawCondition).end, this.getBounds(node.body).end);
          if (node.elseBody != null) {
            bounds.end = this.boundMax(bounds.end, this.getBounds(node.elseBody).end);
          }
        }
        if (node.nodeType() === 'While') {
          bounds.start = this.boundMin(bounds.start, this.getBounds(node.body).start);
          bounds.end = this.boundMax(bounds.end, this.getBounds(node.body).end);
          if (node.guard != null) {
            bounds.end = this.boundMax(bounds.end, this.getBounds(node.guard).end);
          }
        }
        if (node.nodeType() === 'Code' && (node.body != null)) {
          bounds.end = this.getBounds(node.body).end;
        }
        while (this.lines[bounds.end.line].slice(0, bounds.end.column).trim().length === 0) {
          bounds.end.line -= 1;
          bounds.end.column = this.lines[bounds.end.line].length + 1;
        }
        if (node.nodeType() === 'Value') {
          bounds = this.getBounds(node.base);
          if ((node.properties != null) && node.properties.length > 0) {
            _ref = node.properties;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              property = _ref[_i];
              bounds.end = this.boundMax(bounds.end, this.getBounds(property).end);
            }
          }
        }
        return bounds;
      };

      CoffeeScriptTranspiler.prototype.flagLineAsMarked = function(line) {
        var _results;
        this.hasLineBeenMarked[line] = true;
        _results = [];
        while (this.lines[line][this.lines[line].length - 1] === '\\') {
          line += 1;
          _results.push(this.hasLineBeenMarked[line] = true);
        }
        return _results;
      };

      CoffeeScriptTranspiler.prototype.addMarkupAtLocation = function(container, bounds, depth) {
        this.flagLineAsMarked(bounds.start.line);
        return this.markup.push({
          container: container,
          bounds: bounds,
          depth: depth
        });
      };

      CoffeeScriptTranspiler.prototype.addMarkup = function(container, node, wrappingParen, depth) {
        var bounds;
        bounds = this.getBounds(wrappingParen != null ? wrappingParen : node);
        return this.addMarkupAtLocation(container, bounds, depth);
      };

      CoffeeScriptTranspiler.prototype.addBlock = function(node, depth, precedence, color, wrappingParen, socketLevel) {
        var block;
        block = new model.Block(precedence, color, socketLevel, getClassesFor(node));
        this.addMarkup(block, node, wrappingParen, depth);
        block.currentlyParenWrapped = wrappingParen != null;
        return block;
      };

      CoffeeScriptTranspiler.prototype.addSocket = function(node, depth, precedence, accepts) {
        var socket;
        if (accepts == null) {
          accepts = SAY_NORMAL;
        }
        socket = new model.Socket(precedence, false, accepts);
        this.addMarkup(socket, node, null, depth);
        return socket;
      };

      CoffeeScriptTranspiler.prototype.addSocketAndMark = function(node, depth, precedence, indentDepth, accepts) {
        var socket;
        if (accepts == null) {
          accepts = SAY_NORMAL;
        }
        socket = this.addSocket(node, depth, precedence, accepts);
        this.mark(node, depth + 1, precedence, null, indentDepth);
        return socket;
      };

      CoffeeScriptTranspiler.prototype.wrapSemicolonLine = function(firstBounds, lastBounds, expressions, depth) {
        var block, child, surroundingBounds, _i, _len, _results;
        block = new model.Block(0, 'command', ANY_DROP);
        surroundingBounds = {
          start: firstBounds.start,
          end: lastBounds.end
        };
        this.addMarkupAtLocation(block, surroundingBounds, depth + 1);
        _results = [];
        for (_i = 0, _len = expressions.length; _i < _len; _i++) {
          child = expressions[_i];
          _results.push(this.addSocket(child, depth + 2, 0));
        }
        return _results;
      };

      CoffeeScriptTranspiler.prototype.wrapSemicolons = function(expressions, depth) {
        var bounds, expr, firstBounds, firstNode, lastBounds, lastNode, nodesOnCurrentLine, _i, _len;
        firstNode = lastNode = firstBounds = lastBounds = null;
        nodesOnCurrentLine = [];
        for (_i = 0, _len = expressions.length; _i < _len; _i++) {
          expr = expressions[_i];
          bounds = this.getBounds(expr);
          if (bounds.start.line === (firstBounds != null ? firstBounds.end.line : void 0)) {
            lastNode = expr;
            lastBounds = bounds;
            nodesOnCurrentLine.push(expr);
          } else {
            if (lastNode != null) {
              this.wrapSemicolonLine(firstBounds, lastBounds, nodesOnCurrentLine, depth);
            }
            firstNode = expr;
            lastNode = null;
            firstBounds = this.getBounds(expr);
            lastBounds = null;
            nodesOnCurrentLine = [expr];
          }
        }
        if (lastNode != null) {
          return this.wrapSemicolonLine(firstBounds, lastBounds, nodesOnCurrentLine, depth);
        }
      };

      return CoffeeScriptTranspiler;

    })();
    coffeeScriptParser = new parser.Parser(function(originalText) {
      var e, firstError, lines, retries, text, tokens, transpiler;
      text = originalText;
      lines = text.split('\n');
      retries = Math.max(1, Math.min(5, Math.ceil(lines.length / 2)));
      firstError = null;
      while (true) {
        try {
          transpiler = new CoffeeScriptTranspiler(text);
          tokens = transpiler.transpile();
          return {
            tokens: tokens,
            text: text,
            error: firstError
          };
        } catch (_error) {
          e = _error;
          if (!firstError) {
            firstError = e;
          }
          if (retries > 0 && fixCoffeeScriptError(lines, e)) {
            retries -= 1;
            text = lines.join('\n');
          } else {
            throw firstError;
          }
        }
      }
    });
    fixCoffeeScriptError = function(lines, e) {
      var unmatchedline, _ref;
      console.log('encountered error', e.message, 'line', (_ref = e.location) != null ? _ref.first_line : void 0);
      if (/unexpected\s*(?:newline|if|for|while|switch|unless|end of input)/.test(e.message) && /^\s*(?:if|for|while|unless)\s+\S+/.test(lines[e.location.first_line])) {
        return addEmptyBackTickLineAfter(lines, e.location.first_line);
      }
      if (/unexpected/.test(e.message)) {
        return backTickLine(lines, e.location.first_line);
      }
      if (/missing "/.test(e.message) && __indexOf.call(lines[e.location.first_line], '"') >= 0) {
        return backTickLine(lines, e.location.first_line);
      }
      if (/unmatched|missing \)/.test(e.message)) {
        unmatchedline = findUnmatchedLine(lines, e.location.first_line);
        if (unmatchedline !== null) {
          return backTickLine(lines, unmatchedline);
        }
      }
      return null;
    };
    findUnmatchedLine = function(lines, above) {
      return null;
    };
    backTickLine = function(lines, n) {
      if (n < 0 || n >= lines.length) {
        return false;
      }
      if (/`/.test(lines[n]) || /^\s*$/.test(lines[n])) {
        return false;
      }
      lines[n] = lines[n].replace(/^(\s*)(\S.*\S|\S)(\s*)$/, '$1`#$2`$3');
      return true;
    };
    addEmptyBackTickLineAfter = function(lines, n) {
      var leading;
      if (n < 0 || n >= lines.length) {
        return false;
      }
      if (n + 1 < lines.length && /^\s*``$/.test(lines[n + 1])) {
        return false;
      }
      leading = /^\s*/.exec(lines[n]);
      if (!leading || leading[0].length >= lines[n].length) {
        return false;
      }
      return lines.splice(n + 1, 0, leading[0] + '  ``');
    };
    exports.parse = function(text, opts) {
      if (opts == null) {
        opts = {
          wrapAtRoot: true
        };
      }
      return coffeeScriptParser.parse(text, opts);
    };
    return exports;
  });

}).call(this);

/*
//@ sourceMappingURL=coffee.js.map
*/;
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('ice-controller',['ice-helper', 'ice-coffee', 'ice-draw', 'ice-model', 'ice-view'], function(helper, coffee, draw, model, view) {
    var ANIMATION_FRAME_RATE, ANY_DROP, AnimatedColor, BLOCK_ONLY, CURSOR_HEIGHT_DECREASE, CURSOR_WIDTH_DECREASE, CreateSegmentOperation, DEFAULT_INDENT_DEPTH, DISCOURAGE_DROP_TIMEOUT, DestroySegmentOperation, DropOperation, Editor, FloatingBlockRecord, FromFloatingOperation, MAX_DROP_DISTANCE, MIN_DRAG_DISTANCE, MOSTLY_BLOCK, MOSTLY_VALUE, PALETTE_LEFT_MARGIN, PALETTE_MARGIN, PALETTE_TOP_MARGIN, PickUpOperation, ReparseOperation, SetValueOperation, TOUCH_SELECTION_TIMEOUT, TextChangeOperation, TextReparseOperation, ToFloatingOperation, UndoOperation, VALUE_ONLY, binding, containsCursor, deepCopy, deepEquals, editorBindings, escapeString, exports, extend_, getCharactersTo, getOffsetLeft, getOffsetTop, getSocketAtChar, hook, isValidCursorPosition, key, last_, touchEvents, unsortedEditorBindings, unsortedEditorKeyBindings, validateLassoSelection, _i, _j, _len, _len1, _ref, _ref1;
    PALETTE_TOP_MARGIN = 5;
    PALETTE_MARGIN = 5;
    MIN_DRAG_DISTANCE = 1;
    PALETTE_LEFT_MARGIN = 5;
    DEFAULT_INDENT_DEPTH = '  ';
    ANIMATION_FRAME_RATE = 60;
    DISCOURAGE_DROP_TIMEOUT = 1000;
    MAX_DROP_DISTANCE = 100;
    CURSOR_WIDTH_DECREASE = 3;
    CURSOR_HEIGHT_DECREASE = 2;
    ANY_DROP = helper.ANY_DROP;
    BLOCK_ONLY = helper.BLOCK_ONLY;
    MOSTLY_BLOCK = helper.MOSTLY_BLOCK;
    MOSTLY_VALUE = helper.MOSTLY_VALUE;
    VALUE_ONLY = helper.VALUE_ONLY;
    exports = {};
    extend_ = function(a, b) {
      var key, obj, value;
      obj = {};
      for (key in a) {
        value = a[key];
        obj[key] = value;
      }
      for (key in b) {
        value = b[key];
        obj[key] = value;
      }
      return obj;
    };
    deepCopy = function(a) {
      var key, newObject, val;
      if (a instanceof Object) {
        newObject = {};
        for (key in a) {
          val = a[key];
          newObject[key] = deepCopy(val);
        }
        return newObject;
      } else {
        return a;
      }
    };
    deepEquals = function(a, b) {
      var key, val;
      if (a instanceof Object) {
        for (key in a) {
          if (!__hasProp.call(a, key)) continue;
          val = a[key];
          if (!deepEquals(b[key], val)) {
            return false;
          }
        }
        for (key in b) {
          if (!__hasProp.call(b, key)) continue;
          val = b[key];
          if (!key in a) {
            if (!deepEquals(a[key], val)) {
              return false;
            }
          }
        }
        return true;
      } else {
        return a === b;
      }
    };
    unsortedEditorBindings = {
      'populate': [],
      'resize': [],
      'resize_palette': [],
      'redraw_main': [],
      'redraw_palette': [],
      'set_palette': [],
      'mousedown': [],
      'mousemove': [],
      'mouseup': [],
      'dblclick': []
    };
    unsortedEditorKeyBindings = {};
    editorBindings = {};
    hook = function(event, priority, fn) {
      var _name;
      if (event.slice(0, 4) === 'key.') {
        if (unsortedEditorKeyBindings[_name = event.slice(4)] == null) {
          unsortedEditorKeyBindings[_name] = [];
        }
        return unsortedEditorKeyBindings[event.slice(4)].push({
          priority: priority,
          fn: fn
        });
      } else {
        return unsortedEditorBindings[event].push({
          priority: priority,
          fn: fn
        });
      }
    };
    exports.Editor = Editor = (function() {
      function Editor(wrapperElement, paletteGroups) {
        var binding, boundListeners, combo, elements, eventName, fns, _fn, _fn1, _i, _len, _ref, _ref1, _ref2,
          _this = this;
        this.wrapperElement = wrapperElement;
        this.paletteGroups = paletteGroups;
        this.draw = new draw.Draw();
        this.debugging = true;
        this.iceElement = document.createElement('div');
        this.iceElement.className = 'ice-wrapper-div';
        this.iceElement.tabIndex = 0;
        this.wrapperElement.appendChild(this.iceElement);
        this.wrapperElement.style.backgroundColor = '#FFF';
        this.mainCanvas = document.createElement('canvas');
        this.mainCanvas.className = 'ice-main-canvas';
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.iceElement.appendChild(this.mainCanvas);
        this.paletteWrapper = this.paletteElement = document.createElement('div');
        this.paletteWrapper.className = 'ice-palette-wrapper';
        this.paletteCanvas = document.createElement('canvas');
        this.paletteCanvas.className = 'ice-palette-canvas';
        this.paletteCtx = this.paletteCanvas.getContext('2d');
        this.paletteWrapper.appendChild(this.paletteCanvas);
        this.paletteElement.style.position = 'absolute';
        this.paletteElement.style.left = '0px';
        this.paletteElement.style.top = '0px';
        this.paletteElement.style.bottom = '0px';
        this.paletteElement.style.width = '270px';
        this.iceElement.style.left = this.paletteElement.offsetWidth + 'px';
        this.wrapperElement.appendChild(this.paletteElement);
        this.draw.refreshFontCapital();
        this.standardViewSettings = {
          padding: 5,
          indentWidth: 20,
          textHeight: helper.getFontHeight('Courier New', 15),
          indentTongueHeight: 20,
          tabOffset: 10,
          tabWidth: 15,
          tabHeight: 4,
          tabSideWidth: 1 / 4,
          dropAreaHeight: 20,
          indentDropAreaMinWidth: 50,
          emptySocketWidth: 20,
          emptyLineHeight: 25,
          highlightAreaHeight: 10,
          shadowBlur: 5,
          ctx: this.mainCtx,
          draw: this.draw
        };
        this.view = new view.View(extend_(this.standardViewSettings, {
          respectEphemeral: true
        }));
        this.dragView = new view.View(extend_(this.standardViewSettings, {
          respectEphemeral: false
        }));
        this.keyListener = new window.keypress.Listener(this.iceElement);
        boundListeners = [];
        _ref = editorBindings.key;
        _fn = function(fns) {
          return _this.keyListener.simple_combo(combo, function(event, count) {
            var executeDefault, fn, result, state, _i, _len, _ref1;
            state = {};
            executeDefault = true;
            for (_i = 0, _len = fns.length; _i < _len; _i++) {
              fn = fns[_i];
              result = (_ref1 = fn.call(_this, state, event, count)) != null ? _ref1 : true;
              executeDefault && (executeDefault = result);
            }
            return executeDefault;
          });
        };
        for (combo in _ref) {
          fns = _ref[combo];
          _fn(fns);
        }
        _ref1 = editorBindings.populate;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          binding = _ref1[_i];
          binding.call(this);
        }
        window.addEventListener('resize', function() {
          return _this.resize();
        });
        _ref2 = {
          mousedown: [this.iceElement, this.paletteElement, this.dragCover],
          dblclick: [this.iceElement, this.paletteElement, this.dragCover],
          mouseup: [window],
          mousemove: [window]
        };
        _fn1 = function(eventName, elements) {
          var element, _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = elements.length; _j < _len1; _j++) {
            element = elements[_j];
            _results.push(element.addEventListener(eventName, function(event) {
              var handler, state, trackPoint, _k, _len2, _ref3;
              trackPoint = _this.getPointRelativeToTracker(event);
              state = {};
              _ref3 = editorBindings[eventName];
              for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                handler = _ref3[_k];
                handler.call(_this, trackPoint, event, state);
              }
              if (typeof event.stopPropagation === "function") {
                event.stopPropagation();
              }
              if (typeof event.preventDefault === "function") {
                event.preventDefault();
              }
              event.cancelBubble = true;
              event.returnValue = false;
              return false;
            }));
          }
          return _results;
        };
        for (eventName in _ref2) {
          elements = _ref2[eventName];
          _fn1(eventName, elements);
        }
        this.tree = new model.Segment();
        this.tree.start.insert(this.cursor);
        this.resize();
        this.redrawMain();
        this.redrawPalette();
      }

      Editor.prototype.resize = function() {
        var binding, _i, _len, _ref;
        this.iceElement.style.left = "" + this.paletteElement.offsetWidth + "px";
        this.iceElement.style.height = "" + this.wrapperElement.offsetHeight + "px";
        this.iceElement.style.width = "" + (this.wrapperElement.offsetWidth - this.paletteWrapper.offsetWidth) + "px";
        this.mainCanvas.height = this.iceElement.offsetHeight;
        this.mainCanvas.width = this.iceElement.offsetWidth - this.gutter.offsetWidth;
        this.mainCanvas.style.height = "" + this.mainCanvas.height + "px";
        this.mainCanvas.style.width = "" + this.mainCanvas.width + "px";
        this.mainCanvas.style.left = "" + this.gutter.offsetWidth + "px";
        this.transitionContainer.style.left = "" + this.gutter.offsetWidth + "px";
        this.resizePalette();
        _ref = editorBindings.resize;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          binding = _ref[_i];
          binding.call(this);
        }
        this.scrollOffsets.main.y = this.mainScroller.scrollTop;
        this.scrollOffsets.main.x = this.mainScroller.scrollLeft;
        this.mainCtx.setTransform(1, 0, 0, 1, -this.scrollOffsets.main.x, -this.scrollOffsets.main.y);
        this.highlightCtx.setTransform(1, 0, 0, 1, -this.scrollOffsets.main.x, -this.scrollOffsets.main.y);
        this.cursorCtx.setTransform(1, 0, 0, 1, -this.scrollOffsets.main.x, -this.scrollOffsets.main.y);
        return this.redrawMain();
      };

      Editor.prototype.resizePalette = function() {
        /*
        @paletteWrapper.style.height = "#{@paletteElement.offsetHeight}px"
        @paletteWrapper.style.width = "#{@paletteElement.offsetWidth}px"
        */

        var binding, _i, _len, _ref;
        this.paletteCanvas.style.top = "" + this.paletteHeader.offsetHeight + "px";
        this.paletteCanvas.height = this.paletteWrapper.offsetHeight - this.paletteHeader.offsetHeight;
        this.paletteCanvas.width = this.paletteWrapper.offsetWidth;
        this.paletteCanvas.style.height = "" + this.paletteCanvas.height + "px";
        this.paletteCanvas.style.width = "" + this.paletteCanvas.width + "px";
        _ref = editorBindings.resize_palette;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          binding = _ref[_i];
          binding.call(this);
        }
        this.paletteCtx.setTransform(1, 0, 0, 1, -this.scrollOffsets.palette.x, -this.scrollOffsets.palette.y);
        this.paletteHighlightCtx.setTransform(1, 0, 0, 1, -this.scrollOffsets.palette.x, -this.scrollOffsets.palette.y);
        return this.redrawPalette();
      };

      return Editor;

    })();
    Editor.prototype.clearMain = function(opts) {
      if (opts.boundingRectangle != null) {
        return this.mainCtx.clearRect(opts.boundingRectangle.x, opts.boundingRectangle.y, opts.boundingRectangle.width, opts.boundingRectangle.height);
      } else {
        return this.mainCtx.clearRect(this.scrollOffsets.main.x, this.scrollOffsets.main.y, this.mainCanvas.width, this.mainCanvas.height);
      }
    };
    Editor.prototype.setTopNubbyStyle = function(height, color) {
      if (height == null) {
        height = 10;
      }
      if (color == null) {
        color = '#EBEBEB';
      }
      this.nubbyHeight = Math.max(0, height);
      this.nubbyColor = color;
      this.topNubbyPath = new this.draw.Path();
      if (height >= 0) {
        this.topNubbyPath.bevel = true;
        this.topNubbyPath.push(new this.draw.Point(this.mainCanvas.width, -5));
        this.topNubbyPath.push(new this.draw.Point(this.mainCanvas.width, height));
        this.topNubbyPath.push(new this.draw.Point(this.view.opts.tabOffset + this.view.opts.tabWidth, height));
        this.topNubbyPath.push(new this.draw.Point(this.view.opts.tabOffset + this.view.opts.tabWidth * (1 - this.view.opts.tabSideWidth), this.view.opts.tabHeight + height));
        this.topNubbyPath.push(new this.draw.Point(this.view.opts.tabOffset + this.view.opts.tabWidth * this.view.opts.tabSideWidth, this.view.opts.tabHeight + height));
        this.topNubbyPath.push(new this.draw.Point(this.view.opts.tabOffset, height));
        this.topNubbyPath.push(new this.draw.Point(-5, height));
        this.topNubbyPath.push(new this.draw.Point(-5, -5));
        this.topNubbyPath.style.fillColor = color;
      }
      return this.redrawMain();
    };
    hook('resize', 0, function() {
      return this.setTopNubbyStyle(this.nubbyHeight, this.nubbyColor);
    });
    Editor.prototype.redrawMain = function(opts) {
      var binding, layoutResult, oldScroll, _i, _len, _ref, _ref1, _ref2;
      if (opts == null) {
        opts = {};
      }
      if (!this.currentlyAnimating_suprressRedraw) {
        this.draw.setGlobalFontSize(this.fontSize);
        this.draw.setCtx(this.mainCtx);
        this.clearMain(opts);
        this.topNubbyPath.draw(this.mainCtx);
        if (opts.boundingRectangle != null) {
          this.mainCtx.save();
          opts.boundingRectangle.clip(this.mainCtx);
        }
        layoutResult = this.view.getViewNodeFor(this.tree).layout(0, this.nubbyHeight);
        this.view.getViewNodeFor(this.tree).draw(this.mainCtx, (_ref = opts.boundingRectangle) != null ? _ref : new this.draw.Rectangle(this.scrollOffsets.main.x, this.scrollOffsets.main.y, this.mainCanvas.width, this.mainCanvas.height), {
          grayscale: 0,
          selected: 0,
          noText: (_ref1 = opts.noText) != null ? _ref1 : false
        });
        this.redrawCursors();
        this.redrawHighlights();
        if (opts.boundingRectangle != null) {
          this.mainCtx.restore();
        }
        _ref2 = editorBindings.redraw_main;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          binding = _ref2[_i];
          binding.call(this, layoutResult);
        }
        if (this.changeEventVersion !== this.tree.version) {
          this.changeEventVersion = this.tree.version;
          this.suppressAceChangeEvent = true;
          oldScroll = this.aceEditor.session.getScrollTop();
          this.aceEditor.setValue(this.getValue(), -1);
          this.suppressAceChangeEvent = false;
          this.aceEditor.session.setScrollTop(oldScroll);
          this.fireEvent('change', []);
        }
        return null;
      }
    };
    Editor.prototype.redrawHighlights = function() {
      var id, info, line, path, _ref, _ref1;
      this.clearHighlightCanvas();
      _ref = this.markedLines;
      for (line in _ref) {
        info = _ref[line];
        if (this.inTree(info.model)) {
          path = this.getHighlightPath(info.model, info.style);
          path.draw(this.highlightCtx);
        } else {
          delete this.markedLines[line];
        }
      }
      _ref1 = this.extraMarks;
      for (id in _ref1) {
        info = _ref1[id];
        if (this.inTree(info.model)) {
          path = this.getHighlightPath(info.model, info.style);
          path.draw(this.highlightCtx);
        } else {
          delete this.extraMarks[id];
        }
      }
      return this.redrawCursors();
    };
    Editor.prototype.clearCursorCanvas = function() {
      return this.cursorCtx.clearRect(this.scrollOffsets.main.x, this.scrollOffsets.main.y, this.cursorCanvas.width, this.cursorCanvas.height);
    };
    Editor.prototype.redrawCursors = function() {
      this.clearCursorCanvas();
      if (this.textFocus != null) {
        return this.redrawTextHighlights();
      } else if (this.lassoSegment == null) {
        return this.drawCursor();
      }
    };
    Editor.prototype.drawCursor = function() {
      return this.strokeCursor(this.determineCursorPosition());
    };
    Editor.prototype.clearPalette = function() {
      return this.paletteCtx.clearRect(this.scrollOffsets.palette.x, this.scrollOffsets.palette.y, this.paletteCanvas.width, this.paletteCanvas.height);
    };
    Editor.prototype.clearPaletteHighlightCanvas = function() {
      return this.paletteHighlightCtx.clearRect(this.scrollOffsets.palette.x, this.scrollOffsets.palette.y, this.paletteHighlightCanvas.width, this.paletteHighlightCanvas.height);
    };
    Editor.prototype.redrawPalette = function() {
      var binding, boundingRect, lastBottomEdge, paletteBlock, paletteBlockView, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.clearPalette();
      lastBottomEdge = PALETTE_TOP_MARGIN;
      boundingRect = new this.draw.Rectangle(this.scrollOffsets.palette.x, this.scrollOffsets.palette.y, this.paletteCanvas.width, this.paletteCanvas.height);
      _ref = this.currentPaletteBlocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        paletteBlock = _ref[_i];
        paletteBlockView = this.view.getViewNodeFor(paletteBlock);
        paletteBlockView.layout(PALETTE_LEFT_MARGIN, lastBottomEdge);
        paletteBlockView.draw(this.paletteCtx, boundingRect);
        lastBottomEdge = paletteBlockView.getBounds().bottom() + PALETTE_MARGIN;
      }
      _ref1 = editorBindings.redraw_palette;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        binding = _ref1[_j];
        _results.push(binding.call(this));
      }
      return _results;
    };
    Editor.prototype.getPointRelativeToTracker = function(event) {
      var offsetPoint, point;
      if (event.offsetX != null) {
        point = new this.draw.Point(event.offsetX, event.offsetY);
      } else {
        point = new this.draw.Point(event.layerX, event.layerY);
      }
      offsetPoint = this.trackerOffset(event.target);
      return new this.draw.Point(point.x + offsetPoint.x, point.y + offsetPoint.y);
    };
    Editor.prototype.absoluteOffset = function(el) {
      var point;
      point = new this.draw.Point(el.offsetLeft, el.offsetTop);
      el = el.offsetParent;
      while (!(el === document.body || (el == null))) {
        point.x += el.offsetLeft - el.scrollLeft;
        point.y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
      }
      return point;
    };
    Editor.prototype.trackerOffset = function(el) {
      var subtractIceElementOffset, x, y,
        _this = this;
      x = el.offsetLeft;
      y = el.offsetTop;
      el = el.offsetParent;
      subtractIceElementOffset = function() {
        var _results;
        el = _this.iceElement.offsetParent;
        x -= _this.iceElement.offsetLeft;
        y -= _this.iceElement.offsetTop;
        _results = [];
        while (el != null) {
          x -= el.offsetLeft - el.scrollLeft;
          y -= el.offsetTop - el.scrollTop;
          _results.push(el = el.offsetParent);
        }
        return _results;
      };
      while (el !== this.iceElement) {
        if (el == null) {
          subtractIceElementOffset();
          break;
        }
        x += el.offsetLeft - el.scrollLeft;
        y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
      }
      return new this.draw.Point(x, y);
    };
    Editor.prototype.trackerPointToMain = function(point) {
      return new this.draw.Point(point.x - this.trackerOffset(this.mainCanvas).x + this.scrollOffsets.main.x, point.y - this.trackerOffset(this.mainCanvas).y + this.scrollOffsets.main.y);
    };
    Editor.prototype.trackerPointToPalette = function(point) {
      if (this.paletteCanvas.offsetParent == null) {
        return new this.draw.Point(NaN, NaN);
      }
      return new this.draw.Point(point.x - this.trackerOffset(this.paletteCanvas).x + this.scrollOffsets.palette.x, point.y - this.trackerOffset(this.paletteCanvas).y + this.scrollOffsets.palette.y);
    };
    Editor.prototype.hitTest = function(point, block) {
      var head, seek;
      head = block.start;
      seek = block.end;
      while (head !== seek) {
        if (head.type === 'blockStart' && this.view.getViewNodeFor(head.container).path.contains(point)) {
          seek = head.container.end;
        }
        head = head.next;
      }
      if (head !== block.end) {
        return head.container;
      } else if (block.type === 'block' && this.view.getViewNodeFor(block).path.contains(point)) {
        return block;
      } else {
        return null;
      }
    };
    hook('mousedown', 10, function() {
      return this.iceElement.focus();
    });
    hook('populate', 0, function() {
      this.undoStack = [];
      return this.changeEventVersion = 0;
    });
    UndoOperation = (function() {
      function UndoOperation() {}

      UndoOperation.prototype.undo = function(editor) {
        return editor.tree.start;
      };

      UndoOperation.prototype.redo = function(editor) {
        return editor.tree.start;
      };

      return UndoOperation;

    })();
    Editor.prototype.removeBlankLines = function() {
      var head, next, _results;
      head = this.tree.end.previousVisibleToken();
      _results = [];
      while ((head != null ? head.type : void 0) === 'newline') {
        next = head.previousVisibleToken();
        head.remove();
        _results.push(head = next);
      }
      return _results;
    };
    Editor.prototype.addMicroUndoOperation = function(operation) {
      this.undoStack.push(operation);
      return this.removeBlankLines();
    };
    Editor.prototype.undo = function() {
      var operation;
      if (this.undoStack.length === 0) {
        return;
      }
      operation = this.undoStack.pop();
      if (operation === 'CAPTURE_POINT') {
        return;
      } else {
        this.moveCursorTo(operation.undo(this));
        this.undo();
      }
      return this.redrawMain();
    };
    Editor.prototype.clearUndoStack = function() {
      return this.undoStack.length = 0;
    };
    hook('key.meta z', 0, function() {
      return this.undo();
    });
    PickUpOperation = (function(_super) {
      __extends(PickUpOperation, _super);

      function PickUpOperation(block) {
        var beforeToken, _ref, _ref1;
        this.block = block.clone();
        beforeToken = block.start.prev;
        while (((beforeToken != null ? beforeToken.prev : void 0) != null) && ((_ref = beforeToken.type) === 'newline' || _ref === 'segmentStart' || _ref === 'cursor')) {
          beforeToken = beforeToken.prev;
        }
        this.before = (_ref1 = beforeToken != null ? beforeToken.getSerializedLocation() : void 0) != null ? _ref1 : null;
      }

      PickUpOperation.prototype.undo = function(editor) {
        var clone;
        if (this.before == null) {
          return;
        }
        (clone = this.block.clone()).moveTo(editor.tree.getTokenAtLocation(this.before));
        if (this.block.type === 'segment' && this.block.isLassoSegment) {
          editor.lassoSegment = this.block;
        }
        return clone.end;
      };

      PickUpOperation.prototype.redo = function(editor) {
        var blockStart;
        if (this.before == null) {
          return;
        }
        blockStart = editor.tree.getTokenAtLocation(this.before);
        while (blockStart.type !== this.block.start.type) {
          blockStart = blockStart.next;
        }
        if (this.block.start.type === 'segment') {
          blockStart.container.moveTo(null);
        } else {
          blockStart.container.moveTo(null);
        }
        return editor.tree.getTokenAtLocation(this.before);
      };

      return PickUpOperation;

    })(UndoOperation);
    DropOperation = (function(_super) {
      __extends(DropOperation, _super);

      function DropOperation(block, dest) {
        var _ref;
        this.block = block.clone();
        this.dest = (_ref = dest != null ? dest.getSerializedLocation() : void 0) != null ? _ref : null;
        if ((dest != null ? dest.type : void 0) === 'socketStart') {
          this.displacedSocketText = dest.container.contents();
        } else {
          this.displacedSocketText = null;
        }
      }

      DropOperation.prototype.undo = function(editor) {
        var blockStart;
        if (this.dest == null) {
          return;
        }
        blockStart = editor.tree.getTokenAtLocation(this.dest);
        while (blockStart.type !== this.block.start.type) {
          blockStart = blockStart.next;
        }
        blockStart.container.spliceOut();
        if (this.displacedSocketText != null) {
          editor.tree.getTokenAtLocation(this.dest).insert(this.displacedSocketText.clone());
        }
        return editor.tree.getTokenAtLocation(this.dest);
      };

      DropOperation.prototype.redo = function(editor) {
        var clone;
        if (this.dest == null) {
          return;
        }
        (clone = this.block.clone()).moveTo(editor.tree.getTokenAtLocation(this.dest));
        return clone.end;
      };

      return DropOperation;

    })(UndoOperation);
    hook('populate', 0, function() {
      this.clickedPoint = null;
      this.clickedBlock = null;
      this.draggingBlock = null;
      this.draggingOffset = null;
      this.lastHighlight = null;
      this.dragCanvas = document.createElement('canvas');
      this.dragCanvas.className = 'ice-drag-canvas';
      this.dragCanvas.style.left = '-9999px';
      this.dragCanvas.style.top = '-9999px';
      this.dragCtx = this.dragCanvas.getContext('2d');
      this.highlightCanvas = document.createElement('canvas');
      this.highlightCanvas.className = 'ice-highlight-canvas';
      this.highlightCtx = this.highlightCanvas.getContext('2d');
      document.body.appendChild(this.dragCanvas);
      return this.iceElement.appendChild(this.highlightCanvas);
    });
    Editor.prototype.clearHighlightCanvas = function() {
      return this.highlightCtx.clearRect(this.scrollOffsets.main.x, this.scrollOffsets.main.y, this.highlightCanvas.width, this.highlightCanvas.height);
    };
    Editor.prototype.clearDrag = function() {
      return this.dragCtx.clearRect(0, 0, this.dragCanvas.width, this.dragCanvas.height);
    };
    hook('resize', 0, function() {
      this.dragCanvas.width = 0;
      this.dragCanvas.height = 0;
      this.highlightCanvas.width = this.iceElement.offsetWidth;
      this.highlightCanvas.style.width = "" + this.highlightCanvas.width + "px";
      this.highlightCanvas.height = this.iceElement.offsetHeight;
      this.highlightCanvas.style.height = "" + this.highlightCanvas.height + "px";
      return this.highlightCanvas.style.left = "" + this.mainCanvas.offsetLeft + "px";
    });
    hook('mousedown', 1, function(point, event, state) {
      var box, hitTestResult, i, line, mainPoint, node, _i, _len, _ref;
      if (state.consumedHitTest) {
        return;
      }
      if (event.which !== 1) {
        return;
      }
      mainPoint = this.trackerPointToMain(point);
      hitTestResult = this.hitTest(mainPoint, this.tree);
      if (this.debugging && event.shiftKey) {
        line = null;
        node = this.view.getViewNodeFor(hitTestResult);
        _ref = node.bounds;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          box = _ref[i];
          if (box.contains(mainPoint)) {
            line = i;
            break;
          }
        }
        this.dumpNodeForDebug(hitTestResult, line);
      }
      if ((hitTestResult != null) && event.which === 1) {
        this.clickedBlock = hitTestResult;
        this.moveCursorTo(this.clickedBlock.start.next);
        this.clickedPoint = point;
        return state.consumedHitTest = true;
      }
    });
    hook('mouseup', 0, function(point, event, state) {
      if (this.clickedBlock != null) {
        this.clickedBlock = null;
        return this.clickedPoint = null;
      }
    });
    Editor.prototype.wouldDelete = function(position) {
      var mainPoint, palettePoint, _ref, _ref1, _ref2, _ref3;
      mainPoint = this.trackerPointToMain(position);
      palettePoint = this.trackerPointToPalette(position);
      return !this.lastHighlight && !((this.mainCanvas.width + this.scrollOffsets.main.x > (_ref = mainPoint.x) && _ref > this.scrollOffsets.main.x) && (this.mainCanvas.height + this.scrollOffsets.main.y > (_ref1 = mainPoint.y) && _ref1 > this.scrollOffsets.main.y)) || ((this.paletteCanvas.width + this.scrollOffsets.palette.x > (_ref2 = palettePoint.x) && _ref2 > this.scrollOffsets.palette.x) && (this.paletteCanvas.height + this.scrollOffsets.palette.y > (_ref3 = palettePoint.y) && _ref3 > this.scrollOffsets.palette.y));
    };
    hook('mousemove', 1, function(point, event, state) {
      var acceptLevel, bound, draggingBlockView, dropPoint, head, line, mainPoint, position, viewNode, _i, _len, _ref;
      if (!state.capturedPickup && (this.clickedBlock != null) && point.from(this.clickedPoint).magnitude() > MIN_DRAG_DISTANCE) {
        this.draggingBlock = this.clickedBlock;
        if (this.clickedBlockIsPaletteBlock) {
          this.draggingOffset = this.view.getViewNodeFor(this.draggingBlock).bounds[0].upperLeftCorner().from(this.trackerPointToPalette(this.clickedPoint));
          this.draggingBlock = this.draggingBlock.clone();
        } else {
          mainPoint = this.trackerPointToMain(this.clickedPoint);
          viewNode = this.view.getViewNodeFor(this.draggingBlock);
          this.draggingOffset = null;
          _ref = viewNode.bounds;
          for (line = _i = 0, _len = _ref.length; _i < _len; line = ++_i) {
            bound = _ref[line];
            if (bound.contains(mainPoint)) {
              this.draggingOffset = bound.upperLeftCorner().from(mainPoint);
              this.draggingOffset.y += viewNode.bounds[0].y - bound.y;
              break;
            }
          }
          if (this.draggingOffset == null) {
            this.draggingOffset = viewNode.bounds[0].upperLeftCorner().from(mainPoint);
          }
        }
        this.draggingBlock.ephemeral = true;
        this.draggingBlock.clearLineMarks();
        draggingBlockView = this.dragView.getViewNodeFor(this.draggingBlock);
        draggingBlockView.layout(1, 1);
        this.dragCanvas.width = Math.min(draggingBlockView.totalBounds.width + 10, window.screen.width);
        this.dragCanvas.height = Math.min(draggingBlockView.totalBounds.height + 10, window.screen.height);
        draggingBlockView.drawShadow(this.dragCtx, 5, 5);
        draggingBlockView.draw(this.dragCtx, new this.draw.Rectangle(0, 0, this.dragCanvas.width, this.dragCanvas.height));
        position = new this.draw.Point(point.x + this.draggingOffset.x, point.y + this.draggingOffset.y);
        this.dropPointQuadTree = QUAD.init({
          x: this.scrollOffsets.main.xA,
          y: this.scrollOffsets.main.y,
          w: this.mainCanvas.width,
          h: this.mainCanvas.height
        });
        head = this.tree.start;
        while (head !== this.tree.end) {
          if (head === this.draggingBlock.start) {
            head = this.draggingBlock.end;
          }
          if (head instanceof model.StartToken) {
            acceptLevel = this.getAcceptLevel(this.draggingBlock, head.container);
            if (acceptLevel !== helper.FORBIDDEN) {
              dropPoint = this.view.getViewNodeFor(head.container).dropPoint;
              if (dropPoint != null) {
                this.dropPointQuadTree.insert({
                  x: dropPoint.x,
                  y: dropPoint.y,
                  w: 0,
                  h: 0,
                  acceptLevel: acceptLevel,
                  _ice_node: head.container
                });
              }
            }
          }
          head = head.next;
        }
        this.dragCanvas.style.top = "" + (position.y + getOffsetTop(this.iceElement)) + "px";
        this.dragCanvas.style.left = "" + (position.x + getOffsetLeft(this.iceElement)) + "px";
        this.clickedPoint = this.clickedBlock = null;
        this.begunTrash = this.wouldDelete(position);
        return this.redrawMain();
      }
    });
    hook('mousemove', 0, function(point, event, state) {
      var best, head, mainPoint, min, palettePoint, position, testPoints, _ref, _ref1, _ref2,
        _this = this;
      if (this.draggingBlock != null) {
        position = new this.draw.Point(point.x + this.draggingOffset.x, point.y + this.draggingOffset.y);
        this.dragCanvas.style.top = "" + (position.y + getOffsetTop(this.iceElement)) + "px";
        this.dragCanvas.style.left = "" + (position.x + getOffsetLeft(this.iceElement)) + "px";
        mainPoint = this.trackerPointToMain(position);
        best = null;
        min = Infinity;
        head = this.tree.start.next;
        while (((_ref = head.type) === 'newline' || _ref === 'cursor') || head.type === 'text' && head.value === '') {
          head = head.next;
        }
        if (head === this.tree.end && (this.mainCanvas.width + this.scrollOffsets.main.x > (_ref1 = mainPoint.x) && _ref1 > this.scrollOffsets.main.x - this.gutter.offsetWidth) && (this.mainCanvas.height + this.scrollOffsets.main.y > (_ref2 = mainPoint.y) && _ref2 > this.scrollOffsets.main.y)) {
          this.view.getViewNodeFor(this.tree).highlightArea.draw(this.highlightCtx);
          this.lastHighlight = this.tree;
        } else {
          testPoints = this.dropPointQuadTree.retrieve({
            x: mainPoint.x - MAX_DROP_DISTANCE,
            y: mainPoint.y - MAX_DROP_DISTANCE,
            w: MAX_DROP_DISTANCE * 2,
            h: MAX_DROP_DISTANCE * 2
          }, function(point) {
            var distance;
            if (!((point.acceptLevel === helper.DISCOURAGED) && !_this.shiftKeyPressed)) {
              distance = mainPoint.from(point);
              distance.y *= 2;
              distance = distance.magnitude();
              if (distance < min && mainPoint.from(point).magnitude() < MAX_DROP_DISTANCE && (_this.view.getViewNodeFor(point._ice_node).highlightArea != null)) {
                best = point._ice_node;
                return min = distance;
              }
            }
          });
          if (best !== this.lastHighlight) {
            this.clearHighlightCanvas();
            if (best != null) {
              this.view.getViewNodeFor(best).highlightArea.draw(this.highlightCtx);
            }
            this.lastHighlight = best;
          }
        }
        palettePoint = this.trackerPointToPalette(position);
        if (this.wouldDelete(position)) {
          if (this.begunTrash) {
            return this.dragCanvas.style.opacity = 0.85;
          } else {
            return this.dragCanvas.style.opacity = 0.3;
          }
        } else {
          this.dragCanvas.style.opacity = 0.85;
          return this.begunTrash = false;
        }
      }
    });
    hook('mouseup', 0, function() {
      clearTimeout(this.discourageDropTimeout);
      return this.discourageDropTimeout = null;
    });
    Editor.prototype.getAcceptLevel = function(drag, drop) {
      var acceptance, _ref, _ref1, _ref2, _ref3, _ref4;
      if (drop == null) {
        return helper.FORBIDDEN;
      }
      if (this.view.getViewNodeFor(drop).dropPoint == null) {
        return helper.FORBIDDEN;
      }
      if (((_ref = drop.parent) != null ? _ref.type : void 0) === 'socket') {
        return helper.FORBIDDEN;
      }
      if ((drag != null ? drag.type : void 0) === 'segment' && ((_ref1 = drop.type) === 'block' || _ref1 === 'segment' || _ref1 === 'indent')) {
        return helper.ENCOURAGED;
      }
      if ((drop != null ? drop.type : void 0) === 'socket') {
        acceptance = drop.accepts(drag);
        if (acceptance === helper.ENCOURAGE_ALL) {
          return helper.ENCOURAGED;
        }
        if (acceptance === helper.NORMAL && ((_ref2 = drag.socketLevel) === ANY_DROP || _ref2 === MOSTLY_VALUE || _ref2 === VALUE_ONLY)) {
          return helper.ENCOURAGED;
        } else if (acceptance === helper.NORMAL && ((_ref3 = drag.socketLevel) === MOSTLY_BLOCK)) {
          return helper.DISCOURAGED;
        } else if (acceptance === helper.DISCOURAGE && drag.socketLevel !== BLOCK_ONLY) {
          return helper.DISCOURAGED;
        } else {
          return helper.FORBIDDEN;
        }
      } else if ((_ref4 = drag.socketLevel) === ANY_DROP || _ref4 === MOSTLY_BLOCK || _ref4 === BLOCK_ONLY) {
        return helper.ENCOURAGED;
      } else if (drag.socketLevel === MOSTLY_VALUE) {
        return helper.DISCOURAGED;
      } else {
        return helper.FORBIDDEN;
      }
    };
    hook('mouseup', 1, function(point, event, state) {
      var newBlock, parent;
      if ((this.draggingBlock != null) && (this.lastHighlight != null)) {
        if (this.inTree(this.draggingBlock)) {
          this.addMicroUndoOperation('CAPTURE_POINT');
          this.addMicroUndoOperation(new PickUpOperation(this.draggingBlock));
          this.draggingBlock.spliceOut();
        }
        this.clearHighlightCanvas();
        switch (this.lastHighlight.type) {
          case 'indent':
          case 'socket':
            this.addMicroUndoOperation(new DropOperation(this.draggingBlock, this.lastHighlight.start));
            this.draggingBlock.spliceIn(this.lastHighlight.start);
            break;
          case 'block':
            this.addMicroUndoOperation(new DropOperation(this.draggingBlock, this.lastHighlight.end));
            this.draggingBlock.spliceIn(this.lastHighlight.end);
            break;
          default:
            if (this.lastHighlight === this.tree) {
              this.addMicroUndoOperation(new DropOperation(this.draggingBlock, this.tree.start));
              this.draggingBlock.spliceIn(this.tree.start);
            }
        }
        if (this.lastHighlight.type === 'socket') {
          try {
            parent = this.draggingBlock.parent.parent;
            newBlock = coffee.parse(parent.stringify(), {
              wrapAtRoot: true
            }).start.next.container;
            if ((newBlock != null ? newBlock.type : void 0) === 'block') {
              parent.start.prev.append(newBlock.start);
              newBlock.end.append(parent.end.next);
              newBlock.parent = newBlock.start.parent = newBlock.end.parent = parent.parent;
              this.addMicroUndoOperation(new ReparseOperation(parent, newBlock));
            }
          } catch (_error) {}
        }
        this.redrawMain();
        this.moveCursorTo(this.draggingBlock.end, true);
        this.draggingBlock = null;
        this.draggingOffset = null;
        this.lastHighlight = null;
        return this.clearDrag();
      }
    });
    hook('populate', 0, function() {
      return this.floatingBlocks = [];
    });
    FloatingBlockRecord = (function() {
      function FloatingBlockRecord(block, position) {
        this.block = block;
        this.position = position;
      }

      return FloatingBlockRecord;

    })();
    ToFloatingOperation = (function(_super) {
      __extends(ToFloatingOperation, _super);

      function ToFloatingOperation(block, position, editor) {
        this.position = new editor.draw.Point(position.x, position.y);
        ToFloatingOperation.__super__.constructor.call(this, block, null);
      }

      ToFloatingOperation.prototype.undo = function(editor) {
        editor.floatingBlocks.pop();
        return ToFloatingOperation.__super__.undo.apply(this, arguments);
      };

      ToFloatingOperation.prototype.redo = function(editor) {
        editor.floatingBlocks.push(new FloatingBlockRecord(this.block.clone(), this.position));
        return ToFloatingOperation.__super__.redo.apply(this, arguments);
      };

      return ToFloatingOperation;

    })(DropOperation);
    FromFloatingOperation = (function() {
      function FromFloatingOperation(record, editor) {
        this.position = new editor.draw.Point(record.position.x, record.position.y);
        this.block = record.block.clone();
      }

      FromFloatingOperation.prototype.undo = function(editor) {
        editor.floatingBlocks.push(new FloatingBlockRecord(this.block.clone(), this.position));
        return null;
      };

      FromFloatingOperation.prototype.redo = function(editor) {
        editor.floatingBlocks.pop();
        return null;
      };

      return FromFloatingOperation;

    })();
    Editor.prototype.inTree = function(block) {
      while (!(block === this.tree || (block == null))) {
        block = block.parent;
      }
      return block === this.tree;
    };
    hook('mouseup', 0, function(point, event, state) {
      var palettePoint, renderPoint, trackPoint, _ref, _ref1, _ref2, _ref3;
      if ((this.draggingBlock != null) && (this.lastHighlight == null)) {
        trackPoint = new this.draw.Point(point.x + this.draggingOffset.x, point.y + this.draggingOffset.y);
        renderPoint = this.trackerPointToMain(trackPoint);
        palettePoint = this.trackerPointToPalette(trackPoint);
        if (this.inTree(this.draggingBlock)) {
          this.moveCursorTo(this.draggingBlock.end);
          this.addMicroUndoOperation('CAPTURE_POINT');
          this.addMicroUndoOperation(new PickUpOperation(this.draggingBlock));
          this.draggingBlock.spliceOut();
        }
        palettePoint = this.trackerPointToPalette(point);
        if ((0 < (_ref = palettePoint.x - this.scrollOffsets.palette.x) && _ref < this.paletteCanvas.width) && (0 < (_ref1 = palettePoint.y - this.scrollOffsets.palette.y) && _ref1 < this.paletteCanvas.height) || !((-this.gutter.offsetWidth < (_ref2 = renderPoint.x - this.scrollOffsets.main.x) && _ref2 < this.mainCanvas.width) && (0 < (_ref3 = renderPoint.y - this.scrollOffsets.main.y) && _ref3 < this.mainCanvas.height))) {
          if (this.draggingBlock === this.lassoSegment) {
            this.lassoSegment = null;
          }
          this.draggingBlock = null;
          this.draggingOffset = null;
          this.lastHighlight = null;
          this.clearDrag();
          this.redrawMain();
          return;
        } else if (renderPoint.x - this.scrollOffsets.main.x < 0) {
          renderPoint.x = this.scrollOffsets.main.x;
        }
        this.addMicroUndoOperation(new ToFloatingOperation(this.draggingBlock, renderPoint, this));
        this.floatingBlocks.push(new FloatingBlockRecord(this.draggingBlock, renderPoint));
        this.draggingBlock = null;
        this.draggingOffset = null;
        this.lastHighlight = null;
        this.clearDrag();
        this.redrawMain();
        return this.redrawHighlights();
      }
    });
    hook('mousedown', 5, function(point, event, state) {
      var hitTestResult, i, record, _i, _len, _ref, _results;
      if (state.consumedHitTest) {
        return;
      }
      if (event.which !== 1) {
        return;
      }
      _ref = this.floatingBlocks;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        record = _ref[i];
        hitTestResult = this.hitTest(this.trackerPointToMain(point), record.block);
        if (hitTestResult != null) {
          this.clickedBlock = record.block;
          this.clickedPoint = point;
          state.consumedHitTest = true;
          _results.push(this.redrawMain());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
    hook('mousemove', 7, function(point, event, state) {
      var i, record, _i, _len, _ref;
      if ((this.clickedBlock != null) && point.from(this.clickedPoint).magnitude() > MIN_DRAG_DISTANCE) {
        _ref = this.floatingBlocks;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          record = _ref[i];
          if (record.block === this.clickedBlock) {
            if (!state.addedCapturePoint) {
              this.addMicroUndoOperation('CAPTURE_POINT');
              state.addedCapturePoint = true;
            }
            this.addMicroUndoOperation(new FromFloatingOperation(record, this));
            this.floatingBlocks.splice(i, 1);
            this.redrawMain();
            return;
          }
        }
      }
    });
    hook('redraw_main', 7, function() {
      var blockView, boundingRect, record, _i, _len, _ref, _results;
      boundingRect = new this.draw.Rectangle(this.scrollOffsets.main.x, this.scrollOffsets.main.y, this.mainCanvas.width, this.mainCanvas.height);
      _ref = this.floatingBlocks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        blockView = this.view.getViewNodeFor(record.block);
        blockView.layout(record.position.x, record.position.y);
        _results.push(blockView.draw(this.mainCtx, boundingRect));
      }
      return _results;
    });
    hook('populate', 0, function() {
      var i, paletteGroup, paletteHeaderRow, _i, _len, _ref, _results,
        _this = this;
      this.currentPaletteBlocks = [];
      this.currentPaletteMetadata = [];
      this.clickedBlockIsPaletteBlock = false;
      this.paletteHeader = document.createElement('div');
      this.paletteHeader.className = 'ice-palette-header';
      this.paletteWrapper.appendChild(this.paletteHeader);
      paletteHeaderRow = null;
      _ref = this.paletteGroups;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        paletteGroup = _ref[i];
        _results.push((function(paletteGroup) {
          var clickHandler, data, event, newBlock, newPaletteBlocks, paletteGroupBlocks, paletteGroupHeader, _j, _k, _len1, _len2, _ref1, _ref2, _results1;
          if (i % 2 === 0) {
            paletteHeaderRow = document.createElement('div');
            paletteHeaderRow.className = 'ice-palette-header-row';
            _this.paletteHeader.appendChild(paletteHeaderRow);
          }
          paletteGroupHeader = document.createElement('div');
          paletteGroupHeader.className = 'ice-palette-group-header';
          paletteGroupHeader.innerText = paletteGroupHeader.textContent = paletteGroup.name;
          if (paletteGroup.color) {
            paletteGroupHeader.className += ' ' + paletteGroup.color;
          }
          paletteHeaderRow.appendChild(paletteGroupHeader);
          newPaletteBlocks = [];
          _ref1 = paletteGroup.blocks;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            data = _ref1[_j];
            newBlock = coffee.parse(data.block).start.next.container;
            newBlock.spliceOut();
            newBlock.parent = null;
            newPaletteBlocks.push({
              block: newBlock,
              title: data.title
            });
          }
          paletteGroupBlocks = newPaletteBlocks;
          clickHandler = function() {
            var event, _k, _len2, _ref2, _results1;
            _this.currentPaletteGroup = paletteGroup.name;
            _this.currentPaletteBlocks = paletteGroupBlocks.map(function(x) {
              return x.block;
            });
            _this.currentPaletteMetadata = paletteGroupBlocks;
            _this.currentPaletteGroupHeader.className = _this.currentPaletteGroupHeader.className.replace(/\s[-\w]*-selected\b/, '');
            _this.currentPaletteGroupHeader = paletteGroupHeader;
            _this.currentPaletteGroupHeader.className += ' ice-palette-group-header-selected';
            _this.redrawPalette();
            _ref2 = editorBindings.set_palette;
            _results1 = [];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              event = _ref2[_k];
              _results1.push(event.call(_this));
            }
            return _results1;
          };
          paletteGroupHeader.addEventListener('click', clickHandler);
          paletteGroupHeader.addEventListener('touchstart', clickHandler);
          if (i === 0) {
            _this.currentPaletteGroup = paletteGroup.name;
            _this.currentPaletteBlocks = paletteGroupBlocks.map(function(x) {
              return x.block;
            });
            _this.currentPaletteMetadata = paletteGroupBlocks;
            _this.currentPaletteGroupHeader = paletteGroupHeader;
            _this.currentPaletteGroupHeader.className += ' ice-palette-group-header-selected';
            _this.redrawPalette();
            _ref2 = editorBindings.set_palette;
            _results1 = [];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              event = _ref2[_k];
              _results1.push(event.call(_this));
            }
            return _results1;
          }
        })(paletteGroup));
      }
      return _results;
    });
    hook('mousedown', 6, function(point, event, state) {
      var block, hitTestResult, palettePoint, _i, _len, _ref, _ref1, _ref2;
      if (state.consumedHitTest) {
        return;
      }
      if (event.which !== 1) {
        return;
      }
      palettePoint = this.trackerPointToPalette(point);
      if ((this.scrollOffsets.palette.y < (_ref = palettePoint.y) && _ref < this.scrollOffsets.palette.y + this.paletteCanvas.height) && (this.scrollOffsets.palette.x < (_ref1 = palettePoint.x) && _ref1 < this.scrollOffsets.palette.x + this.paletteCanvas.width)) {
        _ref2 = this.currentPaletteBlocks;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          block = _ref2[_i];
          hitTestResult = this.hitTest(palettePoint, block);
          if (hitTestResult != null) {
            this.clickedBlock = block;
            this.clickedPoint = point;
            this.clickedBlockIsPaletteBlock = true;
            state.consumedHitTest = true;
            return;
          }
        }
      }
      return this.clickedBlockIsPaletteBlock = false;
    });
    hook('populate', 1, function() {
      this.paletteHighlightCanvas = document.createElement('canvas');
      this.paletteHighlightCanvas.className = 'ice-palette-highlight-canvas';
      this.paletteHighlightCtx = this.paletteHighlightCanvas.getContext('2d');
      this.paletteHighlightPath = null;
      this.currentHighlightedPaletteBlock = null;
      return this.paletteWrapper.appendChild(this.paletteHighlightCanvas);
    });
    hook('resize', 0, function() {
      this.paletteHighlightCanvas.style.top = this.paletteHeader.offsetHeight + 'px';
      this.paletteHighlightCanvas.width = this.paletteCanvas.width;
      return this.paletteHighlightCanvas.height = this.paletteCanvas.height;
    });
    hook('redraw_palette', 0, function() {
      this.clearPaletteHighlightCanvas();
      if (this.currentHighlightedPaletteBlock != null) {
        return this.paletteHighlightPath.draw(this.paletteHighlightCtx);
      }
    });
    hook('redraw_palette', 0, function() {
      var block, bounds, data, hoverDiv, _fn, _i, _len, _ref, _ref1, _results,
        _this = this;
      this.paletteScrollerStuffing.innerHTML = '';
      this.currentHighlightedPaletteBlock = null;
      _ref = this.currentPaletteMetadata;
      _fn = function(block) {
        hoverDiv.addEventListener('mousemove', function(event) {
          var palettePoint;
          palettePoint = _this.trackerPointToPalette(_this.getPointRelativeToTracker(event));
          if (_this.mainViewOrChildrenContains(block, palettePoint)) {
            if (block !== _this.currentHighlightedPaletteBlock) {
              _this.clearPaletteHighlightCanvas();
              _this.paletteHighlightPath = _this.getHighlightPath(block, {
                color: '#FF0'
              });
              _this.paletteHighlightPath.draw(_this.paletteHighlightCtx);
              return _this.currentHighlightedPaletteBlock = block;
            }
          } else if (block === _this.currentHighlightedPaletteBlock) {
            _this.currentHighlightedPaletteBlock = null;
            return _this.clearPaletteHighlightCanvas();
          }
        });
        return hoverDiv.addEventListener('mouseout', function(event) {
          if (block === _this.currentHighlightedPaletteBlock) {
            _this.currentHighlightedPaletteBlock = null;
            return _this.paletteHighlightCtx.clearRect(_this.scrollOffsets.palette.x, _this.scrollOffsets.palette.y, _this.paletteHighlightCanvas.width + _this.scrollOffsets.palette.x, _this.paletteHighlightCanvas.height + _this.scrollOffsets.palette.y);
          }
        });
      };
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        block = data.block;
        hoverDiv = document.createElement('div');
        hoverDiv.className = 'ice-hover-div';
        hoverDiv.title = (_ref1 = data.title) != null ? _ref1 : block.stringify();
        bounds = this.view.getViewNodeFor(block).totalBounds;
        hoverDiv.style.top = "" + bounds.y + "px";
        hoverDiv.style.left = "" + bounds.x + "px";
        hoverDiv.style.width = "" + (Math.min(bounds.width, Infinity)) + "px";
        hoverDiv.style.height = "" + bounds.height + "px";
        _fn(block);
        _results.push(this.paletteScrollerStuffing.appendChild(hoverDiv));
      }
      return _results;
    });
    TextChangeOperation = (function(_super) {
      __extends(TextChangeOperation, _super);

      function TextChangeOperation(socket, before) {
        this.before = before;
        this.after = socket.stringify();
        this.socket = socket.start.getSerializedLocation();
      }

      TextChangeOperation.prototype.undo = function(editor) {
        var socket;
        socket = editor.tree.getTokenAtLocation(this.socket).container;
        return editor.populateSocket(socket, this.before);
      };

      TextChangeOperation.prototype.redo = function(editor) {
        var socket;
        socket = editor.tree.getTokenAtLocation(this.socket).container;
        return editor.populateSocket(this.socket, this.after);
      };

      return TextChangeOperation;

    })(UndoOperation);
    TextReparseOperation = (function(_super) {
      __extends(TextReparseOperation, _super);

      function TextReparseOperation(socket, before) {
        this.before = before;
        this.after = socket.start.next.container;
        this.socket = socket.start.getSerializedLocation();
      }

      TextReparseOperation.prototype.undo = function(editor) {
        var socket;
        socket = editor.tree.getTokenAtLocation(this.socket).container;
        socket.start.next.container.moveTo(null);
        return socket.start.insert(new model.TextToken(this.before));
      };

      TextReparseOperation.prototype.redo = function(editor) {
        var socket;
        socket = editor.tree.getTokenAtLocation(this.socket).container;
        socket.start.append(socket.end);
        socket.notifyChange();
        return this.after.clone().moveTo(socket);
      };

      return TextReparseOperation;

    })(UndoOperation);
    hook('populate', 1, function() {
      var event, _i, _len, _ref, _results,
        _this = this;
      this.hiddenInput = document.createElement('textarea');
      this.hiddenInput.className = 'ice-hidden-input';
      this.iceElement.appendChild(this.hiddenInput);
      this.textFocus = null;
      this.textFocus = null;
      this.textInputAnchor = null;
      this.textInputSelecting = false;
      this.oldFocusValue = null;
      this.hiddenInput.addEventListener('keydown', function(event) {
        var _ref;
        if (event.keyCode === 8 && _this.hiddenInput.value.length > 1 && _this.hiddenInput.value[0] === _this.hiddenInput.value[_this.hiddenInput.value.length - 1] && ((_ref = _this.hiddenInput.value[0]) === '\'' || _ref === '\"') && _this.hiddenInput.selectionEnd === 1) {
          return event.preventDefault();
        }
      });
      _ref = ['input', 'keyup', 'keydown', 'select'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        _results.push(this.hiddenInput.addEventListener(event, function() {
          _this.highlightFlashShow();
          if (_this.textFocus != null) {
            _this.populateSocket(_this.textFocus, _this.hiddenInput.value);
            return _this.redrawTextInput();
          }
        }));
      }
      return _results;
    });
    hook('resize', 0, function() {
      this.aceElement.style.width = "" + this.wrapperElement.offsetWidth + "px";
      return this.aceElement.style.height = "" + this.wrapperElement.offsetHeight + "px";
    });
    last_ = function(array) {
      return array[array.length - 1];
    };
    Editor.prototype.redrawTextInput = function() {
      var endRow, head, line, newp, oldp, rect, sameLength, startRow, textFocusView, treeView;
      sameLength = this.textFocus.stringify().split('\n').length === this.hiddenInput.value.split('\n').length;
      this.populateSocket(this.textFocus, this.hiddenInput.value);
      textFocusView = this.view.getViewNodeFor(this.textFocus);
      startRow = this.textFocus.stringify().slice(0, this.hiddenInput.selectionStart).split('\n').length - 1;
      endRow = this.textFocus.stringify().slice(0, this.hiddenInput.selectionEnd).split('\n').length - 1;
      if (sameLength && startRow === endRow) {
        line = endRow;
        head = this.textFocus.start;
        while (head !== this.tree.start) {
          head = head.prev;
          if (head.type === 'newline') {
            line++;
          }
        }
        treeView = this.view.getViewNodeFor(this.tree);
        oldp = deepCopy([treeView.glue[line - 1], treeView.glue[line], treeView.bounds[line].height]);
        treeView.layout(0, this.nubbyHeight);
        newp = deepCopy([treeView.glue[line - 1], treeView.glue[line], treeView.bounds[line].height]);
        if (deepEquals(newp, oldp)) {
          rect = new this.draw.NoRectangle();
          if (line > 0) {
            rect.unite(treeView.bounds[line - 1]);
          }
          rect.unite(treeView.bounds[line]);
          if (line + 1 < treeView.bounds.length) {
            rect.unite(treeView.bounds[line + 1]);
          }
          rect.width = Math.max(rect.width, this.mainCanvas.width);
          return this.redrawMain({
            boundingRectangle: rect
          });
        } else {
          return this.redrawMain();
        }
      } else {
        return this.redrawMain();
      }
    };
    Editor.prototype.redrawTextHighlights = function(scrollIntoView) {
      var endPosition, endRow, i, lines, startPosition, startRow, textFocusView, _i, _ref;
      if (scrollIntoView == null) {
        scrollIntoView = false;
      }
      textFocusView = this.view.getViewNodeFor(this.textFocus);
      startRow = this.textFocus.stringify().slice(0, this.hiddenInput.selectionStart).split('\n').length - 1;
      endRow = this.textFocus.stringify().slice(0, this.hiddenInput.selectionEnd).split('\n').length - 1;
      lines = this.textFocus.stringify().split('\n');
      startPosition = textFocusView.bounds[startRow].x + this.view.opts.textPadding + this.mainCtx.measureText(last_(this.textFocus.stringify().slice(0, this.hiddenInput.selectionStart).split('\n'))).width;
      endPosition = textFocusView.bounds[endRow].x + this.view.opts.textPadding + this.mainCtx.measureText(last_(this.textFocus.stringify().slice(0, this.hiddenInput.selectionEnd).split('\n'))).width;
      if (this.hiddenInput.selectionStart === this.hiddenInput.selectionEnd) {
        this.cursorCtx.lineWidth = 1;
        this.cursorCtx.strokeStyle = '#000';
        this.cursorCtx.strokeRect(startPosition, textFocusView.bounds[startRow].y, 0, this.view.opts.textHeight);
        this.textInputHighlighted = false;
      } else {
        this.textInputHighlighted = true;
        this.cursorCtx.fillStyle = 'rgba(0, 0, 256, 0.3)';
        if (startRow === endRow) {
          this.cursorCtx.fillRect(startPosition, textFocusView.bounds[startRow].y + this.view.opts.textPadding, endPosition - startPosition, this.view.opts.textHeight);
        } else {
          this.cursorCtx.fillRect(startPosition, textFocusView.bounds[startRow].y + this.view.opts.textPadding, textFocusView.bounds[startRow].right() - this.view.opts.textPadding - startPosition, this.view.opts.textHeight);
          for (i = _i = _ref = startRow + 1; _ref <= endRow ? _i < endRow : _i > endRow; i = _ref <= endRow ? ++_i : --_i) {
            this.cursorCtx.fillRect(textFocusView.bounds[i].x, textFocusView.bounds[i].y + this.view.opts.textPadding, textFocusView.bounds[i].width, this.view.opts.textHeight);
          }
          this.cursorCtx.fillRect(textFocusView.bounds[endRow].x, textFocusView.bounds[endRow].y + this.view.opts.textPadding, endPosition - textFocusView.bounds[endRow].x, this.view.opts.textHeight);
        }
      }
      if (scrollIntoView && endPosition > this.scrollOffsets.main.x + this.mainCanvas.width) {
        return this.mainScroller.scrollLeft = endPosition - this.mainCanvas.width + this.view.opts.padding;
      }
    };
    escapeString = function(str) {
      return str[0] + str.slice(1, -1).replace(/(\'|\"|\n)/g, '\\$1') + str[str.length - 1];
    };
    Editor.prototype.setTextInputFocus = function(focus, selectionStart, selectionEnd) {
      var newParse, originalText, parseParent, shouldPop, string, unparsedValue, _ref, _ref1, _ref2, _ref3;
      if (selectionStart == null) {
        selectionStart = 0;
      }
      if (selectionEnd == null) {
        selectionEnd = 0;
      }
      if ((focus != null ? focus.id : void 0) in this.extraMarks) {
        delete this.extraMarks[focus != null ? focus.id : void 0];
      }
      if ((this.textFocus != null) && this.textFocus !== focus) {
        this.addMicroUndoOperation('CAPTURE_POINT');
        this.addMicroUndoOperation(new TextChangeOperation(this.textFocus, this.oldFocusValue));
        this.oldFocusValue = null;
        originalText = this.textFocus.stringify();
        shouldPop = false;
        if (!this.textFocus.handwritten) {
          newParse = null;
          string = this.textFocus.stringify().trim();
          try {
            newParse = coffee.parse(unparsedValue = string, {
              wrapAtRoot: false
            });
          } catch (_error) {
            if (string[0] === string[string.length - 1] && ((_ref = string[0]) === '"' || _ref === '\'')) {
              try {
                string = escapeString(string);
                newParse = coffee.parse(unparsedValue = string, {
                  wrapAtRoot: false
                });
                this.populateSocket(this.textFocus, string);
              } catch (_error) {}
            }
          }
          if ((newParse != null) && newParse.start.next.type === 'blockStart' && newParse.start.next.container.end.next === newParse.end) {
            this.textFocus.start.append(this.textFocus.end);
            newParse.start.next.container.spliceIn(this.textFocus.start);
            this.addMicroUndoOperation(new TextReparseOperation(this.textFocus, unparsedValue));
            shouldPop = true;
          }
        }
        try {
          parseParent = this.textFocus.parent;
          newParse = coffee.parse(parseParent.stringify(), {
            wrapAtRoot: true
          });
          if (((_ref1 = newParse.start.next) != null ? (_ref2 = _ref1.container) != null ? _ref2.end : void 0 : void 0) === newParse.end.prev) {
            if (focus === null) {
              newParse = newParse.start.next;
              if (newParse.type === 'blockStart') {
                parseParent.start.prev.append(newParse);
                newParse.container.end.append(parseParent.end.next);
                newParse.container.parent = newParse.parent = newParse.container.end.parent = parseParent.parent;
                newParse.container.notifyChange();
                this.addMicroUndoOperation(new ReparseOperation(parseParent, newParse.container));
                parseParent.parent = null;
              }
            }
          } else {
            throw new Error('Socket is split.');
          }
        } catch (_error) {
          this.populateSocket(this.textFocus, originalText);
          if (shouldPop) {
            this.undoStack.pop();
          }
          this.redrawMain();
        }
      }
      if (focus == null) {
        this.textFocus = null;
        this.redrawMain();
        this.hiddenInput.blur();
        this.iceElement.focus();
        return;
      }
      this.oldFocusValue = focus.stringify();
      this.textFocus = focus;
      this.populateSocket(focus, focus.stringify());
      this.textFocus.notifyChange();
      this.moveCursorTo(focus.end);
      this.hiddenInput.value = this.textFocus.stringify();
      if (selectionStart < 0) {
        selectionStart = this.textFocus.stringify().length - selectionStart;
      }
      if (selectionEnd < 0) {
        selectionEnd = this.textFocus.stringify().length - selectionEnd;
      }
      if (this.textFocus != null) {
        this.hiddenInput.focus();
        if (this.hiddenInput.value[0] === this.hiddenInput.value[this.hiddenInput.value.length - 1] && ((_ref3 = this.hiddenInput.value[0]) === '\'' || _ref3 === '"')) {
          this.hiddenInput.setSelectionRange(1, this.hiddenInput.value.length - 1);
        } else {
          this.hiddenInput.setSelectionRange(0, this.hiddenInput.value.length);
        }
        this.redrawTextInput();
      }
      this.redrawMain();
      return this.redrawTextInput();
    };
    Editor.prototype.populateSocket = function(socket, string) {
      var head, i, line, lines, _i, _len;
      lines = string.split('\n');
      socket.start.append(socket.end);
      head = socket.start;
      for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
        line = lines[i];
        head = head.insert(new model.TextToken(line));
        if (i + 1 !== lines.length) {
          head = head.insert(new model.NewlineToken());
        }
      }
      return socket.notifyChange();
    };
    Editor.prototype.hitTestTextInput = function(point, block) {
      var head, _ref;
      head = block.start;
      while (head != null) {
        if (head.type === 'socketStart' && ((_ref = head.next.type) === 'text' || _ref === 'socketEnd') && this.view.getViewNodeFor(head.container).path.contains(point)) {
          return head.container;
        }
        head = head.next;
      }
      return null;
    };
    Editor.prototype.getTextPosition = function(point) {
      var column, lines, row, textFocusView;
      textFocusView = this.view.getViewNodeFor(this.textFocus);
      row = Math.floor((point.y - textFocusView.bounds[0].y) / (this.fontSize + 2 * this.view.opts.padding));
      row = Math.max(row, 0);
      row = Math.min(row, textFocusView.lineLength - 1);
      column = Math.max(0, Math.round((point.x - textFocusView.bounds[row].x - this.view.opts.textPadding) / this.mainCtx.measureText(' ').width));
      lines = this.textFocus.stringify().split('\n').slice(0, +row + 1 || 9e9);
      lines[lines.length - 1] = lines[lines.length - 1].slice(0, column);
      return lines.join('\n').length;
    };
    Editor.prototype.setTextInputAnchor = function(point) {
      this.textInputAnchor = this.textInputHead = this.getTextPosition(point);
      return this.hiddenInput.setSelectionRange(this.textInputAnchor, this.textInputHead);
    };
    Editor.prototype.selectDoubleClick = function(point) {
      var after, before, position, _ref, _ref1, _ref2, _ref3;
      position = this.getTextPosition(point);
      before = (_ref = (_ref1 = this.textFocus.stringify().slice(0, position).match(/\w*$/)[0]) != null ? _ref1.length : void 0) != null ? _ref : 0;
      after = (_ref2 = (_ref3 = this.textFocus.stringify().slice(position).match(/^\w*/)[0]) != null ? _ref3.length : void 0) != null ? _ref2 : 0;
      this.textInputAnchor = position - before;
      this.textInputHead = position + after;
      return this.hiddenInput.setSelectionRange(this.textInputAnchor, this.textInputHead);
    };
    Editor.prototype.setTextInputHead = function(point) {
      this.textInputHead = this.getTextPosition(point);
      return this.hiddenInput.setSelectionRange(Math.min(this.textInputAnchor, this.textInputHead), Math.max(this.textInputAnchor, this.textInputHead));
    };
    hook('mousedown', 2, function(point, event, state) {
      var hitTestResult, mainPoint;
      if (state.consumedHitTest) {
        return;
      }
      if (event.which !== 1) {
        return;
      }
      mainPoint = this.trackerPointToMain(point);
      hitTestResult = this.hitTestTextInput(mainPoint, this.tree);
      if (hitTestResult !== this.textFocus) {
        this.setTextInputFocus(null);
        this.redrawMain();
        hitTestResult = this.hitTestTextInput(mainPoint, this.tree);
      }
      if (hitTestResult != null) {
        if (hitTestResult !== this.textFocus) {
          this.setTextInputFocus(hitTestResult);
          this.redrawMain();
          this.textInputSelecting = false;
        } else {
          this.setTextInputAnchor(mainPoint);
          this.redrawTextInput();
          this.textInputSelecting = true;
        }
        return state.consumedHitTest = true;
      }
    });
    hook('dblclick', 0, function(point, event, state) {
      var hitTestResult, mainPoint,
        _this = this;
      if (state.consumedHitTest) {
        return;
      }
      mainPoint = this.trackerPointToMain(point);
      hitTestResult = this.hitTestTextInput(mainPoint, this.tree);
      if (hitTestResult !== this.textFocus) {
        this.setTextInputFocus(null);
        this.redrawMain();
        hitTestResult = this.hitTestTextInput(mainPoint, this.tree);
      }
      if (hitTestResult != null) {
        this.setTextInputFocus(hitTestResult);
        this.redrawMain();
        setTimeout((function() {
          _this.selectDoubleClick(mainPoint);
          _this.redrawTextInput();
          return _this.textInputSelecting = false;
        }), 0);
        return state.consumedHitTest = true;
      }
    });
    hook('mousemove', 0, function(point, event, state) {
      var mainPoint;
      if (this.textInputSelecting) {
        if (this.textFocus == null) {
          this.textInputSelecting = false;
          return;
        }
        mainPoint = this.trackerPointToMain(point);
        this.setTextInputHead(mainPoint);
        return this.redrawTextInput();
      }
    });
    hook('mouseup', 0, function(point, event, state) {
      var mainPoint;
      if (this.textInputSelecting) {
        mainPoint = this.trackerPointToMain(point);
        this.setTextInputHead(mainPoint);
        this.redrawTextInput();
        return this.textInputSelecting = false;
      }
    });
    CreateSegmentOperation = (function(_super) {
      __extends(CreateSegmentOperation, _super);

      function CreateSegmentOperation(segment) {
        this.first = segment.start.getSerializedLocation();
        this.last = segment.end.getSerializedLocation() - 2;
        this.lassoSelect = segment.isLassoSegment;
      }

      CreateSegmentOperation.prototype.undo = function(editor) {
        editor.tree.getTokenAtLocation(this.first).container.unwrap();
        return editor.tree.getTokenAtLocation(this.first);
      };

      CreateSegmentOperation.prototype.redo = function(editor) {
        var segment;
        segment = new model.Segment();
        segment.isLassoSegment = this.lassoSelect;
        segment.wrap(editor.tree.getTokenAtLocation(this.first), editor.tree.getTokenAtLocation(this.last));
        return segment.end;
      };

      return CreateSegmentOperation;

    })(UndoOperation);
    DestroySegmentOperation = (function(_super) {
      __extends(DestroySegmentOperation, _super);

      function DestroySegmentOperation(segment) {
        this.first = segment.start.getSerializedLocation();
        this.last = segment.end.getSerializedLocation() - 2;
        this.lassoSelect = segment.isLassoSegment;
      }

      DestroySegmentOperation.prototype.undo = function(editor) {
        var segment;
        segment = new model.Segment();
        segment.isLassoSegment = this.lassoSelect;
        segment.wrap(editor.tree.getTokenAtLocation(this.first), editor.tree.getTokenAtLocation(this.last));
        if (this.lassoSelect) {
          editor.lassoSegment = segment;
        }
        return segment.end;
      };

      DestroySegmentOperation.prototype.redo = function(editor) {
        editor.tree.getTokenAtLocation(this.first).container.unwrap();
        return editor.tree.getTokenAtLocation(this.first);
      };

      return DestroySegmentOperation;

    })(UndoOperation);
    hook('populate', 0, function() {
      this.lassoSelectCanvas = document.createElement('canvas');
      this.lassoSelectCanvas.className = 'ice-lasso-select-canvas';
      this.lassoSelectCtx = this.lassoSelectCanvas.getContext('2d');
      this.lassoSelectAnchor = null;
      this.lassoSegment = null;
      return this.iceElement.appendChild(this.lassoSelectCanvas);
    });
    Editor.prototype.clearLassoSelectCanvas = function() {
      return this.lassoSelectCtx.clearRect(0, 0, this.lassoSelectCanvas.width, this.lassoSelectCanvas.height);
    };
    hook('resize', 0, function() {
      this.lassoSelectCanvas.width = this.iceElement.offsetWidth;
      this.lassoSelectCanvas.style.width = "" + this.lassoSelectCanvas.width + "px";
      this.lassoSelectCanvas.height = this.iceElement.offsetHeight;
      this.lassoSelectCanvas.style.height = "" + this.lassoSelectCanvas.height + "px";
      return this.lassoSelectCanvas.style.left = "" + this.mainCanvas.offsetLeft + "px";
    });
    Editor.prototype.clearLassoSelection = function() {
      var head, needToRedraw, next;
      this.lassoSegment = null;
      head = this.tree.start;
      needToRedraw = false;
      while (head !== this.tree.end) {
        if (head.type === 'segmentStart' && head.container.isLassoSegment) {
          next = head.next;
          this.addMicroUndoOperation(new DestroySegmentOperation(head.container));
          head.container.unwrap();
          needToRedraw = true;
          head = next;
        } else {
          head = head.next;
        }
      }
      if (needToRedraw) {
        return this.redrawMain();
      }
    };
    hook('mousedown', 0, function(point, event, state) {
      var mainPoint, palettePoint, _ref, _ref1, _ref2, _ref3;
      if (!state.clickedLassoSegment) {
        this.clearLassoSelection();
      }
      if (state.consumedHitTest || state.suppressLassoSelect) {
        return;
      }
      if (event.which !== 1) {
        return;
      }
      mainPoint = this.trackerPointToMain(point).from(this.scrollOffsets.main);
      palettePoint = this.trackerPointToPalette(point).from(this.scrollOffsets.palette);
      if ((0 < (_ref = mainPoint.x) && _ref < this.mainCanvas.width) && (0 < (_ref1 = mainPoint.y) && _ref1 < this.mainCanvas.height) && !((0 < (_ref2 = palettePoint.x) && _ref2 < this.paletteCanvas.width) && (0 < (_ref3 = palettePoint.x) && _ref3 < this.paletteCanvas.height))) {
        return this.lassoSelectAnchor = this.trackerPointToMain(point);
      }
    });
    hook('mousemove', 0, function(point, event, state) {
      var first, lassoRectangle, last, mainPoint, _ref;
      if (this.lassoSelectAnchor != null) {
        mainPoint = this.trackerPointToMain(point);
        this.clearLassoSelectCanvas();
        lassoRectangle = new this.draw.Rectangle(Math.min(this.lassoSelectAnchor.x, mainPoint.x), Math.min(this.lassoSelectAnchor.y, mainPoint.y), Math.abs(this.lassoSelectAnchor.x - mainPoint.x), Math.abs(this.lassoSelectAnchor.y - mainPoint.y));
        first = this.tree.start;
        while (!((first == null) || first.type === 'blockStart' && this.view.getViewNodeFor(first.container).path.intersects(lassoRectangle))) {
          first = first.next;
        }
        last = this.tree.end;
        while (!((last == null) || last.type === 'blockEnd' && this.view.getViewNodeFor(last.container).path.intersects(lassoRectangle))) {
          last = last.prev;
        }
        this.clearLassoSelectCanvas();
        this.clearHighlightCanvas();
        if (first && (last != null)) {
          _ref = validateLassoSelection(this.tree, first, last), first = _ref[0], last = _ref[1];
          this.drawTemporaryLasso(first, last);
        }
        this.lassoSelectCtx.strokeStyle = '#00f';
        return this.lassoSelectCtx.strokeRect(lassoRectangle.x - this.scrollOffsets.main.x, lassoRectangle.y - this.scrollOffsets.main.y, lassoRectangle.width, lassoRectangle.height);
      }
    });
    Editor.prototype.drawTemporaryLasso = function(first, last) {
      var head, mainCanvasRectangle, _results;
      mainCanvasRectangle = new this.draw.Rectangle(this.scrollOffsets.main.x, this.scrollOffsets.main.y, this.mainCanvas.width, this.mainCanvas.height);
      head = first;
      _results = [];
      while (head !== last) {
        if (head instanceof model.StartToken) {
          this.view.getViewNodeFor(head.container).draw(this.highlightCtx, mainCanvasRectangle, {
            selected: Infinity
          });
          _results.push(head = head.container.end);
        } else {
          _results.push(head = head.next);
        }
      }
      return _results;
    };
    validateLassoSelection = function(tree, first, last) {
      var head, tokensToInclude;
      tokensToInclude = [];
      head = first;
      while (head !== last.next) {
        if (head instanceof model.StartToken || head instanceof model.EndToken) {
          tokensToInclude.push(head.container.start);
          tokensToInclude.push(head.container.end);
        }
        head = head.next;
      }
      first = tree.start;
      while (__indexOf.call(tokensToInclude, first) < 0) {
        first = first.next;
      }
      last = tree.end;
      while (__indexOf.call(tokensToInclude, last) < 0) {
        last = last.prev;
      }
      while (first.type !== 'blockStart') {
        first = first.prev;
        if (first.type === 'blockEnd') {
          first = first.container.start.prev;
        }
      }
      while (last.type !== 'blockEnd') {
        last = last.next;
        if (last.type === 'blockStart') {
          last = last.container.end.next;
        }
      }
      return [first, last];
    };
    hook('mouseup', 0, function(point, event, state) {
      var first, lassoRectangle, last, mainPoint, _ref;
      if (this.lassoSelectAnchor != null) {
        mainPoint = this.trackerPointToMain(point);
        lassoRectangle = new this.draw.Rectangle(Math.min(this.lassoSelectAnchor.x, mainPoint.x), Math.min(this.lassoSelectAnchor.y, mainPoint.y), Math.abs(this.lassoSelectAnchor.x - mainPoint.x), Math.abs(this.lassoSelectAnchor.y - mainPoint.y));
        this.lassoSelectAnchor = null;
        this.clearLassoSelectCanvas();
        first = this.tree.start;
        while (!((first == null) || first.type === 'blockStart' && this.view.getViewNodeFor(first.container).path.intersects(lassoRectangle))) {
          first = first.next;
        }
        last = this.tree.end;
        while (!((last == null) || last.type === 'blockEnd' && this.view.getViewNodeFor(last.container).path.intersects(lassoRectangle))) {
          last = last.prev;
        }
        if (!((first != null) && (last != null))) {
          return;
        }
        _ref = validateLassoSelection(this.tree, first, last), first = _ref[0], last = _ref[1];
        this.lassoSegment = new model.Segment();
        this.lassoSegment.isLassoSegment = true;
        this.lassoSegment.wrap(first, last);
        this.addMicroUndoOperation(new CreateSegmentOperation(this.lassoSegment));
        this.moveCursorTo(this.lassoSegment.end.next, true);
        return this.redrawMain();
      }
    });
    hook('mousedown', 3, function(point, event, state) {
      if (state.consumedHitTest) {
        return;
      }
      if (event.which !== 1) {
        return;
      }
      if ((this.lassoSegment != null) && (this.hitTest(this.trackerPointToMain(point), this.lassoSegment) != null)) {
        this.clickedBlock = this.lassoSegment;
        this.clickedPoint = point;
        state.consumedHitTest = true;
        return state.clickedLassoSegment = true;
      }
    });
    hook('populate', 0, function() {
      return this.cursor = new model.CursorToken();
    });
    isValidCursorPosition = function(pos) {
      var _ref;
      return (_ref = pos.parent.type) === 'indent' || _ref === 'segment';
    };
    Editor.prototype.moveCursorTo = function(destination, attemptReparse) {
      var head, _ref;
      if (attemptReparse == null) {
        attemptReparse = false;
      }
      if (destination == null) {
        return;
      }
      if (!this.inTree(destination)) {
        return;
      }
      this.highlightFlashShow();
      this.cursor.remove();
      if (destination === this.tree.start) {
        destination.insert(this.cursor);
      } else {
        head = destination;
        while (!(((_ref = head.type) === 'newline' || _ref === 'indentEnd') || head === this.tree.end)) {
          head = head.next;
        }
        if (head.type === 'newline') {
          head.insert(this.cursor);
        } else {
          head.insertBefore(this.cursor);
        }
      }
      if (!isValidCursorPosition(this.cursor)) {
        this.moveCursorTo(this.cursor.next);
      }
      if (attemptReparse) {
        this.reparseHandwrittenBlocks();
      }
      return this.redrawHighlights();
    };
    Editor.prototype.moveCursorUp = function() {
      var head, _ref;
      if (this.cursor.prev == null) {
        return;
      }
      this.cursor = this.cursor.prev;
      this.highlightFlashShow();
      if (typeof head === "undefined" || head === null) {
        return;
      }
      while (!(((_ref = head.type) === 'newline' || _ref === 'indentEnd') || head === this.tree.start)) {
        head = head.prev;
      }
      this.cursor.remove();
      if (head.type === 'newline' || head === this.tree.start) {
        head.insert(this.cursor);
      } else {
        head.insertBefore(this.cursor);
      }
      if (!isValidCursorPosition(this.cursor)) {
        this.moveCursorUp();
      }
      this.reparseHandwrittenBlocks();
      this.redrawHighlights();
      return this.scrollCursorIntoPosition();
    };
    Editor.prototype.determineCursorPosition = function() {
      var bound, head, line, _ref, _ref1;
      if ((this.cursor != null) && (this.cursor.parent != null)) {
        this.view.getViewNodeFor(this.tree).layout(0, this.nubbyHeight);
        head = this.cursor;
        line = 0;
        while (head !== this.cursor.parent.start) {
          head = head.prev;
          if (head.type === 'newline') {
            line++;
          }
        }
        bound = this.view.getViewNodeFor(this.cursor.parent).bounds[line];
        if (((_ref = this.cursor.nextVisibleToken()) != null ? _ref.type : void 0) === 'indentEnd' && ((_ref1 = this.cursor.prev) != null ? _ref1.prev.type : void 0) !== 'indentStart' || (this.cursor.next === this.tree.end && this.cursor.prev !== this.tree.start)) {
          return new this.draw.Point(bound.x, bound.bottom());
        } else {
          return new this.draw.Point(bound.x, bound.y);
        }
      }
    };
    Editor.prototype.scrollCursorIntoPosition = function() {
      var axis;
      axis = this.determineCursorPosition().y;
      if (axis - this.scrollOffsets.main.y < 0) {
        this.mainScroller.scrollTop = axis;
      } else if (axis - this.scrollOffsets.main.y > this.mainCanvas.height) {
        this.mainScroller.scrollTop = axis - this.mainCanvas.height;
      }
      return this.mainScroller.scrollLeft = 0;
    };
    hook('key.up', 0, function() {
      this.clearLassoSelection();
      this.setTextInputFocus(null);
      return this.moveCursorUp();
    });
    hook('key.down', 0, function() {
      this.clearLassoSelection();
      this.setTextInputFocus(null);
      this.reparseHandwrittenBlocks();
      this.moveCursorTo(this.cursor.next.next);
      return this.scrollCursorIntoPosition();
    });
    getCharactersTo = function(parent, token) {
      var chars, head;
      head = token;
      chars = 0;
      while (head !== parent.start) {
        if (head.type === 'text') {
          chars += head.value.length;
        }
        head = head.prev;
      }
      return chars;
    };
    getSocketAtChar = function(parent, chars) {
      var charsCounted, head;
      head = parent.start;
      charsCounted = 0;
      while (!(charsCounted >= chars && head.type === 'socketStart' && (head.next.type === 'text' || head.next === head.container.end))) {
        if (head.type === 'text') {
          charsCounted += head.value.length;
        }
        head = head.next;
      }
      return head.container;
    };
    hook('key.tab', 0, function() {
      var chars, head, persistentParent, socket;
      if (this.shiftKeyPressed) {
        if (this.textFocus != null) {
          head = this.textFocus.start;
        } else {
          head = this.cursor;
        }
        while (!((head == null) || head.type === 'socketEnd' && (head.container.start.next.type === 'text' || head.container.start.next === head.container.end))) {
          head = head.prev;
        }
        if (head != null) {
          if ((this.textFocus != null) && head.container.hasParent(this.textFocus.parent)) {
            persistentParent = this.textFocus.parent.parent;
            chars = getCharactersTo(persistentParent, head.container.start);
            this.setTextInputFocus(null);
            socket = getSocketAtChar(persistentParent, chars);
          } else {
            socket = head.container;
            this.setTextInputFocus(null);
          }
          this.setTextInputFocus(socket);
        }
        return false;
      } else {
        if (this.textFocus != null) {
          head = this.textFocus.end;
        } else {
          head = this.cursor;
        }
        while (!((head == null) || head.type === 'socketStart' && (head.container.start.next.type === 'text' || head.container.start.next === head.container.end))) {
          head = head.next;
        }
        if (head != null) {
          if ((this.textFocus != null) && head.container.hasParent(this.textFocus.parent)) {
            persistentParent = this.textFocus.parent.parent;
            chars = getCharactersTo(persistentParent, head.container.start);
            this.setTextInputFocus(null);
            socket = getSocketAtChar(persistentParent, chars);
          } else {
            socket = head.container;
            this.setTextInputFocus(null);
          }
          this.setTextInputFocus(socket);
        }
        return false;
      }
    });
    Editor.prototype.deleteAtCursor = function() {
      var blockEnd, _ref;
      this.setTextInputFocus(null);
      blockEnd = this.cursor.prev;
      while ((_ref = blockEnd != null ? blockEnd.type : void 0) !== 'blockEnd' && _ref !== 'indentStart' && _ref !== (void 0)) {
        blockEnd = blockEnd.prev;
      }
      if (blockEnd == null) {
        return;
      }
      if (blockEnd.type === 'blockEnd') {
        this.addMicroUndoOperation(new PickUpOperation(blockEnd.container));
        blockEnd.container.spliceOut();
        return this.redrawMain();
      }
    };
    hook('key.backspace', 0, function(state, event) {
      if (state.capturedBackspace) {
        return;
      }
      if (this.lassoSegment != null) {
        this.addMicroUndoOperation('CAPTURE_POINT');
        this.deleteLassoSegment();
        return false;
      } else if ((this.textFocus == null) || (this.hiddenInput.value.length === 0 && this.textFocus.handwritten)) {
        this.addMicroUndoOperation('CAPTURE_POINT');
        this.deleteAtCursor();
        state.capturedBackspace = true;
        return false;
      }
      return true;
    });
    Editor.prototype.deleteLassoSegment = function() {
      if (this.lassoSegment == null) {
        throw new Error('Cannot delete nonexistent lasso segment');
      }
      this.addMicroUndoOperation(new PickUpOperation(this.lassoSegment));
      this.lassoSegment.spliceOut();
      this.lassoSegment = null;
      return this.redrawMain();
    };
    hook('populate', 0, function() {
      var _this = this;
      this.handwrittenBlocks = [];
      this.shiftKeyPressed = false;
      this.keyListener.register_combo({
        keys: 'shift',
        on_keydown: function() {
          return _this.shiftKeyPressed = true;
        },
        on_keyup: function() {
          return _this.shiftKeyPressd = false;
        }
      });
      return this.keyListener.register_combo({
        keys: 'enter',
        on_keydown: function() {
          var head, newBlock, newSocket, _ref;
          if (!((_this.textFocus != null) || _this.shiftKeyPressed)) {
            _this.setTextInputFocus(null);
            newBlock = new model.Block();
            newSocket = new model.Socket(-Infinity);
            newSocket.spliceIn(newBlock.start);
            newSocket.handwritten = true;
            _this.handwrittenBlocks.push(newBlock);
            head = _this.cursor.prev;
            while (((_ref = head.type) === 'newline' || _ref === 'cursor' || _ref === 'segmentStart' || _ref === 'segmentEnd') && head !== _this.tree.start) {
              head = head.prev;
            }
            _this.addMicroUndoOperation('CAPTURE_POINT');
            _this.addMicroUndoOperation(new DropOperation(newBlock, head));
            newBlock.moveTo(head);
            _this.redrawMain();
            _this.reparseHandwrittenBlocks();
            return _this.newHandwrittenSocket = newSocket;
          } else if ((_this.textFocus != null) && !_this.shiftKeyPressed) {
            _this.setTextInputFocus(null);
            return _this.redrawMain();
          } else {
            return true;
          }
        },
        on_keyup: function() {
          if (_this.newHandwrittenSocket != null) {
            _this.setTextInputFocus(_this.newHandwrittenSocket);
            return _this.newHandwrittenSocket = null;
          }
        }
      });
    });
    containsCursor = function(block) {
      var head;
      head = block.start;
      while (head !== block.end) {
        if (head.type === 'cursor') {
          return true;
        }
        head = head.next;
      }
      return false;
    };
    ReparseOperation = (function(_super) {
      __extends(ReparseOperation, _super);

      function ReparseOperation(block, parse) {
        this.before = block.clone();
        this.location = block.start.getSerializedLocation();
        this.after = parse.clone();
      }

      ReparseOperation.prototype.undo = function(editor) {
        var block, newBlock;
        block = editor.tree.getTokenAtLocation(this.location).container;
        newBlock = this.before.clone();
        block.start.prev.append(newBlock.start);
        newBlock.end.append(block.end.next);
        return newBlock.notifyChange();
      };

      ReparseOperation.prototype.redo = function(editor) {
        var block, newBlock;
        block = editor.tree.getTokenAtLocation(this.location).container;
        newBlock = this.after.clone();
        block.prev.append(newBlock.start);
        newBlock.end.append(block.end.next);
        return newBlock.notifyChange();
      };

      return ReparseOperation;

    })(UndoOperation);
    Editor.prototype.reparseHandwrittenBlocks = function() {
      var head, newBlock;
      this.setTextInputFocus(null);
      head = this.tree.start;
      while (head !== this.tree.end) {
        if (head.type === 'blockStart' && head.next.type === 'socketStart' && head.next.container.handwritten && !containsCursor(head.container)) {
          try {
            newBlock = coffee.parse(head.container.stringify(), {
              wrapAtRoot: true
            }).start.next;
            if (newBlock.type === 'blockStart') {
              this.addMicroUndoOperation(new ReparseOperation(head.container, newBlock.container));
              head.prev.append(newBlock);
              newBlock.container.end.append(head.container.end.next);
              newBlock.parent = head.container.parent;
              head.container.parent = null;
              newBlock.notifyChange();
              head = newBlock.container.end;
            }
          } catch (_error) {}
        }
        head = head.next;
      }
      this.redrawMain();
      return null;
    };
    Editor.prototype.copyAceEditor = function() {
      this.gutter.style.width = this.aceEditor.renderer.$gutterLayer.gutterWidth + 'px';
      return this.resize();
    };
    hook('populate', 0, function() {
      var _this = this;
      this.aceElement = document.createElement('div');
      this.aceElement.className = 'ice-ace';
      this.wrapperElement.appendChild(this.aceElement);
      this.aceEditor = ace.edit(this.aceElement);
      this.aceEditor.setTheme('ace/theme/chrome');
      this.aceEditor.setFontSize(15);
      this.aceEditor.getSession().setMode('ace/mode/coffee');
      this.aceEditor.getSession().setTabSize(2);
      this.aceEditor.on('change', function() {
        if (_this.currentlyUsingBlocks && !_this.suppressAceChangeEvent) {
          return _this.copyAceEditor();
        }
      });
      this.currentlyUsingBlocks = true;
      this.currentlyAnimating = false;
      this.transitionContainer = document.createElement('div');
      this.transitionContainer.className = 'ice-transition-container';
      return this.iceElement.appendChild(this.transitionContainer);
    });
    getOffsetTop = function(element) {
      var top;
      top = element.offsetTop;
      while ((element = element.offsetParent) != null) {
        top += element.offsetTop;
      }
      return top;
    };
    getOffsetLeft = function(element) {
      var left;
      left = element.offsetLeft;
      while ((element = element.offsetParent) != null) {
        left += element.offsetLeft;
      }
      return left;
    };
    Editor.prototype.computePlaintextTranslationVectors = function() {
      var aceSession, corner, head, rownum, state, textElements, translationVectors, wrappedlines;
      textElements = [];
      translationVectors = [];
      head = this.tree.start;
      aceSession = this.aceEditor.session;
      state = {
        x: (this.aceEditor.container.getBoundingClientRect().left - getOffsetLeft(this.aceElement) + this.aceEditor.renderer.$gutterLayer.gutterWidth) - this.gutter.offsetWidth + 5,
        y: (this.aceEditor.container.getBoundingClientRect().top - getOffsetTop(this.aceElement)) - aceSession.getScrollTop(),
        indent: 0,
        lineHeight: this.aceEditor.renderer.layerConfig.lineHeight,
        leftEdge: (this.aceEditor.container.getBoundingClientRect().left - getOffsetLeft(this.aceElement) + this.aceEditor.renderer.$gutterLayer.gutterWidth) - this.gutter.offsetWidth + 5
      };
      this.mainCtx.font = this.aceFontSize() + ' ' + this.fontFamily;
      rownum = 0;
      while (head !== this.tree.end) {
        switch (head.type) {
          case 'text':
            corner = this.view.getViewNodeFor(head).bounds[0].upperLeftCorner();
            corner.x -= this.scrollOffsets.main.x;
            corner.y -= this.scrollOffsets.main.y;
            translationVectors.push((new this.draw.Point(state.x, state.y)).from(corner));
            textElements.push(this.view.getViewNodeFor(head));
            state.x += this.mainCtx.measureText(head.value).width;
            break;
          case 'newline':
            wrappedlines = Math.max(1, aceSession.documentToScreenRow(rownum + 1, 0) - aceSession.documentToScreenRow(rownum, 0));
            rownum += 1;
            state.y += state.lineHeight * wrappedlines;
            if (head.specialIndent != null) {
              state.x = state.leftEdge + this.mainCtx.measureText(head.specialIndent).width;
            } else {
              state.x = state.leftEdge + state.indent * this.mainCtx.measureText(' ').width;
            }
            break;
          case 'indentStart':
            state.indent += head.container.depth;
            break;
          case 'indentEnd':
            state.indent -= head.container.depth;
        }
        head = head.next;
      }
      return {
        textElements: textElements,
        translationVectors: translationVectors
      };
    };
    AnimatedColor = (function() {
      function AnimatedColor(start, end, time) {
        this.start = start;
        this.end = end;
        this.time = time;
        this.currentRGB = [parseInt(this.start.slice(1, 3), 16), parseInt(this.start.slice(3, 5), 16), parseInt(this.start.slice(5, 7), 16)];
        this.step = [(parseInt(this.end.slice(1, 3), 16) - this.currentRGB[0]) / this.time, (parseInt(this.end.slice(3, 5), 16) - this.currentRGB[1]) / this.time, (parseInt(this.end.slice(5, 7), 16) - this.currentRGB[2]) / this.time];
      }

      AnimatedColor.prototype.advance = function() {
        var i, item, _i, _len, _ref;
        _ref = this.currentRGB;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          item = _ref[i];
          this.currentRGB[i] += this.step[i];
        }
        return "rgb(" + (Math.round(this.currentRGB[0])) + "," + (Math.round(this.currentRGB[1])) + "," + (Math.round(this.currentRGB[2])) + ")";
      };

      return AnimatedColor;

    })();
    Editor.prototype.performMeltAnimation = function(fadeTime, translateTime, cb) {
      var aceScrollTop, bottom, div, i, line, lineHeight, textElement, textElements, top, translatingElements, translationVectors, treeView, _fn, _fn1, _i, _j, _len, _ref,
        _this = this;
      if (fadeTime == null) {
        fadeTime = 500;
      }
      if (translateTime == null) {
        translateTime = 1000;
      }
      if (cb == null) {
        cb = function() {};
      }
      if (this.currentlyUsingBlocks && !this.currentlyAnimating) {
        this.fireEvent('statechange', [false]);
        this.aceEditor.setValue(this.getValue(), -1);
        top = this.findLineNumberAtCoordinate(this.scrollOffsets.main.y);
        this.aceEditor.scrollToLine(top);
        this.aceEditor.resize(true);
        this.redrawMain({
          noText: true
        });
        this.textFocus = this.lassoAnchor = null;
        if (this.mainScroller.scrollWidth > this.mainScroller.offsetWidth) {
          this.mainScroller.style.overflowX = 'scroll';
        } else {
          this.mainScroller.style.overflowX = 'hidden';
        }
        this.mainScroller.style.overflowY = 'hidden';
        this.iceElement.style.width = this.wrapperElement.offsetWidth + 'px';
        this.currentlyUsingBlocks = false;
        this.currentlyAnimating = this.currentlyAnimating_suppressRedraw = true;
        this.paletteHeader.style.zIndex = 0;
        _ref = this.computePlaintextTranslationVectors(), textElements = _ref.textElements, translationVectors = _ref.translationVectors;
        translatingElements = [];
        _fn = function(div, textElement, translationVectors, i) {
          return setTimeout((function() {
            div.style.left = (textElement.bounds[0].x - _this.scrollOffsets.main.x + translationVectors[i].x) + 'px';
            div.style.top = (textElement.bounds[0].y - _this.scrollOffsets.main.y + translationVectors[i].y) + 'px';
            return div.style.fontSize = _this.aceFontSize();
          }), fadeTime);
        };
        for (i = _i = 0, _len = textElements.length; _i < _len; i = ++_i) {
          textElement = textElements[i];
          if (!(0 < textElement.bounds[0].bottom() - this.scrollOffsets.main.y + translationVectors[i].y && textElement.bounds[0].y - this.scrollOffsets.main.y + translationVectors[i].y < this.mainCanvas.height)) {
            continue;
          }
          div = document.createElement('div');
          div.style.whiteSpace = 'pre';
          div.innerText = textElement.model.value;
          div.style.font = this.fontSize + 'px ' + this.fontFamily;
          div.style.left = "" + (textElement.bounds[0].x - this.scrollOffsets.main.x) + "px";
          div.style.top = "" + (textElement.bounds[0].y - this.scrollOffsets.main.y - this.fontAscent) + "px";
          div.className = 'ice-transitioning-element';
          div.style.transition = "left " + translateTime + "ms, top " + translateTime + "ms, font-size " + translateTime + "ms";
          translatingElements.push(div);
          this.transitionContainer.appendChild(div);
          _fn(div, textElement, translationVectors, i);
        }
        top = Math.max(this.aceEditor.getFirstVisibleRow(), 0);
        bottom = Math.min(this.aceEditor.getLastVisibleRow(), this.view.getViewNodeFor(this.tree).lineLength - 1);
        aceScrollTop = this.aceEditor.session.getScrollTop();
        treeView = this.view.getViewNodeFor(this.tree);
        lineHeight = this.aceEditor.renderer.layerConfig.lineHeight;
        _fn1 = function(div, line) {
          return setTimeout((function() {
            div.style.left = '0px';
            div.style.top = (_this.aceEditor.session.documentToScreenRow(line, 0) * lineHeight - aceScrollTop) + 'px';
            return div.style.fontSize = _this.aceFontSize();
          }), fadeTime);
        };
        for (line = _j = top; top <= bottom ? _j <= bottom : _j >= bottom; line = top <= bottom ? ++_j : --_j) {
          div = document.createElement('div');
          div.style.whiteSpace = 'pre';
          div.innerText = line + 1;
          div.style.left = 0;
          div.style.top = "" + (treeView.bounds[line].y + treeView.distanceToBase[line].above - this.view.opts.textHeight - this.fontAscent - this.scrollOffsets.main.y) + "px";
          div.style.font = this.fontSize + 'px ' + this.fontFamily;
          div.style.width = "" + this.gutter.offsetWidth + "px";
          translatingElements.push(div);
          div.className = 'ice-transitioning-element ice-transitioning-gutter';
          div.style.transition = "left " + translateTime + "ms, top " + translateTime + "ms, font-size " + translateTime + "ms";
          this.iceElement.appendChild(div);
          _fn1(div, line);
        }
        this.lineNumberWrapper.style.display = 'none';
        this.mainCanvas.style.transition = this.highlightCanvas.style.transition = this.cursorCanvas.style.opacity = "opacity " + fadeTime + "ms linear";
        this.mainCanvas.style.opacity = this.highlightCanvas.style.opacity = this.cursorCanvas.style.opacity = 0;
        this.iceElement.style.transition = this.paletteWrapper.style.transition = "left " + fadeTime + "ms";
        this.iceElement.style.left = '0px';
        this.paletteWrapper.style.left = "" + (-this.paletteWrapper.offsetWidth) + "px";
        setTimeout((function() {
          var _k, _len1;
          _this.iceElement.style.transition = _this.paletteWrapper.style.transition = '';
          _this.iceElement.style.top = '-9999px';
          _this.iceElement.style.left = '-9999px';
          _this.paletteWrapper.style.top = '-9999px';
          _this.paletteWrapper.style.left = '-9999px';
          _this.aceElement.style.top = "0px";
          _this.aceElement.style.left = "0px";
          _this.currentlyAnimating = false;
          _this.mainScroller.style.overflow = 'auto';
          for (_k = 0, _len1 = translatingElements.length; _k < _len1; _k++) {
            div = translatingElements[_k];
            div.parentNode.removeChild(div);
          }
          _this.fireEvent('toggledone', [_this.currentlyUsingBlocks]);
          if (cb != null) {
            return cb();
          }
        }), fadeTime + translateTime);
        return {
          success: true
        };
      }
    };
    Editor.prototype.aceFontSize = function() {
      return parseFloat(this.aceEditor.getFontSize()) + 'px';
    };
    Editor.prototype.performFreezeAnimation = function(fadeTime, translateTime, cb) {
      var setValueResult,
        _this = this;
      if (fadeTime == null) {
        fadeTime = 500;
      }
      if (translateTime == null) {
        translateTime = 500;
      }
      if (cb == null) {
        cb = function() {};
      }
      if (!this.currentlyUsingBlocks && !this.currentlyAnimating) {
        this.copyAceEditor();
        this.fireEvent('statechange', [true]);
        setValueResult = this.setValue_raw(this.aceEditor.getValue());
        if (!setValueResult.success) {
          return setValueResult;
        }
        if (this.aceEditor.getFirstVisibleRow() === 0) {
          this.mainScroller.scrollTop = 0;
        } else {
          this.mainScroller.scrollTop = this.view.getViewNodeFor(this.tree).bounds[this.aceEditor.getFirstVisibleRow()].y;
        }
        this.currentlyUsingBlocks = true;
        this.currentlyAnimating = true;
        setTimeout((function() {
          var aceScrollTop, bottom, div, el, i, line, lineHeight, textElement, textElements, top, translatingElements, translationVectors, treeView, _fn, _fn1, _i, _j, _k, _len, _len1, _ref, _ref1;
          _this.mainScroller.style.overflow = 'hidden';
          _this.iceElement.style.width = _this.wrapperElement.offsetWidth + 'px';
          _this.redrawMain({
            noText: true
          });
          _this.currentlyAnimating_suppressRedraw = true;
          _this.aceElement.style.top = "-9999px";
          _this.aceElement.style.left = "-9999px";
          _this.paletteWrapper.style.top = '0px';
          _this.paletteWrapper.style.left = "" + (-_this.paletteWrapper.offsetWidth) + "px";
          _this.iceElement.style.top = "0px";
          _this.iceElement.style.left = "0px";
          _this.paletteHeader.style.zIndex = 0;
          _ref = _this.computePlaintextTranslationVectors(), textElements = _ref.textElements, translationVectors = _ref.translationVectors;
          translatingElements = [];
          _fn = function(div, textElement) {
            return setTimeout((function() {
              div.style.left = "" + (textElement.bounds[0].x - _this.scrollOffsets.main.x) + "px";
              div.style.top = "" + (textElement.bounds[0].y - _this.scrollOffsets.main.y - _this.fontAscent) + "px";
              return div.style.fontSize = _this.fontSize + 'px';
            }), 0);
          };
          for (i = _i = 0, _len = textElements.length; _i < _len; i = ++_i) {
            textElement = textElements[i];
            if (!(0 < textElement.bounds[0].bottom() - _this.scrollOffsets.main.y + translationVectors[i].y && textElement.bounds[0].y - _this.scrollOffsets.main.y + translationVectors[i].y < _this.mainCanvas.height)) {
              continue;
            }
            div = document.createElement('div');
            div.style.whiteSpace = 'pre';
            div.innerText = textElement.model.value;
            div.style.font = _this.aceFontSize() + ' ' + _this.fontFamily;
            div.style.position = 'absolute';
            div.style.left = "" + (textElement.bounds[0].x - _this.scrollOffsets.main.x + translationVectors[i].x) + "px";
            div.style.top = "" + (textElement.bounds[0].y - _this.scrollOffsets.main.y + translationVectors[i].y) + "px";
            div.className = 'ice-transitioning-element';
            div.style.transition = "left " + translateTime + "ms, top " + translateTime + "ms, font-size " + translateTime + "ms";
            translatingElements.push(div);
            _this.transitionContainer.appendChild(div);
            _fn(div, textElement);
          }
          top = Math.max(_this.aceEditor.getFirstVisibleRow(), 0);
          bottom = Math.min(_this.aceEditor.getLastVisibleRow(), _this.view.getViewNodeFor(_this.tree).lineLength - 1);
          treeView = _this.view.getViewNodeFor(_this.tree);
          lineHeight = _this.aceEditor.renderer.layerConfig.lineHeight;
          aceScrollTop = _this.aceEditor.session.getScrollTop();
          _fn1 = function(div, line) {
            return setTimeout((function() {
              div.style.left = 0;
              div.style.top = "" + (treeView.bounds[line].y + treeView.distanceToBase[line].above - _this.view.opts.textHeight - _this.fontAscent - _this.scrollOffsets.main.y) + "px";
              return div.style.fontSize = _this.fontSize + 'px';
            }), 0);
          };
          for (line = _j = top; top <= bottom ? _j <= bottom : _j >= bottom; line = top <= bottom ? ++_j : --_j) {
            div = document.createElement('div');
            div.style.whiteSpace = 'pre';
            div.innerText = line + 1;
            div.style.font = _this.aceFontSize() + ' ' + _this.fontFamily;
            div.style.width = "" + _this.aceEditor.renderer.$gutter.offsetWidth + "px";
            div.style.left = 0;
            div.style.top = "" + (_this.aceEditor.session.documentToScreenRow(line, 0) * lineHeight - aceScrollTop) + "px";
            div.className = 'ice-transitioning-element ice-transitioning-gutter';
            div.style.transition = "left " + translateTime + "ms, top " + translateTime + "ms, font-size " + translateTime + "ms";
            translatingElements.push(div);
            _this.iceElement.appendChild(div);
            _fn1(div, line);
          }
          _ref1 = [_this.mainCanvas, _this.highlightCanvas, _this.cursorCanvas];
          for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
            el = _ref1[_k];
            el.style.opacity = 0;
          }
          setTimeout((function() {
            var _l, _len2, _ref2, _results;
            _ref2 = [_this.mainCanvas, _this.highlightCanvas, _this.cursorCanvas];
            _results = [];
            for (_l = 0, _len2 = _ref2.length; _l < _len2; _l++) {
              el = _ref2[_l];
              el.style.transition = "opacity " + fadeTime + "ms linear";
              _results.push(el.style.opacity = 1);
            }
            return _results;
          }), translateTime);
          _this.iceElement.style.transition = _this.paletteWrapper.style.transition = "left " + fadeTime + "ms";
          _this.iceElement.style.left = "" + _this.paletteWrapper.offsetWidth + "px";
          _this.paletteWrapper.style.left = '0px';
          return setTimeout((function() {
            var _l, _len2;
            _this.iceElement.style.transition = _this.paletteWrapper.style.transition = '';
            _this.mainScroller.style.overflow = 'auto';
            _this.currentlyAnimating = false;
            _this.lineNumberWrapper.style.display = 'block';
            _this.redrawMain();
            _this.paletteHeader.style.zIndex = 257;
            for (_l = 0, _len2 = translatingElements.length; _l < _len2; _l++) {
              div = translatingElements[_l];
              div.parentNode.removeChild(div);
            }
            _this.resize();
            _this.fireEvent('toggledone', [_this.currentlyUsingBlocks]);
            if (cb != null) {
              return cb();
            }
          }), translateTime + fadeTime);
        }), 0);
        return {
          success: true
        };
      }
    };
    Editor.prototype.toggleBlocks = function(cb) {
      if (this.currentlyUsingBlocks) {
        return this.performMeltAnimation(700, 500, cb);
      } else {
        return this.performFreezeAnimation(500, 500, cb);
      }
    };
    hook('populate', 2, function() {
      var _this = this;
      this.scrollOffsets = {
        main: new this.draw.Point(0, 0),
        palette: new this.draw.Point(0, 0)
      };
      this.mainScroller = document.createElement('div');
      this.mainScroller.className = 'ice-main-scroller';
      this.mainScrollerStuffing = document.createElement('div');
      this.mainScrollerStuffing.className = 'ice-main-scroller-stuffing';
      this.mainScroller.appendChild(this.mainScrollerStuffing);
      this.iceElement.appendChild(this.mainScroller);
      this.mainScroller.addEventListener('scroll', function() {
        _this.scrollOffsets.main.y = _this.mainScroller.scrollTop;
        _this.scrollOffsets.main.x = _this.mainScroller.scrollLeft;
        _this.mainCtx.setTransform(1, 0, 0, 1, -_this.scrollOffsets.main.x, -_this.scrollOffsets.main.y);
        _this.highlightCtx.setTransform(1, 0, 0, 1, -_this.scrollOffsets.main.x, -_this.scrollOffsets.main.y);
        _this.cursorCtx.setTransform(1, 0, 0, 1, -_this.scrollOffsets.main.x, -_this.scrollOffsets.main.y);
        return _this.redrawMain();
      });
      this.paletteScroller = document.createElement('div');
      this.paletteScroller.className = 'ice-palette-scroller';
      this.paletteScrollerStuffing = document.createElement('div');
      this.paletteScrollerStuffing.className = 'ice-palette-scroller-stuffing';
      this.paletteScroller.appendChild(this.paletteScrollerStuffing);
      this.paletteWrapper.appendChild(this.paletteScroller);
      return this.paletteScroller.addEventListener('scroll', function() {
        _this.scrollOffsets.palette.y = _this.paletteScroller.scrollTop;
        _this.paletteCtx.setTransform(1, 0, 0, 1, -_this.scrollOffsets.palette.x, -_this.scrollOffsets.palette.y);
        _this.paletteHighlightCtx.setTransform(1, 0, 0, 1, -_this.scrollOffsets.palette.x, -_this.scrollOffsets.palette.y);
        return _this.redrawPalette();
      });
    });
    hook('resize', 0, function() {
      this.mainScroller.style.width = "" + this.iceElement.offsetWidth + "px";
      return this.mainScroller.style.height = "" + this.iceElement.offsetHeight + "px";
    });
    hook('resize_palette', 0, function() {
      this.paletteScroller.style.top = "" + this.paletteHeader.offsetHeight + "px";
      this.paletteScroller.style.width = "" + this.paletteCanvas.offsetWidth + "px";
      return this.paletteScroller.style.height = "" + this.paletteCanvas.offsetHeight + "px";
    });
    hook('redraw_main', 1, function() {
      var bounds, record, _i, _len, _ref;
      bounds = this.view.getViewNodeFor(this.tree).getBounds();
      _ref = this.floatingBlocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        record = _ref[_i];
        bounds.unite(this.view.getViewNodeFor(record.block).getBounds());
      }
      this.mainScrollerStuffing.style.width = "" + (bounds.right()) + "px";
      return this.mainScrollerStuffing.style.height = "" + (bounds.bottom()) + "px";
    });
    hook('redraw_palette', 0, function() {
      var block, bounds, _i, _len, _ref;
      bounds = new this.draw.NoRectangle();
      _ref = this.currentPaletteBlocks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        block = _ref[_i];
        bounds.unite(this.view.getViewNodeFor(block).getBounds());
      }
      return this.paletteScrollerStuffing.style.height = "" + (bounds.bottom()) + "px";
    });
    hook('populate', 0, function() {
      this.fontSize = 15;
      this.fontFamily = 'Courier New';
      return this.fontAscent = helper.fontMetrics(this.fontFamily, this.fontSize).prettytop;
    });
    Editor.prototype.setFontSize_raw = function(fontSize) {
      if (this.fontSize !== fontSize) {
        this.fontSize = fontSize;
        this.paletteHeader.style.fontSize = "" + fontSize + "px";
        this.gutter.style.fontSize = "" + fontSize + "px";
        this.view.opts.textHeight = this.dragView.opts.textHeight = helper.getFontHeight(this.fontFamily, this.fontSize);
        this.fontAscent = helper.fontMetrics(this.fontFamily, this.fontSize).prettytop;
        this.view.clearCache();
        this.dragView.clearCache();
        this.gutter.style.width = this.aceEditor.renderer.$gutterLayer.gutterWidth + 'px';
        this.redrawMain();
        return this.redrawPalette();
      }
    };
    Editor.prototype.setFontFamily = function(fontFamily) {
      this.draw.setGlobalFontFamily(fontFamily);
      this.fontFamily = fontFamily;
      this.view.opts.textHeight = helper.getFontHeight(this.fontFamily, this.fontSize);
      this.fontAscent = helper.fontMetrics(this.fontFamily, this.fontSize).prettytop;
      this.view.clearCache();
      this.dragView.clearCache();
      this.gutter.style.fontFamily = fontFamily;
      this.redrawMain();
      return this.redrawPalette();
    };
    Editor.prototype.setFontSize = function(fontSize) {
      this.setFontSize_raw(fontSize);
      return this.resize();
    };
    hook('populate', 0, function() {
      this.markedLines = {};
      return this.extraMarks = {};
    });
    Editor.prototype.getHighlightPath = function(model, style) {
      var path;
      path = this.view.getViewNodeFor(model).path.clone();
      path.style.fillColor = null;
      path.style.strokeColor = style.color;
      path.style.lineWidth = 3;
      path.noclip = true;
      path.bevel = false;
      return path;
    };
    Editor.prototype.markLine = function(line, style) {
      var block;
      block = this.tree.getBlockOnLine(line);
      if (block != null) {
        this.markedLines[line] = {
          model: block,
          style: style
        };
      }
      return this.redrawMain();
    };
    Editor.prototype.unmarkLine = function(line) {
      delete this.markedLines[line];
      return this.redrawMain();
    };
    Editor.prototype.clearLineMarks = function(tag) {
      this.markedLines = {};
      return this.redrawMain();
    };
    hook('populate', 0, function() {
      return this.lastHoveredLine = null;
    });
    hook('mousemove', 0, function(point, event, state) {
      var hoveredLine, mainPoint, treeView;
      if ((this.draggingBlock == null) && (this.clickedBlock == null) && this.hasEvent('linehover')) {
        mainPoint = this.trackerPointToMain(point);
        treeView = this.view.getViewNodeFor(this.tree);
        if ((this.lastHoveredLine != null) && (treeView.bounds[this.lastHoveredLine] != null) && treeView.bounds[this.lastHoveredLine].contains(mainPoint)) {
          return;
        }
        hoveredLine = this.findLineNumberAtCoordinate(point.y);
        if (!treeView.bounds[hoveredLine].contains(mainPoint)) {
          hoveredLine = null;
        }
        if (hoveredLine !== this.lastHoveredLine) {
          return this.fireEvent('linehover', [
            {
              line: this.lastHoveredLine = hoveredLine
            }
          ]);
        }
      }
    });
    SetValueOperation = (function(_super) {
      __extends(SetValueOperation, _super);

      function SetValueOperation(oldValue, newValue) {
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.oldValue = this.oldValue.clone();
        this.newValue = this.newValue.clone();
      }

      SetValueOperation.prototype.undo = function(editor) {
        editor.tree = this.oldValue.clone();
        return editor.tree.start;
      };

      SetValueOperation.prototype.redo = function(editor) {
        editor.tree = this.newValue.clone();
        return editor.tree.start;
      };

      return SetValueOperation;

    })(UndoOperation);
    hook('populate', 0, function() {
      return this.trimWhitespace = false;
    });
    Editor.prototype.setTrimWhitespace = function(trimWhitespace) {
      return this.trimWhitespace = trimWhitespace;
    };
    Editor.prototype.setValue_raw = function(value) {
      var newParse;
      if (this.trimWhitespace) {
        value = value.trim();
      }
      newParse = coffee.parse(value, {
        wrapAtRoot: true
      });
      if (value !== this.tree.stringify()) {
        this.addMicroUndoOperation('CAPTURE_POINT');
      }
      this.addMicroUndoOperation(new SetValueOperation(this.tree, newParse));
      this.tree = newParse;
      this.gutterVersion = -1;
      this.tree.start.insert(this.cursor);
      this.removeBlankLines();
      this.redrawMain();
      return {
        success: true
      };
    };
    Editor.prototype.setValue = function(value) {
      var oldScrollTop;
      oldScrollTop = this.aceEditor.session.getScrollTop();
      this.aceEditor.setValue(value, -1);
      this.aceEditor.resize(true);
      this.aceEditor.session.setScrollTop(oldScrollTop);
      if (this.currentlyUsingBlocks) {
        return this.setValue_raw(value);
      }
    };
    Editor.prototype.addEmptyLine = function(str) {
      if (str.length === 0 || str[str.length - 1] === '\n') {
        return str;
      } else {
        return str + '\n';
      }
    };
    Editor.prototype.getValue = function() {
      if (this.currentlyUsingBlocks) {
        return this.addEmptyLine(this.tree.stringify());
      } else {
        return this.aceEditor.getValue();
      }
    };
    hook('populate', 0, function() {
      return this.bindings = {};
    });
    Editor.prototype.on = function(event, handler) {
      return this.bindings[event] = handler;
    };
    Editor.prototype.once = function(event, handler) {
      return this.bindings[event] = function() {
        handler.apply(this, arguments);
        return this.bindings[event] = null;
      };
    };
    Editor.prototype.fireEvent = function(event, args) {
      if (event in this.bindings) {
        return this.bindings[event].apply(this, args);
      }
    };
    Editor.prototype.hasEvent = function(event) {
      return event in this.bindings && (this.bindings[event] != null);
    };
    Editor.prototype.setEditorState = function(useBlocks) {
      var oldScrollTop;
      if (useBlocks) {
        this.setValue(this.aceEditor.getValue());
        this.iceElement.style.top = this.paletteWrapper.style.top = this.paletteWrapper.style.left = '0px';
        this.iceElement.style.left = "" + this.paletteWrapper.offsetWidth + "px";
        this.aceElement.style.top = this.aceElement.style.left = '-9999px';
        this.currentlyUsingBlocks = true;
        this.lineNumberWrapper.style.display = 'block';
        this.mainCanvas.opacity = this.paletteWrapper.opacity = this.highlightCanvas.opacity = 1;
        this.resize();
        return this.redrawMain();
      } else {
        oldScrollTop = this.aceEditor.session.getScrollTop();
        this.aceEditor.setValue(this.getValue(), -1);
        this.aceEditor.resize(true);
        this.aceEditor.session.setScrollTop(oldScrollTop);
        this.iceElement.style.top = this.iceElement.style.left = this.paletteWrapper.style.top = this.paletteWrapper.style.left = '-9999px';
        this.aceElement.style.top = this.aceElement.style.left = '0px';
        this.currentlyUsingBlocks = false;
        this.lineNumberWrapper.style.display = 'none';
        this.mainCanvas.opacity = this.highlightCanvas.opacity = 0;
        return this.resize();
      }
    };
    hook('populate', 0, function() {
      this.dragCover = document.createElement('div');
      this.dragCover.className = 'ice-drag-cover';
      this.dragCover.style.display = 'none';
      return document.body.appendChild(this.dragCover);
    });
    hook('mousedown', -1, function() {
      if (this.clickedBlock != null) {
        return this.dragCover.style.display = 'block';
      }
    });
    hook('mouseup', 0, function() {
      this.dragCanvas.style.top = this.dragCanvas.style.left = '-9999px';
      return this.dragCover.style.display = 'none';
    });
    touchEvents = {
      'touchstart': 'mousedown',
      'touchmove': 'mousemove',
      'touchend': 'mouseup'
    };
    TOUCH_SELECTION_TIMEOUT = 1000;
    Editor.prototype.touchEventToPoint = function(event, index) {
      var absolutePoint;
      absolutePoint = new this.draw.Point(event.changedTouches[index].pageX, event.changedTouches[index].pageY);
      return absolutePoint.from(this.absoluteOffset(this.iceElement));
    };
    Editor.prototype.queueLassoMousedown = function(trackPoint, event) {
      var _this = this;
      return this.lassoSelectStartTimeout = setTimeout((function() {
        var handler, state, _i, _len, _ref, _results;
        state = {};
        _ref = editorBindings.mousedown;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          _results.push(handler.call(_this, trackPoint, event, state));
        }
        return _results;
      }), TOUCH_SELECTION_TIMEOUT);
    };
    hook('populate', 0, function() {
      var _this = this;
      this.touchScrollAnchor = new this.draw.Point(0, 0);
      this.lassoSelectStartTimeout = null;
      this.wrapperElement.addEventListener('touchstart', function(event) {
        var handler, state, trackPoint, _i, _len, _ref;
        clearTimeout(_this.lassoSelectStartTimeout);
        trackPoint = _this.touchEventToPoint(event, 0);
        state = {
          suppressLassoSelect: true
        };
        _ref = editorBindings.mousedown;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          handler.call(_this, trackPoint, event, state);
        }
        if (state.consumedHitTest) {
          return event.preventDefault();
        } else {
          return _this.queueLassoMousedown(trackPoint, event);
        }
      });
      this.wrapperElement.addEventListener('touchmove', function(event) {
        var handler, state, trackPoint, _i, _len, _ref;
        clearTimeout(_this.lassoSelectStartTimeout);
        trackPoint = _this.touchEventToPoint(event, 0);
        if (!((_this.clickedBlock != null) || (_this.draggingBlock != null))) {
          _this.queueLassoMousedown(trackPoint, event);
        }
        state = {};
        _ref = editorBindings.mousemove;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          handler.call(_this, trackPoint, event, state);
        }
        if ((_this.clickedBlock != null) || (_this.draggingBlock != null) || (_this.lassoSelectAnchor != null) || _this.textInputSelecting) {
          return event.preventDefault();
        }
      });
      return this.wrapperElement.addEventListener('touchend', function(event) {
        var handler, state, trackPoint, _i, _len, _ref;
        clearTimeout(_this.lassoSelectStartTimeout);
        trackPoint = _this.touchEventToPoint(event, 0);
        state = {};
        _ref = editorBindings.mouseup;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          handler.call(_this, trackPoint, event, state);
        }
        return event.preventDefault();
      });
    });
    hook('populate', 0, function() {
      this.cursorCanvas = document.createElement('canvas');
      this.cursorCanvas.className = 'ice-highlight-canvas';
      this.cursorCtx = this.cursorCanvas.getContext('2d');
      return this.iceElement.appendChild(this.cursorCanvas);
    });
    hook('resize', 0, function() {
      this.cursorCanvas.width = this.iceElement.offsetWidth;
      this.cursorCanvas.style.width = "" + this.cursorCanvas.width + "px";
      this.cursorCanvas.height = this.iceElement.offsetHeight;
      this.cursorCanvas.style.height = "" + this.cursorCanvas.height + "px";
      return this.cursorCanvas.style.left = "" + this.mainCanvas.offsetLeft + "px";
    });
    Editor.prototype.strokeCursor = function(point) {
      var arcAngle, arcCenter, endAngle, h, startAngle, w;
      if (point == null) {
        return;
      }
      this.cursorCtx.beginPath();
      this.cursorCtx.fillStyle = this.cursorCtx.strokeStyle = '#000';
      this.cursorCtx.lineCap = 'round';
      this.cursorCtx.lineWidth = 3;
      w = this.view.opts.tabWidth / 2 - CURSOR_WIDTH_DECREASE;
      h = this.view.opts.tabHeight - CURSOR_HEIGHT_DECREASE;
      arcCenter = new this.draw.Point(point.x + this.view.opts.tabOffset + w + CURSOR_WIDTH_DECREASE, point.y - (w * w + h * h) / (2 * h) + h + CURSOR_HEIGHT_DECREASE / 2);
      arcAngle = Math.atan2(w, (w * w + h * h) / (2 * h) - h);
      startAngle = 0.5 * Math.PI - arcAngle;
      endAngle = 0.5 * Math.PI + arcAngle;
      this.cursorCtx.arc(arcCenter.x, arcCenter.y, (w * w + h * h) / (2 * h), startAngle, endAngle);
      return this.cursorCtx.stroke();
    };
    Editor.prototype.highlightFlashShow = function() {
      var _this = this;
      if (this.flashTimeout != null) {
        clearTimeout(this.flashTimeout);
      }
      this.cursorCanvas.style.display = 'block';
      this.highlightsCurrentlyShown = true;
      return this.flashTimeout = setTimeout((function() {
        return _this.flash();
      }), 500);
    };
    Editor.prototype.highlightFlashHide = function() {
      var _this = this;
      if (this.flashTimeout != null) {
        clearTimeout(this.flashTimeout);
      }
      this.cursorCanvas.style.display = 'none';
      this.highlightsCurrentlyShown = false;
      return this.flashTimeout = setTimeout((function() {
        return _this.flash();
      }), 500);
    };
    Editor.prototype.flash = function() {
      if ((this.lassoSegment != null) || (this.draggingBlock != null) || ((this.textFocus != null) && this.textInputHighlighted) || !this.highlightsCurrentlyShown) {
        return this.highlightFlashShow();
      } else {
        return this.highlightFlashHide();
      }
    };
    hook('populate', 0, function() {
      var _this = this;
      this.highlightsCurrentlyShown = false;
      return this.flashTimeout = setTimeout((function() {
        return _this.flash();
      }), 0);
    });
    Editor.prototype.mainViewOrChildrenContains = function(model, point) {
      var childObj, modelView, _i, _len, _ref;
      modelView = this.view.getViewNodeFor(model);
      if (modelView.path.contains(point)) {
        return true;
      }
      _ref = modelView.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        childObj = _ref[_i];
        if (this.mainViewOrChildrenContains(childObj.child, point)) {
          return true;
        }
      }
      return false;
    };
    hook('mouseup', 0.5, function(point, event) {
      var renderPoint, trackPoint;
      if (this.draggingBlock != null) {
        trackPoint = new this.draw.Point(point.x + this.draggingOffset.x, point.y + this.draggingOffset.y);
        renderPoint = this.trackerPointToMain(trackPoint);
        if (this.inTree(this.draggingBlock) && this.mainViewOrChildrenContains(this.draggingBlock, renderPoint)) {
          this.draggingBlock.ephemeral = false;
          this.draggingBlock = null;
          this.draggingOffset = null;
          this.lastHighlight = null;
          this.clearDrag();
          return this.redrawMain();
        }
      }
    });
    hook('populate', 0, function() {
      this.gutter = document.createElement('div');
      this.gutter.className = 'ice-gutter';
      this.lineNumberWrapper = document.createElement('div');
      this.gutter.appendChild(this.lineNumberWrapper);
      this.gutterVersion = -1;
      this.lineNumberTags = {};
      return this.iceElement.appendChild(this.gutter);
    });
    hook('resize', 0, function() {
      return this.gutter.style.width = this.aceEditor.renderer.$gutterLayer.gutterWidth + 'px';
    });
    Editor.prototype.addLineNumberForLine = function(line) {
      var lineDiv, treeView;
      treeView = this.view.getViewNodeFor(this.tree);
      if (line in this.lineNumberTags) {
        lineDiv = this.lineNumberTags[line];
      } else {
        lineDiv = document.createElement('div');
        lineDiv.className = 'ice-gutter-line';
        lineDiv.innerText = line + 1;
        this.lineNumberTags[line] = lineDiv;
      }
      lineDiv.style.top = "" + (treeView.bounds[line].y + treeView.distanceToBase[line].above - this.view.opts.textHeight - this.fontAscent - this.scrollOffsets.main.y) + "px";
      lineDiv.style.height = treeView.bounds[line].height + 'px';
      lineDiv.style.fontSize = this.fontSize + 'px';
      return this.lineNumberWrapper.appendChild(lineDiv);
    };
    Editor.prototype.findLineNumberAtCoordinate = function(coord) {
      var end, pivot, start, treeView;
      treeView = this.view.getViewNodeFor(this.tree);
      start = 0;
      end = treeView.bounds.length;
      pivot = Math.floor((start + end) / 2);
      while (treeView.bounds[pivot].y !== coord && start < end) {
        if (start === pivot || end === pivot) {
          return pivot;
        }
        if (treeView.bounds[pivot].y > coord) {
          end = pivot;
        }
        if (treeView.bounds[pivot].y < coord) {
          start = pivot;
        }
        if (end < 0) {
          return 0;
        }
        if (start >= treeView.bounds.length) {
          return treeView.bounds.length - 1;
        }
        pivot = Math.floor((start + end) / 2);
      }
      return pivot;
    };
    hook('redraw_main', 0, function(changedBox) {
      var bottom, line, tag, top, treeView, _i, _ref;
      treeView = this.view.getViewNodeFor(this.tree);
      top = this.findLineNumberAtCoordinate(this.scrollOffsets.main.y);
      bottom = this.findLineNumberAtCoordinate(this.scrollOffsets.main.y + this.mainCanvas.height);
      for (line = _i = top; top <= bottom ? _i <= bottom : _i >= bottom; line = top <= bottom ? ++_i : --_i) {
        this.addLineNumberForLine(line);
      }
      _ref = this.lineNumberTags;
      for (line in _ref) {
        tag = _ref[line];
        if (line < top || line > bottom) {
          this.lineNumberTags[line].parentNode.removeChild(this.lineNumberTags[line]);
          delete this.lineNumberTags[line];
        }
      }
      if (changedBox) {
        return this.gutter.style.height = "" + (Math.max(this.mainScroller.offsetHeight, treeView.totalBounds.height)) + "px";
      }
    });
    hook('resize', 0, function() {
      var _ref, _ref1;
      return this.gutter.style.height = "" + (Math.max(this.iceElement.offsetHeight, (_ref = (_ref1 = this.view.getViewNodeFor(this.tree).totalBounds) != null ? _ref1.height : void 0) != null ? _ref : 0)) + "px";
    });
    Editor.prototype.setPaletteWidth = function(width) {
      this.paletteWrapper.style.width = width + 'px';
      return this.resize();
    };
    hook('populate', 0, function() {
      var pressedVKey, pressedXKey,
        _this = this;
      this.copyPasteInput = document.createElement('textarea');
      this.copyPasteInput.style.position = 'absolute';
      this.copyPasteInput.style.left = this.copyPasteInput.style.top = '-9999px';
      this.iceElement.appendChild(this.copyPasteInput);
      this.keyListener.register_combo({
        keys: 'meta',
        on_keydown: function() {
          if (_this.textFocus == null) {
            _this.copyPasteInput.focus();
            if (_this.lassoSegment != null) {
              _this.copyPasteInput.value = _this.lassoSegment.stringify();
            }
            return _this.copyPasteInput.setSelectionRange(0, _this.copyPasteInput.value.length);
          }
        },
        on_keyup: function() {
          if (_this.textFocus != null) {
            return _this.hiddenInput.focus();
          } else {
            return _this.iceElement.focus();
          }
        }
      });
      pressedVKey = false;
      pressedXKey = false;
      this.copyPasteInput.addEventListener('keydown', function(event) {
        if (event.keyCode === 86) {
          return pressedVKey = true;
        } else if (event.keyCode === 88) {
          return pressedXKey = true;
        }
      });
      this.copyPasteInput.addEventListener('keyup', function(event) {
        if (event.keyCode === 86) {
          return pressedVKey = false;
        } else if (event.keyCode === 88) {
          return pressedXKey = false;
        }
      });
      return this.copyPasteInput.addEventListener('input', function() {
        var blocks, line, minIndent, str, _i, _len, _ref, _ref1;
        if (pressedVKey) {
          try {
            str = _this.copyPasteInput.value;
            minIndent = Infinity;
            _ref = str.split('\n');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              line = _ref[_i];
              minIndent = Math.min(minIndent, str.length - str.trimLeft().length);
            }
            str = ((function() {
              var _j, _len1, _ref1, _results;
              _ref1 = str.split('\n');
              _results = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                line = _ref1[_j];
                _results.push(line.slice(minIndent));
              }
              return _results;
            })()).join('\n');
            str = str.replace(/^\n*|\n*$/g, '');
            blocks = coffee.parse(str);
            _this.addMicroUndoOperation('CAPTURE_POINT');
            if (_this.lassoSegment != null) {
              _this.addMicroUndoOperation(new PickUpOperation(_this.lassoSegment));
              _this.lassoSegment.spliceOut();
              _this.lassoSegment = null;
            }
            _this.addMicroUndoOperation(new DropOperation(blocks, _this.cursor.previousVisibleToken()));
            blocks.spliceIn(_this.getCursorSpliceArea());
            if ((_ref1 = blocks.end.nextVisibleToken().type) !== 'newline' && _ref1 !== 'indentEnd') {
              blocks.end.insert(new model.NewlineToken());
            }
            _this.addMicroUndoOperation(new DestroySegmentOperation(blocks));
            blocks.unwrap();
            _this.redrawMain();
          } catch (_error) {}
          return _this.copyPasteInput.setSelectionRange(0, _this.copyPasteInput.value.length);
        } else if (pressedXKey && (_this.lassoSegment != null)) {
          _this.addMicroUndoOperation('CAPTURE_POINT');
          _this.addMicroUndoOperation(new PickUpOperation(_this.lassoSegment));
          _this.lassoSegment.spliceOut();
          _this.lassoSegment = null;
          return _this.redrawMain();
        }
      });
    });
    hook('populate', 0, function() {
      var _this = this;
      return setTimeout((function() {
        return _this.cursor.parent = _this.tree;
      }), 0);
    });
    Editor.prototype.overflowsX = function() {
      return this.documentDimensions().width > this.viewportDimensions().width;
    };
    Editor.prototype.overflowsY = function() {
      return this.documentDimensions().height > this.viewportDimensions().height;
    };
    Editor.prototype.documentDimensions = function() {
      var bounds;
      bounds = this.view.getViewNodeFor(this.tree).totalBounds;
      return {
        width: bounds.width,
        height: bounds.height
      };
    };
    Editor.prototype.viewportDimensions = function() {
      return {
        width: this.mainCanvas.width,
        height: this.mainCanvas.height
      };
    };
    Editor.prototype.dumpNodeForDebug = function(hitTestResult, line) {
      console.log('Model node:');
      console.log(hitTestResult.serialize());
      console.log('View node:');
      return console.log(this.view.getViewNodeFor(hitTestResult).serialize(line));
    };
    for (key in unsortedEditorBindings) {
      unsortedEditorBindings[key].sort(function(a, b) {
        if (a.priority > b.priority) {
          return -1;
        } else {
          return 1;
        }
      });
      editorBindings[key] = [];
      _ref = unsortedEditorBindings[key];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binding = _ref[_i];
        editorBindings[key].push(binding.fn);
      }
    }
    editorBindings.key = {};
    for (key in unsortedEditorKeyBindings) {
      unsortedEditorKeyBindings[key].sort(function(a, b) {
        if (a.priority > b.priority) {
          return -1;
        } else {
          return 1;
        }
      });
      editorBindings.key[key] = [];
      _ref1 = unsortedEditorKeyBindings[key];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        binding = _ref1[_j];
        editorBindings.key[key].push(binding.fn);
      }
    }
    return exports;
  });

}).call(this);

/*
//@ sourceMappingURL=controller.js.map
*/;
(function() {
  define('ice',['ice-draw', 'ice-view', 'ice-model', 'ice-coffee', 'ice-controller', 'ice-parser'], function(draw, view, model, coffee, controller, parser) {
    return {
      view: view,
      draw: draw,
      model: model,
      parse: coffee.parse,
      parseObj: parser.parseObj,
      Editor: controller.Editor
    };
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/;
}).call(this);