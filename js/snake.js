/*
 * Snake game in canvas
 *
 */
 
var DIRECTION = {
  LEFT : 1, 
  RIGHT: 2, 
  UP : 3,
  DOWN : 4
};

var message = null;

var config = {
	snakeDirection : DIRECTION.RIGHT,
	squareSize: 10,
	speed : 1000,
	snakeColor: "red",
	mealColor : "green",
	throughTheWalls : false,
}



function Meal(canvasWidth,canvasHeight) {
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;    
	
	this.changePosition = function(snake){
		var squareWidth = this.canvasWidth / config.squareSize ;
		var squareHeight = this.canvasHeight / config.squareSize ;
		
		var randX = Math.floor(Math.random() * squareWidth);
		var randY = Math.floor(Math.random() * squareHeight);
		
		while(!this.checkMeal(snake,randX,randY)){
			randX = Math.floor(Math.random() * squareWidth);
			randY = Math.floor(Math.random() * squareHeight);
			
		}

		
		this.x = randX;
		this.y = randY;
	}	
	
	this.checkMeal = function(snake,x,y){
		for (var i in this.snakeBody){
	
			if (head.x == x && head.y == y){
				return false;
			}			
		}
		return true;
	}
}

function SnakeElement(x,y) {
    this.x = x;
    this.y = y;
}


function Snake(canvas,ctx) {
	
	this.canvas = canvas;
	this.ctx = ctx;
	this.snakeBody = []; 
	this.snakeDirection = DIRECTION.RIGHT;
	this.meal ;
	this.points = 0 ;
	
	
	this.init = function(meal){
		var squareWidth = this.canvas.width / config.squareSize ;
		var squareHeight = this.canvas.width / config.squareSize ;
		
		var headPositionX = Math.round(squareWidth / 2);
		var headPositionY = Math.round(squareHeight / 2);
		
		this.snakeBody.push(new SnakeElement(headPositionX,headPositionY));
		this.snakeBody.push(new SnakeElement(headPositionX-1,headPositionY));		
		this.snakeBody.push(new SnakeElement(headPositionX-2,headPositionY));
		



		
		this.meal = meal;
		
	}
    this.move = function () {
		
		var head = this.snakeBody[0];
		
		var newX = head.x;
		var newY = head.y;
		
		
        switch(this.snakeDirection){
			case DIRECTION.LEFT:
				newX--;
			break;
			case DIRECTION.RIGHT:
				newX++;
			break;
			case DIRECTION.UP:
				newY--;
			break;
			case DIRECTION.DOWN:
				newY++;
			break;			
		}
		
		this.snakeBody.unshift(new SnakeElement(newX,newY));
		if (!(head.x == this.meal.x && head.y == this.meal.y)){
			this.snakeBody.pop();			
		}
		else {
			this.points+=100;
			this.meal.changePosition(this);
		}

    };
	this.checkColision = function(){
		var squareWidth = this.canvas.width / config.squareSize ;
		var squareHeight = this.canvas.height / config.squareSize ;
		var head = this.snakeBody[0];
		return this.checkWalls(squareWidth, squareHeight, head)
			    || this.checkSnakeBody(head);
		
	}
	
	this.checkWalls = function(width, height, head){
		if (config.throughTheWalls){
			if (head.x >= width){
				head.x = 0;
				return false;
			}
			if (head.x < 0){
				head.x = width;
				return false;
			}
			if (head.y >= height){
				head.y = 0
				return false;
			}
			if (head.y < 0){
				head.y = height;
				return false;
			}			
		}

		if (head.x >= width || head.x < 0 || head.y >= height || head.y < 0){
			return true;
		}
		return false;
				
	}
	this.checkSnakeBody = function( head){
		

		
		for (var i in this.snakeBody){
			if (head.x == this.snakeBody[i].x && head.y == this.snakeBody[i].y && 0 != i){
				console.log(this.snakeBody);
				console.log(head);
				return true;
			}			
		}
		return false;
				
	}

}

function clear(canvas,ctx){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function addSquare(canvas,ctx,x,y,color){
	
	rect_pixel_x = x * config.squareSize;
	rect_pixel_y = y * config.squareSize;
	
	ctx.beginPath();
	ctx.rect(
		rect_pixel_x,
		rect_pixel_y,
		config.squareSize,
		config.squareSize
	);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'black';
 	ctx.stroke();
}

$(function(){
	
	$(".start").click(function(){
		
		config.speed = $("#speed").val();
		config.throughTheWalls = $("#troughtwall").is(':checked');
		
		$("#controls").hide();
		startGame(function(message){

		})
	
	});

});



function startGame(callback){
	var canvas = document.getElementById("snake_board");
	var ctx =  canvas.getContext("2d");
	
	var meal = new Meal(canvas.width,canvas.height);
	
	var snake = new Snake(canvas, ctx);
	
	meal.changePosition(snake);
	
	snake.init(meal);
	
	var gameLoop = setInterval(gameLoop,config.speed);
	
	
	window.addEventListener('keydown', function (e) {
		var head = snake.snakeBody[0];
		var beforeHead = snake.snakeBody[1];
		
		console.log(e.keyCode) 
		if (e.keyCode == 37 || e.keyCode == 65) {
			if (head.x - 1 != beforeHead.x && head.y != beforeHead.y)
				snake.snakeDirection = DIRECTION.LEFT; 
		}
		if (e.keyCode == 39 || e.keyCode == 68) {
			if (head.x + 1 != beforeHead.x && head.y != beforeHead.y) 
				snake.snakeDirection = DIRECTION.RIGHT; 
		}
		if (e.keyCode == 38 || e.keyCode == 87) {
			if (head.x != beforeHead.x && head.y - 1 != beforeHead.y)
				snake.snakeDirection = DIRECTION.UP;
		}
		if (e.keyCode == 40 || e.keyCode == 83) { 
			if (head.x != beforeHead.x && head.y - 1 != beforeHead.y)
				snake.snakeDirection = DIRECTION.DOWN; 
			}
		
		//console.log(this.snakeDirection);
    })
	function gameLoop(){
		clear(canvas,ctx);
		
		snake.move();
		for (var element in snake.snakeBody){
			addSquare(
				canvas,
				ctx,
				snake.snakeBody[element].x,
				snake.snakeBody[element].y,
				config.snakeColor
			);				
		}
		
		addSquare(
			canvas,
			ctx,
			meal.x,
			meal.y,
			config.mealColor
		);
		
		if (snake.checkColision()){
			clearInterval(gameLoop);
			var message = "<strong>Gratulacje</strong>, udało ci się zdobyć "+snake.points+" punktów!";
			$("#controls").show();
			$(".message").show();
			$(".message").html(message);
		}
		
	}
}
