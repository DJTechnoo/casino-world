import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRef, useEffect, memo } from 'react';

const WheelOfFortune = ({participants, play, setWinner}) => {

    (({ merge, wrap }) => {

    wrap(
        Highcharts.seriesTypes.pie.prototype,
        'getDataLabelPosition',
        function (proceed, point, distance) {
            const pos = proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            if (this.options.dataLabels.rotationMode === 'perpendicular') {
                pos.alignment = 'left';
            }
            return pos;
        }
    );

    // Wrap the placeDataLabels method to apply the rotation mode
    wrap(
        Highcharts.seriesTypes.pie.prototype,
        'placeDataLabels',
        function (proceed) {
            const seriesDLOptions = this.options.dataLabels;

            // Call the original placeDataLabels method
            proceed.apply(this);

            // Apply rotation mode if specified
            for (const point of this.points) {
                for (const dataLabel  of point.dataLabels || []) {
                    const options = merge(seriesDLOptions, dataLabel.options);
                    if (options.rotationMode === 'perpendicular') {
                        const radius = this.center[2] / 2,
                            vertical = options.style.writingMode === 'vertical-rl',
                            halfHeight = vertical ? 0 : this.chart.renderer.fontMetrics(dataLabel).h / 2,
                            attr = {
                                x: this.center[0] - radius - options.distance,
                                y: this.center[1] - halfHeight,
                                rotationOriginX: radius + options.distance,
                                rotationOriginY: halfHeight,
                                rotation: point.angle * (180 / Math.PI) + 180
                            };

                        // Avoid animating from far side of the circle
                        if (typeof dataLabel.rotation === 'number') {
                            if (attr.rotation > dataLabel.rotation + 180) {
                                attr.rotation -= 360;
                            } else if (attr.rotation < dataLabel.rotation - 180) {
                                attr.rotation += 360;
                            }
                        }

                        if (options.style.writingMode === 'vertical-rl') {
                            attr.x = this.center[0];
                            attr.y = this.center[1] - radius + options.distance;
                            attr.rotationOriginX = 0;
                            attr.rotationOriginY = radius - options.distance;                                
                            attr.rotation -= 90;
                        }
                
                        dataLabel[
                            dataLabel.placedPerpendicular ? 'animate' : 'attr'
                        ](attr);

                        dataLabel.placedPerpendicular = true;

                    }
                }
            }
        }
    );

})(Highcharts);

    const chartComponent = useRef(null),
        animationSpd = 10;
    let currentWinner = -1,
        foundPossibleWinner = false;

    Highcharts.setOptions({colors: ['#ffd319', '#ff2975', '#c700b5','#ff901f', '#b000ff']})

    let physics = {
        force: 0,
        angleVel: 0,
        angle: 0,
        prevAngle: 0, // only used to calculate winner
        strength: 0.0001,
        drag: 0.997,
        threshold: 0.1,
        targ: 0,
        isActive: false
    };

    const radToDeg = r => r * 180 / Math.PI;

    const findWinner = data => {
        const winThreshold = 360 - 360 / (data.length);
        let startAngle;

        for (let i in data) {
            startAngle = radToDeg(data[i].shapeArgs.start) + 90;
            if (startAngle > 360) {
                startAngle -= 360;
            }
            if (startAngle > winThreshold) {
                return i;
            }
        }
        return -1;
    }


    useEffect(() => {
        if (!play) {
            return;
        }

        // How many degrees to spin for each iteration
        const chart = chartComponent.current.chart;
        let diff = 4 + Math.random() * 1,
            startAngle = chart.series[0].options.startAngle,
            angleToUse = 0;


        // Draw the triangle
        chart.renderer.path([
            ['M', chart.chartWidth / 2 - 10, chart.plotTop],
            ['L', chart.chartWidth / 2 + 10, chart.plotTop],
            ['L', chart.chartWidth / 2, chart.plotTop + 40],
            ['Z']
        ])
        .attr({
            fill: 'black'
        })
        .add().toFront();

        // Game loop
        const interval = setInterval(() => {
            if (chart && chart.series[0].data.length) {
                if (!physics.isActive) {
                    startAngle += diff;
                    if (startAngle > 360) {
                        startAngle -= 360;
                    }
                    diff *= 0.998;
                    angleToUse = startAngle;

                    // If we should activate spring physics.
                    if (diff < physics.threshold) {
                        physics.isActive = true;
                        physics.targ = startAngle;
                        physics.angleVel = physics.threshold * 0.998;
                        physics.angle = startAngle;
                    }
                } else { // spring physics
                    physics.prevAngle = physics.angle;
                    physics.force = physics.targ - physics.angle;
                    physics.force *= physics.strength;
                    physics.angleVel *= physics.drag;
                    physics.angleVel += physics.force;
                    physics.angle += physics.angleVel;

                    angleToUse = physics.angle;

                    /*
                        Sometimes it's obvious when an item is about to win.
                        Instead of waiting for the wheel to come to a complete stop
                        we can calculate this earlier.

                        Once the wheel changes direction we select a temporary
                        winner. When the wheel changes direction a second time,
                        we check whether the temporary winner got
                        selected again. This MUST happen consecutively.
                    */
                    if (physics.prevAngle >= physics.angle && currentWinner < 0) {
                        currentWinner = findWinner(chart.series[0].data);
                        foundPossibleWinner = true;
                    } else if (
                        physics.prevAngle <= physics.angle &&
                        foundPossibleWinner
                    ) {

                        const nextWinner = findWinner(chart.series[0].data);
                        
                        if (currentWinner ==  nextWinner) {
                            const winnerName = chart.series[0].data[currentWinner].name;
                            chart.series[0].data[currentWinner].update({sliced: true});

                            setWinner(winnerName);

                        } else {
                            currentWinner = -1;
                            foundPossibleWinner = false;
                        }
                    }
                }

                chart.series[0].update({
                    startAngle: angleToUse
                });
            }
        }, animationSpd);

        return () => clearInterval(interval);
      }, [play, participants]);

    const options = {
        chart: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            width: 1000,
            height: '70%',
            animation: false,
        },

        credits: {
            enabled: false
        },

        title: {
            text: ''
        },

        plotOptions: {
        pie: {
            size: 600,
            //slicedOffset: 30,
            borderWidth: 0,
            dataLabels: {
                allowOverlap: true,
                //align: 'left',
                // backgroundColor: 'contrast',
                //distance: -5,
                rotationMode: 'perpendicular', // Plugin option
                style: {
                    fontSize: '1em',
                    textOutline: 'none'
                }
            },
            innerSize: '10%'
        }
    },

        tooltip: {
            enabled: false
        },
        series: [{
            type: 'pie',
            data: participants.map(i => ({ name: i, y: 40 })),
            dataLabels: {
            style: {
                fontSize: '1.5em'
            },
            distance: -80
            },
            startAngle: 360 * Math.random()
        }]
    };

    return <div>
        <HighchartsReact
            ref={chartComponent}
            highcharts={Highcharts}
            options={options} 
        />
    </div>
}

export default memo(WheelOfFortune);