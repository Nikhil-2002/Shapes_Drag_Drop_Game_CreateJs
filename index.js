function init() {
  const stage = new createjs.Stage("MyCanvas");

  const heading = new createjs.Text(
    "👻...Drag and Drop Game...👻",
    "30px Arial",
    "Black"
  );
  heading.x = 200;
  heading.y = 5;
  stage.addChild(heading);

  const messageDisplay = new createjs.Text("", "30px Arial", "Red");
  messageDisplay.x = 660;
  messageDisplay.y = 300;
  stage.addChild(messageDisplay);

  const shapesData = [
    {
      type: "hexagon",
      color: "orange",
      correctX: 500,
      correctY: 100,
      originalX: 300,
      originalY: 100,
      attempts: 0,
    },
    {
      type: "square",
      color: "blue",
      correctX: 500,
      correctY: 250,
      originalX: 300,
      originalY: 250,
      attempts: 0,
    },
    {
      type: "triangle",
      color: "green",
      correctX: 500,
      correctY: 400,
      originalX: 300,
      originalY: 400,
      attempts: 0,
    },
    {
      type: "rectangle",
      color: "purple",
      correctX: 500,
      correctY: 520,
      originalX: 300,
      originalY: 520,
      attempts: 0,
    },
  ];

  const container = new createjs.Container();
  const dropZones = new createjs.Container();
  stage.addChild(dropZones, container);

  function createShape(type, color, x, y) {
    let shape;
    switch (type) {
      case "hexagon":
        shape = new createjs.Shape();
        shape.graphics.beginFill(color).drawPolyStar(0, 0, 50, 6, 0, -90);
        break;
      case "square":
        shape = new createjs.Shape();
        shape.graphics.beginFill(color).drawRect(-40, -40, 80, 80);
        break;
      case "triangle":
        shape = new createjs.Shape();
        shape.graphics.beginFill(color).drawPolyStar(0, 0, 60, 3, 0, -90);
        break;
      case "rectangle":
        shape = new createjs.Shape();
        shape.graphics.beginFill(color).drawRect(-50, -30, 110, 65);
        break;
    }
    shape.x = x;
    shape.y = y;
    shape.originalX = x;
    shape.originalY = y;
    shape.attempts = 0;
    return shape;
  }

  function createDropZone(type, color, x, y) {
    let zone = createShape(type, color, x, y);
    zone.alpha = 0.3;
    dropZones.addChild(zone);
    return zone;
  }

  shapesData.forEach((data) => {
    const shape = createShape(
      data.type,
      data.color,
      data.originalX,
      data.originalY
    );
    const dropZone = createDropZone(
      data.type,
      data.color,
      data.correctX,
      data.correctY
    );

    shape.on("pressmove", function (evt) {
      evt.target.x = evt.stageX;
      evt.target.y = evt.stageY;
      stage.update();
    });

    shape.on("pressup", function (evt) {
      const targetShape = evt.target;
      if (
        Math.abs(targetShape.x - data.correctX) < 50 &&
        Math.abs(targetShape.y - data.correctY) < 50
      ) {
        targetShape.x = data.correctX;
        targetShape.y = data.correctY;
        targetShape.attempts = 0;
        messageDisplay.text = "Shape placed correctly...!😃";
        messageDisplay.color = "Green";
      } else {
        targetShape.x = targetShape.originalX;
        targetShape.y = targetShape.originalY;
        targetShape.attempts += 1;
        messageDisplay.text =
          targetShape.attempts >= 3
            ? "Sorry..😥 Limit exceeded, please try again!"
            : "Incorrect placement...😑, try again!";
        messageDisplay.color = "Red";
        if (targetShape.attempts >= 3) {
          targetShape.attempts = 0;
        }
      }
      stage.update();
    });

    container.addChild(shape);
  });

  const submitBtn = new createjs.Text("Submit", "25px Arial", "Green");

  submitBtn.x = 370;
  submitBtn.y = 620;
  submitBtn.cursor = "pointer";
  submitBtn.on("click", function () {
    let allCorrect = true;
    container.children.forEach((shape, index) => {
      if (
        shape.x !== shapesData[index].correctX ||
        shape.y !== shapesData[index].correctY
      ) {
        allCorrect = false;
        shape.x = shapesData[index].originalX;
        shape.y = shapesData[index].originalY;
      }
    });

    if (allCorrect) {
      messageDisplay.text = "All shapes placed correctly..🥳";
      messageDisplay.color = "Green";
    } else {
      messageDisplay.text =
        "Some shapes are not placed correctly,😥 try again!";
      messageDisplay.color = "Red";
    }
    stage.update();
  });

  stage.addChild(submitBtn);

  createjs.Ticker.framerate = 60;
  createjs.Ticker.addEventListener("tick", stage);
}
