import * as util from 'https://code.agentscript.org/src/utils.js'
import TwoDraw from 'https://code.agentscript.org/src/TwoDraw.js'
import Animator from 'https://code.agentscript.org/src/Animator.js'
import Color from 'https://code.agentscript.org/src/Color.js'
import TrafficBasicModel from './traffic_model.js'
import * as chart from 'https://cdn.jsdelivr.net/npm/chart.js'



// DrawOptions here due to using model
// const patchColors = model.patches.map(p => {
//     switch (p.color) {
//         case 'white':
//             return Color.typedColor('white')
//         default:
//             return Color.typedColor('black')
//     }
// })

const targetedSizeInPx = 800


const carPath = function (ctx) {


    // ctx.save();

    // ctx.scale(0.1,0.1)

    // let path = new Path2D('M507.976 226.172c-3.25-3.781-7.984-5.984-12.953-5.984h-104.11a21.235 21.235 0 0 1-16.734-8.156l-45.875-58.656a21.279 21.279 0 0 0-16.734-8.156H145.334a21.283 21.283 0 0 0-18.422 10.656l-36.953 64.313H16.991c-5.016 0-9.797 2.219-13.016 6.063S-.619 235.19.256 240.111l6.969 64.5c1.172 10.766 10.234 18.953 21.078 18.969l47.719.109v-14.984l-47.672-.109a6.262 6.262 0 0 1-6.219-5.594l-7.125-65.484.453-1.641 1.531-.688h72.969c5.375 0 10.313-2.875 13.016-7.531l36.938-64.297a6.23 6.23 0 0 1 5.422-3.141h166.234c1.891 0 3.75.891 4.922 2.391l45.875 58.688c6.938 8.813 17.328 13.891 28.547 13.891h104.11l1.531.688.516.672.172-.297-17.625 68.688c-.672 2.766-3.188 4.703-6.063 4.703l-62.172-.125V324.5l62.141.141a21.267 21.267 0 0 0 20.625-15.984l17.641-68.734c.78-4.923-.595-9.954-3.813-13.751z m177.209 323.891 133.016.39v-14.984l-133.016-.375z M360.819 282.016a42.246 42.246 0 0 0-29.984 12.406 42.328 42.328 0 0 0-12.422 29.984c.016 23.406 18.969 42.375 42.406 42.375 23.422 0 42.375-18.984 42.375-42.375a42.296 42.296 0 0 0-12.391-29.984 42.3 42.3 0 0 0-29.984-12.406zm0 63.468c-11.672-.016-21.078-9.453-21.094-21.078 0-11.672 9.406-21.094 21.094-21.094 11.656 0 21.078 9.422 21.078 21.094-.016 11.625-9.438 21.063-21.078 21.078zM126.616 282.016a42.244 42.244 0 0 0-29.984 12.406c-7.656 7.625-12.406 18.313-12.406 29.984.016 23.391 18.953 42.375 42.391 42.375 23.422 0 42.391-18.969 42.391-42.375-.002-23.453-18.986-42.39-42.392-42.39zm0 63.468c-11.672-.016-21.063-9.453-21.078-21.078 0-11.672 9.406-21.094 21.078-21.094 11.656.016 21.078 9.422 21.094 21.094-.016 11.625-9.454 21.063-21.094 21.078z');
    // ctx.stroke(path);
    // ctx.restore()

    ctx.arc(0, 0, 0.5, 0, 2 * Math.PI)

}

const red = Color.typedColor('red')
const blue = Color.typedColor('blue')
const white = Color.typedColor('white')
const black = Color.typedColor('black')

const drawOptions = {
    turtlesShape: "car",
    turtlesColor: t => {

        switch (t.color) {
            case 'red':
                return red
            default:
                return blue
        }
    },
    turtlesSize: 1,
    textProperty: 'id',
    textColor: 'white',
    textSize: 0.8,
    patchesColor: p => {
        switch (p.color) {
            case 'white':
                return white
            default:
                return black
        }

    }
}


export default class TrafficGUI {


