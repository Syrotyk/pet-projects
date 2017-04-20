/*
 * v5.2  перерисовка контекстов по запуску лототрона и остановка
 * 
 */
;(function(){

	function lotoTron() {	
		var imgZone = document.getElementById("img_zone");
		var gameTypeSelect = document.getElementById("game_type");
		var gameZone = document.getElementById("game_zone");
		var trones = gameZone.getElementsByTagName("CANVAS");
		var imgs = document.getElementsByTagName("IMG"); // 
		var result = document.getElementById("result");
		var form = document.getElementById("choiceForm");
		var startTrigger = false;	
		var intervalId = [];
		var changingTimer = [];
		var contextsBuffer = [];
		var drawCoords = [];
	
		function makeCanvas(id, width, height) {
			var canvas = document.createElement("canvas");
			canvas.id = id;
			canvas.width = width;
			canvas.height = height;
			return canvas;
		}

		function makeImg(id, src) {
			var img = new Image();
			img.id = id;
			img.src = src;
			return img;
		}

		lotoTron.initGame = function() {
			var gameType = gameTypeSelect.value;
			var img	= makeImg(i, "sprite.png");
		
			for (var i = imgZone.childNodes.length -1; i >= 0; i--) {
				imgZone.childNodes[i].remove();
			}	

			for (var i = gameZone.childNodes.length -1; i >= 0; i--) {
				gameZone.childNodes[i].remove();
			}
		
			imgZone.appendChild(img);

			for (var i = 1; i <= gameType; i++) {		
				var canId = i + '_tron'; 
				var canvas = makeCanvas(canId, 180, 180);	
				gameZone.appendChild(canvas);
			}

			// прорисовка лототрона
			for (var i = 0; i < trones.length; i++) {
				contextsBuffer[i] = trones[i].getContext("2d");
				contextsBuffer[i].lineWidth = 2;
				contextsBuffer[i].strokeStyle = "black";
				contextsBuffer[i].rotate(0*Math.PI/180);	
				contextsBuffer[i].translate(5,5);
		
				var start_gradient = contextsBuffer[i].createLinearGradient(0,0,170,0);
					start_gradient.addColorStop(0,"black");
					start_gradient.addColorStop("0.3","magenta");
					start_gradient.addColorStop("0.5","blue");
					start_gradient.addColorStop("0.6","green");
					start_gradient.addColorStop("0.8","yellow");
					start_gradient.addColorStop(1,"red");
		
				contextsBuffer[i].font="30px Verdana";
				contextsBuffer[i].fillStyle = start_gradient;
				contextsBuffer[i].fillText("let `s play",10,50);
			} // ./ contexts 

		}

		lotoTron.startStop = function() {
			if (startTrigger == false) {
				startImgChange(); 
				startTrigger = true;		
				setTimeout(function() {
					stopImgChange(); 
					startTrigger = false;
				}, 2000);
			}
			else return;
		}

		function startImgChange() { 
	     	result.classList.remove('show-win');
	     	result.classList.remove('show-lose');
	     	result.style.display = 'none';				

			var gameType = gameTypeSelect.value; 
			
			for (var i = 0; i < gameType; i++) {	
				drawCoords[i] = getStartDrawPosition(i);
			}

			// перерисовка в канвасе с заданой периодичностью
			intervalId = window.setInterval(function() {	
				for (var i = 0 ; i < contextsBuffer.length ; i++) {							
					contextsBuffer[i].clearRect(0, 0, 600, 400);
					contextsBuffer[i].drawImage(imgs[0], drawCoords[i].x, drawCoords[i].y, 150, 150, 10, 10, 150, 150);
				}   
			},200);	
		}

		function stopImgChange() {	
			for (var timerId = 0; timerId < changingTimer.length; timerId++) {
				clearInterval(changingTimer[timerId]);
			}

			clearInterval(intervalId);						
			setTimeout(checkResult(), 200); 
		}
	
		// смена координат отрисовки
		function getStartDrawPosition(timerId) {
			var position = {};
			var getRandomInt;
		
			position.x = 0;		
		
			changingTimer[timerId] = setInterval(function() {
				getRandomInt = Math.round(Math.random() * 300) + 0;								
				position.y = getRandomInt; 					
			}, 201);	

			return position;
		}
		//  кнопка/и контроля

		//TODO переделать проверку результата
		function checkResult() { 
			var gameType = gameTypeSelect.value;
			var value = form.options.value;
	
			switch (gameType) {
				
				case '1': {  				
					if ((drawCoords[0].y > value ) && (drawCoords[0].y <= (value + 149))) {
						result.style.display = 'block';
						result.classList.add('show-win');
						initResult("wrapper", "You WIN", true);
					} else { 
						result.style.display = 'block';			
						result.classList.add('show-lose');
						initResult("wrapper", "You LOSE", false);
					}
				    break;
				}
				case '2': {
					if (((drawCoords[0].y + 75 ) <= drawCoords[1].y) || ((drawCoords[1].y + 75) <= drawCoords[0].y)) {				 
				    	result.style.display = 'block';
						result.classList.add('show-win');
						initResult("wrapper", "You WIN", true);
					} else { 
						result.style.display = 'block';
						result.classList.add('show-lose');
						initResult("wrapper", "You LOSE", false);
					}
					break;
				}
				case '3': {
					if  ((((drawCoords[0].y + 75) <= drawCoords[1].y) 
					  &&  ((drawCoords[1].y + 75) <= drawCoords[2].y))
					  || (((drawCoords[2].y + 75) <= drawCoords[1].y)
					  &&  ((drawCoords[1].y + 75) <= drawCoords[0].y))) {
				    	result.style.display = 'block';
						result.classList.add('show-win');
						initResult("wrapper", "You WIN", true);
					} else { 
						result.style.display = 'block';
						result.classList.add('show-lose');
						initResult("wrapper", "You LOSE", false);
					}
				    break;	
				}
				 default:
				 		style.display = 'block';
						result.classList.add('show-lose');
						initResult("wrapper", "Smth WRONG", false);;
			}	
		} // ./ checkResult

		function initResult(elem,text,res) {
			var resultContext = result.getContext("2d");
			var win_gradient = resultContext.createLinearGradient(0,0,180,0);
				win_gradient.addColorStop(0,"black");
				win_gradient.addColorStop("0.3","magenta");
				win_gradient.addColorStop("0.5","blue");
				win_gradient.addColorStop("0.6","green");
				win_gradient.addColorStop("0.8","yellow");
				win_gradient.addColorStop(1,"red");
			var lose_gradient = resultContext.createLinearGradient(0,0,180,0);
				lose_gradient.addColorStop(0, "#ff3333");
				lose_gradient.addColorStop("0.4","#ff5c33");
				lose_gradient.addColorStop("0.8","#ff9933");
				lose_gradient.addColorStop(1,"#ff9900");
			resultContext.font="30px Verdana";
			resultContext.textAlign="center";
			resultContext.textBaseline="middle";

			if (res) { 
				resultContext.fillStyle = win_gradient;
			} else {
				resultContext.fillStyle = lose_gradient;
			} 

			resultContext.clearRect(0,0,180,180);
			resultContext.fillText(text,90,35);
		}
	} // ./ lotoTron

	window.addEventListener("DOMContentLoaded", function(){	

		lotoTron();
		lotoTron.initGame();

		var	gameSelect = document.forms[0].gameOptions;
		gameSelect.addEventListener("change", lotoTron.initGame);

		var startStopBtn = document.getElementById("on-off");
		startStopBtn.addEventListener("mousedown", lotoTron.startStop);
	});

})();



	
	
