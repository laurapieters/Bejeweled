function playGame(){
    let grid = new Grid();
    let length = grid.foundRows.length;
    // to construct initial grid without 3-in-a-rows
    while(length != 0){
        grid = new Grid();
        length = grid.foundRows.length;
    }
    grid.sideDisplay();
    let gridDiv = grid.createGrid();
    document.body.appendChild(gridDiv);
}

class Grid{
    constructor() {
        this.jewels = this.createJewels();
        this.foundRows = this.checkForRow2();
        this.clickedJewels = [];
        this.score = 0;
    }

    createJewels(){
        const colors = ['darkblue', 'darkpink', 'green', 'lightblue', 'lightpink', 'orange',
            'purple', 'red', 'turquois'];
        let jewels = [];
        for(let i = 0; i < 8; i++){
            let yJewels = [];
            for(let j = 0; j < 8; j++){
                const nr = Math.floor(Math.random() * (colors.length));
                const color =  colors[nr];
                let jewel = new Jewel(i,j,color, this.switchCallback);
                yJewels.push(jewel);
            }
            jewels.push(yJewels);
        }
        return jewels;
    }

    createGrid(){
        let gridDiv = document.createElement('div');
        gridDiv.setAttribute('id', 'grid');
        for(let j = 0; j < 8; j++){
            for(let i = 0; i < 8; i++) {
                gridDiv.appendChild(this.jewels[i][j].createJewel());
            }
            const br = document.createElement('br');
            gridDiv.appendChild(br);
        }
        return gridDiv;
    }

    checkForRow2(){
        let foundRows = [];

        // check for rows
        for(let j = 0; j < 8; j++){
            let foundRow = [];
            for(let i = 0; i < 8-1; i++) {
                foundRow.push(this.jewels[i][j]);
                if(this.jewels[i][j].color === this.jewels[i+1][j].color){
                    if(i === 6){
                        foundRow.push(this.jewels[i+1][j]);
                        if(foundRow.length >= 3){
                            foundRows.push(foundRow);
                        }
                    }
                }else{
                    if(foundRow.length >= 3){
                        foundRows.push(foundRow);
                    }
                    foundRow = [];
                }
            }
        }

        // check for columns
        for(let i = 0; i < 8; i++){
            let foundColumn = [];
            for(let j = 0; j < 8-1; j++) {
                foundColumn.push(this.jewels[i][j]);
                if(this.jewels[i][j].color === this.jewels[i][j+1].color){
                    if(j === 6){
                        foundColumn.push(this.jewels[i][j+1]);
                        if(foundColumn.length >= 3){
                            foundRows.push(foundColumn);
                        }
                    }
                }else{
                    if(foundColumn.length >= 3){
                        foundRows.push(foundColumn);
                    }
                    foundColumn = [];
                }

            }
        }

        return foundRows;
    }

    // not in use anymore, old version
    checkForRow(){
        let foundRows = [];
        let foundKind = [];

        // check for rows
        for(let j = 0; j < 8; j++){
            for(let i = 0; i < 8-2; i++) {
                if(this.jewels[i][j].color === this.jewels[i+1][j].color && this.jewels[i+1][j].color === this.jewels[i+2][j].color){
                    // found 3-in-a-row!
                    let foundRow = [];
                    foundRow.push(this.jewels[i][j]);
                    foundRow.push(this.jewels[i+1][j]);
                    foundRow.push(this.jewels[i+2][j]);
                    if(!foundRows.includes(foundRow)){
                        foundRows.push(foundRow);
                        foundKind.push('row');
                    }
                }
            }
        }
        // check for columns
        for(let j = 0; j < 8-2; j++){
            for(let i = 0; i < 8; i++) {
                if(this.jewels[i][j].color === this.jewels[i][j+1].color && this.jewels[i][j+1].color === this.jewels[i][j+2].color){
                    // found 3-in-a-column!
                    let foundColumn = [];
                    foundColumn.push(this.jewels[i][j]);
                    foundColumn.push(this.jewels[i][j+1]);
                    foundColumn.push(this.jewels[i][j+2]);
                    if(!foundRows.includes(foundColumn)) {
                        foundRows.push(foundColumn);
                        foundKind.push('column');
                    }
                }
            }
        }
        // check for diagonals
        // for(let j = 0; j < 8-2; j++){
        //     for(let i = 0; i < 8-2; i++) {
        //         if(this.jewels[i][j].color === this.jewels[i+1][j+1].color && this.jewels[i+1][j+1].color === this.jewels[i+2][j+2].color){
        //         // found 3-in-a-diagonal!
        //         let foundDiagonal = [];
        //         foundDiagonal.push(this.jewels[i][j]);
        //         foundDiagonal.push(this.jewels[i+1][j+1]);
        //         foundDiagonal.push(this.jewels[i+2][j+2]);
        //             if(!foundRows.includes(foundDiagonal)) {
        //                 foundRows.push(foundDiagonal);
        //                 foundKind.push('diagonal');
        //             }
        //         }
        //     }
        // }
        // check for backwards diagonals
        // for(let j = 0; j < 8-2; j++){
        //     for(let i = 0+2; i < 8; i++) {
        //         if(this.jewels[i][j].color === this.jewels[i-1][j+1].color && this.jewels[i-1][j+1].color === this.jewels[i-2][j+2].color){
        //             // found 3-in-a-diagonal! (backwards)
        //             let foundDiagonal = [];
        //             foundDiagonal.push(this.jewels[i][j]);
        //             foundDiagonal.push(this.jewels[i-1][j+1]);
        //             foundDiagonal.push(this.jewels[i-2][j+2]);
        //             if(!foundRows.includes(foundDiagonal)) {
        //                 foundRows.push(foundDiagonal);
        //                 foundKind.push('backwardsDiagonal');
        //             }
        //         }
        //     }
        // }

        // remove double rows (for example row and column with one jewel the same), but not >3-in-a-row
        for(let i = 0; i < 3*foundRows.length; i++){
            for(let j = 0; j < 3*foundRows.length; j++){
                if(foundRows[Math.floor(i/3)][i%3].color === foundRows[Math.floor(j/3)][j%3].color
                && foundKind[Math.floor(i/3)] !== foundKind[Math.floor(j/3)]){
                    console.log('found double');
                    foundRows.splice(Math.floor(i/3),1);
                }
            }
        }
        return foundRows;
    }