    constructor(containerDiv) {

        //create model container
        this.modelContainer = document.createElement('div');
        this.modelContainer.id = "current-model-div"
        //create chart container!
        this.chartContainer = document.createElement('div')
        this.chartContainer.id = "current-chart-div"
        this.chartCanvas = document.createElement('canvas')
        this.chartCanvas.id = "current-linechart"
        this.chartContainer.appendChild(this.chartCanvas)
        //put them both in
        containerDiv.appendChild(this.modelContainer)
        containerDiv.appendChild(this.chartContainer)
        this.containerDiv = containerDiv

        this.model = new TrafficBasicModel()

        //create the sliders
        this.slidecontainer = document.createElement('div');
        this.buildSliders()
        //also create the play/pause switch
        this.onoff = document.createElement("input")
        this.onoff.type = "button"
        this.onoff.value = "Start"
        const onoff = this.onoff
        const gui = this
        this.onoff.onclick = function () {

            if(onoff.value=="Start")
            {
                onoff.value= "Running"
                gui.start()
                return;
            }
            if (onoff.value == "Paused")
                onoff.value = "Running"
            else
                onoff.value = "Paused"
        }
        this.slidecontainer.appendChild(document.createElement('br'))
        this.slidecontainer.style.width = 800
        this.slidecontainer.appendChild(this.onoff)

    }


    buildSliders() {

        this.addSlider("numberOfCars", 1, 41, 20, "Number of Cars");
        this.addSlider("speed_limit", 0, 2, 1, "Speed limit", 0.01);


        this.containerDiv.prepend(this.slidecontainer)

        //.oninput = function() {
        //    myFunction()
        //};

    }

    addSlider(variableNameInModel, min, max, initialValue, labelName, step = 1) {
        const slider = document.createElement('input');
        slider.id = this.containerDiv.id + "_slider_";
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step
        slider.value = initialValue;
        slider.style.width = "100%"
        this.model[variableNameInModel] = Number(slider.value)


        const label = document.createElement("h4");
        label.textContent = labelName + ": ";
        //label.for = slider.id;
        const valueLabel = document.createElement("label");
        valueLabel.textContent = slider.value;
        valueLabel.for = slider.id;

        const gui = this
        slider.oninput = function () {
            valueLabel.textContent = slider.value;
            gui.model[variableNameInModel] = Number(slider.value)
        };

        const thisSlider = document.createElement("div")
        thisSlider.appendChild(label);
        thisSlider.appendChild(document.createElement('br'));
        thisSlider.appendChild(slider);
        thisSlider.appendChild(valueLabel);

        this.slidecontainer.appendChild(thisSlider);

    }

    async start() {

        //start the model
        const model = this.model
        await model.startup()
        alert(model.numberOfCars)
        model.setup()


        const patchPixelSize = Math.floor(targetedSizeInPx/model.world.width)
        

        //start the view
        const view = new TwoDraw(
            model,
            {
                div: this.modelContainer.id,
                patchSize: patchPixelSize
            },
            drawOptions
        )
        view.turtlesView.shapes.addPath("car", carPath)

        const expected_width = patchPixelSize * model.world.width
        //prep the charts!
        this.chartContainer.style.width = expected_width

        //create the chart
        const line = new chart.Chart(this.chartCanvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Average Speed',
                    data: [],
                    borderWidth: 1
                },
                {
                    label: 'Max Speed',
                    data: [],
                    borderWidth: 1
                }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        ticks: {
                          display: false,
                        },
                        grid: {
                            display: false
                        }
                      }
                },
                animation: {
                    duration: 0
                },
                plugins: {
                    legend: {
                        position: 'top',
                        display: false
                    },
                    tooltip: {
                        animation: false
                    },
                    title: {
                        display: true,
                        text: 'Speed Chart'
                    }
                }
            }
        });

        //gui loop
        const anim = new Animator(
            () => {

                if (this.onoff.value == "Paused")
                    return;

                model.step()
                view.draw()

                //add data
                const data = line.data

                data.labels.push(model.ticks)
                data.datasets[0].data.push(model.averageSpeed)
                data.datasets[1].data.push(model.maxSpeed)
                
                if(data.datasets[0].data.length > 500)
                {
                    data.datasets[0].data.shift()
                    data.datasets[1].data.shift()
                }
                line.update('none')

            },
            -1, // run forever
            30 // 30 fps
        )
        //put it together
        util.toWindow({ model, view, anim })

    }






}