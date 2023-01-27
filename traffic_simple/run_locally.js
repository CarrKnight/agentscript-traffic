import * as util from 'https://code.agentscript.org/src/utils.js'
import TrafficBasicModel from './traffic_model.js'
// This is what you need to run your model in your own html file.
// First instanciate the Model using no arguments: uses Model's default
const model  = new TrafficBasicModel()
console.log("instantiation")
 // Now init and run the model 500 steps async (don't block browser)
 await model.startup()
 console.log("startup")
 model.setup()
 await util.timeoutLoop(() => {
     model.step()
 }, 500)
 // That's it!
