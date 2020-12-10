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
            // switching
            const firstColor = this.clickedJewels[0].color;
            const secondColor = this.clickedJewels[1].color;
            this.jewels[this.clickedJewels[0].x][this.clickedJewels[0].y].color = secondColor;
            this.jewels[this.clickedJewels[1].x][this.clickedJewels[1].y].color = firstColor;

            // displaying
            this.displayAgain();
            this.clickedJewels = [];


            const removeAndFill = () => {
                this.foundRows = this.checkForRow();
                if(this.foundRows.length === 0){
                    return;
                }
                // check for row, remove and display again
                setTimeout(() => {
                    // this.foundRows = this.checkForRow();
                    this.removeRows(this.foundRows);
                    this.displayAgain();

                    // move jewels down
                    setTimeout(() => {
                        this.fallDown();
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

    displayAgain(){
        const element = document.getElementById('grid');
        element.parentNode.removeChild(element);
        const gridDiv = this.createGrid();
        document.body.appendChild(gridDiv);
    }

    removeRows(foundRows){
        for(let i = 0; i < foundRows.length; i++){
            this.jewels[foundRows[i][0].x][foundRows[i][0].y] = new Jewel(foundRows[i][0].x, foundRows[i][0].y, 'empty',this.switchCallback);
            this.jewels[foundRows[i][1].x][foundRows[i][1].y] = new Jewel(foundRows[i][1].x, foundRows[i][1].y, 'empty',this.switchCallback);
            this.jewels[foundRows[i][2].x][foundRows[i][2].y] = new Jewel(foundRows[i][2].x, foundRows[i][2].y, 'empty',this.switchCallback);
        }
    }

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

    switch = () => {
        this.switchCallback(this);
    }
}