/// <reference path="GridCalculator.ts" />
/// <reference path="GridPainter.ts" />
/// <reference path="GridModel.ts" />
/// <reference path="BresenhamRasterizer.ts" />

namespace Bresenham {
    export class DrawingController {
        
        constructor(
            private calculator : GridCalculator,
            private model: GridModel,
            private painter : GridPainter) {
        }
        
        strokeGrid(): void {
            this.painter.strokeGrid();
        }
        
        rasterizeLine(
            column0: number, 
            row0: number, 
            column1: number, 
            row1: number): void {
            
            this.painter.rasterizeLine(column0, row0, column1, row1);
            this.painter.fillCellsFromModel();
        }
    }
}
