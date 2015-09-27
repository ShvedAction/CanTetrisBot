var Figure, field, game, figure, ALL_TYPE_FIGURE;
var fieldHeight = 30, fieldWidth = 10;
$(document).ready(function () {
    game = new (can.Model.extend({}, {
        score: 0,
        countFigure: 0,
        status: "none",
        gameOver: function () {
            clearInterval(this.intervalId);
            $(document).undelegate("*", "keydown", controlKeyEvent);
            this.attr("status", "over");
        },
        start: function () {
            this.nextFigure();
            figure.come_down();
            this.attr("score", 0);
            this.attr("countFigure", 0);
            this.attr("status", "in game");
            this.intervalId = setInterval(function () {
                figure.come_down();
            }, 1000);
        },
        nextFigure: function () {
            figure = new Figure({});
            this.attr("score", game.score + field.cleanFilledCell() * 10);
        },
        stop: function () {
            clearInterval(this.intervalId);
            this.attr("status", "stop");
            $(document).undelegate("*", "keydown", controlKeyEvent);
        }
    }))({});
    ALL_TYPE_FIGURE = [
        [{x: -2, y: 0}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}],
        [{x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}],
        [{x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 1, y: 0}],
        [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}],
        [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}],
        [{x: -1, y: -1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}],
        [{x: -1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 0}]
    ];
    var ALL_TYPE_COLOR = ["red", "green", "blue", "brown", "yellow"];


    Figure = can.Model.extend({}, {
        posx: 4,
        posy: 28,
        init: function () {
            var randIndex = Math.floor(Math.random() * (ALL_TYPE_FIGURE.length));
            this.attr("color", ALL_TYPE_COLOR[Math.floor(Math.random() * (ALL_TYPE_COLOR.length))]);
            this.attr('cells', ALL_TYPE_FIGURE[randIndex]);
            game.attr("countFigure", game.countFigure + 1);
            console.log(game)
            if (!this.reflectOnField()) {
                game.gameOver();
            }
        },
        come_down: function () {
            this.eraseMeFromField();
            this.attr("posy", this.posy - 1);
            if (!this.reflectOnField()) {
                this.eraseMeFromField();
                this.attr("posy", this.posy + 1);
                this.reflectOnField();
                field.save_step();
                can.each(this.getPosCells(), function (val) {
                    var fillCell = field.getXY(val.x, val.y);
                    fillCell.attr("state", fillCell.style_class);
                });
                game.nextFigure();
            }
        },
        moveHorizontal: function (deltX) {
            this.eraseMeFromField();
            this.attr("posx", this.posx + deltX);
            if (!this.reflectOnField()) {
                this.moveHorizontal(-deltX);
            }
        },
        getPosCells: function () {
            var result = [], _this = this;
            this.cells.each(function (cell) {
                result.push({x: cell.x + _this.posx, y: cell.y + _this.posy});
            });
            return result;
        },
        reflectOnField: function () {
            var _this = this;
            var allCellIsFree = true;
            can.each(_this.getPosCells(), function (val) {
                var cell = field.getXY(val.x, val.y);
                if (cell) {
                    if (cell.state != "empty") {
                        allCellIsFree = false;
                    }
                    else {
                        cell.attr("style_class", _this.color);
                    }
                }
            });
            return allCellIsFree;

        },
        eraseMeFromField: function () {
            var _this = this;
            can.each(_this.getPosCells(), function (val) {
                var cell = field.getXY(val.x, val.y);
                if (cell && cell.state === "empty") {
                    cell.attr("style_class", "empty");
                }
            });
        },
        rotate: function (rightOrLeft) {  //1 - right;   -1 - left
            var _this = this;
            var newCells = [];
            var nothingNoOccupied = true;
            can.each(_this.cells, function (val) {
                var newVal;
                newVal = {x: rightOrLeft * val.y, y: -rightOrLeft * val.x};
                var x = newVal.x + _this.posx;
                var y = newVal.y + _this.posy;
                var cellOnField = field.getXY(x, y);
                if (cellOnField && cellOnField.state != "empty") {
                    nothingNoOccupied = false;
                }
                newCells.push(newVal);
            });
            if (nothingNoOccupied) {
                _this.eraseMeFromField();
                _this.attr("cells", newCells);
                if (!_this.reflectOnField()) {
                    _this.rotate(-rightOrLeft);
                }
            }
        }
    });

    //create field
    field = new can.List([]);
    for (var i = 0; i < (fieldHeight * fieldWidth); i++) {
        field.attr(i, new can.Model({style_class: "empty", state: "empty"}));
    }
    field.getXY = function (x, y) {
        if ((x >= 0) && (x < fieldWidth) && (y >= 0) && (y < fieldHeight)) {
            return this.attr(fieldHeight * fieldWidth - (y * fieldWidth + x) - 1);
        }
        return {state: "not field", attr: function () {
            }}
    }
    field.cleanFilledCell = function () {
        var quantety = 0;
        for (var y = fieldHeight - 1; y >= 0; y--) {
            var allCellFilled = true;
            for (var x = 0; x < fieldWidth; x++)
                if (this.getXY(x, y).state == "empty")
                    allCellFilled = false;
            if (allCellFilled) {
                quantety++;
                for (var x = 0; x < fieldWidth; x++) {
                    this.getXY(x, y).attr("state", "empty");
                    this.getXY(x, y).attr("style_class", "empty");
                }
                for (var y1 = y; y1 < fieldHeight - 1; y1++) {
                    for (var x = 0; x < fieldWidth; x++) {
                        var uperCell = this.getXY(x, y1 + 1);
                        this.getXY(x, y1).attr("state", uperCell.state);
                        this.getXY(x, y1).attr("style_class", uperCell.style_class);
                    }
                }
            }
        }
        return quantety;
    };
    field.save_step = function(){
        var resultHash = "";
        var number_position = 0; //разряд
        var sum = 0;
        for(var i = fieldHeight*fieldWidth-1; i>=0; i--){
            var cell = this.attr(i);
            var valField = (cell.state != "empty"? 1 : (cell.style_class != "empty" ? 2 : 0));
            sum += Math.pow(3 , number_position) * valField;
            number_position++;
            if (number_position == 4){
                resultHash += String.fromCharCode(sum+43);
                sum = 0;
                number_position = 0;
            }
        }
        console.log(resultHash);
        resultHash = resultHash.replace(/\++$/,'');
        console.log(resultHash);
        $.post("/new_step",{hash: resultHash, number_figure: game.countFigure, points: game.score});
    };

    $("#field").html(can.view('templateOfField', field));
    $("#status").html(can.view('templateOfStatusGame', game));

    game.start();
    var onceClickOnceEvent = true;
    function controlKeyEvent(key) {
        //console.log(key.keyCode);
        onceClickOnceEvent = !onceClickOnceEvent;
        if (onceClickOnceEvent) {
            return false;
        }
        if (key.keyCode == 39) {
            figure.moveHorizontal(-1);
        }
        if (key.keyCode == 37) {
            figure.moveHorizontal(1);
        }
        if (key.keyCode == 38) {
            figure.rotate(1);
        }
        if (key.keyCode == 40) {
            figure.come_down();
        }

    }
    $(document).delegate("*", "keydown", controlKeyEvent);
});
