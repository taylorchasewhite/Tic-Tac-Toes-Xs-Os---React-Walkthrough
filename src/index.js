import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import { Helmet } from 'react-helmet';
import './index.css';

function Square(props) {
	let className = new String();
	
	if (props.isWinner) {
		className="winner ";
	}
	className=className+"square col-"+props.column;
	
	return (
		<button 
			className={className}
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i,column,isWinner) {
		return (
			<Square 
				value={this.props.squares[i]}
				onClick={()=> this.props.onClick(i)}
				column={column}
				isWinner={isWinner}
				key={i}
			/>
		);
	}

	render() {
		const boardSize=3;
		const boardClass="board-row row-";
		let squares=[];
		let winner = this.props.winnerInfo.winner;
		let winnerLine;
		if (winner) {
			winnerLine = this.props.winnerInfo.lines;
		}

		for (let i=0; i<boardSize;i++) {
			let row=[];
			for (let j=0; j<boardSize; j++) {
				let squareID = i*boardSize+j;
				let isWinner=false;
				if (winner) {
					isWinner=winnerLine.includes(squareID);
				}
				row.push(this.renderSquare(squareID,j,isWinner));
			}
			
			squares.push(<div key={i} className={boardClass+i}>{row}</div>);
		}

		return (
			<div>
				{squares};
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
				lastSelectedSquareID:null,
				lastPlayer:null,
			}],
			currentTurn: ['X','O'],
			stepNumber:0,
			xIsCurrent: Math.round(Math.random()),
			isSortAscending:true
		}
	}

	handleSquareClick(i) {
		const history = this.state.history.slice(0,this.state.stepNumber+1);
		const current = history[history.length-1];
		const squares = current.squares.slice();
		if (calculateWinner(squares).winner||squares[i]) {
			return;
		}
		squares[i] = this.state.currentTurn[+this.state.xIsCurrent];
		this.setState({
			history:history.concat([{
				squares:squares,
				lastSelectedSquareID:i,
				lastPlayer:this.state.currentTurn[+this.state.xIsCurrent],
			}]),
			stepNumber: history.length,
			xIsCurrent:!this.state.xIsCurrent,
		});

	}

	handleSortClick() {
		let isSortAscending = this.state.isSortAscending;
		this.setState({
			isSortAscending:!isSortAscending
		});
	}

	jumpTo(stepNumber) {
		const currentPlayerIsX = this.state.xIsCurrent;
		const currentStepNumber = this.state.stepNumber;
		const playerChange = Math.abs((currentStepNumber-stepNumber))%2;
		const jumpToPlayerIsX = (Boolean) (currentPlayerIsX && !playerChange) || (!currentPlayerIsX && playerChange); 


		this.setState({
			stepNumber:stepNumber,
			xIsCurrent:jumpToPlayerIsX
		});

	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winnerInfo = calculateWinner(current.squares);
		const winner = winnerInfo.winner;
		const isSortAscending= this.state.isSortAscending;

		const currentStepNum = this.state.stepNumber;
		let siteTitle = 'Tic Tac & Toe\'s';
		
		/* Get history of moves */
		let moves = history.map((step,move) => {
			const lastSelectedSquareID=step.lastSelectedSquareID;
			console.log(step);
			const player = step.lastPlayer;
			const column = 1+lastSelectedSquareID%3;
			const row = 1+ (Math.floor(lastSelectedSquareID/3));
			const description = move ?
				`${move}: ${player} (${column}, ${row})` :
				'First move!';
			return (
				<li key={move} className={selectedMove(move,currentStepNum)}>
					<button onClick={()=>this.jumpTo(move)}>{description}</button>
				</li>
			);
		});

		if(!isSortAscending) {
			moves.reverse();
		}
		
		let status;
		
		if (winner) {
			status = winner + ' wins!';
			siteTitle += ' - ' + status;
		} 
		else if (!winner && currentStepNum===9) {
			status = 'It\'s a draw!';
		}
		else {
			status = this.state.currentTurn[+this.state.xIsCurrent]+'\'s turn!';
		}

		return (
		<div className="game">
			<div className="game-board">
			<Helmet>
				<title>{siteTitle}</title>
			</Helmet>
			<Board 
				squares={current.squares}
				onClick={(i) => this.handleSquareClick(i)}
				winnerInfo={winnerInfo}
			/>
			</div>
			<div className="game-info">
			<div className="game-turn">{status}</div>
			<button 
				className="game-sort"
				onClick={()=>this.handleSortClick()}>
					{isSortAscending ? 'Ascending' : 'Descending'}
			</button>
			<ul>{moves}</ul>
			</div>
		</div>
		);
	}
}
/**
 * 
 *
 * @param {*} squares
 * @returns
 */
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
				return {
					winner: squares[a],
					lines:lines[i],
				}
			}
	}
	return {
		winner:null
	};
}

function selectedMove(move,stepNum) {
	if (move===stepNum) {
		return "selected";
	}
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
