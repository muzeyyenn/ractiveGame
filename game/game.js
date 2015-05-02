
// prepare canvas

var canvas = new fabric.Canvas('c');
canvas.selection = false;

canvas.on('object:selected',function(ev){
     if(objectsToDelete.length == 0){
              objectsToDelete.push(ev.target);
        idToDelete.push(ev.target.id);
                objectsToDelete[0].setOpacity(0.5);

    }

          else {
        if((idToDelete[0] == ev.target.id || objectsToDelete[0].fill == ev.target.fill) && ev.target != objectsToDelete[0] ){
                shapes = shapes.filter(function(shape) { return shape != objectsToDelete[0] && shape != ev.target });
        ractive.add("score", 10);
        canvas.remove(objectsToDelete[0]);
        canvas.remove(ev.target);
                idToDelete.length =0;
                objectsToDelete.length =0;
                //shapes.splice(0, 2);


           }
              else {
                    objectsToDelete[0].setOpacity(1);
                    idToDelete.length =0;
                    objectsToDelete.length =0;

                   }

              if(shapes.length == 1 || shapes.length == 2) {
                  level++;
                  if(level==2) {
                  gameStart(2);
                  }

                  if(level==3) {
                     gameStart(3);
                  }
             }
      }
});

// ractive

var levelConfig = {
    1: { timeLimit: 60, shapeCount: 2 },
    2: { timeLimit: 50, shapeCount: 3 }
}

var ractive = new Ractive({
    el: 'container',
    template: '#template',
    data: {
        signedIn: false,
        level: 2,
        shapesSelected: [false,false,false,false,false,false],
        colorsSelected: [false,false,false,false,false,false],
        allShapes: ['Circle','Star','Square','Hexagon','Triangle','Polygon'],
        allColors: ["#FF0000", "#0000FF", "#FFFF00", "#00FF00", "#FF0080", "#01DFD7"],
        gameStarted: false,
        time: 0
    }
});

ractive.on('signIn', function(){
    var name = prompt('Enter your username to sign in','');
    ractive.set({
        userName: name,
        signedIn: true,
    });
    var level = ractive.get("level");
    for (i=0; i<levelConfig[level].shapeCount; i++) {
        ractive.set("shapesSelected." + i, "true");
    }
    for (i=0; i<levelConfig[level].shapeCount; i++) {
        ractive.set("colorsSelected." + i, "true");
    }
});

var shapes, objectsToDelete, idToDelete, levelShapes, levelColors;
var addShapeTimer, countdownTimer;
var posX, posY;

ractive.on('startGame', function(){
    console.log("Starting game")
    canvas.clear();
    var level = ractive.get("level");
    this.set("time", levelConfig[level].timeLimit);
    this.set("score", 0);
    this.toggle("gameStarted");
    shapes = [];
    objectsToDelete = [];
    idToDelete = [];
    levelShapes = ractive.get("allShapes").filter(function (shape,i) {
      return ractive.get("shapesSelected")[i]
    });
    levelColors = ractive.get("allColors").filter(function (color,i) {
        return ractive.get("colorsSelected")[i]
    });
    addShapeTimer = setTimeout(addShape, 20);
    countdownTimer = setInterval(function() {
        ractive.subtract("time");
    }, 1000
    )
})

function addShape() {
    if(shapes.length == 15) {
        // stopGame
    }
    var fillColor = levelColors[Math.floor(Math.random()*levelColors.length)];
    var shapeName = levelShapes[Math.floor(Math.random()*levelShapes.length)];
    var newShape = createShape(shapeName);
    var isValid = false;
    newShape.setLeft(canvas.width * Math.random());
    newShape.setTop(canvas.height * Math.random());
    newShape.setCoords();
    newShape.fill = fillColor;
    console.log("Shape fill", fillColor);
    console.log("Shape name", shapeName);
    while (!isValid) {
        if (newShape.isContainedWithinRect( {x:0, y:0}, {x:600 , y:600 })) {
            isValid = true;
            for (i=0; i<shapes.length; i++) {
                var isIntersecting = newShape.intersectsWithObject(shapes[i]) ||
                newShape.isContainedWithinObject(this.shapes[i]) ||
                this.shapes[i].isContainedWithinObject(newShape);
                if (isIntersecting) {
                    isValid = false;
                    break;
                }
            }
            if(isValid && shapes.length > 4) {
                var foundmatch =false;
                for (i=0; i<shapes.length; i++) {
                    if(newShape.id == shapes[i].id || newShape.fill == shapes[i].fill) {
                        foundmatch = true;
                        break;
                    }
                }
                if(!foundmatch) {
                    newShape.fill = shapes[Math.floor(Math.random()*shapes.length)].fill;
                }
            }
        }
        if (!isValid) {
            newShape.setLeft(canvas.width * Math.random());
            newShape.setTop(canvas.height * Math.random());
            newShape.setCoords();
        }
    }
    console.log(newShape);
    canvas.add(newShape);
    shapes.push(newShape);
    if(shapes.length < 5) {
        setTimeout(addShape,2000);
    }
    else if(shapes.length >= 5 && shapes.length <= 10){
        setTimeout(addShape, 1500);
    }
    else if(shapes.length > 10){
        setTimeout(addShape, 3000);
    }
}


function createShape(shapeName) {
    var newShape = null;
    switch (shapeName){
        case "Circle":
            newShape = new fabric.Circle({
                id: '1',
                hasBorders:false,
                hasControls:false,
                radius: 20,
            });
            break;
        case "Star":
            var newShape = new fabric.Polygon([
                {x: 10, y: 3},
                {x: 25, y: 18},
                {x: 40, y: 3},
                {x: 35, y: 25},
                {x: 50, y: 40},
                {x: 33, y: 40},
                {x: 25, y: 60},
                {x: 18, y: 40},
                {x: 0, y: 40},
                {x: 15, y: 25}], {
                    hasBorders:false,
                    hasControls:false,
                    id: '2',
                    angle: 180
                });
                break;
        case "Square":
            var newShape = new fabric.Rect({
                hasBorders:false,
                hasControls:false,
                id: '3',
                width: 50,
                height: 50,
                angle: 45
            });
            break;
        case "Hexagon":
            var newShape = new fabric.Polygon([
                {x: 45, y: 0},
                {x: 67.5, y: 22.5},
                {x: 67.5, y: 45},
                {x:45, y: 67.5},
                {x: 22.5, y: 45},
                {x: 22.5, y: 22.5} ], {
                    id: '4',
                    hasBorders:false,
                    hasControls:false,
                });
                break;
        case "Triangle":
            var newShape = new fabric.Polygon([
                {x: 0, y: 0},
                {x: 60, y: 0},
                {x: 30, y: 45} ], {
                    hasBorders:false,
                    hasControls:false,
                    angle:180,
                    id: '5',
                });
                break;
        case "Polygon":
            var newShape = new fabric.Polygon([
                {x: 20, y: 0},
                {x: 20, y: 25},
                {x: -20, y: 0},
                {x: -20, y: 25}], {
                    hasBorders:false,
                    hasControls:false,
                    id: '6',
                    originX: 'left',
                    originY: 'top',
                });
                break;

    }
    return newShape;
}
