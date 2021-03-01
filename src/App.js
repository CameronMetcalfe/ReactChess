import React from 'react';
import './App.css';

class Piece {
	constructor(board, colour, position, pieceType, component) { 
		this.board = board; //READ ONLY
		this.colour = colour;
		this.position = position; //tuple of form [x, y] ===> x is this.position[0]
		this.pieceType = pieceType;
		this.component = component;
	}

	//Note: behaviour is undefined if the new location isn't in a straight line from the existing one; knights will have a custom isBlocked to deal with this 
	isBlocked(x, y, canCapture = true) {
		const oldX = this.position[0];
		const oldY = this.position[1];
		let xIncrement = Math.sign(x - oldX);
		let yIncrement = Math.sign(y - oldY);
		let checkBoard = this.board.state.squares;

		var curX, curY;
		for (curX = oldX + xIncrement, curY = oldY + yIncrement; curX !== x || curY !== y; curX += xIncrement, curY += yIncrement) { //the ugliest for loop header I've ever written
			console.log("checking: [" + curY + ", " + curX + "]");
			console.log(checkBoard[curY][curX]);
			console.log(checkBoard);
			if (checkBoard[curY][curX]) {
				console.log("found something");
				return true;
			}
		}

		//now check final space
		if(!checkBoard[y][x]) { //new spot is empty
			return false;
		} else {
			return !canCapture || (checkBoard[y][x].colour === this.colour); //return true if can't capture or piece occupying the space is of the same colour as piece being moved
		}
	}

	//This method must be overided in each individual piece with the logic for validating moves by that type of piece
	valid(x, y) {
		console.log("piece valid");
		return true;
	}

	render() {
		if (this.state === null) {
			return "null";
		}
		let source = process.env.PUBLIC_URL + '/pieces/' + this.state.colour + '/' + this.state.pieceType + '.png'
		return (
			<img src={source} alt="chess piece"/>
		);
	}
}

class Pawn extends Piece {
	constructor(board, colour, position, component) {
		super(board, colour, position, "pawn", component);
		//this.canEnPassant = false;
	}

