// JavaScript source code
// snakeGame v0.1
//

Snek[] bigSnek = new Snek[1];
bigSnek[0] = new Snek(0, 0); //Establishing the Head of the Snake

bool snaccEaten = false;
bool dead = false;


int unitLength = 30;
int scale = 25;
int dir = 0; //will store direction of the snake

Snacc snacc = new Snacc();

void setup()
{
    size((scale * unitLength) - 10, (scale * unitLength) - 10); //defines dimension of the display window in units of pixels
    frameRate(10);    

    println("Initialized");
}


void draw() /*called directly after setup() and continuously executes code in block until prgrm is stopped or noLoop() is called */
{
    background(150, 150, 150); //Setup tiled background for each frame
    fill(100, 100, 100);
    for (int x = 0; x <= (scale * unitLength); x += unitLength) {
        for (int y = 0; y <= (scale * unitLength); y += unitLength) {
            rect(x, y, unitLength - 10, unitLength - 10);
        }
    }

    if(dead){
        noLoop();
    }

    snacc.update();

    if(snaccEaten == true){
        snaccEaten = false; //reset bool
        bigSnek = append(bigSnek, new Snek(bigSnek[bigSnek.length-1].x, bigSnek[bigSnek.length-1].y));
    }

    for (i = bigSnek.length-1; i > 0; i--){
        bigSnek[i].x = bigSnek[i-1].x; //Working from the back, we'll set the value of the last tile to be the 2nd to last, etc.
        bigSnek[i].y = bigSnek[i-1].y;
        bigSnek[i].update();
    }
   
    bigSnek[0].move(dir);
    bigSnek[0].update();

}


void keyPressed(){
    println("Key Pressed");

    if(keyCode == UP || keyCode == DOWN || keyCode == RIGHT || keyCode == LEFT){
        dir = keyCode; //we've encoded the direction for the snake as a (int) code
        println(dir); //37 (left) 38 (up) 39 (right) 40 (down)
    }; 
	
    if(key == 'r'){ //reset button
        bigSnek = { }; //reset the array
        bigSnek[0] = new Snek(0, 0, true); //re-establish new head
        dead = false;
        dir = 0;
        snacc = new Snacc();
        loop();
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\

class Snek {

  int x, y;
  int r, g, b;

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
        dead = true;
        this.update(); // 0 < y < max dimension
        return;
    }

    if ((dir == LEFT && x-unitLength < 0) || (dir == RIGHT && x+unitLength >= scale*unitLength)){
        dead = true;
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
        } else {
            //println("invalid direction");
        }
    }
    
    for(i = 1; i < bigSnek.length; i++){ //Checks if it's touching any previous instances
        if(this.x == bigSnek[i].x && this.y == bigSnek[i].y){
            dead = true;
        }
    }
}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\\

class Snacc {
    int x, y;

    Snacc(){
        println("snacc function");
        newCoordinates = genLocation();
        x = newCoordinates.x;
        y = newCoordinates.y;
        println("x: " + x + " y: " + y);

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
        
        if(x == bigSnek[0].x && y == bigSnek[0].y){
            newCoordinates = genLocation();
            x = newCoordinates.x;
            y = newCoordinates.y;
            println("x: " + x + " y: " + y);
            snaccEaten = true;
        }
    }
       
}
