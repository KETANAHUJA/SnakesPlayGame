// alert("Press Any Key To Start");
const foodsound = new Audio('food.mp3');
const gameoversound = new Audio('gameover.mp3');
const movesound = new Audio('move.mp3');
const musicsound = new Audio('music.mp3');



function init(){
	canvas = document.getElementById('mycanvas');
	W  = canvas.width = 1100;
	H  = canvas.height = 545;
	pen = canvas.getContext('2d');
	cs = 55;
	game_over = false;
	score = 2;



	//Create a Image Object for food
	food_img = new Image();
	food_img.src = "apple.png";

	trophy = new Image();
	trophy.src = "trophy.png";

	food = getRandomFood();

	snake = {
		init_len:3,
		color:"blue",
		colour:"red",
		cells:[],
		isStart:false,
		direction:"right",

		


		createSnake:function(){
			for(var i=this.init_len;i>0;i--){
				this.cells.push({x:i,y:0});
			}
		},
		drawSnake:function(){

			for(var i=0;i<this.cells.length;i++){
		    if(i==0)
		    {
		    	var borderWidth = 5;   
				var offset = borderWidth * 2;

				pen.beginPath();
				pen.fillStyle = 'black';
				pen.fillRect(this.cells[i].x*cs-borderWidth ,this.cells[i].y*cs -borderWidth , cs-3 + offset, cs-3 + offset);
				pen.fillStyle = this.colour;
				pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-3,cs-3);

                // pen.fillStyle = this.colour;
				// pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-3,cs-3);
            }
            else
            {
				pen.fillStyle = this.color;
				pen.fillRect(this.cells[i].x*cs,this.cells[i].y*cs,cs-3,cs-3);
			}
		}
	
	},
		checkCollision:function(){
			var headX = this.cells[0].x;
			var headY = this.cells[0].y;

			for(var i=1;i<this.cells.length;i++){
 				if(headX==this.cells[i].x
 					&& headY==this.cells[i].y)
 				{
 					game_over=true;
 				}
			}
		},

		updateSnake:function(){
			//console.log("updating snake according to the direction property");
			//check if the snake has eaten food, increase the length of the snake and 
			//generate new food object
			if(this.isStart===true) {

			var headX = this.cells[0].x;
			var headY = this.cells[0].y;


			if(headX==food.x && headY==food.y){
				foodsound.play();
				console.log("Food eaten");
				food = getRandomFood();
				score++;
				if(score>hiscoreval)
					{
				       hiscoreval=score;
	 				   localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
	   				   // hiscoreBox.innerHTML = " HiScore :"+hiscoreval;

		             }

			}
			else
			{
				this.cells.pop();
			}

			
			var nextX,nextY;


			if(this.direction=="right"){
				nextX = headX + 1;
				nextY = headY;
			}
			else if(this.direction=="left"){
				nextX = headX - 1;
				nextY = headY;
			}
			else if(this.direction=="down"){
				nextX = headX;
				nextY = headY + 1;
			}
			else{
				nextX = headX;
				nextY = headY - 1;
			}

			this.cells.unshift({x: nextX,y:nextY});

			/*Write a Logic that prevents snake from going out*/
			var last_x = Math.round(W/cs);
			var last_y = Math.round(H/cs);

			if(this.cells[0].y<0 || this.cells[0].x < 0 || this.cells[0].x > last_x || this.cells[0].y > last_y){
				game_over = true;
			}
		}

		}

	};

	snake.createSnake();
	//Add a Event Listener on the Document Object
	function keyPressed(e){
		snake.isStart=true;
		movesound.play();
		//Conditional Statments
		if(e.key=="ArrowRight"){
			snake.direction = "right";
		}
		else if(e.key=="ArrowLeft"){
			snake.direction = "left";
		}
		else if(e.key=="ArrowDown"){
			snake.direction = "down";
		}
		else{
			snake.direction = "up";
		}
		console.log(snake.direction);
	}


	document.addEventListener('keydown',keyPressed) ;
	
}


function draw(){
	//console.log("In Draw");

	//erase the old frame
	pen.clearRect(0,0,W,H);
	snake.drawSnake();
	musicsound.play();

	pen.fillStyle = food.color;
	pen.drawImage(food_img,food.x*cs,food.y*cs,cs,cs);

	pen.drawImage(trophy,18,20,cs,cs);
	pen.fillStyle = "blue";
	pen.font = "20px Roboto"
	pen.fillText(score,50,50);
    pen.fillText("Hi-Score : ", 80, 50);
	pen.fillText(hiscoreval,168,50);

	
}

function update(){
	//console.log("In Update");
	snake.updateSnake(); 
}

function getRandomFood(){

	var foodX = Math.round(Math.random()*(W-cs)/cs);
	var foodY = Math.round(Math.random()*(H-cs)/cs);

	var food = {
		x:foodX,
		y:foodY,
		color:"red",
	}
	return food

}

function gameloop(){
	if(game_over==true){
		musicsound.pause();
		gameoversound.play();
		clearInterval(f);
		alert("Game Over!, Refresh To Play Again ");
		return;
	}
	draw();
	update();
	snake.checkCollision();
}

let hiscore = localStorage.getItem('hiscore');
if(hiscore === null){
	hiscoreval = 0;
	localStorage.setItem("hiscore",JSON.stringify(hiscoreval));
}
else
{
	hiscoreval = JSON.parse(hiscore);
	// hiscoreBox.innerHTML = "HiScore: "+hiscore;
}

init();

document.addEventListener('keydown',snake.startNow);





var f = setInterval(gameloop,100);











