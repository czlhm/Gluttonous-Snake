/**
 * Created by 彭林 on 2017/9/9.
 */
;(function (window) {
  //声明一个数组，用来保存食物的div
  var eles = [];

  //1.创建食物的构造函数
  function Food(x,y,width,height,color){
    this.x = x ||0;
    this.y = y ||0;
    this.width = width || 20;
    this.height = height || 20;
    this.color = color || "green";
  }

  //2.因为每一个食物都要显示在地图上，所以这个显示食物的方法，就写成原型方法。
  Food.prototype.render = function (map) {
    //渲染新食物之前，应该把原来的食物给删掉。
    remove();

    this.x = Math.floor(Math.random() * map.offsetWidth / this.width) * this.width;
    this.y = Math.floor(Math.random() * map.offsetHeight / this.height) * this.height;
    //想要让食物显示在地图上，就可以创建一个div，让这个div拥有这个食物所有的属性样式。
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.left = this.x + "px";
    div.style.top = this.y + "px";
    div.style.width = this.width + "px";
    div.style.height = this.height + "px";
    div.style.backgroundColor = this.color;
    //把这个div装进那个map中
    map.appendChild(div);

    //把这个食物的div给保存进那个eles数组中
    eles.push(div);
  }


  //删掉食物的方法 - 私有方法
  function remove(){
    for(var i = eles.length-1;i >=0;i--){
      eles[i].parentNode.removeChild(eles[i]);
      eles.pop();
    }
  }


  //因为这里是我一个沙盒，要把这个构造函数暴露外面去。
  window.Food = Food;
}(window));




//--------------------------------------------------------
//蛇
;(function (window) {
  //声明一个数组，用来保存蛇显示的的那些个div
  var eles = [];

  var arrColor = ["skyblue","green","pink","orange","greenyellow"];

  //1.创建蛇的构造函数
  function Snake(width,height,direction){
    this.width = width || 20;  //如果没有指定蛇的每一节的宽高，就要保证宽高和食物一致。
    this.height = height || 20;
    this.direction = direction || "right"; //蛇默认向右移动
    //蛇身体 - 最开始蛇身体你有三节。
    //每一节应该是一个对象，因为每一节都有x，y和color
    //数组的第一个元素是蛇头
    this.body = [
      {x:3,y:1,color:"red"},
      {x:2,y:1,color:"greenyellow"},
      {x:1,y:1,color:"skyblue"}
    ];
  }

  //2.让蛇显示在map上。
  Snake.prototype.render = function (map) {
    //显示蛇之前，把之前的蛇给删掉
    remove();

    //蛇的每一节都要显示。找到蛇的每一节。
    for(var i = 0 ; i < this.body.length; i++){
      var unit = this.body[i]; //这里unit就是蛇的每一节。
      //创建div，让div拥有这个蛇的每一节的属性样式。
      var div = document.createElement("div");
      div.style.position = "absolute";
      div.style.left = unit.x * this.width + "px";
      div.style.top = unit.y * this.height + "px";
      div.style.width = this.width + "px";
      div.style.height = this.height + "px";
      div.style.backgroundColor = unit.color;
      //要把div假如到map中
      map.appendChild(div);

      //把这个div装进eles数组中
      eles.push(div);
    }
  }

  //4.删掉蛇的方法。
  function remove(){
    //找到那些div，让他们的父亲map，移除掉他们。
    for(var i = eles.length-1; i>=0; i--){
      eles[i].parentNode.removeChild(eles[i]);
      //把数组中保存的div给删掉
      eles.pop();
    }
  }



  //3.蛇移动的方法
  Snake.prototype.move = function (food,map) {
    //移动蛇身体(不包含蛇头)
    var i = this.body.length-1;
    //蛇中间部分可以给蛇尾巴，蛇头可以给蛇中间部分。
    for(;i>0;i--){
      this.body[i].x = this.body[i-1].x;
      this.body[i].y = this.body[i-1].y;
    }
    //蛇头也要移动-蛇头是根据方向移动的。
    switch(this.direction){
      case  "right":
        this.body[0].x += 1;
        break;
      case  "left":
        this.body[0].x -= 1;
        break;
      case  "top":
        this.body[0].y -= 1;
        break;
      case  "bottom":
        this.body[0].y += 1;
        break;
    }

    //蛇移动的时候，判断蛇有没有吃到食物。-蛇头的坐标和食物的坐标重合了就表示蛇吃到了食物。
    var foodX = food.x;
    var foodY = food.y;
    var headX = this.body[0].x * this.width;
    var headY = this.body[0].y * this.height;
    if(headX === foodX && headY === foodY){
      //吃到食物了就应该长一节身体。
      var obj = this.body[this.body.length-1];
      this.body.push({
        x:obj.x,
        y:obj.y,
        color:arrColor[Math.floor(Math.random()* (arrColor.length-1))]
      });
      //食物吃掉了，就应该重新的再创建一个食物。
      food.render(map);
    }

  }

  window.Snake = Snake;
}(window));


//-------------------------------------------
//游戏对象
;(function (window) {
  var that = null; //声明一个变量that,用来保存用Game构造函数创建出来的game对象。

  //1.游戏对象  构造函数
  function Game(map){
    this.food = new Food();
    this.snake = new Snake();
    this.map = map;
    that = this; //在构造函数里面，this就是创建出来的那个game对象。
  }

  //2.游戏开始的方法
  Game.prototype.start = function () {
    //让食物和蛇显示出来。
    this.food.render(this.map);
    this.snake.render(this.map);

    // //验证让蛇移动一下
    // this.snake.move();
    // this.snake.render(this.map);

    //让蛇自动移动起来。
    runSnake();

    //调用方法bindKey.获取按的键，从而改变蛇的移动方向
    bindKey();
  }


  //3.写一个函数，让蛇自动移动-私有方法
  function runSnake(){
    //计时器是window调用的，所以setInterval里面的this就是window，而window对象里面没有蛇对象。所以报错了。
    //我们的目的是拿到蛇，让蛇移动。 蛇在game对象里，所以我们在调用计时器的时候，应该要改变这个setInterval函数里面的this.
    var timerID = setInterval(function () {
      //console.log(this); //window
      //console.log(this.snake); //undefiend
      //this.snake.move(); //报错
      //this.snake.render(this.map);

      //这里的this就是那个game对象。
      this.snake.move(this.food,this.map);
      this.snake.render(this.map);


      //判断蛇有没有撞到墙。
      var mapX = this.map.offsetWidth / this.snake.width;
      var mapY = this.map.offsetHeight / this.snake.height;
      var headX = this.snake.body[0].x;
      var headY = this.snake.body[0].y;
      if(headX >= mapX || headY >= mapY){
        //结束游戏
        alert("Game Over!");
        clearInterval(timerID);
      }
      if(headX < 0 || headY < 0){
        //结束游戏
        alert("Game Over!");
        clearInterval(timerID);
      }

    }.bind(that),200);
  }


  //4.写一个方法，获取按键，从而改变蛇的移动方向。
  function bindKey(){
    document.addEventListener("keydown", function (e) {
      e = e || window.event;
      //获取按键
      //console.log(e.keyCode); //37 left  38 top  39right 40bottom
      switch(e.keyCode){
        case 37:
          this.snake.direction = "left";
          break;
        case 38:
          this.snake.direction = "top";
          break;
        case 39:
          this.snake.direction = "right";
          break;
        case 40:
          this.snake.direction = "bottom";
          break;
      }

    }.bind(that),false);
  }


  //把Game构造函数给暴露出去
  window.Game = Game;
}(window));