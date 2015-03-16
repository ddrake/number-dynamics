Summing Proper Divisors to Generate Sequences with Interesting Dynamics
=======================================================================

Consider each integer as the initial value of a sequence which converges to some 'attractor'.
The possible attractors are zero, infinity, perfect numbers, amicable pairs and sociable chains.

Each number is plotted as a vertical bar whose color indicates the attractor its sequence converges to.  The sequences for most integers tend to the attractors at zero and infinity, which are colored black and white respectively.

The main difficulty is that I'm not able to prove that any given sequence of numbers diverges to infinity.  There seems to be always the possibility that the sum of proper divisors, even of a very large number, could be a prime or an element of an amicable pair or sociable chain.

So far, the best I can do is to say that if the number hasn't converged to a cycle, chain, or fixed number after some large number of iterations and/or if it reaches some extremely large number, I suppose its attractor to be infinity.  The relatively smooth appearance of most sequence generated from this algorithm seems to justify that strategy, but there are likely some numbers labled as diverging to infinity which in fact converge.

Assigning the color black to zero, white to (probably) infinity and different colors for the various perfect numbers, amicable pairs, etc. and organizing the numbers in rows, so as to make good use of the canvas, reveals a suprising amount of structure in the resulting dynamics.

To make the process of checking all the integers for a given range reasonably efficient, before generating a sequence for an integer, we check an array/hash to see if the number has already been assigned a color/attractor, since it may be an element of a previously computed sequence.  We also check to see if a generated number is in our list of known attractors.

Assign an integer/color index to infinity and one to each of smaller known attractors.
0    white   infinity
1    black   zero
2    perfect 6
3    perfect 28 (trivial attractor)
4    perfect 496
5    perfect 8128
6    amicable pair 220, 284
7    amicable pair 1184, 1210
8    amicable pair 2620, 2924
9    amicable pair 5020, 5564
10   amicable pair 6232, 6368
11   amicable pair 10744, 10856
12   amicable pair 12285, 14595
13   amicable pair 17296, 18416
14   amicable pair 63020, 66928
15   amicable pair 66992, 67095
16   amicable pair 69615, 71145
17   amicable pair 76084, 79750
18   amicable pair 87633, 88730
19   sociable chain 12496,14288,15472,14536,14264
20   amicable chain 14316,19116,31704,47616,83328,177792,295488,629072,589786,294896,358336,
                    418904,366556,274924,275444,243760,376736,381028,285778,152990,122410,
                    97946,48976,45946,22976,22744,19916,17716

colors of maximum contrast
http://www.iscc.org/pdf/PC54_1724_001.pdf
http://tx4.us/nbs-iscc.htm
0    #FFFFFF white
1    #000000 black 
2    #FFB300 vivid yellow
3    #803E75 strong purple
4    #FF6800 orange
5    #A6BDD7 light blue
6    #C10020 red
7    #CEA262 buff
8    #817066 gray
9    #007D34 green
10   #F6768E purplish pink
11   #00538A blue
12   #FF7A5C yellowish pink
13   #53377A violet
14   #FF8E00 orange yellow
15   #B32851 purplish red
16   #F4C800 greenish yellow
17   #7F180D reddish brown
18   #93AA00 yellow green
19   #593315 yellowish brown
20   #F13A13 reddish orange
21   #232C16 olive green
