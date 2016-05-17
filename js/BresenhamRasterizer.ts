namespace Bresenham {
    
    class Line {
        private _isSlopeNormalized: boolean;
        private _isSlopePositive: boolean;
        
        private _dx: number;
        private _dy: number;
        
        constructor(
            public x0: number, 
            public y0: number, 
            public x1: number, 
            public y1: number) {

            // It's important to call normalizeSlope() before normalize()
            // as normalizeSlope can swap the coordinates of line's endpoints
            // and this swapping can result in a "denormalization" of the line.                
            this.normalizeSlope();
            this.normalize();

            this._dy = this.y1 - this.y0;
            this._dx = this.x1 - this.x0;
        }
        
        private normalize(): void {
            if (this.x0 > this.x1) {
                let temp = this.x0;
                this.x0 = this.x1;
                this.x1 = temp;
                
                temp = this.y0;
                this.y0 = this.y1;
                this.y1 = temp;
            }
        }
        
        private normalizeSlope(): void {
            
            this._isSlopeNormalized = false;
            
            // The slope of a line is considered to be steep when its value is greater than 1
            // The slope calculation formulae is the following:
            // slope = dy / dx
            // In case dy is greater than dx, the slope is greater than 1 (steep)
            let dx = Math.abs(this.x1 - this.x0);
            let dy = Math.abs(this.y1 - this.y0);
            
            let isSteep = dy > dx;
            if (isSteep) {
                let temp = this.x0;
                this.x0 = this.y0;
                this.y0 = temp;
                
                temp = this.x1;
                this.x1 = this.y1;
                this.y1 = temp;
                
                this._isSlopeNormalized = true;
            }
        }
        
        public get isSlopeNormalized(): boolean {
            return this._isSlopeNormalized;
        }
        
        public get dy(): number {
            return this._dy;
        }
        
        public get dx(): number {
            return this._dx;
        }
    }
    
    /// <remarks>
    /// See <a href="https://www.cs.helsinki.fi/group/goa/mallinnus/lines/bresenh.html">The Bresenham Line-Drawing Algorithm</a> 
    /// for the reference...
    /// </remarks>
    export class BresenhamRasterizer {
        private line: Line;
        private step: number;
        
        constructor(
            private fillCellCallback: (x: number, y: number) => any,
            x0: number, y0: number, x1: number, y1: number) {
                
            this.line = new Line(x0, y0, x1, y1);
            if (this.line.dy > 0) {
                this.step = 1;
            } 
            else {
                this.step = -1;
            }
        }
        
        public rasterizeLine(): void {
               
            // NOTE: A horizontal line is rasterized just fine:
            // NOTE: dy is zero and consequently y is never changed,
            // NOTE: so the resulting rasterization is horizontal.
            
            // NOTE: A vertical line is rasterized successfully thanks to the following:
            // NOTE: 1. A vertical line is considered to have a steep slope and
            // NOTE:    and as a result it's normalized to a "horizontal" line.
            // NOTE: 2. A horizontal line rasterization is described above...
            
            let epsilon = 0;
            
            let x = this.line.x0;
            let y = this.line.y0;
           
            do {
                this.fillCell(x, y);
                
                x = x + 1;
                epsilon = epsilon + Math.abs(this.line.dy);
                
                if (2*epsilon > this.line.dx) {
                    epsilon = epsilon - this.line.dx;
                    y = y + this.step;
                }
            } while (x <= this.line.x1);
        }
        
        private fillCell(column: number, row: number): void {
            if (this.line.isSlopeNormalized) {
                let temp = column;
                column = row;
                row = temp;
            }
            
            this.fillCellCallback(column, row);
        }
    }
}
