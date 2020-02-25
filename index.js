function generateGrid (gridSize,mines){
    const minesIndex = [...Array(mines).keys()].map((e,i,a)=>{
        return Math.floor(Math.random() * (gridSize*gridSize))
    });
    const gwm = fillGridWithMines(gridSize,minesIndex);
    const gwn = fillMineAroundNumber(gwm);
    return gwn;
}

function fillGridWithMines(gs,m){
    const arrayWithMines = [];
    let indexCounter=0;
    for (let i = 0; i < gs; i++) {
        arrayWithMines[i]=[];
        for (let j = 0; j < gs; j++) {
            if(m.includes(indexCounter)){
                arrayWithMines[i][j]={id:indexCounter,mine:true,x:j,y:i}
            }else{
                arrayWithMines[i][j]={id:indexCounter,mine:false,x:j,y:i}
            }
            indexCounter++;
        }
    }
    return arrayWithMines;
}

function fillMineAroundNumber(gridWithMines){
    let gwm = gridWithMines;
    for (let i = 0; i < gwm.length; i++) {
        for (let j = 0; j < gwm.length; j++) {
            let amount = 0;
                if(!gwm[i][j].mine){
                if(gwm[i-1]    && gwm[i-1][j-1] && gwm[i-1][j-1].mine){amount ++}
                if(gwm[i-1]    && gwm[i-1][j  ] && gwm[i-1][j  ].mine){amount ++}
                if(gwm[i-1]    && gwm[i-1][j+1] && gwm[i-1][j+1].mine){amount ++}
                if(gwm[i][j-1] && gwm[i  ][j-1].mine){amount ++}
                if(gwm[i][j+1] && gwm[i  ][j+1].mine){amount ++}
                if(gwm[i+1]    && gwm[i+1][j-1] && gwm[i+1][j-1].mine){amount ++}
                if(gwm[i+1]    && gwm[i+1][j  ] && gwm[i+1][j  ].mine){amount ++}
                if(gwm[i+1]    && gwm[i+1][j+1] && gwm[i+1][j+1].mine){amount ++}
                gwm[i][j].minesAround=amount;
            }
        }
    }
    return gwm;
}

function renderGrid(dimention){
    const generated = generateGrid(dimention,dimention*4);

    for (let i = 0; i < generated.length; i++) {
        const row = document.createElement('div')
        row.classList.add('row')
        document.body.appendChild(row);
        for (let j = 0; j < generated.length; j++) {
            const cell = document.createElement('div')
            cell.dataset.id=generated[i][j].id;
            cell.classList.add('cell')
            cell.classList.add('cover')
            cell.addEventListener('click',
                (e)=>{
                    removeCover(e.target,generated)
                }
            )
            cell.addEventListener('contextmenu',(e)=>{
                e.preventDefault();
                e.target.dataset.tagged=="true"?e.target.classList.remove('tagged'):e.target.classList.add('tagged');
                e.target.dataset.tagged==="true"?e.target.dataset.tagged="false":e.target.dataset.tagged="true";
            })
            generated[i][j].mine?cell.classList.add('mine'):null;
            if(generated[i][j].minesAround>0){
                cell.textContent=generated[i][j].minesAround;
                cell.classList.add(`color-${generated[i][j].minesAround}`)
            };
            if(generated[i][j].mine){cell.textContent='💣'};
            row.appendChild(cell);
        }
    }

}

function removeCover(t,grid){
    if(!t.dataset.clicked==true){
        t.dataset.clicked=true;
        t.classList.remove('cover')
        const dcs = (a,b) =>{
            return document.querySelector(`[data-id="${grid[a][b].id}"]`)
        };
        const [j,i] = grid.reduce((p,q)=>
            {
                let arr = q.filter(e=>e.id==t.dataset.id);
                if(arr.length>0){return [arr[0].x,arr[0].y]} else return p
            },[])
        if(grid[i][j].mine){gameLost(grid)}
        if(grid[i][j].minesAround===0){
            if(grid[i-1]    && grid[i-1][j-1] && !grid[i-1][j-1].mine){removeCover(dcs(i-1,j-1),grid)}
            if(grid[i-1]    && grid[i-1][j  ] && !grid[i-1][j  ].mine){removeCover(dcs(i-1,j  ),grid)}
            if(grid[i-1]    && grid[i-1][j+1] && !grid[i-1][j+1].mine){removeCover(dcs(i-1,j+1),grid)}
            if(grid[i][j-1] &&                   !grid[i  ][j-1].mine){removeCover(dcs(i  ,j-1),grid)}
            if(grid[i][j+1] &&                   !grid[i  ][j+1].mine){removeCover(dcs(i  ,j+1),grid)}
            if(grid[i+1]    && grid[i+1][j-1] && !grid[i+1][j-1].mine){removeCover(dcs(i+1,j-1),grid)}
            if(grid[i+1]    && grid[i+1][j  ] && !grid[i+1][j  ].mine){removeCover(dcs(i+1,j  ),grid)}
            if(grid[i+1]    && grid[i+1][j+1] && !grid[i+1][j+1].mine){removeCover(dcs(i+1,j+1),grid)}
        }
    }
}

function gameLost(grid){
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            const e = document.querySelector(`[data-id="${grid[i][j].id}"]`);
            e.classList.remove('cover');
            e.classList.remove('tagged');
            e.dataset.clicked=true;
        }
    }
}

renderGrid(24);