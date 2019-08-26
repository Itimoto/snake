//***********************************
// Processing JS source code
// snakeGame v1.0: Cleaned up Source
// Can move Snek, Eat Snacc, and Grow Big
// Less cluttered background
// Speeds up with progress
//***********************************


int unitLength = 30; //Affects tile size
int scale = 18; //Affects canvas size
int dir = 0; //snake's direction

int speed = 4; //Tied to framerate

Snek[] bigSnek = new Snek[1];
bigSnek[0] = new Snek(0, 0); //Establishing the Head of the Snake

Snacc snacc = new Snacc();

void setup()
{
    size((2 * scale * unitLength) - 10, (scale * unitLength) - 10); //defines dimension of the display window in units of pixels
    frameRate(speed);    
}


void draw() /*called directly after setup() and continuously executes code in block until prgrm is stopped or noLoop() is called */
{
    background(0);
	
    snacc.update();

    for (i = bigSnek.length-1; i > 0; i--){
        bigSnek[i].x = bigSnek[i-1].x; //Working from the back, we'll set the value of the last tile to be the 2nd to last, etc.
        bigSnek[i].y = bigSnek[i-1].y;
        bigSnek[i].update();
    }
   
    bigSnek[0].move(dir);
    bigSnek[0].update();
}


void keyPressed(){
	
    if(keyCode == UP || keyCode == DOWN || keyCode == RIGHT || keyCode == LEFT){
        dir = keyCode; //37 (left) 38 (up) 39 (right) 40 (down)
    }
	
    if(key == 'r'){ //reset button
        bigSnek = { }; //reset the array
        bigSnek[0] = new Snek(0, 0, true); //re-establish new head
        dir = 0;
        snacc = new Snacc(); //for new coordinates
        loop();
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\


class Snek {

  int x, y;

Snek(int xPos, int yPos) { //Initializing Portion

   x = xPos;
   y = yPos;   

}

void update() { //Updates the visuals
    fill(230);
    rect(x, y, unitLength - 10, unitLength - 10);
}

void move(int dir){

    if ((dir == UP && y-unitLength < 0) || (dir == DOWN && y+unitLength >= scale*unitLength)){ //Checking bounds...
        noLoop();
        this.update(); // 0 < y < max dimension
        return;
    }

    if ((dir == LEFT && x-unitLength < 0) || (dir == RIGHT && x+unitLength >= 2*scale*unitLength)){
        noLoop();
        this.update(); // 0 < x < max dimension
        return;
    }


    if (x % unitLength == 0 && y % unitLength == 0) { //ensures the snake is lined up with each tile
        if (dir == UP) {
            y -= (unitLength); // move up a tile
        } else if (dir == DOWN) {
            y += (unitLength);
        } else if (dir == RIGHT) {
            x += (unitLength);
        } else if (dir == LEFT) {
            x -= (unitLength);
        }
    }
    
    for(i = 1; i < bigSnek.length; i++){ //Checks if it's touching any previous instances
        if(this.x == bigSnek[i].x && this.y == bigSnek[i].y){
            noLoop(); //'Dead,' effectively
        }
    }
}
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\


class Snacc {
    int x, y;

    Snacc(){
        newCoordinates = genLocation();
        x = newCoordinates.x;
        y = newCoordinates.y;
    }

    void genLocation(){ //recursively generates new coordinates not touching the snake
        potX = unitLength*round(random(0, scale - 1));
        potY = unitLength*round(random(0, scale - 1));

        for(i = 0; i < bigSnek.length; i++){
            if(potX == bigSnek[i].x || potY == bigSnek[i].y){
                return genLocation(); //repeat until no match; will 'chain' return the final values
                break; //we don't want to keep looping it in this case
            } else {
                var loc = {x: potX, y: potY};
                return loc;
            }
        }
    }

    void update(){
        fill(201, 22, 22);
        rect(x + (unitLength / 5), y + (unitLength / 5), (unitLength) / 4, (unitLength) / 4);
        
        if(x == bigSnek[0].x && y == bigSnek[0].y){ //On eating the snacc:
            newCoordinates = genLocation();
            x = newCoordinates.x;
            y = newCoordinates.y;
	    			
	    bigSnek = append(bigSnek, new Snek(bigSnek[bigSnek.length-1].x, bigSnek[bigSnek.length-1].y)); //new tile at previous tile's x&y
						
	    speed++;
	    frameRate(speed);
        }
    }
       
}
