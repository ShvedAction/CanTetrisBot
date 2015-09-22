describe("figure", function() {
    var targetFigure;
    beforeEach(function() {
        targetFigure = new Figure();
    });
    
    afterEach(function(){
    
    });
    
    function isReflectOnField(figure){
        can.each(figure.getPosCells(), function(val, index){
            var cell = field.getXY(val.x, val.y);
            if (cell){
                expect(cell.style_class).not.toEqual("empty");
            }
        });
    }
    
    it("should be create on center and top", function() {
        expect(targetFigure.posx).toEqual(5);
        expect(targetFigure.posy).toEqual(29);
        isReflectOnField(targetFigure);
    });
    
    it("in the come-down should be reduce posy", function(){
        targetFigure.come_down();
        expect(targetFigure.posy).toEqual(28);
        isReflectOnField(targetFigure);
    });
    
    it("on create should be random", function (){
        //todo may be
    });
    
    it("should be able to rotate", function(){
        expect(function (){targetFigure.rotate(-1);}).not.toThrow();
        isReflectOnField(targetFigure);
    });
    
    it("should be able to move horizontal",function(){
        targetFigure.moveHorizontal(1);
        expect(targetFigure.posx).toEqual(6);
        isReflectOnField(targetFigure);
        targetFigure.moveHorizontal(-1);
        expect(targetFigure.posx).toEqual(5);
        isReflectOnField(targetFigure);
    });
    
    it("should be able to return the occupied cells, by method: getPosCells", function(){
        var i = 0;
        can.each(targetFigure.getPosCells(),function(posCell, index){
            expect(posCell.x).toEqual(targetFigure.cells[index].x + targetFigure.posx);
            expect(posCell.y).toEqual(targetFigure.cells[index].y + targetFigure.posy);
        });
    });
    
    describe("movement should take account of the field", function(){
        beforeEach(function(){
            field.each(function(val, index){
                field[index].attr("style_class","empty")
                field[index].attr("state","empty");
            });
        });
        
        it("reflectOnField should be return FALSE if the cells under figure is occupied", function(){
            field.getXY(5,29).attr("state", "red");     field.getXY(4,29).attr("state", "red");
            field.getXY(6,29).attr("state", "red");     field.getXY(3,29).attr("state", "red");
            targetFigure = new Figure();
            expect(targetFigure.reflectOnField()).toEqual(false);
        });
        
        it("reflectOnField should be return TRUE if the cells under figure is not occupied", function(){
            targetFigure = new Figure();
            expect(targetFigure.reflectOnField()).toEqual(true);
        });
        
        it("when the figure is created in the occupied cells, the game must end.", function(){
            field.getXY(5,29).attr("state", "red");     field.getXY(4,29).attr("state", "red");
            field.getXY(6,29).attr("state", "red");     field.getXY(3,29).attr("state", "red");
            spyOn(game, "gameOver");
            targetFigure = new Figure();
            expect(game.gameOver).toHaveBeenCalled();
        });
        
        it("It does not have to turn around and move in a horizontal line when there is a hurdle", function(){
            var figure = new Figure();
            field.each(function(val){
                if (val.attr("style_class") == "empty"){
                    val.attr("state","red");
                    val.attr("style_class","red");
                }
            });
            var originalCells = $.extend(true,{},figure.attr("cells"));
            figure.rotate(-1);
            figure.attr("cells").each(function(val, index){
                expect(val.x).toEqual(originalCells[index].x);
                expect(val.y).toEqual(originalCells[index].y);
            });
            figure.moveHorizontal(1);
            figure.attr("cells").each(function(val, index){
                expect(val.x).toEqual(originalCells[index].x);
                expect(val.y).toEqual(originalCells[index].y);
            });
        });
    });
    
    describe("when on come down not make", function (){
        beforeEach(function(){
            field.each(function(val, index){
                field[index].attr("style_class","empty")
                field[index].attr("state","empty");
            });
        });
        
        it("come down not make if figure on the bottom line field", function (){
            var figure = new Figure();
            figure.attr('cells', ALL_TYPE_FIGURE[0]);  //must be stick
            figure.attr('posy', 0);
            figure.come_down();
            //todo
        });
        
        it("should be fill cells on field under figure", function(){
            
        });
    });
});

describe("field", function(){
    beforeEach(function(){
        field.each(function(val, index){
            field[index].attr("style_class","empty")
            field[index].attr("state","empty");
        });
    });
        
        
    it("should be the double array 5x30 collapsed to the list: length == 300", function(){
        expect(field.attr("length")).toEqual(300);
    });
    
    it("should be able to getXY",function(){
        expect(function(){return field.getXY(3,12);}).not.toThrow();
        expect(field.attr(32)).toBe(field.getXY(2,3));
    });
 });
 
describe("game", function(){
	it("it should be able to start and stop.", function (){
		expect(function (){game.start();}).not.toThrow();
		expect(function (){game.stop();}).not.toThrow();
	});
	
	it("should cause every second figure.come_down.", function(){
		jasmine.clock().install();
		var countCall = 0;
		game.start();
		spyOn(figure, 'come_down');
		jasmine.clock().tick(3001);
		expect(figure.come_down.calls.count()).toEqual(3);
	});
});

describe("canva", function (){
        
    it("every cell of work field sould be 20x20",function(){
        
    });
    
    it("width of work field should be quantety of cell on line multiple on width of cell", function(){
        
    });
});
