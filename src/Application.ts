/// <reference path="GridCalculator.ts" />
/// <reference path="GridPainter.ts" />
/// <reference path="GridModel.ts" />
/// <reference path="PreviewController.ts" />
/// <reference path="DrawingController.ts" />
/// <reference path="BresenhamRasterizer.ts" />

namespace Bresenham {
    declare const $: any;
    
    export class Application {
        private drawingController: DrawingController|null = null;

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
            // this.initDrawing();
            // this.initPreview();
            
            // The following line sets up a shared canvas for both - drawing and preview.
            this.initWithSharedCanvas();
        }
        
        private initWithSharedCanvas() {
            const canvas: HTMLCanvasElement = $(this.document).find('#canvasPreview')[0];
            const size = { 
                width: canvas.offsetWidth - this.origin.x, 
                height: canvas.offsetHeight - this.origin.y 
            };
            
            const model = new GridModel(this.dimensions);
            
            const calculator = new GridCalculator(
                this.origin,
                size,
                model.dimensions
            );
            
            const painter = new GridPainter(canvas, calculator, model);
            
            this.drawingController = new DrawingController(painter);
            
            new PreviewController(
                calculator, 
                model, 
                painter, 
                canvas,
                (pc: PreviewController) => {
                    this.drawingController!.rasterizeLine(
                        pc.column0, pc.row0, pc.column1, pc.row1);
                });
        }
        
        // private initDrawing() {
        //     const canvasDrawing: HTMLCanvasElement = $(this.document).find('#canvasDrawing')[0];
        //     const size = { 
        //         width: canvasDrawing.offsetWidth - this.origin.x, 
        //         height: canvasDrawing.offsetHeight - this.origin.y 
        //     };
            
        //     const model = new GridModel(this.dimensions);
            
        //     const calculator = new GridCalculator(
        //         this.origin,
        //         size,
        //         model.dimensions
        //     );
            
        //     const painter = new GridPainter(canvasDrawing, calculator, model);
            
        //     this.drawingController = new DrawingController(painter);
        // }
        
        // private initPreview() {
        //     const preivew: HTMLCanvasElement = $(this.document).find('#canvasPreview')[0];
        //     const size = { 
        //         width: preivew.offsetWidth - this.origin.x, 
        //         height: preivew.offsetHeight - this.origin.y 
        //     };
            
        //     const model = new GridModel(this.dimensions);
            
        //     const calculator = new GridCalculator(
        //         this.origin,
        //         size,
        //         model.dimensions
        //     );
            
        //     const painter = new GridPainter(preivew, calculator, model);
            
        //     this.previewController = new PreviewController(
        //         calculator, 
        //         model, 
        //         painter, 
        //         preivew,
        //         (pc: PreviewController) => {
        //             this.drawingController!.rasterizeLine(
        //                 pc.column0, pc.row0, pc.column1, pc.row1);
        //         });
        // }
        
        strokeGrid() {
            this.drawingController!.strokeGrid();
        }
        
        rasterizeLine(
            column0: number, 
            row0: number, 
            column1: number, 
            row1: number) {
            
            this.drawingController!.rasterizeLine(column0, row0, column1, row1);
        }
    }
}