    // check if switching makes a row
    switchMakesRow(clickedJewels){
        let makesRow = false;
        // switching
        const firstColor = clickedJewels[0].color;
        const secondColor = clickedJewels[1].color;
        this.jewels[clickedJewels[0].x][clickedJewels[0].y].color = secondColor;
        this.jewels[clickedJewels[1].x][clickedJewels[1].y].color = firstColor;
        // check for rows
        if(this.checkForRow2().length > 0){
            makesRow = true;
        }
        // switch back
        this.jewels[clickedJewels[0].x][clickedJewels[0].y].color = firstColor;
        this.jewels[clickedJewels[1].x][clickedJewels[1].y].color = secondColor;

        return makesRow;
    }

    // check if switch possible, or whether no rows can be made; game over
    switchPossible(){
        let switchPossible = false;
        // row switch
        for(let j = 0; j < 8; j++){
            for(let i = 0; i < 7; i++){
                if(this.switchMakesRow([this.jewels[i][j],this.jewels[i+1][j]])){
                    switchPossible = true;
                }
            }
        }
        // column switch
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 7; j++){
                if(this.switchMakesRow([this.jewels[i][j],this.jewels[i][j+1]])){
                    switchPossible = true;
                }
            }
        }
        return switchPossible;
    }

    switchCallback = (jewel) => {
        if(this.clickedJewels.length === 0){
            this.clickedJewels.push(jewel);
            jewel.clicked();
        }
        if(this.clickedJewels.length === 1){

            // only push second click if next to first
            if(((jewel.x === this.clickedJewels[0].x+1 || jewel.x === this.clickedJewels[0].x-1) && jewel.y === this.clickedJewels[0].y)
            ||((jewel.y === this.clickedJewels[0].y+1 || jewel.y === this.clickedJewels[0].y-1) && jewel.x === this.clickedJewels[0].x)){
                this.clickedJewels.push(jewel);
                jewel.clicked();
            }
        }

        // resetting clicked jewels if wrong move
        if (this.clickedJewels.length === 2 && !this.switchMakesRow(this.clickedJewels)) {
            this.clickedJewels[0].unclicked();
            this.clickedJewels[1].unclicked();
            this.clickedJewels = [];
        }

        if (this.clickedJewels.length === 2 && this.switchMakesRow(this.clickedJewels)) {
            // switching
            const firstColor = this.clickedJewels[0].color;
            const secondColor = this.clickedJewels[1].color;
            this.jewels[this.clickedJewels[0].x][this.clickedJewels[0].y].color = secondColor;
            this.jewels[this.clickedJewels[1].x][this.clickedJewels[1].y].color = firstColor;

            // displaying
            this.displayAgain();
            this.clickedJewels[0].unclicked();
            this.clickedJewels[1].unclicked();
            this.clickedJewels = [];

            // instead of while loop (does not work with setTimout)
            const removeAndFill = () => {
                this.foundRows = this.checkForRow2();
                if(this.foundRows.length === 0){
                    return;
                }
                // check for row, remove and display again
                setTimeout(() => {
                    this.removeRows(this.foundRows);
                    // score
                    // to do: add special score for combos
                    for(let i = 0; i < this.foundRows.length; i++){
                        if(this.foundRows[i].length === 3){
                            this.score += 100;
                        }else if(this.foundRows[i].length === 4){
                            this.score += 200;
                        }else if(this.foundRows[i].length === 5){
                            this.score += 300;
                        }
                    }
                    this.displayAgain();



                    // move jewels down
                    setTimeout(() => {
                        this.fallDown2();
                        this.displayAgain();

                        // generate new jewels
                        setTimeout(() => {
                            this.generateNewJewels();
                            this.displayAgain();
                            removeAndFill();
                        }, 1000);
                    }, 1000);
                }, 1000);
            }
            removeAndFill();
        }
    }

    sideDisplay(){
        // title
        let title = document.createElement('div');
        title.setAttribute('id', 'title');
        title.innerHTML = 'BEJEWELED';
        document.body.appendChild(title);

        // score word
        let scoreWordDiv = document.createElement('div');
        scoreWordDiv.setAttribute('id', 'scoreWord');
        scoreWordDiv.innerHTML = 'score: ';
        document.body.appendChild(scoreWordDiv);

        // score number
        let scoreDiv = document.createElement('div');
        scoreDiv.setAttribute('id', 'score');
        scoreDiv.innerHTML = this.score;
        document.body.appendChild(scoreDiv);
    }

    // displays the new configuration
    displayAgain() {
        // change score
        const elementScore = document.getElementById('score');
        elementScore.parentNode.removeChild(elementScore);
        let scoreDiv = document.createElement('div');
        scoreDiv.setAttribute('id', 'score');
        scoreDiv.innerHTML = this.score;
        document.body.appendChild(scoreDiv);

        // change grid
        const element = document.getElementById('grid');
        element.parentNode.removeChild(element);
        const gridDiv = this.createGrid();
        document.body.appendChild(gridDiv);

        // game over
        if(!this.switchPossible()){
            let gameOver = document.createElement('div');
            gameOver.setAttribute('id', 'gameOver');
            gameOver.innerHTML = 'GAME OVER';
            document.body.appendChild(gameOver);
            return;
        }
    }

    removeRows(foundRows){
        for(let i = 0; i < foundRows.length; i++){
            for(let k = 0; k < foundRows[i].length; k++){
                this.jewels[foundRows[i][k].x][foundRows[i][k].y] = new Jewel(foundRows[i][k].x, foundRows[i][k].y, 'empty',this.switchCallback);
            }
        }
    }

    fallDown2(){
        // iterate over columns
        for(let i = 0; i < 8; i++) {
            // inside column
            for (let j = 7; j >= 0; j--) {
                if(this.jewels[i][j].color === 'empty'){
                    for(let k = j-1; k >= 0; k--){
                        if(this.jewels[i][k].color !== 'empty'){
                            this.jewels[i][j].color = this.jewels[i][k].color;
                            this.jewels[i][k].color = 'empty';
                            break;
                        }
                    }
                }
            }
        }
    }

    // only works for one gap, not in use anymore
    fallDown(){
        let firstEmpty = 100;
        let lastEmpty = 100;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if((j !== 0 && this.jewels[i][j].color === 'empty' && this.jewels[i][j-1].color !== 'empty') ||
                    (j === 0 && this.jewels[i][j].color === 'empty')){
                    firstEmpty = j;
                }
                if((j !== 7 && this.jewels[i][j].color === 'empty' && this.jewels[i][j+1].color !== 'empty') ||
                    (j === 7 && this.jewels[i][j].color === 'empty')){
                    lastEmpty = j;
                }
            }
            if(firstEmpty !== 0 && firstEmpty !== 100){
                for(let j = 0; j < firstEmpty; j++){
                    this.jewels[i][lastEmpty-j].color = this.jewels[i][firstEmpty-j-1].color;
                    this.jewels[i][firstEmpty-j-1].color = 'empty';
                }
            }
            firstEmpty = 100;
            lastEmpty = 100;
        }
    }

    generateNewJewels(){
        const colors = ['darkblue', 'darkpink', 'green', 'lightblue', 'lightpink', 'orange',
            'purple', 'red', 'turquois'];
        for(let j = 0; j < 8; j++){
            for(let i = 0; i < 8; i++) {
                if(this.jewels[i][j].color === 'empty'){
                    const nr = Math.floor(Math.random() * (colors.length));
                    const color =  colors[nr];
                    this.jewels[i][j].color = color;
                }
            }
        }
    }

}

class Jewel{
    constructor(x,y,color, switchCallback) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.switchCallback = switchCallback;
    }

    createJewel(){
        this.jewelImg = document.createElement('img');
        this.jewelImg.setAttribute('class','jewel');
        const src = 'Images/'+this.color+'.png';
        this.jewelImg.setAttribute('src', src);
        this.jewelImg.onclick = this.switch;
        return this.jewelImg;
    }

    clicked(){
        this.jewelImg.setAttribute('id','clicked');
    }

    unclicked(){
        this.jewelImg.setAttribute('id','');
    }

    switch = () => {
        this.switchCallback(this);
    }
}