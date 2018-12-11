/**
 * Created by 彭林 on 2017/9/9.
 */
(function (window) {
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