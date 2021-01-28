import React from 'react';
import './App.css';

function Square(props) {
	let squareClasses = 'square ' + (props.w ? 'w' : 'b')
	return (
		<button className={squareClasses} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Game extends React.Component {

}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			squares: Array(8).fill(Array(8).fill(null)),
			wNext: true
		};
	}

	componentDidMount() {
		this.setBoard();
	}

	setMainRow(squares, row, colour) {
		squares[row][0] = {colour: colour, pieceType: 'rook'}
		squares[row][1] = {colour: colour, pieceType: 'knight'}
		squares[row][2] = {colour: colour, pieceType: 'bishop'}
		squares[row][3] = {colour: colour, pieceType: 'queen'}
		squares[row][4] = {colour: colour, pieceType: 'king'}
		squares[row][5] = {colour: colour, pieceType: 'bishop'}
		squares[row][6] = {colour: colour, pieceType: 'knight'}
		squares[row][7] = {colour: colour, pieceType: 'rook'}
	}

	setBoard() {
		var newSquares = this.state.squares.map(function (arr) {
			return arr.slice();
		});
		
		this.setMainRow(newSquares, 0, 'b');
		newSquares[1] = Array(8).fill({colour: 'b', pieceType: 'pawn'});
		newSquares[6] = Array(8).fill({colour: 'w', pieceType: 'pawn'});
		this.setMainRow(newSquares, 7, 'w');

		this.setState({squares: newSquares});
	}

	handleClick(piece) {
		//console.log(i);
		if (!piece) {
			//maybe log something here
			return;
		}
	}

	renderSquare(hello, piece, x, y) {
		let content = piece ? <Piece colour={piece.colour} pieceType={piece.pieceType} /> : "";
		return (
			<Square 
				w={hello}
				value={content} //should be something like {this.state.squares[i]}
				onClick={() => this.handleClick(piece)}
			/>
		);
	}

	render() {
		var rows = [];
		for (let i = 0; i < 8; i++) {
			var currentRow = [];
			for (let j = 0; j < 8; j++) {
				let squareColour = (i + j) % 2;
				currentRow.push(this.renderSquare(squareColour, this.state.squares[i][j]), j, i);
			}
			rows.push(<div className="board-row" key={i}>
				{currentRow}
			</div>);
		}

		
		return (
			<div class="board">
				{rows}
			</div>
		);
	}
}

class Piece extends React.Component {
	constructor(props) { 
		super(props);
		this.state = {
			colour: props.colour,
			pieceType: props.pieceType,
			position: props.position
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

class Pawn extends Piece {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		colour: props.colour,
	// 		pieceType: 'pawn'
	// 	}
	// }

	// render() {
	// 	let source = '..\\public\\pieces\\' + this.state.colour + '\\pawn.png'
	// 	return (
	// 		<img src={source}/>
	// 	);
	// }
}

class Bishop extends Piece {

}

class Knight extends Piece {

}

class Rook extends Piece {

}

class Queen extends Piece {

}

class King extends Piece {

}

class App extends React.Component {
	render() {
		return (
			<div className="game">
				<Board/>
			</div>
		);
	}
}

// function App() {
// 	return (
// 		<div className="App">
// 			<header className="App-header">
// 				Testing, should remove
// 			</header>
// 		</div>
// 	);
// }

export default App;
