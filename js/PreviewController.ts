/// <reference path="GridCalculator.ts" />
/// <reference path="GridPainter.ts" />
/// <reference path="GridModel.ts" />
/// <reference path="BresenhamRasterizer.ts" />

namespace Bresenham {
    class Cell {
        column: number;
        row: number;
        value: boolean;
    }
    
    export class PreviewController {
        private previewRefreshInterval = 100;
        
        private _isMousePressed: boolean;
        //private _intervalId: any;
        
        private savedCells: Cell[];
        
        public column0: number;
        public row0: number;
        public column1: number;
        public row1: number; 
    
        constructor(
            private calculator : GridCalculator,
            private model: GridModel,
            private painter : GridPainter,
            private preview: HTMLCanvasElement,
            private drawLineCallback: (controller: PreviewController) => any) {
                
            $(this.preview).mousedown((me: MouseEvent) => this.processMouseDown(this, me));
            $(this.preview).mousemove((me: MouseEvent) => this.processMouseMove(this, me));
            $(this.preview).mouseleave((me: MouseEvent) => this.processMouseLeave(this, me));
            $(this.preview).mouseup((me: MouseEvent) => this.processMouseUp(this, me));
        }
        
        private processMouseDown(self: PreviewController, me: MouseEvent): void {
            self._isMousePressed = false;

            let cell = self.getCellFromMouseEvent(me);            
            
            if (!self.model.isCellWithinBounds(cell)) {
                return;
            }
            
            self._isMousePressed = true;
            self.column0 = cell.x;
            self.row0 = cell.y;
            self.column1 = cell.x;
            self.row1 = cell.y;
            
            // self._intervalId = setInterval(
            //     () => this.updatePreview(self), 
            //     this.previewRefreshInterval);
        }
        
        private updatePreview(self: PreviewController): void {
            self.clearPreview();
            self.drawPreview();
        }
        
        private processMouseMove(self: PreviewController, me: MouseEvent): void {
            if (!self._isMousePressed) {
                return;
            }
            
            let cell = self.getCellFromMouseEvent(me);
            self.column1 = cell.x;
            self.row1 = cell.y;

            self.updatePreview(self);
        }
        
        private processMouseLeave(self: PreviewController, me: MouseEvent): void {
            if (!self._isMousePressed) {
                return;
            }
            
            //clearInterval(self._intervalId);
            self._isMousePressed = false;
            self.clearPreview();
            
            self.column0 = 0;
            self.row0 = 0;
            self.column1 = 0;
            self.row1 = 0;
        }
        
        private processMouseUp(self: PreviewController, me: MouseEvent): void {
            if (!self._isMousePressed) {
                return;
            }
            
            //clearInterval(self._intervalId);
            self._isMousePressed = false;
            self.clearPreview();
            
            let cell = self.getCellFromMouseEvent(me);
            self.column1 = cell.x;
            self.row1 = cell.y;

            self.drawLineCallback(self);
        }
        
        private getCellFromMouseEvent(me: MouseEvent): Point {
            let canvasX = me.pageX - this.preview.offsetLeft;
            let canvasY = me.pageY - this.preview.offsetTop;
            
            let column = this.calculator.getColumnFromX(canvasX);
            let row = this.calculator.getRowFromY(canvasY);
            
            return {x: column, y: row};
        }
        
        private clearPreview(): void {
            if (!this.savedCells || this.savedCells.length === 0) {
                return;
            }
            
            for (let i = 0; i < this.savedCells.length; ++i) {
                let cell = this.savedCells[i];
                this.model.setCellValue(cell.column, cell.row, cell.value);
                if (cell.value) {
                    this.painter.fillCell(cell.column, cell.row);
                }
                else {
                    this.painter.clearCell(cell.column, cell.row);
                }
            }
            
            this.savedCells = [];
        }
        
        private drawPreview(): void {
            this.savedCells = [];
            
            this.painter.rasterizeLine(
                this.column0, this.row0, this.column1, this.row1,
                (x: number, y: number) => {
                    
                    let cell = new Cell();
                    cell.column = x;
                    cell.row = y;
                    cell.value = this.model.getCellValue(x, y);
                    
                    this.savedCells.push(cell); 
                });
        }
    }
}
