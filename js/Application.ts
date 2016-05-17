/// <reference path="GridCalculator.ts" />
/// <reference path="GridPainter.ts" />
/// <reference path="GridModel.ts" />
/// <reference path="PreviewController.ts" />
/// <reference path="DrawingController.ts" />
/// <reference path="BresenhamRasterizer.ts" />

namespace Bresenham {
    export class Application {
        private previewController: PreviewController;
        private drawingController: DrawingController;

        constructor(
            public origin: Point = {x: 0, y: 0},
            public dimensions: { columns: number; rows: number },
            private document: HTMLDocument) {
                
            if (!document) {
                throw {
                    message: 'A reference to an html document is required', 
                    code: 'document'
                };
            }
            
            if (!dimensions) {
                throw {
                    message: 'The dimensions argument must be supplied', 
                    code: 'dimensions'
                };
            }
            
            // The following two lines set up independent drawing and preview canvases.
            //this.initDrawing();
            //this.initPreview();
            
            // The following line sets up a shared canvas for both - drawing and preview.
            this.initWithSharedCanvas();
        }
        
        private initWithSharedCanvas(): void {
            let canvas: HTMLCanvasElement = $(this.document).find('#canvasPreview')[0];
            let size = { 
                width: canvas.offsetWidth - this.origin.x, 
                height: canvas.offsetHeight - this.origin.y 
            };
            
            let model = new GridModel(this.dimensions);
            
            let calculator = new GridCalculator(
                this.origin,
                size,
                model.dimensions
            );
            
            let painter = new GridPainter(canvas, calculator, model);
            
            this.drawingController = new DrawingController(calculator, model, painter);
            
            this.previewController = new PreviewController(
                calculator, 
                model, 
                painter, 
                canvas,
                (pc: PreviewController) => {
                    this.drawingController.rasterizeLine(
                        pc.column0, pc.row0, pc.column1, pc.row1);
                });
        }
        
        private initDrawing(): void {
            let canvasDrawing: HTMLCanvasElement = $(this.document).find('#canvasDrawing')[0];
            let size = { 
                width: canvasDrawing.offsetWidth - this.origin.x, 
                height: canvasDrawing.offsetHeight - this.origin.y 
            };
            
            let model = new GridModel(this.dimensions);
            
            let calculator = new GridCalculator(
                this.origin,
                size,
                model.dimensions
            );
            
            let painter = new GridPainter(canvasDrawing, calculator, model);
            
            this.drawingController = new DrawingController(calculator, model, painter);
        }
        
        private initPreview(): void {
            let preivew: HTMLCanvasElement = $(this.document).find('#canvasPreview')[0];
            let size = { 
                width: preivew.offsetWidth - this.origin.x, 
                height: preivew.offsetHeight - this.origin.y 
            };
            
            let model = new GridModel(this.dimensions);
            
            let calculator = new GridCalculator(
                this.origin,
                size,
                model.dimensions
            );
            
            let painter = new GridPainter(preivew, calculator, model);
            
            this.previewController = new PreviewController(
                calculator, 
                model, 
                painter, 
                preivew,
                (pc: PreviewController) => {
                    this.drawingController.rasterizeLine(
                        pc.column0, pc.row0, pc.column1, pc.row1);
                });
        }
        
        strokeGrid(): void {
            this.drawingController.strokeGrid();
        }
        
        rasterizeLine(
            column0: number, 
            row0: number, 
            column1: number, 
            row1: number): void {
            
            this.drawingController.rasterizeLine(column0, row0, column1, row1);
        }
    }
}
