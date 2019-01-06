import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import './index.css';


function Square(props) {
	return (
		<button 
			className="square" 
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square 
				value={this.props.squares[i]}
				onClick={()=> this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
		<div>
			<div className="board-row">
			{this.renderSquare(0)}
			{this.renderSquare(1)}
			{this.renderSquare(2)}
			</div>
			<div className="board-row">
			{this.renderSquare(3)}
			{this.renderSquare(4)}
			{this.renderSquare(5)}
			</div>
			<div className="board-row">
			{this.renderSquare(6)}
			{this.renderSquare(7)}
			{this.renderSquare(8)}
			</div>
		</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history:[{
				squares: Array(9).fill(null),
			}],
			currentTurn: ['X','O'],
			xIsCurrent: Math.round(Math.random()),
		}
	}

	handleSquareClick(i) {
		const history = this.state.history;
		const current = history[history.length-1];
		const squares = current.squares.slice();
		if (calculateWinner(squares)||squares[i]) {
			return;
		}
		squares[i] = this.state.currentTurn[+this.state.xIsCurrent];
		this.setState({
			history:history.concat({squares:squares}),
			xIsCurrent:!this.state.xIsCurrent
		});

	}

	render() {
		const history = this.state.history;
		const current = history[history.length-1];
		const winner = calculateWinner(current.squares);
		let status;
		
		if (winner) {
			status = winner + ' wins!';
		} 
		else {
			status = this.state.currentTurn[+this.state.xIsCurrent]+'\'s turn!';
		}

		return (
		<div className="game">
			<div className="game-board">
			<Board 
				squares={current.squares}
				onClick={(i) => this.handleSquareClick(i)}
			/>
			</div>
			<div className="game-info">
			<div>{status}</div>
			<ol>{/* TODO */}</ol>
			</div>
		</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6],
	];

	for(let i=0; i<lines.length; i++) {
		const [a,b,c] = lines[i]; // find out what values make for this line
		if (squares[a] // don't understand this first one here...
			&& squares[a] === squares[b] 
			&& squares[b] === squares[c]) {
				return squares[a];
			}
	}
	return null;
}

// ========================================

WebFont.load({
  google: {
    families: ['Thasadith:300,400,700', 'sans-serif']
  }
});

ReactDOM.render(
		<Game />,
document.getElementById('root')
);
