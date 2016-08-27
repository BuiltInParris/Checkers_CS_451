    var socket = io.connect();
	var playerColor = "";
	var turnPlayer = false;
	//var jumpFlag = false; set to true after a jump is madeif another jump can be made
    
	/* // End Game Take Piece
    var board = [[0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 1, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 2, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0]];*/

    /*// End Game No Moves
    var board = [[1, 0, 1, 0, 0, 0, 0, 0], 
                 [0, 2, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 2, 0, 2, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0]];*/


    var board = [[1, 0, 1, 0, 1, 0, 1, 0], 
                 [0, 1, 0, 1, 0, 1, 0, 1], 
                 [1, 0, 1, 0, 1, 0, 1, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 2, 0, 2, 0, 2, 0, 2], 
                 [2, 0, 2, 0, 2, 0, 2, 0], 
                 [0, 2, 0, 2, 0, 2, 0, 2]];

    var oldChecker = null;
    var JumpsArray = [];

    $( document ).ready(function() {

        function MovePiece(pieceColor, xOldLocation, yOldLocation, xNewLocation, yNewLocation)
        {
        	console.log(pieceColor);
            if(pieceColor == "black_checker.png")
            {
                pieceColor = 2;
            } 
			else if (pieceColor == "white_checker.png")
			{
                pieceColor = 1;
            }
			else if (pieceColor == "white_king.png")
			{
				pieceColor = 3;
			}
			else if (pieceColor == "black_king.png")
			{
				pieceColor = 4;
			}

			if(checkJumpMoveValid(pieceColor, xOldLocation, yOldLocation, xNewLocation, yNewLocation))
			{
				/*Remove checker from old location*/
				ModifySpace(xOldLocation, yOldLocation, 0);
				/*Remove jumped piece*/
				ModifySpace((parseInt(xOldLocation) + parseInt(xNewLocation))/2, (parseInt(yOldLocation) + parseInt(yNewLocation))/2, 0);
				/*Add checker to new location*/
				//Check if a piece should be crowned
				if((pieceColor == 2) && (yNewLocation == 1)){
					console.log("BECAME KING");
					ModifySpace(xNewLocation, yNewLocation, 4);
				} else if((pieceColor == 1)&&(yNewLocation == 8)) {
					console.log("BECAME KING");
					ModifySpace(xNewLocation, yNewLocation, 3);
				} else {
					ModifySpace(xNewLocation, yNewLocation, pieceColor);
				}
				
				while(((pieceColor == 1 || pieceColor == 2) && availableCheckerJump(xNewLocation, yNewLocation)) || ((pieceColor == 3 || pieceColor == 4) && availableKingJump(xNewLocation, yNewLocation)))
				{
					/* Returns as an array of arrays, with stored coordinates
					   Use same logic as in availableKingJump and availableCheckerJump to find those coordinates */
					// JumpsArray = getAvailableJumps();
					// Once you have those coordinates, present user with the choices (however you want to do that).
				}


				SendBoard();
				turnPlayer = !turnPlayer;
				//checkWinner();
			}

            else if(checkMoveValid(pieceColor, xOldLocation, yOldLocation, xNewLocation, yNewLocation))
            {
                /*Remove checker from old location*/
                ModifySpace(xOldLocation, yOldLocation, 0);
				//Check if a piece should be crowned
				if((pieceColor == 2) && (yNewLocation == 1)){
					console.log("BECAME KING");
					ModifySpace(xNewLocation, yNewLocation, 4);
				} else if((pieceColor == 1)&&(yNewLocation == 8)) {
					console.log("BECAME KING");
					ModifySpace(xNewLocation, yNewLocation, 3);
				} else {
					ModifySpace(xNewLocation, yNewLocation, pieceColor);
				}
				SendBoard();
				turnPlayer = !turnPlayer;
				//checkWinner();
				//console.log(turnPlayer);
            }
        }
		


        function checkMoveValid(pieceColor, xOldLocation, yOldLocation, xNewLocation, yNewLocation)
        {
			console.log(pieceColor);
			/*Check if white is making a valid move */
			var whiteCondition = ((playerColor == "White") && ((Math.abs(xOldLocation - xNewLocation) == 1 && (yOldLocation - yNewLocation == -1)) || (pieceColor == 3 && Math.abs(xOldLocation - xNewLocation) == 1 && Math.abs(yOldLocation - yNewLocation) == 1)));
			/*Check if black is making a valid move*/
			var blackCondition = ((playerColor == "Black") && ((Math.abs(xOldLocation - xNewLocation) == 1 && (yOldLocation - yNewLocation ==  1)) || (pieceColor == 4 && Math.abs(xOldLocation - xNewLocation) == 1 && Math.abs(yOldLocation - yNewLocation) == 1)));
			
			if(whiteCondition || blackCondition)
            {
                var className = ".column" + xNewLocation + ".row" + yNewLocation;
                
                //console.log($(className).attr('src'));
                if($(className).attr('src') == "")
                {
                    console.log("valid src");
                    return true;
                }
            }

            return false;
        }
		
		/*Jump check for man piece*/
		function checkJumpMoveValid(pieceColor, xOldLocation, yOldLocation, xNewLocation, yNewLocation)
		{
			console.log(pieceColor);
			/*Check if white is making a valid move */
			var whiteCondition = ((playerColor == "White") && ((Math.abs(xOldLocation - xNewLocation) == 2 && (yOldLocation - yNewLocation == -2)) || (pieceColor == 3 && Math.abs(xOldLocation - xNewLocation) == 2 && Math.abs(yOldLocation - yNewLocation) == 2)));
			/*Check if black is making a valid move*/
			var blackCondition = ((playerColor == "Black") && ((Math.abs(xOldLocation - xNewLocation) == 2 && (yOldLocation - yNewLocation ==  2)) || (pieceColor == 4 && Math.abs(xOldLocation - xNewLocation) == 2 && Math.abs(yOldLocation - yNewLocation) == 2)));
			
			if(whiteCondition || blackCondition)
            {
                var className = ".column" + xNewLocation + ".row" + yNewLocation;
				var jumpedX = (parseInt(xOldLocation) + parseInt(xNewLocation))/2;
				var jumpedY = (parseInt(yOldLocation) + parseInt(yNewLocation))/2;
                var remClassName = ".column" + jumpedX + ".row" + jumpedY;
				
				/*Booleans*/
				var whiteCap = ($(remClassName).attr('src') == "black_checker.png" && whiteCondition);
				var blackCap = ($(remClassName).attr('src') == "white_checker.png" && blackCondition);
                
				//console.log($(className).attr('src'));
				/*Make sure the space going to is blank*/
                if(($(className).attr('src') == "" && whiteCap) || ($(className).attr('src') == "" && blackCap))
                {
                    console.log("valid src");
                    return true;
                }
            }
			
			return false;
		}

		 function availableCheckerMove(x, y){
            if((x < 7 && y < 7 && board[x+1][y+1] == 0) || (x > 0 && y < 7 && board[x-1][y+1] == 0))
            {
                return true;
            }

            return false;
        }
        function availableKingMove(x, y){
            if((x < 7 && y < 7 && board[x+1][y+1] == 0) || (x > 0 && y < 7 && board[x-1][y+1] == 0) || (x < 7 && y > 0 && board[x+1][y-1] == 0) || (x > 0 && y > 0 && board[x-1][y-1] == 0))
            {
                return true;
            }
            return false;
        }
        function availableCheckerJump(x, y){
            if((x < 6 && y < 6 && isEnemyPiece(x+1, y+1) && board[x+2][y+2] == 0) || (x > 1 && y < 6 && isEnemyPiece(x-1, y+1) && board[x-2][y+2] == 0))
            {
                return true;
            }
            return f

        function availableKingJump(x, y){
            if((x < 6 && y < 6 && isEnemyPiece(x+1, y+1) && board[x+2][y+2] == 0) || (x > 1 && y < 6 && isEnemyPiece(x-1, y+1) && board[x-2][y+2] == 0) || (x < 6 && y > 1 && isEnemyPiece(x+1, y-1) && board[x+2][y-2] == 0) || (x > 1 && y > 1 && isEnemyPiece(x-1, y-1) && board[x-2][y-2] == 0))
            {
                return true;
            }
            return false;
        }

        function isEnemyPiece(x, y)
        {
        	if(playerColor == "White")
        	{
	        	if(board[x][y] == 2 || board[x][y] == 4)
	        	{
	        		return true;
	        	}
        	} else {
				if(board[x][y] == 1 || board[x][y] == 3)
	        	{
	        		return true;
	        	}
        	}
        	return false;
        }

        function checkAvailableMove(){ 
            for(x = 0; x < board.length; x++)
            {
                for(y = 0; y < board[x].length; y++)
                {
                    if(playerColor == "White")
                    {
                    	if((board[x][y] == 1 && (availableCheckerMove(x,y) || availableCheckerJump(x,y))) || (board[x][y] == 3 && (availableKingMove(x,y) || availableKingJump(x,y))))
                        {
                            console.log("TRUE AT: (" + x + ", " + y + ") = " + board[x][y]);
                            return true;
                        }
                    } else if (playerColor = "Black") {
                    	console.log("Checker move available: " + availableCheckerMove(x,y) + " - Checker jump available: " + availableCheckerJump(x,y));
                        if((board[x][y] == 2 && (availableCheckerMove(x,y) || availableCheckerJump(x,y))) || (board[x][y] == 4 && (availableKingMove(x,y) || availableKingJump(x,y))))
                        {
                            console.log("TRUE AT: (" + x + ", " + y + ") = " + board[x][y]);
                            return true;
                        }
                    }
                }
            }

            console.log("FALSE OH GEEZ.");
            return false;
        }

        function Piece(color,xlocation, ylocation) {
           this.color=color;
           this.xlocation=xlocation;
           this.ylocation=ylocation;
        }

        //checker_1 = new Piece("white", 2, 2);

        socket.on('board', function(board){
            console.log("Recieved new board");
			mirrorBoard(board);
			turnPlayer = !turnPlayer;
			console.log("Now Turn");
			if(!checkAvailableMove())
			{
				socket.emit('end_game', true);
				window.location.href = "/Loser";
			}
        });

        socket.on('game_over', function(val){
			window.location.href = "/Winner";
        });

        socket.on('disconnect', function(){
            alert("Disconnected!");
        });
		
		socket.on("White", function()
		{
			playerColor = "White";
			console.log(playerColor);
			turnPlayer = true;
		});
		
		socket.on("Black", function()
		{
			playerColor = "Black";
			console.log("Black player");
		});
		
        function mirrorBoard(new_board){
            for(i=0; i < new_board.length; i++)
            {
                row = new_board[i];
                for(j=0; j < row.length; j++)
                {
                    type_num = row[j];
                    ModifySpace(j+1, i+1, type_num);
                }
            }
        }
		
		function announceWinner(color) {
			alert(color + "Won!");
		}
		function checkWinner() {
			var numWhite = 0; // Number of white pieces left
			var numBlack = 0; // Number of black pieces left
			for(i=0; i < board.length; i++)
			{
				row = board[i];
				for(j=0; j < row.length; j++)
				{
					if(row[j] == 1)
						numWhite++;
					else if(row[j] == 2)
						numBlack++;
				}
			}
			//console.log(numBlack);
			//console.log(numWhite);
			if(numBlack == 0)
				announceWinner("white");
			else if(numWhite == 0)
				announceWinner("black");
		}
		
		//Click on a black square
        $( ".black" ).click(function() {
            if(oldChecker != null)
            {
            	console.log(oldChecker);
                var rowNum = $(this).find("img").attr('class').split(' ')[1][3];
                var colNum = $(this).find("img").attr('class').split(' ')[2][6];
                MovePiece(oldChecker[2], oldChecker[0], oldChecker[1], colNum, rowNum);
            }
			//console.log(playerColor);

            if(turnPlayer &&((playerColor == "White" &&($(this).find("img").attr('src') == "white_checker.png" ||$(this).find("img").attr('src') == "white_king.png")) ||(playerColor == "Black" &&($(this).find("img").attr('src') == "black_checker.png" ||$(this).find("img").attr('src') == "black_king.png"))))
            {
                oldChecker = [$(this).find("img").attr('class').split(' ')[2][6], $(this).find("img").attr('class').split(' ')[1][3], $(this).find("img").attr('src')];
                //console.log($(this).find("img").attr('src'));
            } else {
                oldChecker = null;
            }
        });

        function ModifySpace(x, y, i)
        {
            var className = ".column" + x + ".row" + y;
			
            if(i == 0){
                $(className).attr("src","");
            } else if(i == 1){
                $(className).attr("src","white_checker.png");
            } else if(i == 2) {
                $(className).attr("src","black_checker.png");
            } else if(i == 3) {
                $(className).attr("src","white_king.png");
            } else if(i == 4) {
                $(className).attr("src","black_king.png");
            }
			
			//console.log("x: " + x + "  y: " + y);
			board[y - 1][x - 1] = i;
        }

        mirrorBoard(board);
    });

    function SendBoard()
    {
		console.log("Sending board");
        socket.emit('move', board);
    }