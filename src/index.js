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
			stepNumber:0,
			xIsCurrent: Math.round(Math.random()),
		}
	}

	handleSquareClick(i) {
		const history = this.state.history.slice(0,this.state.stepNumber+1);
		const current = history[history.length-1];
		const squares = current.squares.slice();
		if (calculateWinner(squares)||squares[i]) {
			return;
		}
		squares[i] = this.state.currentTurn[+this.state.xIsCurrent];
		this.setState({
			history:history.concat([{squares:squares}]),
			stepNumber: history.length,
			xIsCurrent:!this.state.xIsCurrent,
		});

	}

	jumpTo(stepNumber) {
		const currentPlayerIsX = this.state.xIsCurrent;
		const currentStepNumber = this.state.stepNumber;
		const playerChange = (currentStepNumber-stepNumber)%2;
		const jumpToPlayerIsX = (currentPlayerIsX && !playerChange) || (!currentPlayerIsX && playerChange); 
		this.setState({
			stepNumber:stepNumber,
			xIsCurrent:jumpToPlayerIsX
		});

	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		
		/* Get history of moves */
		const moves = history.map((step,move) => {
			const description = move ?
				'Move ' + move :
				'Go to the start';
			return (
				<li key={move}>
					<button onClick={()=>this.jumpTo(move)}>{description}</button>
				</li>
			);
		});
		
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
			<ol>{moves}</ol>
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
