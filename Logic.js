    var socket = io.connect();
	var playerColor = "";
	var turnPlayer = false;
	//var jumpFlag = false; set to true after a jump is madeif another jump can be made
    var board = [[1, 0, 1, 0, 1, 0, 1, 0], 
                 [0, 1, 0, 1, 0, 1, 0, 1], 
                 [1, 0, 1, 0, 1, 0, 1, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 0, 0, 0, 0, 0, 0, 0], 
                 [0, 2, 0, 2, 0, 2, 0, 2], 
                 [2, 0, 2, 0, 2, 0, 2, 0], 
                 [0, 2, 0, 2, 0, 2, 0, 2]];

    var oldChecker = [];

    $( document ).ready(function() {

        function MovePiece(pieceColor, xOldLocation, yOldLocation, xNewLocation, yNewLocation)
        {
            if(pieceColor == "black_checker.png")
            {
                pieceColor = 2;
            } else {
                pieceColor = 1;
            }

            if(checkMoveValid(xOldLocation, yOldLocation, xNewLocation, yNewLocation))
            {
                //Remove checker from old location
                ModifySpace(xOldLocation, yOldLocation, 0);
                //Add checker to new location
                ModifySpace(xNewLocation, yNewLocation, pieceColor);
				SendBoard();
				turnPlayer = !turnPlayer;
				console.log(turnPlayer);
				
            }
        }
		
		/*Valid Move Black
		function checkMoveValid(xOldLocation, yOldlocation, xNewLocation, yNewLocatoin)
		{
			if((xOldLocation - xNewLocation) <= 1 && (yOldLocation - yNewLocation) <= 1)
		
		*/

		//This is how king moves work
        function checkMoveValid(xOldLocation, yOldLocation, xNewLocation, yNewLocation)
        {
			//White Move
			if((playerColor == "White") && (Math.abs(xOldLocation - xNewLocation) <= 1 && (yOldLocation - yNewLocation <= -1)))
            {
                var className = ".column" + xNewLocation + ".row" + yNewLocation;
                
                //console.log($(className).attr('src'));
                if($(className).attr('src') == "")
                {
                    console.log("valid src");
                    return true;
                }
            }
			
			//Black Move
			else if((playerColor == "Black") && (Math.abs(xOldLocation - xNewLocation) == 1 && (yOldLocation - yNewLocation == 1)))
            {
                var className = ".column" + xNewLocation + ".row" + yNewLocation;
                
                //console.log($(className).attr('src'));
                if($(className).attr('src') == "")
                {
                    console.log("valid src");
                    return true;
                }
            }
			
            /*King move
            if(Math.abs(xOldLocation - xNewLocation) <= 1 && Math.abs(yOldLocation - yNewLocation) <= 1)
            {
                var className = ".column" + xNewLocation + ".row" + yNewLocation;
                
                //console.log($(className).attr('src'));
                if($(className).attr('src') == "")
                {
                    console.log("valid src");
                    return true;
                }
            }
			*/
            return false;
        }
		
		//Jump moves for normal Men
		function checkJumpMoveValid(xOldLocation, yOldLocation, xNewLocation, yNewLocation)
		{
			//White Move
			if((playerColor == "White") && (Math.abs(xOldLocation - xNewLocation) == 2 && (yOldLocation - yNewLocation == -2)))
            {
                var className = ".column" + xNewLocation + ".row" + yNewLocation;
                
                //console.log($(className).attr('src'));
                if($(className).attr('src') == "")
                {
                    console.log("valid src");
                    return true;
                }
            }
			
			//Black Move
			else if((playerColor == "Black") && (Math.abs(xOldLocation - xNewLocation) == 2 && (yOldLocation - yNewLocation == 2)))
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

        function Piece(color,xlocation, ylocation)
        {
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
		
		//Click on a black square
        $( ".black" ).click(function() {
            if(oldChecker != null)
            {
                var rowNum = $(this).find("img").attr('class').split(' ')[1][3];
                var colNum = $(this).find("img").attr('class').split(' ')[2][6];
                MovePiece(oldChecker[2], oldChecker[0], oldChecker[1], colNum, rowNum);
            }
			//console.log(playerColor);

            if((($(this).find("img").attr('src') == "white_checker.png" && playerColor == "White") || ($(this).find("img").attr('src') == "black_checker.png" && playerColor == "Black")) && turnPlayer)
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
			
            if(i == 0)
            {
                $(className).attr("src","");
            } else if(i == 1)
            {
                $(className).attr("src","white_checker.png");
            } else if(i == 2) {
                $(className).attr("src","black_checker.png");
            }
			
			//console.log(board[x - 1][y - 1]);
			board[y - 1][x - 1] = i;
        }

        mirrorBoard(board);
    });

    function SendBoard()
    {
		console.log("Sending board");
        socket.emit('move', board);
    }