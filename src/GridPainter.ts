/// <reference path="GridCalculator.ts" />

namespace Bresenham {
    
    export class GridPainter {
        private context : CanvasRenderingContext2D;
        
        constructor(
            canvas: HTMLCanvasElement,
            private grid: GridCalculator,
            private gridModel: GridModel
        ) { 
            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error("Getting 2d context failed!");
            }

            this.context = context;
        }
        
        strokeGrid()  {
            // Stroke the horizontal lines
            for (let row = 0; row < this.grid.dimensions.rows + 1; ++row) {
                const y = this.grid.getHorizontalLineY(row);
                
                this.strokeLine(this.grid.left, y, this.grid.right, y);
            }
            
            // Stroke the vertical lines
            for (let column = 0; column < this.grid.dimensions.columns + 1; ++column) {
                const x = this.grid.getVerticalLineX(column);
                
                this.strokeLine(x, this.grid.top, x, this.grid.bottom);
            }
        }
        
        fillCellsFromModel() {
            for (let row = 0; row < this.gridModel.dimensions.rows; ++row) {
                for (let column = 0; column < this.gridModel.dimensions.columns; ++column) {
                    if (this.gridModel.getCellValue(column, row)) {
                        this.fillCell(column, row);
                    }
                    else {
                        this.clearCell(column, row);
                    }
                }
            }
        }
        
        private strokeLine(x1: number, y1: number, x2: number, y2: number) {
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.closePath();
            this.context.stroke();
        }
        
        fillCell(column: number, row: number)  {
            const rect = this.grid.getCellRectangle(column, row);
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
        
        clearCell(column: number, row: number)  {
            const rect = this.grid.getCellRectangle(column, row);
            this.context.clearRect(rect.x, rect.y, rect.width, rect.height);
        }
        
        rasterizeLine(
            column0: number, 
            row0: number, 
            column1: number, 
            row1: number,
            beforeSetCellValueCallback?: (x: number, y: number) => any) {
            
            if (!this.gridModel.isCellWithinBounds({x: column0, y: row0})) {
                throw {
                    message: `The start cell {x: ${column0}, y: ${row0}} is out of the grid's bounds`,
                    code: 'out-of-bounds'
                };
            }
            
            if (!this.gridModel.isCellWithinBounds({x: column1, y: row1})) {
                throw {
                    message: `The end cell {x: ${column1}, y: ${row1}} is out of the grid's bounds`,
                    code: 'out-of-bounds'
                };
            }
            
            const bresenham = new BresenhamRasterizer(
                (x: number, y: number) => {
                    if (beforeSetCellValueCallback) {
                        beforeSetCellValueCallback(x, y);
                    }
                    
                    this.gridModel.setCellValue(x, y, true);
                    this.fillCell(x, y); 
                }, 
                column0, row0, column1, row1);
                
            bresenham.rasterizeLine();
        }
    }
}
