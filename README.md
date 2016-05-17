# typescript-bresenham
Bresenham's line rasterization algorithm as described here -- https://www.cs.helsinki.fi/group/goa/mallinnus/lines/bresenh.html
A TypeScript implementation.

The algorithm itself is contained in BresenhamRasterizer.ts

All the other code implements a primitive line drawing application.
It uses BresenhamRasterizer to rasterize the lines on a grid.
The grid is implemented on top of HTML5 canvas.
The application is controlled by mouse clicks and movement on the canvas element (the light-gray area of the page).
