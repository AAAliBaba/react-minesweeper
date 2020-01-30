import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as helpers from './helpers.js';

function Cell(props) {
        return (
            <p className="cell" onClick={props.onClick} onContextMenu={props.onClick} style={{backgroundColor: props.bg_color}}>
                {props.face}
            </p>
        );
}

class Board extends React.Component {
    constructor(props) {
        super(props);

        var init = [];
        for(var i = 0; i < 9; i++)
        {
            init[i] = new Array(9);
        }
        helpers.init_board(init);

        for(var k = 0; k < 9; k++)
        {
            for(var j = 0; j < 9; j++)
            {
                var val = init[k][j];
                init[k][j] = this.renderCell(k, j, val, "", "white");
            }
        }

        this.state = {
            cells: init,
            mines: 10,
            revealed_cells: 0,
            did_lose: false,
            did_win: false,
        }
    }

    reveal(row, col) {
        if(helpers.flag_arr[row][col])
            return; //can't reveal a flagged cell.
        else if(helpers.val_arr[row][col] === 0 && !helpers.bool_arr[row][col])
        {
            helpers.bool_arr[row][col] = true;

            for(var i = 0; i < 9; i++)
            {
                var row_to_check = row + helpers.neighbor_rows[i];
                var col_to_check = col + helpers.neighbor_cols[i];

                if(row_to_check < 0 || row_to_check >= 9 || col_to_check < 0 || col_to_check >= 9)
                    continue; //out of bounds

                if(isNaN(row_to_check) || isNaN(col_to_check))
                    break; //weird error I was getting after a recursive call returned.

                this.reveal(row_to_check, col_to_check);
            }
        }
        else
            helpers.bool_arr[row][col] = true;
    }

    flag(row, col) {
        if(!helpers.bool_arr[row][col] || helpers.flag_arr[row][col])
        {
            helpers.flag_arr[row][col] = !helpers.flag_arr[row][col];
            var m = this.state.mines;
            helpers.flag_arr[row][col] ? this.setState({mines: (m - 1)}) : this.setState({mines: (m + 1)});
        }
    }

    handleClick(row, col, event) {
        if(this.state.did_lose || this.state.did_win)
            return;

        event.preventDefault(); //need this so menu doesn't pop up when we right click

        var cells_copy = [];
        var rev_cells_cnt = 0;
        for(var i = 0; i < 9; i++)
        {
            cells_copy[i] = new Array(9);
        }

        if(event.type === 'click')
            this.reveal(row, col);
        else
            this.flag(row, col);

        var didLose = false;
        for(var r = 0; r < 9; r++)
        {
            for(var c = 0; c < 9; c++)
            {
                if(helpers.bool_arr[r][c])
                {
                    if(this.state.cells[r][c].props.value === "*")
                    {
                        didLose = true;
                        cells_copy[r][c] = this.renderCell(r, c, (this.state.cells[r][c].props.value), (this.state.cells[r][c].props.value), "lightcoral");
                    }
                    else
                        cells_copy[r][c] = this.renderCell(r, c, (this.state.cells[r][c].props.value), (this.state.cells[r][c].props.value), "lightgrey");
                    
                    rev_cells_cnt++;
                }
                else if(helpers.flag_arr[r][c])
                {
                    cells_copy[r][c] = this.renderCell(r, c, (this.state.cells[r][c].props.value), "M", "white");
                    rev_cells_cnt++;
                }
                else
                    cells_copy[r][c] = this.renderCell(r, c, (this.state.cells[r][c].props.value), "", "white");
            }
        }

        if(rev_cells_cnt === 81)
            this.setState({cells: cells_copy, revealed_cells: rev_cells_cnt, did_lose: didLose, did_win: true});
        else    
            this.setState({cells: cells_copy, revealed_cells: rev_cells_cnt, did_lose: didLose});    
    }

    renderCell(r, c, v, f, bgc) {
        return <Cell row={r} col={c} value={v} face={f} onClick={(event) => this.handleClick(r, c, event)} bg_color={bgc}/>
    }

    render() {
        if (this.state.init === null) return null;

        let status;
        if(this.state.did_lose)
            status = "You Lose!";
        else if(this.state.did_win)
            status = "You Win!";
        else
            status = "# of mines: " + this.state.mines;

        return (
            <div>
                <div>
                    <h3>{status}</h3>
                </div>
                <div className="grid">
                    {this.state.cells}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    render() {
        return(
            <div className="game">
                <h2>React.Minesweeper</h2>
                <Board />
                <p>Left click to reveal a cell</p>
                <p>Right click to flag a potential mine</p>
                <p>The number of the cell tells you how many mines directly surround it</p>
                <p>Sweep all the mines to win the game!</p>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );