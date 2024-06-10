import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRef, useEffect, memo } from 'react';

const HorseRace = ({participants, play, setWinner}) => {
    const chartComponent = useRef(null),
        finishLine = 1000000,
        animationSpd = 500;
    let labelWidth = 16;

    useEffect(() => {
        if (!play) {
            return;
        }
        const boostInterval = 6;
        let boostCounter = -1,
            luckyOne = -1,
            boostAmount = 0,
            boostPower = 0.4,
            candidateIndeces = [],
            winner = '';

        const interval = setInterval(() => {
            if (chartComponent.current && chartComponent.current.chart.series[0].data.length) {
                const data = chartComponent.current.chart.series[0].data;
                if(boostCounter == boostInterval) {
                    luckyOne = Math.floor(Math.random() * data.length);
                    boostCounter = 0;
                    boostAmount = 3 + Math.floor(Math.random()*8);
                }
                
                
                if (boostAmount) {
                    boostAmount--;
                    data[luckyOne].update(data[luckyOne].y *= 1 + boostPower * Math.random(), false, false, false);
                } else {
                    boostCounter++;
                }
                for (let i in data) {
                    data[i].update(data[i].y *= 1.1 + Math.random()*0.1, false, false, false);
                    if (data[i].y > finishLine) {
                        winner = i;
                        data[i].update({color: '#03fc4e'}, false, false, false);
                    }
                }
                chartComponent.current.chart.redraw();
                if (winner) {
                    const winnerName = participants[winner];
                    setWinner(winnerName);
                    chartComponent.current.chart.title.update({text: winnerName})

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
            height: '60%',
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
                text: ''
            },
            plotBands: [{
                color: 'rgba(252, 3, 132, 0.2)',
                from: finishLine,
                to: finishLine* 2
            }]
        },
        title: {
            text: 'HORSE RACE'
        },

        series: [{
            groupPadding: 0,
            pointPadding: 0.05,
            borderWidth: 0,
            borderRadius: 30,
            color: '#fc0384',
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