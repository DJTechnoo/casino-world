import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRef, useEffect, memo } from 'react';

const HorseRace = ({participants, play, setWinner}) => {
    const chartComponent = useRef(null),
        finishLine = 1000000,
        animationSpd = 400;
    let labelWidth = 16;

    useEffect(() => {
        if (!play) {
            return;
        }
        const boostInterval = 3;
        let boostCounter = -1,
            luckyOne = -1,
            boostAmount = 0,
            boostPower = 1.0,
            candidateIndices = [],
            selectWinner = false,
            winner = -1;

        const interval = setInterval(() => {
            if (chartComponent.current && chartComponent.current.chart.series[0].data.length) {
                const data = chartComponent.current.chart.series[0].data;
                if(boostCounter == boostInterval) {
                    luckyOne = Math.floor(Math.random() * data.length);
                    boostCounter = 0;
                    boostAmount = 2 + Math.floor(Math.random()*2);
                    data[luckyOne].update({color: '#ffa3ff'}, false, false, false);
                }

                if (!selectWinner) {
                    if (boostAmount) {
                        boostAmount--;
                        if (boostAmount == 0) {
                            data[luckyOne].update({color: '#bfff00'}, false, false, false);
                        }
                        data[luckyOne].update(data[luckyOne].y *= 1 + boostPower * Math.random(), false, false, false);
                    } else {
                        boostCounter++;
                    }

                    for (let i in data) {
                        data[i].update(data[i].y *= 1.1 + Math.random()*0.1, false, false, false);
                        if (data[i].y > finishLine) {
                            selectWinner = true;
                            candidateIndices.push(i);
                        }
                    }
                } else {
                    let previousBest = 0;
                    for (let i in candidateIndices) {
                        if (data[candidateIndices[i]].y > previousBest) {
                            previousBest = data[candidateIndices[i]].y;
                            winner = candidateIndices[i];
                        }
                    }
                    data[luckyOne].update({color: '#bfff00'}, false, false, false);
                    data[winner].update({color: '#03fc4e'}, false, false, false);
                    const winnerName = participants[winner];
                    chartComponent.current.chart.title.update({text: winnerName}, false, false, false);
                    setWinner(winnerName);
                }
                chartComponent.current.chart.redraw();
                if (winner > -1) {
                    winner = -1;
                    clearInterval(interval);
                }

            }
        }, animationSpd);

        return () => clearInterval(interval);
      }, [play, participants]);

    if (chartComponent.current && chartComponent.current.chart.series[0].columnMetrics.width) {
        labelWidth = chartComponent.current.chart.series[0].columnMetrics.width * 0.5 + 'px'
    }

    const options = {
        chart: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            width: 1000,
            height: '70%',
            type: 'bar',
            animation: {
                duration: animationSpd,
                easing: t => t
            },
        },

        credits: {
            enabled: false
        },

        legend: {
            enabled: false
        },

        tooltip: false,

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    inside: true,
                    align: 'right',
                    format: '{point.category}',
                    style: {
                        fontSize: labelWidth,
                        textOutline: 'none',
                    }
                }
            }
        },

        xAxis: {
            categories: participants,
            labels: {
                enabled: false
            }
        },
        yAxis: {
           gridLineWidth: 0,
            labels: {
                style: {
                    color: 'white',
                    fontSize: '1em'
                }
            },
            title: {
                text: '',
                style: {
                    color: 'red'
                }
            },
            plotBands: [{
                color: 'rgba(252, 255, 255, 0.4)',
                from: finishLine,
                to: finishLine * 2
            }, {
                color: 'rgba(252, 255, 255, 1)',
                from: finishLine,
                to: finishLine * 1.01
            }]
        },
        title: {
            text: 'HORSE RACE',
            style: {
                color: 'white'
            }
        },

        series: [{
            groupPadding: 0,
            pointPadding: 0.05,
            borderWidth: 0,
            borderRadius: 30,
            color: '#bfff00',
            data: participants.map(() => 40)

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

export default memo(HorseRace);