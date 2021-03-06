var Figure, field, game, figure, ALL_TYPE_FIGURE;
var fieldHeight = 30, fieldWidth = 10, fromShifr;
var user;
$(document).ready(function () {
    var User = can.Model.extend({
        findOne: 'GET user',
        create: 'POST user/edit',
        update: 'POST user/edit'
    }, {
        init: function(){
            this.on("change",function(event, key_of_val){
                if(key_of_val === "updated" ||key_of_val === "updated_at")
                    return;
                this.save();
                game.toggelStop();
            })
        },
        user_key_up: function(somethink, element, event){
            if (event.keyCode == 13){
                element.blur()
            }
        }

    });

    User.findOne({},function(u){
        game.attr("game_user", u);
    });

    can.Component.extend({
        tag: "user-info",
        template: "{{#if target}}<input type='text' can-keyup='target.user_key_up' can-value='target.nik' can-click='pause' can-focusin='pause' can-focusout='resume' />{{/if}}",
        scope: {}
    });

    game = new (can.Model.extend({
        update: 'POST game/edit',
        create: 'POST game/edit'
    }, {
        points: 0,
        countFigure: 0,
        status: "none",
        toggelStatus: "Pause",
        togelStatusEnabled: "",
        init: function () {
            this.on("change", function (ev, value) {
                if (value === "status") {
                    switch (this.status)
                    {
                        case "in game":
                            this.attr("toggelStatus", "Pause");
                            this.attr("togelStatusEnabled", "");
                            this.set_period_come_down();
                            $(document).delegate("*", "keydown", controlKeyEvent);
                            break;
                        case "stop":
                            this.attr("toggelStatus", "Resume");
                            this.attr("togelStatusEnabled", "");
                            this.stop();
                            break;
                        case "over":
                            this.attr("toggelStatus", "Pause");
                            this.attr("togelStatusEnabled", "disabled");
                            this.stop();
                            break;
                    }
                } else if (value === "points") {
                    this.save();
                }
            });
        },
        gameOver: function () {
            this.attr("status", "over");
            $.get("game/over");
        },
        start: function () {
            field.cleanCell();
            this.nextFigure();
            figure.come_down();
            this.attr("points", 0);
            this.attr("countFigure", 0);
            this.attr("status", "in game");
            $.get("game/new");
        },
        set_period_come_down: function () {
            this.intervalId = setInterval(function () {
                figure.come_down();
            }, 1000);
        },
        nextFigure: function () {
            this.attr("points", game.points + field.cleanFilledCell() * 10);
            figure = new Figure({});
        },
        stop: function () {
            clearInterval(this.intervalId);
            $(document).undelegate("*", "keydown", controlKeyEvent);
        },
        pause: function(){
            this.attr("status", "stop");
        },
        resume: function(){
            this.attr("status", "in game");
        },
        toggelStop: function () {
            switch (this.status) {
                case "in game":
                    this.pause();
                    break;
                case "stop":
                    this.resume();
                    break;
            }
        }
    }))
    ({});
    
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
                if (cell.state === "empty") {
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
    field.fillCleanCell = function () {
        for (var i = 0; i < (fieldHeight * fieldWidth); i++) {
            this.attr(i, new can.Model({style_class: "empty", state: "empty"}));
        }
    };
    field.cleanCell = function () {
        for (var i = 0; i < (fieldHeight * fieldWidth); i++) {
            this.attr(i).attr("style_class", "empty");
            this.attr(i).attr("state", "empty");
        }
    };
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
    field.save_step = function () {
        var resultHash = "";
        var number_position = 0; //разряд
        var sum = 0;
        for (var i = fieldHeight * fieldWidth - 1; i >= 0; i--) {
            var cell = this.attr(i);
            var valField = (cell.state != "empty" ? 1 : (cell.style_class != "empty" ? 2 : 0));
            sum += Math.pow(3, number_position) * valField;
            number_position++;
            if (number_position == 4) {
                resultHash += String.fromCharCode(sum + 43);
                sum = 0;
                number_position = 0;
            }
        }
        console.log(resultHash);
        resultHash = resultHash.replace(/\++$/, '');
        console.log(resultHash);
        fromShifr.fill(resultHash);
        $.post("/new_step", {hash_of_step: resultHash, number_figure: game.countFigure, points: game.points});
    };


    fromShifr = new can.List([]);
    fromShifr.fillCleanCell = field.fillCleanCell;
    fromShifr.cleanCell = field.cleanCell;
    fromShifr.fillCleanCell();
    fromShifr.fill = function (shifr) {
        fromShifr.cleanCell();
        var indexCell = fieldHeight * fieldWidth - 1;
        for (var i = 0; i < shifr.length; i++) {
            var sum = shifr.charCodeAt(i) - 43;
            var deshif = sum.toString(3);
            if (deshif.length > 4)
                throw "sum is incorect";
            var le = deshif.length;
            for (var j = 0; j < (4 - le); j++)
                deshif = "0" + deshif;
            for (var j = 3; j >= 0; j--) {
                var obj = {};
                switch (deshif[j]) {
                    case '0':
                        obj = {style_class: "empty", state: "empty"};
                        break
                    case '1':
                        obj = {style_class: "red", state: "red"};
                        break
                    case '2':
                        obj = {style_class: "blue", state: "empty"};
                }
                this.attr(indexCell).attr("style_class", obj.style_class);
                this.attr(indexCell).attr("state", obj.state);
                indexCell--;
            }
        }
    };

    fromShifr.fill("");
    $("#field").html(can.view('templateOfField', field));
    //$("#fieldShifr").html(can.view('templateOfField', fromShifr));
    $("#status").html(can.view('templateOfStatusGame', game));

    field.fillCleanCell();
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
    //$(document).delegate("*", "keydown", controlKeyEvent);
});
