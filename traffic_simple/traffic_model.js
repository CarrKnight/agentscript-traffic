// 
// Welcome to the model editor! It is similar to the tutorial code blocks
// you saw before, but more flexible--everything can be customized here.
// I'll walk you through it in these comments.
// 

// 
// The first thing to notice is that there are two tabs up top:
// the model tab, and the view tab. The model tab is where you write
// code describing agent behavior, just like before.
// 
// The view tab is totally new. That's where you customize the size of
// the world, and how agents and patches are drawn to the screen.
// 

import Model from 'https://code.agentscript.org/src/Model.js'
import Patch from 'https://code.agentscript.org/src/Patch.js'

const DEFAULT_NUMBER_OF_CARS = 20
const DECELERATION = 0.026
const ACCELERATION = 0.0045
const MINIMUM_X = -25;
// 
// The SlimeMoldModel below is based on the code we wrote in the tutorial,
// with two extra things added:
// 
//  1) turtles now intentionally move toward patches with more pheromone
//  2) pheromone diffuses over time to neighboring patches
// 

export default class TrafficBasicModel extends Model {



    constructor() {
        super({

            "maxX": 25,
            "minX": MINIMUM_X,
            "minY": -4,
            "maxY": 4
        })

        //data we want to use
        this.averageSpeed = 0
        this.maxSpeed = 0
        this.redCarSpeed = 0


        // parameters we want to use. 
        this.numberOfCars = DEFAULT_NUMBER_OF_CARS;
        this.speed_limit = 1
        this.speed_min = 0
        this.deceleration = DECELERATION
        this.acceleration = ACCELERATION
    }




    // 
    // The setup function is like a "run once" block. It gets
    // executed only once, to setup the model.
    // 

    setup() {



        // This line should look familiar. One important difference:
        // in the editor, you say "this.turtles" instead of "model.turtles"
        this.turtles.create(this.numberOfCars)

        // The next line is what gives all patches a property called
        // "pheromone", equal to 0. We were doing this behind the scenes before.
        this.patches.setDefault('color', "black")

        let counter = 0
        // Give each turtle a random starting position
        this.turtles.ask(turtle => {
            turtle.id = counter++;
            //give each turtle the color blue
            //notice that this is just a string, colors are part of view
            this.turtles.color = "blue"

            // put them somewhere in the road
            const [x, y] = this.world.randomPoint()
            turtle.setxy(x, 0)
            turtle.speed = 0.1 + Math.random() * 0.9

            //they all look forward!
            turtle.heading = 90

        })

        //separate-cars
        //now we are going to push the turtle forward until there
        //no more turtles on the same patch
        this.turtles.ask(turtle => {

            while (turtle.patch.turtlesHere.length > 1) {
                console.log("moved forward!")
                turtle.forward(1)
            }


        })


        //force the first turtle to be red colored
        this.turtles.first().color = "red"

        // color the road white
        this.patches.ask(patch => {
            this.setup_road(patch)
        })

         }

    // 
    // The step function is like a "run forever" block. It gets
    // executed over and over again.
    // 

    step() {
        this.turtles.ask(turtle => {

            //get the patch ahead
            let patchAhead = turtle.patchAhead(1)
            if(patchAhead === undefined)
                patchAhead = this.patches.patch(MINIMUM_X, 0)
            const carsAhead = patchAhead.turtlesHere
            if(carsAhead.length == 0){
                this.speedUp(turtle)
            }
            else{
                this.slowDown(turtle,carsAhead.first())
            }
            
            if(turtle.speed < this.speed_min | isNaN(turtle.speed) | this.speed_min > this.speed_limit)
            {
        //        console.log(`${turtle.id} was going BELOW speed_min; its speed was ${turtle.speed}`)
                turtle.speed = this.speed_min

            }
            if(turtle.speed > this.speed_limit)
            {
          //      console.log(`${turtle.id} was going ABVE speed limit; its speed was ${turtle.speed}`)

                turtle.speed = this.speed_limit
            }
            turtle.forward(turtle.speed)


        })

        // This part is new. patches.diffuse() causes each patch to give
        // some of its pheromone to its neighbors. Try changing the
        // diffusion amount and see what happens.

        // Evaporate the pheromone over time
        this.patches.ask(_patch => {

        })


        //collect data
        let total = 0;
        let max = 0
        
        for(const turtle of this.turtles){
            total += turtle.speed
            if(turtle.speed>max)
                max = turtle.speed
            
        }
        this.averageSpeed = total / this.turtles.length
        this.maxSpeed = max
        this.redCarSpeed = this.turtles[0].speed
      //  console.log(`max: ${this.maxSpeed}, avg: ${this.averageSpeed}`)

    }

    slowDown(turtle_behind,
        turtle_ahead) {

        turtle_behind.speed =
            turtle_ahead.speed - this.deceleration

   //     console.log(`${turtle_behind.id} saw in front of it ${turtle_ahead.id} and is now changing its speed to ${turtle_behind.speed}`)
    }

    speedUp(turtle){
        turtle.speed = turtle.speed + this.acceleration
    }

    /**
     * just adds color. Color in agentscript is actually not part of the patch
     * object. It is only part of the 
     * @param {Patch} patch 
     */
    setup_road(patch) {
        if (patch.y < 2 & patch.y > -2) {
            patch.color = "white"
        }
        else {
            patch.color = "black"
        }

    }

}

