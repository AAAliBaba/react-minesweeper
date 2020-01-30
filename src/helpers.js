//globals that help us compute the new states of the board, avoid direct mutation of states
export const neighbor_rows = [-1, -1, -1, 0, 0,   1, 1, 1];
export const neighbor_cols = [-1,  0,  1, -1, 1, -1, 0, 1];

export var bool_arr = [];
export var flag_arr = [];
export var val_arr = [];
for(var i = 0; i < 9; i++)
{
    bool_arr[i] = new Array(9).fill(false);
    flag_arr[i] = new Array(9).fill(false);
}

export function init_board(arr) {
    var count = 0;
    while(count < 10)
    {
        var rand_r = Math.floor(Math.random() * 9);
        var rand_c = Math.floor(Math.random() * 9);
        while(arr[rand_r][rand_c] === '*')
        {
            rand_r = Math.floor(Math.random() * 9);
            rand_c = Math.floor(Math.random() * 9);
        }
        arr[rand_r][rand_c] = '*';
        count++;
    }

    for(var i = 0; i < 9; i++)
    {
        for(var j = 0; j < 9; j++)
        {
            if(arr[i][j] !== '*')
            {
                var cnt_mines = 0;
                for(var k = 0; k < 9; k++)
                {
                    var row_to_check = i + neighbor_rows[k];
                    var col_to_check = j + neighbor_cols[k];

                    if(row_to_check < 0 || row_to_check > 9 || col_to_check < 0 || col_to_check > 9)
                    {
                        continue;
                    }
                    else
                    {
                        try {
                            if(arr[row_to_check][col_to_check] === '*')
                                {
                                    cnt_mines++;
                                }
                        } catch (error) {
                            //some NaN/undefined error we can ignore
                        }
                    }
                }
                arr[i][j] = cnt_mines;
            }
        }
    }

    //copying over to val_arr
    for(var v = 0; v < 9; v++)
    {
        val_arr[v] = arr[v].slice();
    }
    return arr;
}