	validW(x, y) {
		const oldX = this.position[0];
		const oldY = this.position[1];

		if (oldY - y === 2 && oldY === 6 && x === oldX) {
			return true;
		} else if (oldY - y === 1) {
			if (x === oldX) {
				return !this.isBlocked(x, y, false);
			} else if (Math.abs(x - oldX) === 1 && this.board.state.squares[y][x]) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	validB(x, y) {
		const oldX = this.position[0];
		const oldY = this.position[1];

		if (y - oldY === 2 && oldY === 1 && x === oldX) {
			return true;
		} else if (y - oldY === 1) {
			if (x === oldX) {
				return !this.isBlocked(x, y, false);
			} else if (Math.abs(x - oldX) === 1 && this.board.state.squares[y][x]) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	valid(x, y) {
		return this.colour === 'w' ? this.validW(x, y) : this.validB(x, y);
	}
}

class Bishop extends Piece {
	constructor(board, colour, position, component) {
		super(board, colour, position, "bishop", component);
	}

	valid(x, y) {
		const oldX = this.position[0];
		const oldY = this.position[1];

		const validMove = x - y === oldX - oldY || x + y === oldX + oldY; //should this be in parentheses?
		return validMove && !this.isBlocked(x, y);
	}
}

class Knight extends Piece {
	constructor(board, colour, position, component) {
		super(board, colour, position, "knight", component);
	}

	isBlocked(x, y) { //parameters exist to ensure proper override
		let checkBoard = this.board.state.squares;
		if(!checkBoard[y][x]) { //new spot is empty
			return false;
		} else {
			return checkBoard[y][x].colour === this.colour; //return true if the piece occupying the space is of the same colour as piece being moved
		}
	}

	valid (x, y) { //TODO: make it so you can't capture your own pieces
		const xDif = Math.abs(x - this.position[0]);
		const yDif = Math.abs(y - this.position[1]);

		const validMove = (xDif === 2 && yDif === 1) || (xDif === 1 && yDif === 2);
		return validMove && !this.isBlocked(x, y);
	}
}

class Rook extends Piece {
	constructor(board, colour, position, component) {
		super(board, colour, position, "rook", component);
	}

	valid(x, y) {
		const oldX = this.position[0];
		const oldY = this.position[1];

		const validMove = x === oldX || y === oldY;
		return validMove && !this.isBlocked(x, y);
	}
}

class Queen extends Piece {
	constructor(board, colour, position, component) {
		super(board, colour, position, "queen", component);
	}

	valid(x, y) {
		const oldX = this.position[0];
		const oldY = this.position[1];

		const validMove = x - y === oldX - oldY || x+y === oldX + oldY || x === oldX || y === oldY;
		return validMove && !this.isBlocked(x, y);
	}
}

class King extends Piece {
	constructor(board, colour, position, component) {
		super(board, colour, position, "king", component);
	}

	valid(x, y) {
		const xDif = Math.abs(x - this.position[0]);
		const yDif = Math.abs(y - this.position[1]);

		const validMove = xDif < 2 && yDif < 2 && !(xDif === 0 && yDif === 0);
		return validMove && !this.isBlocked(x, y);
	}
}

function Square(props) {
	let squareClasses = 'square ' + (props.w ? 'w' : 'b')
	return (
		<button className={squareClasses} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {endGame: ""};
	}

	handleVictory = (victor) => { 
		this.setState({endGame: "Game ended"});
	}

	reload = () => {
		window.location.reload();
	}

	render() {
		//should add active class to end-game for styling
		return (
			<div className="game">
				<Board handleVictory={this.handleVictory}/>
				<div className="end-game">
					<span>{this.state.endGame}</span>
					<button onClick={this.reload}>Replay</button>
				</div>
			</div>
		);
	}
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.childKey = 0;
		this.state = {
			squares: Array(8).fill(Array(8).fill(null)),
			wNext: true,
			selectedPiece: null
		};
	}

	componentDidMount() {
		this.setBoard();
	}

	setMainRow(squares, row, colour) {
		squares[row][0] = new Rook(this, colour, [0, row], <PieceComponent colour={colour} pieceType="rook"/>);
		squares[row][1] = new Knight(this, colour, [1, row], <PieceComponent colour={colour} pieceType="knight"/>);
		squares[row][2] = new Bishop(this, colour, [2, row], <PieceComponent colour={colour} pieceType="bishop"/>);
		squares[row][3] = new Queen(this, colour, [3, row], <PieceComponent colour={colour} pieceType="queen"/>);
		squares[row][4] = new King(this, colour, [4, row], <PieceComponent colour={colour} pieceType="king"/>); 
		squares[row][5] = new Bishop(this, colour, [5, row], <PieceComponent colour={colour} pieceType="bishop"/>);
		squares[row][6] = new Knight(this, colour, [6, row], <PieceComponent colour={colour} pieceType="knight"/>);
		squares[row][7] = new Rook(this, colour, [7, row], <PieceComponent colour={colour} pieceType="rook"/>);
	}

	setBoard() {
		var newSquares = this.state.squares.map(function (arr) {
			return arr.slice();
		});
		
		this.setMainRow(newSquares, 0, 'b');
		for (let i = 0; i < 8; i++) {
			newSquares[1][i] = new Pawn(this, 'b', [i, 1], <PieceComponent colour='b' pieceType="pawn"/>);
			newSquares[6][i] = new Pawn(this, 'w', [i, 6], <PieceComponent colour='w' pieceType="pawn"/>);
		}
		this.setMainRow(newSquares, 7, 'w');

		this.setState({squares: newSquares});
	}

	movePiece(piece, x, y) {
		var newSquares = this.state.squares.map(function (arr) { //should move into it's own function
			return arr.slice();
		});

		newSquares[piece.position[1]][piece.position[0]] = null; //removes piece from old location
		if (newSquares[y][x]?.pieceType === "king") {
			this.props.handleVictory(newSquares[y][x] === "w" ? "White" : "Black");
		}
		newSquares[y][x] = piece;
		piece.position = [x, y];
		this.setState({squares: newSquares});
	}

	//@params: coordinates of the square
	handleClick(x, y) { 
		let piece = this.state.squares[y][x] //hope this still refers to board
		if (this.state.selectedPiece) { //piece already selected, so move it
			if ((this.state.selectedPiece.colour === 'w') === this.state.wNext && this.state.selectedPiece.valid(x, y)) {
				this.movePiece(this.state.selectedPiece, x, y);
				this.setState({wNext: !this.state.wNext});
			}
			this.setState({selectedPiece: null}); //deselect piece after movement / if movement isn't valid
		} else if (piece) { //no piece selected, but there's a piece in the clicked square, so select it
			//select piece
			this.setState({selectedPiece: piece});
			console.log(piece);
		} else { //no piece selected: do nothing
			console.log("there's nothing here")
			return;
		}
	}

	renderSquare(hello, piece, x, y) {
		let content = piece ? piece : "";
		return (
			<Square 
				w={hello}
				value={content}
				onClick={() => this.handleClick(x, y)}
			/>
		);
	}

	render() {
		++this.childKey;
		var rows = [];
		for (let i = 0; i < 8; i++) {
			var currentRow = [];
			for (let j = 0; j < 8; j++) {
				let squareColour = (i + j) % 2;
				currentRow.push(this.renderSquare(squareColour, this.state.squares[i][j]?.component, j, i)); 
			}
			rows.push(<div className="board-row" key={i}>
				{currentRow}
			</div>);
		}
		
		return (
			<div class="board" key={this.childKey}> 
				{rows}
			</div>
		);
	}
}

class PieceComponent extends React.Component {
	constructor(props) { 
		super(props);
		this.state = {
			colour: props.colour,
			pieceType: props.pieceType
		}
	}

	render() {
		if (this.state === null) {
			return "null";
		}
		let source = process.env.PUBLIC_URL + '/pieces/' + this.state.colour + '/' + this.state.pieceType + '.png'
		return (
			<img src={source} alt="chess piece"/>
		);
	}
}



class App extends React.Component {
	render() {
		return (
			<Game/>
		);
	}
}

export default App;
