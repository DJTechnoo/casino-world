import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useRef, useEffect, memo } from 'react';

const Poker = ({participants, play, setWinner}) => {
    const chartComponent = useRef(null),
        finishLine = 1000,
        animationSpd = 500;

    useEffect(() => {
        if (!play) {
            return;
        }
        const boostInterval = 6;
        let boostCounter = -1,
            luckyOne = -1,
            boostAmount = 0,
            boostPower = 0.2,
            winner = '';

        const interval = setInterval(() => {
            if (chartComponent.current && chartComponent.current.chart.series[0].data.length) {
                const data = chartComponent.current.chart.series[0].data;
                if(boostCounter == boostInterval) {
                    luckyOne = Math.floor(Math.random() * data.length);
                    boostCounter = 0;
                    boostAmount = 3 + Math.floor(Math.random()*3);
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

    const options = {
        chart: {
            width: 1000,
            height: 550,
            type: 'bar',
            animation: {
                duration: animationSpd,
                easing: t => t
            }
        },

        legend: {
            enabled: false
        },

        xAxis: {
            categories: participants,
        },
        yAxis: {
            plotLines: [{
                color: 'red',
                value: finishLine
            }]
        },
        title: {
            text: 'HORSE RACE'
        },

        series: [{
            groupPadding: 0,
            pointPadding: 0,
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

export default memo(Poker);