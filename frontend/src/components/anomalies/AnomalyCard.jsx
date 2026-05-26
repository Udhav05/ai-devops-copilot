function AnomalyCard(props) {

    return (

        <div>

            <h3>{props.service}</h3>

            <p>{props.message}</p>

            <p>{props.level}</p>

            <p>{props.response_time} ms</p>

        </div>

    )

}

export default AnomalyCard