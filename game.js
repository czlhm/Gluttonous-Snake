/**
 * Created by 彭林 on 2017/9/9.
 */
//游戏对象
(function (window) {
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