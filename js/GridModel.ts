namespace Bresenham {
    
    export class GridModel {
        private grid : boolean[][]
        
        constructor(public dimensions: { columns: number; rows: number }) {
            this.grid = [];
            for (let row = 0; row < dimensions.rows; ++row) {
                this.grid[row] = [];
                // Alternatively: 
                // this.grid.push([]);
                
                for (let column = 0; column < dimensions.columns; ++column) {
                    this.grid[row][column] = false;
                }
            }
        }
        
        getCellValue(column: number, row: number): boolean {
            if (!this.isCellWithinBounds({ x: column, y: row })) {
                throw {
                    message: `The cell {x: ${column}, y: ${row}} is out of the grid's bounds`,
                    code: 'out-of-bounds'
                };
            }

            return this.grid[row][column];
        }
        
        setCellValue(column: number, row: number, value: boolean): void {
            if (!this.isCellWithinBounds({ x: column, y: row })) {
                throw {
                    message: `The cell {x: ${column}, y: ${row}} is out of the grid's bounds`,
                    code: 'out-of-bounds'
                };
            }

            this.grid[row][column] = value;
        }
        
        private isColumnInRange(column: number): boolean {
            return 0 <= column && column < this.dimensions.columns;
        }
        
        private isRowInRange(row: number): boolean {
            return 0 <= row && row < this.dimensions.rows;
        }
        
        isCellWithinBounds(p: Point): boolean {
            return this.isColumnInRange(p.x) && 
                this.isRowInRange(p.y);
        }
    }
}
