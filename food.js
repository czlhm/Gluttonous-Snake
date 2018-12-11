/**
 * Created by 彭林 on 2017/9/9.
 */
(function (window) {
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