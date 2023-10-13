# c-cad
CAD for creating basic furnitures, frontend for Threejs.
- c-cad is a parametric korpus generator
- c-cad creates 3d models
- input is only via text lines with special terminologie

c-cad can not
-------------
- can not working with lines and arcs
- can not create dimensions

Example 
------

m0 4 54 1.5 #arbeitsplatte lichtgrau buche anleimer
m1 2.8 14 1.4 kunststoff lichtgrau
m2 1.6 9 1.4 kunststoff lichtgrau
L 145
a L 100 70 m1 f1
apl L 90 m0 z84
c $a wa3
d $a wc3

MATERIAL LIST
--------------
Each row has 5 fields, separated with space:
materialNumber thickness price wasteRate # comment
-materialNumber starts with "m" followed by a number
Example:
m0 4 54 1.5 #arbeitsplatte lichtgrau buche anleimer
m1...
m2
...


Short Reference
---------------

parts:
-
-l left
-r right
t top
g=ground
b=back
f=front
h=horizontal
v=vertical

Properties
-
w width
d depth
h height
x x-position

-- =   align to korpus
    /////////////////////////////////
    /*///////////////////////////////
                   5 --- 6
                 /.    / |
                1 --- 2  |
                | 4 . |. 7
                |.    | /
                0 --- 3 
    /////////////////////////////////
    /////////////////////////////////
    */
