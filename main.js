const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let playAgain;

const gameSetup = () => {
    console.log('\nHello and welcome to my version of find your hat.\nTo win this game you must make your way to the hat - ^.\nWalking into a hole - O, would terminate the game and you might also be eaten by crocodiles.\nFirst we need to define the size of the field...');
    const userInputWidth = prompt('\nPlease enter the width of the field (number)   ');
    const userInputHeight = prompt('\nNow the height (number)   ');
    const userInputHolesPercent= prompt('You can define the percentage of holes in the field (number 1-100) ');
    const fieldDefinition = {
        height: userInputHeight,
        width: userInputWidth,
        holesPercent: userInputHolesPercent
    }
    return fieldDefinition;
}


const play = () => {
    const fieldDefinition =  gameSetup();
    const gameField = new Field(Field.generateField(fieldDefinition));
    gameField.runGame();
}

class Field {
    constructor(fieldArray = [[]]) {
        this.field = fieldArray;
        this.userLocationX = 0;
        this.userLocationY = 0;
        this.gameOn = true;
        this.field[0][0] = pathCharacter;
    }

    printField() {
        for (let i=0; i < this.field.length; i++) {
            let row = this.field[i].join('').toString();
            console.log(row);
        } 
    }

    getUserMove() {
        let userInput = prompt('\nWhere to? (u = up /d = down /l = left /r = right)  ');
        switch(userInput) {
            case 'u': 
                this.userLocationY -=1;
                break
            case 'd': 
                this.userLocationY +=1;
                break;
            case 'l':
                this.userLocationX -=1;
                break;
            case 'r':
                this.userLocationX +=1;
                break;
            default:
                console.log(`Choosing ${userInput} won't get you anywhere...`);
        }
    }

    userPosition() {
        const x = this.userLocationX;
        const y = this.userLocationY;
        if(x < 0 || y < 0 || x === this.field[0].length || y === this.field.length) {
            console.log('\nYou are out of the field, game over!');
            this.gameOn = false;
        } else {
            switch (this.field[y][x]) {
                case hat:
                    console.log('\nYou win! you found the hat!');
                    this.gameOn = false;
                    break;
                case hole:
                    console.log('\nYou fell into a hole, game over!');
                    this.gameOn = false;
                    break;
                case fieldCharacter: 
                    this.field[y][x] = pathCharacter;
                    break;
                default:
                    break;
            }
        }
    }

    static generateField( fieldDefinition ) {
        const { height, width, holesPercent } = fieldDefinition;

        let fieldArray = new Array(height);
        
        for(let i=0; i<height; i++) {
            fieldArray[i] = new Array(width)
        }

        for(let i=0; i < height; i++) {
            for(let j=0; j<width; j++){
                const random = Math.floor(Math.random() * 100);
                if(random < holesPercent) {
                    fieldArray[i][j] = hole;
                } else {
                    fieldArray[i][j] = fieldCharacter;
                }
            }
        }

        let hatX, hatY;
        do {
            hatX = Math.floor(Math.random() * width);
            hatY = Math.floor(Math.random() * height);
        } while(hatX===0 && hatY===0);
        
        fieldArray[hatY][hatX] = hat;
        return fieldArray;
    }

    runGame() {
        while(this.gameOn) {
            this.printField();
            this.getUserMove();
            this.userPosition();
        }
    }

}

do {
    play();
    playAgain = prompt('\nWould you like to play again? (y/n)   ');
    if (playAgain == 'n') {
        console.log('\n\nThank you for playing my silly game and goodbye!\n\n\n');
    }
}   while(playAgain !== 'n');

