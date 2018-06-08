namespace Bresenham {
    export interface Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export interface Point {
        x: number;
        y: number;
    }

    export class GridCalculator {
        private cellWidth: number;
        private cellHeight: number;

        constructor(
            public origin: Point,
            public size: { width: number; height: number },
            public dimensions: { columns: number; rows: number }) {
            this.cellWidth = size.width / dimensions.columns;
            this.cellHeight = size.height / dimensions.rows;
        }
        
        get left() {
            return this.origin.x;
        }
        
        get right() {
            return this.origin.x + this.size.width;
        }
        
        get top() {
            return this.origin.y;
        }
        
        get bottom() {
            return this.origin.y + this.size.height;
        }

        getCellRectangle(column: number, row: number): Rectangle {
            const rectangle = {
                x: this.origin.x + (column * this.cellWidth),
                y: this.origin.y + (row * this.cellHeight),
                width: this.cellWidth,
                height: this.cellHeight
            };

            return rectangle;
        }
        
        getHorizontalLineY(row: number) {
            return this.origin.y + (row * this.cellHeight);
        }
        
        getVerticalLineX(column: number) {
            return this.origin.x + (column * this.cellWidth);
        }
        
        getColumnFromX(x: number) {
            return Math.ceil(x / this.cellWidth);
        }
        
        getRowFromY(y: number) {
            return Math.ceil(y / this.cellHeight);
        }
    }
} 
