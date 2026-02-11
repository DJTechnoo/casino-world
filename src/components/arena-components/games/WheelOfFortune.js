import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRef, useEffect, memo } from 'react';

const WheelOfFortune = ({participants, play, setWinner}) => {

    const chartComponent = useRef(null),
        animationSpd = 10;
    let currentWinner = -1,
        foundPossibleWinner = false;

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
            ['L', chart.chartWidth / 2, chart.plotTop + 30],
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
                            chart.setTitle({
                                text: 'The winner is ' + winnerName + '!'
                            });
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
            text: 'Lykkehjulet'
        },

        plotOptions: {
            pie: {
                size: 600,
                slicedOffset: 30,
                borderWidth: 0,
                dataLabels: {
                    color: '#FFFFFF'
                },
                
            }
        },

        series: [{
            type: 'pie',
            tooltip: {
                enabled: false
            },
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