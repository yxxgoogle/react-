import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
function Square(props) {
  //console.log(props);
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {


  renderSquare(i,j) {
    const className = this.props.winner ?
    this.props.winner.includes(i) ? 
    'square win' : 'square' : 'square'
    return (<Square 
      className = {className}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i,j)}
      key={i}
    />
    );
  }

  render() {
    let m = 3;
    let res = [];
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let j = 0; j < m; j++) {
      let data = arr.slice(j * m, (j + 1) * m); // 3个为一组取值，进行二次循环
      res.push(
        <div className="board-row" key={j}>
          {
            data.map((i) => {
              return this.renderSquare(i,j);
            })
          }
        </div>
      )
    }

    return (
      <div >
        {res}
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
      }],
      stepNumber: 0,//这个值代表我们当前正在查看哪一项历史记
      xIsNext: true,
      style:false,

    };
  }
  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
  
    this.setState({
      history: history.concat([{
        squares: squares,
        xy:{'x':i,'y':j,'u':squares[i]},
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      style:step,
    });
  }
  lightUp(lines){
    this.setState({
      winbg:lines,
      });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let winnerPosition = calculateWinner(current.squares);
    const winner = winnerPosition ? current.squares[winnerPosition[0]] : null;

    const moves = history.map((step, move) => {

      const desc = move ? 'Go to move #' + move : 'Go to game start';
      const xy=step.xy?'('+step.xy.x+','+step.xy.y+','+step.xy.u+')':'()';
let classnameT= this.state.style===move?"active":" ";
// + this.state.winbg.includes(move)?" win":" ";

      return (
        <li key={move}>
          <button 
          className={classnameT}
          onClick={() => this.jumpTo(move)}>{desc}{xy}
          </button>
        </li>
      );
    });


    let status;
    let nowiner = (!current.squares.includes(null));
    if (winner) {
      status = 'Winner: ' + winner;
    }  else if (nowiner) {
      status = '无人获胜，平局'
  }else { status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          winner={winnerPosition}
          squares={current.squares} 
          onClick={(i,j) => this.handleClick(i,j)} />
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
      console.log(lines[i]);
      //lightUp(lines[i]);
      return lines[i];
      //return squares[a];
    }
  }
  return null;
}
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
