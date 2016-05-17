var Bresenham;
(function (Bresenham) {
    var GridCalculator = (function () {
        function GridCalculator(origin, size, dimensions) {
            this.origin = origin;
            this.size = size;
            this.dimensions = dimensions;
            this.cellWidth = size.width / dimensions.columns;
            this.cellHeight = size.height / dimensions.rows;
        }
        Object.defineProperty(GridCalculator.prototype, "left", {
            get: function () {
                return this.origin.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridCalculator.prototype, "right", {
            get: function () {
                return this.origin.x + this.size.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridCalculator.prototype, "top", {
            get: function () {
                return this.origin.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridCalculator.prototype, "bottom", {
            get: function () {
                return this.origin.y + this.size.height;
            },
            enumerable: true,
            configurable: true
        });
        GridCalculator.prototype.getCellRectangle = function (column, row) {
            var rectangle = {
                x: this.origin.x + (column * this.cellWidth),
                y: this.origin.y + (row * this.cellHeight),
                width: this.cellWidth,
                height: this.cellHeight
            };
            return rectangle;
        };
        GridCalculator.prototype.getHorizontalLineY = function (row) {
            return this.origin.y + (row * this.cellHeight);
        };
        GridCalculator.prototype.getVerticalLineX = function (column) {
            return this.origin.x + (column * this.cellWidth);
        };
        GridCalculator.prototype.getColumnFromX = function (x) {
            return Math.ceil(x / this.cellWidth);
        };
        GridCalculator.prototype.getRowFromY = function (y) {
            return Math.ceil(y / this.cellHeight);
        };
        return GridCalculator;
    }());
    Bresenham.GridCalculator = GridCalculator;
})(Bresenham || (Bresenham = {}));
/// <reference path="GridCalculator.ts" />
var Bresenham;
(function (Bresenham) {
    var GridPainter = (function () {
        function GridPainter(canvas, grid, gridModel) {
            this.canvas = canvas;
            this.grid = grid;
            this.gridModel = gridModel;
            this.context = canvas.getContext('2d');
        }
        GridPainter.prototype.strokeGrid = function () {
            // Stroke the horizontal lines
            for (var row = 0; row < this.grid.dimensions.rows + 1; ++row) {
                var y = this.grid.getHorizontalLineY(row);
                this.strokeLine(this.grid.left, y, this.grid.right, y);
            }
            // Stroke the vertical lines
            for (var column = 0; column < this.grid.dimensions.columns + 1; ++column) {
                var x = this.grid.getVerticalLineX(column);
                this.strokeLine(x, this.grid.top, x, this.grid.bottom);
            }
        };
        GridPainter.prototype.fillCellsFromModel = function () {
            for (var row = 0; row < this.gridModel.dimensions.rows; ++row) {
                for (var column = 0; column < this.gridModel.dimensions.columns; ++column) {
                    if (this.gridModel.getCellValue(column, row)) {
                        this.fillCell(column, row);
                    }
                    else {
                        this.clearCell(column, row);
                    }
                }
            }
        };
        GridPainter.prototype.strokeLine = function (x1, y1, x2, y2) {
            this.context.beginPath();
            this.context.moveTo(x1, y1);
            this.context.lineTo(x2, y2);
            this.context.closePath();
            this.context.stroke();
        };
        GridPainter.prototype.fillCell = function (column, row) {
            var rect = this.grid.getCellRectangle(column, row);
            this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
        };
        GridPainter.prototype.clearCell = function (column, row) {
            var rect = this.grid.getCellRectangle(column, row);
            this.context.clearRect(rect.x, rect.y, rect.width, rect.height);
        };
        GridPainter.prototype.rasterizeLine = function (column0, row0, column1, row1, beforeSetCellValueCallback) {
            var _this = this;
            if (!this.gridModel.isCellWithinBounds({ x: column0, y: row0 })) {
                throw {
                    message: "The start cell {x: " + column0 + ", y: " + row0 + "} is out of the grid's bounds",
                    code: 'out-of-bounds'
                };
            }
            if (!this.gridModel.isCellWithinBounds({ x: column1, y: row1 })) {
                throw {
                    message: "The end cell {x: " + column1 + ", y: " + row1 + "} is out of the grid's bounds",
                    code: 'out-of-bounds'
                };
            }
            var bresenham = new Bresenham.BresenhamRasterizer(function (x, y) {
                if (beforeSetCellValueCallback) {
                    beforeSetCellValueCallback(x, y);
                }
                _this.gridModel.setCellValue(x, y, true);
                _this.fillCell(x, y);
            }, column0, row0, column1, row1);
            bresenham.rasterizeLine();
        };
        return GridPainter;
    }());
    Bresenham.GridPainter = GridPainter;
})(Bresenham || (Bresenham = {}));
var Bresenham;
(function (Bresenham) {
    var GridModel = (function () {
        function GridModel(dimensions) {
            this.dimensions = dimensions;
            this.grid = [];
            for (var row = 0; row < dimensions.rows; ++row) {
                this.grid[row] = [];
                // Alternatively: 
                // this.grid.push([]);
                for (var column = 0; column < dimensions.columns; ++column) {
                    this.grid[row][column] = false;
                }
            }
        }
        GridModel.prototype.getCellValue = function (column, row) {
            if (!this.isCellWithinBounds({ x: column, y: row })) {
                throw {
                    message: "The cell {x: " + column + ", y: " + row + "} is out of the grid's bounds",
                    code: 'out-of-bounds'
                };
            }
            return this.grid[row][column];
        };
        GridModel.prototype.setCellValue = function (column, row, value) {
            if (!this.isCellWithinBounds({ x: column, y: row })) {
                throw {
                    message: "The cell {x: " + column + ", y: " + row + "} is out of the grid's bounds",
                    code: 'out-of-bounds'
                };
            }
            this.grid[row][column] = value;
        };
        GridModel.prototype.isColumnInRange = function (column) {
            return 0 <= column && column < this.dimensions.columns;
        };
        GridModel.prototype.isRowInRange = function (row) {
            return 0 <= row && row < this.dimensions.rows;
        };
        GridModel.prototype.isCellWithinBounds = function (p) {
            return this.isColumnInRange(p.x) &&
                this.isRowInRange(p.y);
        };
        return GridModel;
    }());
    Bresenham.GridModel = GridModel;
})(Bresenham || (Bresenham = {}));
var Bresenham;
(function (Bresenham) {
    var Line = (function () {
        function Line(x0, y0, x1, y1) {
            this.x0 = x0;
            this.y0 = y0;
            this.x1 = x1;
            this.y1 = y1;
            // It's important to call normalizeSlope() before normalize()
            // as normalizeSlope can swap the coordinates of line's endpoints
            // and this swapping can result in a "denormalization" of the line.                
            this.normalizeSlope();
            this.normalize();
            this._dy = this.y1 - this.y0;
            this._dx = this.x1 - this.x0;
        }
        Line.prototype.normalize = function () {
            if (this.x0 > this.x1) {
                var temp = this.x0;
                this.x0 = this.x1;
                this.x1 = temp;
                temp = this.y0;
                this.y0 = this.y1;
                this.y1 = temp;
            }
        };
        Line.prototype.normalizeSlope = function () {
            this._isSlopeNormalized = false;
            // The slope of a line is considered to be steep when its value is greater than 1
            // The slope calculation formulae is the following:
            // slope = dy / dx
            // In case dy is greater than dx, the slope is greater than 1 (steep)
            var dx = Math.abs(this.x1 - this.x0);
            var dy = Math.abs(this.y1 - this.y0);
            var isSteep = dy > dx;
            if (isSteep) {
                var temp = this.x0;
                this.x0 = this.y0;
                this.y0 = temp;
                temp = this.x1;
                this.x1 = this.y1;
                this.y1 = temp;
                this._isSlopeNormalized = true;
            }
        };
        Object.defineProperty(Line.prototype, "isSlopeNormalized", {
            get: function () {
                return this._isSlopeNormalized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "dy", {
            get: function () {
                return this._dy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Line.prototype, "dx", {
            get: function () {
                return this._dx;
            },
            enumerable: true,
            configurable: true
        });
        return Line;
    }());
    /// <remarks>
    /// See <a href="https://www.cs.helsinki.fi/group/goa/mallinnus/lines/bresenh.html">The Bresenham Line-Drawing Algorithm</a> 
    /// for the reference...
    /// </remarks>
    var BresenhamRasterizer = (function () {
        function BresenhamRasterizer(fillCellCallback, x0, y0, x1, y1) {
            this.fillCellCallback = fillCellCallback;
            this.line = new Line(x0, y0, x1, y1);
            if (this.line.dy > 0) {
                this.step = 1;
            }
            else {
                this.step = -1;
            }
        }
        BresenhamRasterizer.prototype.rasterizeLine = function () {
            // NOTE: A horizontal line is rasterized just fine:
            // NOTE: dy is zero and consequently y is never changed,
            // NOTE: so the resulting rasterization is horizontal.
            // NOTE: A vertical line is rasterized successfully thanks to the following:
            // NOTE: 1. A vertical line is considered to have a steep slope and
            // NOTE:    and as a result it's normalized to a "horizontal" line.
            // NOTE: 2. A horizontal line rasterization is described above...
            var epsilon = 0;
            var x = this.line.x0;
            var y = this.line.y0;
            do {
                this.fillCell(x, y);
                x = x + 1;
                epsilon = epsilon + Math.abs(this.line.dy);
                if (2 * epsilon > this.line.dx) {
                    epsilon = epsilon - this.line.dx;
                    y = y + this.step;
                }
            } while (x <= this.line.x1);
        };
        BresenhamRasterizer.prototype.fillCell = function (column, row) {
            if (this.line.isSlopeNormalized) {
                var temp = column;
                column = row;
                row = temp;
            }
            this.fillCellCallback(column, row);
        };
        return BresenhamRasterizer;
    }());
    Bresenham.BresenhamRasterizer = BresenhamRasterizer;
})(Bresenham || (Bresenham = {}));
/// <reference path="GridCalculator.ts" />
/// <reference path="GridPainter.ts" />
/// <reference path="GridModel.ts" />
/// <reference path="BresenhamRasterizer.ts" />
var Bresenham;
(function (Bresenham) {
    var Cell = (function () {
        function Cell() {
        }
        return Cell;
    }());
    var PreviewController = (function () {
        function PreviewController(calculator, model, painter, preview, drawLineCallback) {
            var _this = this;
            this.calculator = calculator;
            this.model = model;
            this.painter = painter;
            this.preview = preview;
            this.drawLineCallback = drawLineCallback;
            this.previewRefreshInterval = 100;
            $(this.preview).mousedown(function (me) { return _this.processMouseDown(_this, me); });
            $(this.preview).mousemove(function (me) { return _this.processMouseMove(_this, me); });
            $(this.preview).mouseleave(function (me) { return _this.processMouseLeave(_this, me); });
            $(this.preview).mouseup(function (me) { return _this.processMouseUp(_this, me); });
        }
        PreviewController.prototype.processMouseDown = function (self, me) {
            self._isMousePressed = false;
            var cell = self.getCellFromMouseEvent(me);
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
        };
        PreviewController.prototype.updatePreview = function (self) {
            self.clearPreview();
            self.drawPreview();
        };
        PreviewController.prototype.processMouseMove = function (self, me) {
            if (!self._isMousePressed) {
                return;
            }
            var cell = self.getCellFromMouseEvent(me);
            self.column1 = cell.x;
            self.row1 = cell.y;
            self.updatePreview(self);
        };
        PreviewController.prototype.processMouseLeave = function (self, me) {
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
        };
        PreviewController.prototype.processMouseUp = function (self, me) {
            if (!self._isMousePressed) {
                return;
            }
            //clearInterval(self._intervalId);
            self._isMousePressed = false;
            self.clearPreview();
            var cell = self.getCellFromMouseEvent(me);
            self.column1 = cell.x;
            self.row1 = cell.y;
            self.drawLineCallback(self);
        };
        PreviewController.prototype.getCellFromMouseEvent = function (me) {
            var canvasX = me.pageX - this.preview.offsetLeft;
            var canvasY = me.pageY - this.preview.offsetTop;
            var column = this.calculator.getColumnFromX(canvasX);
            var row = this.calculator.getRowFromY(canvasY);
            return { x: column, y: row };
        };
        PreviewController.prototype.clearPreview = function () {
            if (!this.savedCells || this.savedCells.length === 0) {
                return;
            }
            for (var i = 0; i < this.savedCells.length; ++i) {
                var cell = this.savedCells[i];
                this.model.setCellValue(cell.column, cell.row, cell.value);
                if (cell.value) {
                    this.painter.fillCell(cell.column, cell.row);
                }
                else {
                    this.painter.clearCell(cell.column, cell.row);
                }
            }
            this.savedCells = [];
        };
        PreviewController.prototype.drawPreview = function () {
            var _this = this;
            this.savedCells = [];
            this.painter.rasterizeLine(this.column0, this.row0, this.column1, this.row1, function (x, y) {
                var cell = new Cell();
                cell.column = x;
                cell.row = y;
                cell.value = _this.model.getCellValue(x, y);
                _this.savedCells.push(cell);
            });
        };
        return PreviewController;
    }());
    Bresenham.PreviewController = PreviewController;
})(Bresenham || (Bresenham = {}));
/// <reference path="GridCalculator.ts" />
/// <reference path="GridPainter.ts" />
/// <reference path="GridModel.ts" />
/// <reference path="BresenhamRasterizer.ts" />
var Bresenham;
(function (Bresenham) {
    var DrawingController = (function () {
        function DrawingController(calculator, model, painter) {
            this.calculator = calculator;
            this.model = model;
            this.painter = painter;
        }
        DrawingController.prototype.strokeGrid = function () {
            this.painter.strokeGrid();
        };
        DrawingController.prototype.rasterizeLine = function (column0, row0, column1, row1) {
            this.painter.rasterizeLine(column0, row0, column1, row1);
            this.painter.fillCellsFromModel();
        };
        return DrawingController;
    }());
    Bresenham.DrawingController = DrawingController;
})(Bresenham || (Bresenham = {}));
/// <reference path="GridCalculator.ts" />
/// <reference path="GridPainter.ts" />
/// <reference path="GridModel.ts" />
/// <reference path="PreviewController.ts" />
/// <reference path="DrawingController.ts" />
/// <reference path="BresenhamRasterizer.ts" />
var Bresenham;
(function (Bresenham) {
    var Application = (function () {
        function Application(origin, dimensions, document) {
            if (origin === void 0) { origin = { x: 0, y: 0 }; }
            this.origin = origin;
            this.dimensions = dimensions;
            this.document = document;
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
        Application.prototype.initWithSharedCanvas = function () {
            var _this = this;
            var canvas = $(this.document).find('#canvasPreview')[0];
            var size = {
                width: canvas.offsetWidth - this.origin.x,
                height: canvas.offsetHeight - this.origin.y
            };
            var model = new Bresenham.GridModel(this.dimensions);
            var calculator = new Bresenham.GridCalculator(this.origin, size, model.dimensions);
            var painter = new Bresenham.GridPainter(canvas, calculator, model);
            this.drawingController = new Bresenham.DrawingController(calculator, model, painter);
            this.previewController = new Bresenham.PreviewController(calculator, model, painter, canvas, function (pc) {
                _this.drawingController.rasterizeLine(pc.column0, pc.row0, pc.column1, pc.row1);
            });
        };
        Application.prototype.initDrawing = function () {
            var canvasDrawing = $(this.document).find('#canvasDrawing')[0];
            var size = {
                width: canvasDrawing.offsetWidth - this.origin.x,
                height: canvasDrawing.offsetHeight - this.origin.y
            };
            var model = new Bresenham.GridModel(this.dimensions);
            var calculator = new Bresenham.GridCalculator(this.origin, size, model.dimensions);
            var painter = new Bresenham.GridPainter(canvasDrawing, calculator, model);
            this.drawingController = new Bresenham.DrawingController(calculator, model, painter);
        };
        Application.prototype.initPreview = function () {
            var _this = this;
            var preivew = $(this.document).find('#canvasPreview')[0];
            var size = {
                width: preivew.offsetWidth - this.origin.x,
                height: preivew.offsetHeight - this.origin.y
            };
            var model = new Bresenham.GridModel(this.dimensions);
            var calculator = new Bresenham.GridCalculator(this.origin, size, model.dimensions);
            var painter = new Bresenham.GridPainter(preivew, calculator, model);
            this.previewController = new Bresenham.PreviewController(calculator, model, painter, preivew, function (pc) {
                _this.drawingController.rasterizeLine(pc.column0, pc.row0, pc.column1, pc.row1);
            });
        };
        Application.prototype.strokeGrid = function () {
            this.drawingController.strokeGrid();
        };
        Application.prototype.rasterizeLine = function (column0, row0, column1, row1) {
            this.drawingController.rasterizeLine(column0, row0, column1, row1);
        };
        return Application;
    }());
    Bresenham.Application = Application;
})(Bresenham || (Bresenham = {}));
