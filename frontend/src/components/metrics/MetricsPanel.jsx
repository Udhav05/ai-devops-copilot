import { useState, useEffect } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
}
from "recharts";


function MetricsPanel() {

    const [metrics, setMetrics] = useState({})
    const [metricsHistory, setMetricsHistory] = useState([])
    const [alerts, setAlerts] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {

        const socket = new WebSocket(
            "ws://127.0.0.1:8000/ws/metrics"
        )


        socket.onopen = () => {

            console.log(
                "Metrics websocket connected"
            )

        }


        socket.onmessage = (event) => {

            const liveData =
                JSON.parse(event.data)

            console.log(
                "metrics:",
                liveData
            )


            setMetrics(
                liveData.metrics
            )


            setAlerts(
                liveData.alerts || []
            )


            setMetricsHistory(
                prev => [

                    ...prev,

                    {

                        cpu:
                        liveData.metrics.cpu_usage,

                        memory:
                        liveData.metrics.memory_usage,

                        disk:
                        liveData.metrics.disk_usage,

                        time:
                        new Date()
                        .toLocaleTimeString()

                    }

                ].slice(-20)
            )


            setLoading(false)

            setError("")
        }


        socket.onerror = (error) => {

            console.error(
                "Metrics websocket failed",
                error
            )

            setError(
                "Failed to connect to metrics websocket"
            )

            setLoading(false)
        }


        socket.onclose = () => {

            console.log(
                "Metrics websocket closed"
            )

        }


        return () => {

            socket.close()

        }

    }, [])



    if (loading) {

        return (
            <h2>
                Loading metrics...
            </h2>
        )

    }


    if (error) {

        return (
            <h2>
                {error}
            </h2>
        )

    }



    return (

        <div>

            <h2>
                Live Metrics Dashboard
            </h2>


            {
                alerts.length > 0 &&

                <div>

                    <h3>
                        Alerts
                    </h3>

                    {
                        alerts.map(
                            (alert, index) => (

                                <p key={index}>
                                    🚨 {alert}
                                </p>

                            )
                        )
                    }

                </div>
            }


            <h3>
                CPU:
                {metrics.cpu_usage ?? 0}%
            </h3>


            <h3>
                Memory:
                {metrics.memory_usage ?? 0}%
            </h3>


            <h3>
                Disk:
                {metrics.disk_usage ?? 0}%
            </h3>



            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart
                    data={metricsHistory}
                >

                    <CartesianGrid />

                    <XAxis
                        dataKey="time"
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="cpu"
                    />

                    <Line
                        type="monotone"
                        dataKey="memory"
                    />

                    <Line
                        type="monotone"
                        dataKey="disk"
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    )

}

export default MetricsPanel