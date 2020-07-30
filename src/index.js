import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
  let winLine = [];
  function Square(props) {
    return (
      <button className={props.win} onClick={props.onClick}>
        {props.value}
      </button>
    )
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      if(this.props.winBlocks.includes(i)) { 
        return (
          <Square 
            win='winSquare'  
            key={i} 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
          />
        );
      } else {
        return (
          <Square 
            win='square' 
            key={i} 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)} 
          />
        );
      }
    }
    render() {
      const ary = [[0,0,0], [0,0,0], [0,0,0]];
      const items = ary.map( (_value, index)=>
        <div key={index} className='board-row'>
          {ary[index].map( (_val, ind) => 
            this.renderSquare(3 * index + ind) )}
        </div> );

      return (
        <div>
          {items}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          chosenIndex: null, 
        }], 
        stepNumber: 0, 
        xIsNext: false, 
        reverseList: false, 
        winBlockId: [null, null, null], 
      }
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const chosenIndex = i;
      if(calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares, 
          chosenIndex: chosenIndex, 
        }]), 
        stepNumber: history.length,  
        xIsNext: !this.state.xIsNext,
      });

      if(calculateWinner(squares)) {
        this.setState({
          winBlockId: winLine.slice(),
        });
        console.log(this.state.winBlockId);
        console.log(winLine);
      }
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step, 
        xIsNext: !((step%2) === 0), 
      })
      if(!calculateWinner(this.state.history[step])) {
        this.setState({
          winBlockId: [null, null, null], 
        });
      }
    }

    reverse(moves) {
      console.log('reverse');
      this.setState({
        reverseList: !this.state.reverseList,
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      let winner = calculateWinner(current.squares);
      if(!current.squares.includes(null) && !winner) {
        winner = 'Tie!';
      }

      const moves = history.map((step, move) => {
        const row = Math.floor(step.chosenIndex/3) + 1;
        const col = step.chosenIndex%3 + 1;
        let buttonJ = 
        <button onClick={()=>this.jumpTo(move)}>
          {step===current ? 
            <strong>
              {move ? 
                [`Go to move #${move}`, <br key={move}/>, `${move%2===0 ? 'X' : 'O'} (${row}, ${col})`]
                : `Go to game start`}
            </strong> 
            :move ?
              [`Go to move #${move}`, <br key={move}/>, `${move%2===0 ? 'X' : 'O'} (${row}, ${col})`]
              : `Go to game start`}
        </button>;
        return (
          <li key={move}>
            {buttonJ}
          </li>
        )
      });
      const movesReverse = moves.slice().map((val, idx)=>{
        return moves[moves.length-1-idx];
      });
      
      let status;
      winner ? status = `Winner: ${winner}` : status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
      
      return (
        <div className="game">
          <div className="game-board">
            <Board
              winBlocks={this.state.winBlockId} 
              squares={current.squares} 
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button className='reverse' onClick={()=>this.reverse(moves)}>reverse list</button>
            <ul>{this.state.reverseList ? movesReverse : moves}</ul>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        winLine = lines[i].slice();
        return squares[a];
      }
    }
    winLine = [null, null, null];
    return null;
  }
  