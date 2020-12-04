function playGame(){
    let grid = new Grid();
    let length = grid.foundRows.length;
    // to construct initial grid without 3-in-a-rows
    while(length != 0){
        grid = new Grid();
        length = grid.foundRows.length;
    }
    let gridDiv = grid.createGrid();
    document.body.appendChild(gridDiv);
}

class Grid{
    constructor() {
        this.jewels = this.createJewels();
        this.foundRows = this.checkForRow();
        this.clickedJewels = [];
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

    checkForRow(){
        let foundRows = [];

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
                    }
                }
            }
        }
        // check for diagonals
        for(let j = 0; j < 8-2; j++){
            for(let i = 0; i < 8-2; i++) {
                if(this.jewels[i][j].color === this.jewels[i+1][j+1].color && this.jewels[i+1][j+1].color === this.jewels[i+2][j+2].color){
                // found 3-in-a-diagonal!
                let foundDiagonal = [];
                foundDiagonal.push(this.jewels[i][j]);
                foundDiagonal.push(this.jewels[i+1][j+1]);
                foundDiagonal.push(this.jewels[i+2][j+2]);
                    if(!foundRows.includes(foundDiagonal)) {
                        foundRows.push(foundDiagonal);
                    }
                }
            }
        }
        // check for backwards diagonals
        for(let j = 0; j < 8-2; j++){
            for(let i = 0+2; i < 8; i++) {
                if(this.jewels[i][j].color === this.jewels[i-1][j+1].color && this.jewels[i-1][j+1].color === this.jewels[i-2][j+2].color){
                    // found 3-in-a-diagonal! (backwards)
                    let foundDiagonal = [];
                    foundDiagonal.push(this.jewels[i][j]);
                    foundDiagonal.push(this.jewels[i-1][j+1]);
                    foundDiagonal.push(this.jewels[i-2][j+2]);
                    if(!foundRows.includes(foundDiagonal)) {
                        foundRows.push(foundDiagonal);
                    }
                }
            }
        }
        return foundRows;
    }

    switchCallback = (jewel) => {
        if(this.clickedJewels.length === 0){
            this.clickedJewels.push(jewel);
        }
        if(this.clickedJewels.length === 1){
            // only push second click if next to first
            if(((jewel.x === this.clickedJewels[0].x+1 || jewel.x === this.clickedJewels[0].x-1) && jewel.y === this.clickedJewels[0].y)
            ||((jewel.y === this.clickedJewels[0].y+1 || jewel.y === this.clickedJewels[0].y-1) && jewel.x === this.clickedJewels[0].x)){
                this.clickedJewels.push(jewel);
            }
        }
        if (this.clickedJewels.length === 2) {
            console.log(this.clickedJewels);
            // saving
            const firstJewel = this.clickedJewels[0];
            const secondJewel = this.clickedJewels[1];
            const firstX = firstJewel.x;
            const firstY = firstJewel.y;
            const secondX = secondJewel.x;
            const secondY = secondJewel.y;

            // switching
            this.jewels[firstJewel.x][firstJewel.y] = secondJewel;
            firstJewel.x = secondX;
            firstJewel.y = secondY;
            this.jewels[secondJewel.x][secondJewel.y] = firstJewel;
            secondJewel.x = firstX;
            secondJewel.y = firstY;

            // displaying
            const element = document.getElementById('grid');
            element.parentNode.removeChild(element);
            const gridDiv = this.createGrid();
            document.body.appendChild(gridDiv);
            this.clickedJewels = [];

            // check for row, remove and display again
            // ...
        }
    }

    fallDown(){

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

    switch = () => {
        this.switchCallback(this);
    }
}