var neighbor_rows = [-1, -1, -1, 0, 0,   1, 1, 1];
var neighbor_cols = [-1,  0,  1, -1, 1, -1, 0, 1];

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
    return arr;
}