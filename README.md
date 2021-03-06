# Bresenham's line rasterization algorithm implemented in TypeScript. 

# What is it?

This implementation of Bresenham's line rasterization has been inspired by [the algorithm's description here](https://www.cs.helsinki.fi/group/goa/mallinnus/lines/bresenh.html).  

We handle the cases which the description leaves as an exercise for the reader.  
Specifically:
  - any endpoint order.
  - small and large positive slopes.
  - small and large negative slopes.
  - all combinations of slope and endpoint order.

The algorithm's description seems to suggest using slightly different versions of code depending on the line's slope being large/small and positive/negative: 

> [...] there is one case which cannot be reduced to a version of the algorithm we have already looked at. 
> If we want to draw a line having a small negative slope, 
> we will have to consider a modification of the basic Bresenham algorithm to do this.
> (The same point applies to lines of large negative slope as well, 
> but the code for small negative slopes may > be adapted to this case by stepping over y instead of x).

The code in this repo instead employs an approach where 
  1) the line is "normalized".
  2) and then handled in a generic way by the same code regardless of it having large/small positive/negative slope.

I'm in no way an expert on the topic. So my implementation may be trading off performance &mdash; in not an obvious to me way &mdash; for having generic rasterization code.

# Just for fun.

The algorithm's point is rasterizing a line relying only on integer addition, subtraction, and bit shifting.  
These operations are usually very cheap compared to multiplication, division, trigonometric functions or using floating point numbers. Consequently, the algorithm makes sense when:
  - There is a need to squeeze every last bit of performance out of a computer.
  - The hardware is simply limited. E.g., floating point numbers aren't supported in the first place.

Implementing Bresenham's algorithm in `TypeScript` and executing it in a web browser is a just-for-fun excercise then.

# Try it!

Simply follow this [link](https://mykolav.github.io/typescript-bresenham/index.html).

And if you prefer doing things the hard way?  
Clone the project to your machine.
```sh
git clone https://github.com/mykolav/typescript-bresenham.git
```

Open [`typescript-bresenham/index.html`](https://github.com/mykolav/typescript-bresenham/blob/master/index.html) in a modern web browser &mdash; i.e. double-click on `typescript-bresenham/index.html`.  
A page with `HTML5` canvas &mdash; the light-gray area &mdash; should load.
You can draw lines by clicking and moving inside of the the canvas.

# How to build?

Make sure [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/get-npm) are installed.

```sh
git clone https://github.com/mykolav/typescript-bresenham.git
cd typescript-bresenham
npm i
./node_modules/.bin/tsc
```

# The project's structure.

### `src`
`TypeScript` code reside in the `src` folder.

The algorithm itself is contained in [`BresenhamRasterizer.ts`](https://github.com/mykolav/typescript-bresenham/blob/master/src/BresenhamRasterizer.ts)

All the other code implements a primitive line drawing application.
It uses `BresenhamRasterizer` to rasterize the lines on `HTML5`'s canvas.

### `scripts`
`tsc` is configured to emit compiled `JavaScript` in the `scripts` folder.  
It compiles all the `src/*.ts` files into a single `scripts/bresenham-drawing.js`.

The `scripts` folder is also the home for a copy of `jquery-2.2.1.js`.

### `index.html`
[`index.html`](https://github.com/mykolav/typescript-bresenham/blob/master/index.html) is the application's entry point.


# Thank you!

[Colin Flanagan](flanaganc@ul.ie) for [the description of Bresenham Line-Drawing Algorithm](https://www.cs.helsinki.fi/group/goa/mallinnus/lines/bresenh.html).

[jQuery](https://jquery.com/) authors for [jQuery]().

# License

The code is licensed under the [BSD-3-Clause](https://raw.githubusercontent.com/mykolav/typescript-bresenham/master/LICENSE) license.  
So it can be used freely in commercial applications.
