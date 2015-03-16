
function num_dyn() {
    //----------------------------
    // display
    //----------------------------
    var color = ['#FFFFFF','#000000','#FFB300','#803E75','#FF6800','#A6BDD7','#C10020','#CEA262','#817066',
                 '#007D34','#F6768E','#00538A','#FF7A5C','#53377A','#FF8E00','#B32851','#F4C800','#7F180D',
                 '#93AA00','#593315','#F13A13','#232C16'];

    var attractor_descriptions = [
        "Infinity", "Prime ~ 1 ~ 0","perfect 6","perfect 28","perfect 496","perfect 8128",
        "amicable pair 220, 284","amicable pair 1184, 1210", "amicable pair 2620, 2924", 
        "amicable pair 5020, 5564","amicable pair 6232, 6368","amicable pair 10744, 10856",
        "amicable pair 12285, 14595","amicable pair 17296, 18416",
        "amicable pair 63020, 66928","amicable pair 66992, 67095","amicable pair 69615, 71145",
        "amicable pair 76084, 79750","amicable pair 87633, 88730",
        "sociable chain (5) 12496...","sociable chain (28) 14316..."];

    var canvas = document.getElementById("mycanvas");
    var canv_width = 1008;
    var canv_height = 4400;
    var line_height = 9;
    var line_space = 1;
    var line_width = 4;
    var height = 600;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF"; 
    ctx.lineWidth = line_width 
    ctx.fillRect(0,0,canv_width,canv_height);

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
        for (var i = 0; i < lookup.length; i++) {
            plot(i);
        };
    }

    var plot = function(n) {
        var pt = line_top(n);
        ctx.strokeStyle = color[lookup[n]];
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x, pt.y + line_height);
        ctx.stroke();
    }

    var attractor_info = function(n) {
        return n ? attractor_descriptions[lookup[n]] : "";
    }


    //----------------------------
    // user input
    //----------------------------

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

    //----------------------------
    // computation
    //----------------------------
    var range = 100000; // max integer to compute and store
    var max_int = 10000000; // if a sequence exceeds this number, assume diverges to infinity
    var iter_inf = 40; // if a sequence exceeds this many steps without hitting an attractor, assume diverges to infinity
    var lookup = []; // global lookup table, index is the number, value is the attractor/color index (an integer)
    // attractors[0] is null, a placeholder for infinity.
    // attractors[1] is 1 (equivalent to zero since 1 has 0 proper divisors)
    var attractors = [
        null, [0,1],[6],[28],[496],[8128],[220, 284],[1184, 1210], [2620, 2924], 
        [5020, 5564],[6232, 6368],[10744, 10856],[12285, 14595],[17296, 18416],
        [63020, 66928],[66992, 67095],[69615, 71145],[76084, 79750],[87633, 88730],
        [12496,14288,15472,14536,14264],
        [14316,19116,31704,47616,83328,177792,295488,629072,589786,294896,358336,418904,366556,274924,275444,
            243760,376736,381028,285778,152990,122410,97946,48976,45946,22976,22744,19916,17716]];

    var compute_all = function() {
        for (var i = 0; i < range; i++) {
            var results = compute_number(i, 0, []);
            var ns = results[0];
            var ai = results[1];
            update(ns, ai);
        };
    }

    // compute a number, returning a nested array with a sequence of numbers and an attractor index
    var compute_number = function(n, depth, ns) {
        var li = lookup[n];
        if (li === undefined) {
            var ai = attractor_index(n);
            if (ai === null) {
                if (depth >= iter_inf || n > max_int) {  // assume divergent
                    ns.push(n);
                    return [ns, 0];
                } 
                else  {
                    ns.push(n);
                    // compute the sum of the number's proper divisors 
                    var next = sum_of_proper_divisors(n);
                    // recursively check that result
                    return compute_number(next, depth+1, ns);                    
                }
            } 
            else  {   // we reached one of the attractors so add all for the attractor array
                var aa = attractors[ai];
                for (var i = 0; i < aa.length; i++) {
                    ns.push(aa[i]);
                }
                return [ns, ai];
            }
        }
        else  {  // we reached a number that is in the lookup
            return [ns,li];
        }
    }

    var attractor_index = function(n)  {
        for (var i = 1; i < attractors.length; i++) {
            var aa = attractors[i];
            for (var j = 0; j < aa.length; j++) {
                if (aa[j] == n) return i;
            }
        }
        return null;
    }

    var update = function(ns, ai) {
        for (var i = 0; (i < ns.length && ns[i] < range); i++) {
            var n = ns[i];
            lookup[n] = ai;
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

    compute_all();
    plot_all();
} 

