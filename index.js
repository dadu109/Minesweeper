const root = document.querySelector('.root')
const restartButton = document.querySelector('.restart')
const allDiff = document.querySelectorAll('.diff')
const timerDisplay = document.querySelector('.timer')
const difficulties = {
    "easy":{n:10,m:20},
    "mid":{n:17,m:40},
    "hard":{n:25,m:75}
}
let globalGridSize = difficulties.mid.n;
let globalMinesAmount = difficulties.mid.m;
let time = 0;

function pickDiff(t){
    const diff = t.target.dataset.diff;
    allDiff.forEach(e=>{e.dataset.diff===diff?e.classList.add('active'):e.classList.remove('active')})
    globalGridSize=difficulties[diff].n;
    globalMinesAmount=difficulties[diff].m;
    restartGame();
}

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

function renderGrid(dimention,mines){
    const generated = generateGrid(dimention,mines);

    for (let i = 0; i < generated.length; i++) {
        const row = document.createElement('div')
        row.classList.add('row')
        root.appendChild(row);
        for (let j = 0; j < generated.length; j++) {
            const cell = document.createElement('div')
            cell.dataset.id=generated[i][j].id;
            cell.classList.add('cell')
            cell.classList.add('cover')
            cell.addEventListener('click',(e)=>{removeCover(e.target,generated)})

            cell.addEventListener('contextmenu',(e)=>{
                const {target:{classList,dataset}} = e;
                e.preventDefault();
                dataset.tagged=="true"?classList.remove('tagged'):classList.add('tagged');
                dataset.tagged==="true"?dataset.tagged="false":dataset.tagged="true";
            })

            generated[i][j].mine?cell.classList.add('mine'):null;
            if(generated[i][j].minesAround>0){
                cell.textContent = generated[i][j].minesAround;
                cell.classList.add(`color-${generated[i][j].minesAround}`)
            };
            if(generated[i][j].mine){cell.textContent='💣'};
            row.appendChild(cell);
        }
    }

}

function removeCover(t,grid){
    if(!t.dataset.clicked==true){
        const dcs = (a,b) =>(document.querySelector(`[data-id="${grid[a][b].id}"]`))
        const [j,i] = grid.reduce((p,q)=>{
            const arr = q.filter(e=>e.id==t.dataset.id);
            return arr.length>0?[arr[0].x,arr[0].y]:p
        },[]) //gets the position of target in overall grid

        t.dataset.clicked=true;
        t.classList.remove('cover')
        if(grid[i][j].mine){gameLost(grid)}
        if(grid[i][j].minesAround===0){
            if(grid[i-1]    && grid[i-1][j-1] && !grid[i-1][j-1].mine){ removeCover(dcs(i-1,j-1) ,grid)}
            if(grid[i-1]    && grid[i-1][j  ] && !grid[i-1][j  ].mine){ removeCover(dcs(i-1,j  ) ,grid)}
            if(grid[i-1]    && grid[i-1][j+1] && !grid[i-1][j+1].mine){ removeCover(dcs(i-1,j+1) ,grid)}
            if(grid[i][j-1] &&                   !grid[i  ][j-1].mine){ removeCover(dcs(i  ,j-1) ,grid)}
            if(grid[i][j+1] &&                   !grid[i  ][j+1].mine){ removeCover(dcs(i  ,j+1) ,grid)}
            if(grid[i+1]    && grid[i+1][j-1] && !grid[i+1][j-1].mine){ removeCover(dcs(i+1,j-1) ,grid)}
            if(grid[i+1]    && grid[i+1][j  ] && !grid[i+1][j  ].mine){ removeCover(dcs(i+1,j  ) ,grid)}
            if(grid[i+1]    && grid[i+1][j+1] && !grid[i+1][j+1].mine){ removeCover(dcs(i+1,j+1) ,grid)}
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
    clearInterval(timer)
}

function restartGame(){
    root.innerHTML='';
    renderGrid(globalGridSize,globalMinesAmount);
    restartTime();
}


function setTimer(){
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    timerDisplay.innerHTML=`${minutes<10?"0"+minutes:minutes}:${seconds<10?"0"+seconds:seconds}`
    time++;
}

const restartTime = () => {
    time=0;
    clearInterval(timer);
    timer = setInterval(()=>{setTimer()},1000);
};

let timer = setInterval(()=>{setTimer()},1000);
restartButton.addEventListener('mousedown',(e)=>{e.target.classList.add('restart-pressed')})
restartButton.addEventListener('mouseup',(e)=>{
    e.target.classList.remove('restart-pressed');
    restartGame();
    restartTime()
});
allDiff.forEach(e=>{e.addEventListener('click',(t)=>{pickDiff(t)})})

renderGrid(globalGridSize,globalMinesAmount);