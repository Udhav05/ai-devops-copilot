import AnomalyCard from "./AnomalyCard"
import { useState, useEffect} from 'react';

function Anomaly() {


    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [anomalyData, setAnomalyData] = useState([])

    useEffect(() => {


    async function fetchAnomaly() {

        try {
        const response = await fetch ("http://127.0.0.1:8000/anomalies")
        const data = await response.json()

        console.log("ANOMALY DATA", data)
        setAnomalyData(data.results) 
        setLoading(false)

        }

        catch(error){
            console.log(error)
            setError("Failed to fetch anomalies")
            setLoading(false)
        }
    }
    fetchAnomaly()}, [])


    function AddAnomaly() {
        const newAnomaly  ={
            service : "new ervice",
            anomaly_score :0.85,
            reason : "high response rate",
            severity : "high"

        }
        setAnomalyData([...anomalyData, newAnomaly])



    }

    if(loading) {
        return <h2> loading anomalies</h2>
    } 
    if(error) {
        return <h2> {error} </h2>
    }



    return (
        <div>
            <h1>anomaly is running</h1>


            <button onClick={AddAnomaly}> ADD ANOAMLY</button>

            {
            anomalyData.map((anomaly, index) => (
                <AnomalyCard 
                key={index}
                 
                service={anomaly.service}
                message={anomaly.message}
                level={anomaly.level}
                response_time={anomaly.response_time}
                  />
            ))

        }
        </div>
    )
}

export default Anomaly;