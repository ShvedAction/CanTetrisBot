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
    
    it("in the come-down should be reduce posy", function(){
        targetFigure.come_down();
        expect(targetFigure.posy).toEqual(27);
        isReflectOnField(targetFigure);
    });
    
    describe("when on come down not make", function (){
        beforeEach(function(){
            field.each(function(val, index){
                field[index].attr("style_class","empty")
                field[index].attr("state","empty");
            });
        });
        
        it("come down not make if figure on the bottom line field", function (){

        });
    });
});
