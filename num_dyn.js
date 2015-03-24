
function num_dyn() {
    //----------------------------
    // display
    //----------------------------
    var color = ['#FFFFFF','#000000','#FFB300','#803E75','#FF6800','#A6BDD7','#C10020','#CEA262','#817066',
                 '#007D34','#F6768E','#00538A','#FF7A5C','#53377A','#FF8E00','#B32851','#F4C800','#7F180D',
                 '#93AA00','#593315','#F13A13','#232C16','235588'];

    var attractor_descriptions = [
        "Infinity", "Prime -> 1 -> 0","perfect 6","perfect 28","perfect 496","perfect 8128",
        "amicable pair 220, 284","amicable pair 1184, 1210", "amicable pair 2620, 2924", 
        "amicable pair 5020, 5564","amicable pair 6232, 6368","amicable pair 10744, 10856",
        "amicable pair 12285, 14595","amicable pair 17296, 18416",
        "amicable pair 63020, 66928","amicable pair 66992, 67095","amicable pair 69615, 71145",
        "amicable pair 76084, 79750","amicable pair 87633, 88730",
        "sociable chain (5) 12496...","sociable chain (28) 14316...", "amicable pair 185368, 203432",
        "amicable pair 879712, 901424"];

    var gray = "#555";
    var black = "#000";
    var white = "#fff";
    var background_color = gray;
    var canvas = document.getElementById("mycanvas");
    var canv_width = 1008;
    var canv_height = 4400;
    var line_height = 9;
    var line_space = 1;
    var line_width = 4;
    var height = 600;
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = line_width 

    var line_top = function(n) {
        var row = Math.floor(n * line_width / canv_width);
        var x = (n - row / line_width * canv_width) * line_width
        // shift things a bit because line width is centered...
        x += Math.floor(line_width/2);
        var y = row * (line_height + line_space);
        return { x: x, y: y};
    }

    var number_at_point = function(x, y)
    {
        var loc = getElementTopLeft(canvas);
        var xc = x - loc.left;
        var yc = y - loc.top; 
        var row = Math.floor(yc / (line_height + line_space));
        var numbers_per_row = canv_width / line_width;
        number = Math.floor(row * numbers_per_row + xc / line_width);
        return (number < range ? number : null); 
    }

    var getElementTopLeft = function(elem) {
        var left, top;
        top = 0;
        left = 0;
        while (elem.tagName !== "BODY") {
            top += elem.offsetTop;
            left += elem.offsetLeft;
            elem = elem.offsetParent;
        }
        return {top: top, left: left};
    };

    var plot_all = function() {
        ctx.fillStyle = background_color; 
        ctx.fillRect(0,0,canv_width,canv_height);
        for (var i = 0; i < lookup.length; i++) {
            plot(i);
        };
    }

    var plot = function(n) {
        var pt = line_top(n);
        var attractor = lookup[n];
        if (is_attractor_shown[attractor]) 
        {
            ctx.strokeStyle = color[lookup[n]];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.x, pt.y + line_height);
            ctx.stroke();            
        }
    }

    var attractor_info = function(n) {
        var ln = lookup[n];
        return n ? ln === 0 ? "Infinity? (" + attrval[n] + ")" :
            ln === 1 ? "prime " + attrval[n] + " -> 1 -> 0" :
            attractor_descriptions[lookup[n]] : "";
    }


    //----------------------------
    // computation
    //----------------------------
    var range = 100000; // max integer to compute and store
    var max_int = 10000000; // if a sequence exceeds this number, assume diverges to infinity
    var iter_inf = 40; // if a sequence exceeds this many steps without hitting an attractor, assume diverges to infinity
    var lookup = []; // global lookup table, index is the number, value is the attractor/color index (an integer)
    // global attractor value array.  If the attractor is 1, this is the corresponding prime.
    // if it is a pair or chain, it's the first element encountered, if it's "infinity" it's the largest number
    // tested -- or 0 if we stopped due to max iterations.  We should alert on hitting max iterations, since that may
    // indicate a new attractor.  
    var attrval = [];
    // attractors[0] is null, a placeholder for infinity.
    // attractors[1] is 1 (equivalent to zero since 1 has 0 proper divisors)
    var attractors = [
        null, [0,1],[6],[28],[496],[8128],[220, 284],[1184, 1210], [2620, 2924], 
        [5020, 5564],[6232, 6368],[10744, 10856],[12285, 14595],[17296, 18416],
        [63020, 66928],[66992, 67095],[69615, 71145],[76084, 79750],[87633, 88730],
        [12496,14288,15472,14536,14264],
        [14316,19116,31704,47616,83328,177792,295488,629072,589786,294896,358336,418904,366556,274924,275444,
            243760,376736,381028,285778,152990,122410,97946,48976,45946,22976,22744,19916,17716],
        [185368,203432],[879712,901424]];

    var global_index = 0;
    var is_running = true;

    var compute_all = function() {
        add_attractors();
        setTimeout(compute_next);
    }

    var resume = function() {
        setTimeout(compute_next);
    }

    var add_attractors = function() {
        for (var i = 1; i < attractors.length; i++) {
            for (var j = 0; j < attractors[i].length; j++) {
                n = attractors[i][j];
                attrval[n] = n;
                lookup[n] = i;
                plot(n);
            }
        }
    }

    var compute_next = function() {
        var results = compute_number(global_index, 0, []);
        var ns = results[0];
        var code = results[1];
        var last = results[2];
        if (code < 0) {  // new attractor
            alert("Found a new attractor: " + last);
            attrval[global_index] = last;
            lookup[global_index] = -1;
        } 
        else if (code === 0) {  // new infinity?
            attrval[global_index] = last;
            lookup[global_index] = 0;
        }
        else if (code === 1) {  // known non-infinite attractor 
            var ai = attractor_index(last);
            attrval[global_index] = ns.length > 0 ? ns[ns.length - 1] : last; 
            lookup[global_index] = ai;
        }
        else {  // value already in the lookup
            attrval[global_index] = attrval[last];
            lookup[global_index] = lookup[last];
        }
        update(ns, lookup[global_index], attrval[global_index]);
        global_index += 1;
        if (global_index < range && is_running) setTimeout(compute_next);
    }

    // compute a number, returning a nested array with a sequence of new tested numbers,
    // a code for the return type and the "last number" for display
    var compute_number = function(n, depth, ns) {
        var li = lookup[n];
        if (li === undefined) {
            if (ns.indexOf(n, 0) >= 0) return [ns, -1, n]  // new attractor
            else if (n > max_int) {  // infinity?
               return [ns, 0, n];
            } 
            else  {
                ns.push(n);
                // compute the sum of the number's proper divisors 
                var next = sum_of_proper_divisors(n);
                // recursively check that result
                return compute_number(next, depth+1, ns);                    
            }
        }
        else {
            if (li > 0 && is_attractor(li,n)) return [ns, 1, n] // reached a non-infinite attractor
            else return [ns, 2, n]; // hit some other element of lookup
        }
    }

    // i > 0
    var is_attractor = function(i, n)  {
        var aa = attractors[i];
        for (var j = 0; j < aa.length; j++) {
            if (aa[j] === n) {
                return true;
            }       
        }
        return false;
    }

     var attractor_index = function(n) {
        for (var i = 1; i < attractors.length; i++) {
            var aa = attractors[i];
            for (var j = 0; j < aa.length; j++) {
                if (aa[j] == n) return i;
            }
        }
        return null;
    }


    var update = function(ns, attr_idx, attr_val) {
         for (var i = 0; (i < ns.length && ns[i] < range); i++) {
            var n = ns[i];
            lookup[n] = attr_idx;
            attrval[n] = attr_val;
            plot(n);
        }
    }

    var sum_of_proper_divisors = function(n) {
        var sum = 1;
        var nb2 = n/2;
        for (var i = 2; i <= nb2; i++) {
            if (n % i === 0) {
                sum += i;
            }
        }
        return sum;
    }
    //----------------------------
    // user input
    //----------------------------

    var is_attractor_shown = [true, true, true, true, true, true, true, true, true, true, 
                              true, true, true, true, true, true, true, true, true, true, 
                              true, true, true];

    var toggle_attractor = function(n) {
        is_attractor_shown[n] = !is_attractor_shown[n];
        plot_all();
    }

    var cycle_background = function() {
        if (background_color == gray) background_color = white;
        else if (background_color == white) background_color = black;
        else background_color = gray;
        plot_all();
    }

    var toggle_playpause = function() {
        var btn = document.getElementById('playpause');
        is_running = !is_running;
        btn.innerHTML = is_running ? "Pause" : "Resume";
        if (is_running) resume();
    }

    canvas.onmousemove = function(e) {
        var tooltip = document.getElementById('tooltip');
        var number = number_at_point(e.pageX, e.pageY);
        if (number) {
            tooltip.innerHTML = "" + number + " -> " + attractor_info(number);
            tooltip.style.top = (e.pageY - 20) + "px";
            tooltip.style.left = (e.pageX + 10) + "px";
        } 
        else {
           tooltip.style.left = "-1000px";
        }        
        return true;
    };

    canvas.onmouseout = function(e) {
        var tooltip = document.getElementById('tooltip')
        tooltip.style.left = "-1000px";
    };

    var controls = document.getElementById("controls");

    function makeCallback(idx) {
        return function() {
            toggle_attractor(idx)           
        };
    }

    function copyToClipboard() {
      window.prompt("Copy to clipboard: Ctrl+C, Enter", lookup.join(","));
    }

    controls.children[0].children[0].onclick = toggle_playpause;
    controls.children[1].children[0].onclick = copyToClipboard;
    controls.children[2].children[0].onclick = cycle_background;

    for (var i = 3; i < controls.children.length; i++) {
        var p = controls.children[i];
        var idx = parseInt(p.id.substring(1));
        var callback = makeCallback(idx)      
        p.firstChild.onclick = callback;
    };






    compute_all();
} 

