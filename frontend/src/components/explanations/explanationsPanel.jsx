
import {useState, useEffect} from 'react';



function Explanations() {

             console.log("COMPONENT RENDERED")



    const [explanationsData, setExplanationsData] = useState([])


    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {



    console.log("EXPLANATIONS useEffect running")
        async function fetchExplanations() {
            try {
                const response = await fetch ("http://127.0.0.1:8000/explanations")
                const data = await response.json()
               console.log(data.results)
                setExplanationsData(data.results)
                setLoading(false)
            }
            catch(error) {
                console.log(error)
                setError("Failed to fetch explanations")
                setLoading(false)
            }
    }fetchExplanations()}, [])

    if(loading) {
        return <h2>Fetching explanations...</h2>
    }

    if(error) {
        return <h2>{error}</h2>
    }

    return (
        <div>
            <h1>explanations is running</h1>
{

            explanationsData.map((item, index) => (
                <div key = {index}>
                <h3>{item.service}</h3>

                <p>{item.explanation}</p>
                </div>
            ))

        }
        </div>
    )
}

export default Explanations;