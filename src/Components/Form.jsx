import { useReducer, useState, Fragment } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Form() {

    const [inputs, dispatch] = useReducer((currentInputs, newInputsValues) => ({ ...currentInputs, ...newInputsValues }), { alias: "", msg: "", category: "" });
    const [timer, setTimer] = useReducer((currentTimer, newTimer) => ({ ...currentTimer, ...newTimer }), { uuid: "", date: "", time: "" })
    const [errorMsg, setErrorMsg] = useState(null);

    const [dataLS, setDataLS] = useState(JSON.parse(localStorage.getItem("data")) || []);

    const event = new Date();

    function handleChangeInputs({ target: { name, value } }) {
        setTimer({ uuid: uuidv4() })
        setTimer({ date: event.toLocaleDateString() })
        setTimer({ time: event.toLocaleTimeString() })

        dispatch({ [name]: value });
    }

    function checkMissingInput(key) {
        if (!inputs[key]) return true;
    }

    function submitHandler(e) {
        e.preventDefault();
        for (const key in inputs) {
            if (checkMissingInput(key)) {
                setErrorMsg(`Veuillez renseigner le champs ${key}`);
                return;
            }
        }
        setErrorMsg("");
        const { alias, msg, category } = inputs;
        const { uuid, date, time } = timer;

        localStorage.setItem("data", JSON.stringify([...dataLS, { uuid, alias, msg, category, date, time }]));
        setDataLS(JSON.parse(localStorage.getItem("data")));
    }

    return (
        <>
            <h1>exo FORM LS</h1>
            <form onSubmit={submitHandler}>

                <input placeholder="votre alias" type="text" name="alias" value={inputs.alias} onChange={handleChangeInputs} />
                <textarea name="msg" value={inputs.msg} onChange={handleChangeInputs} />
                <select name="category" onChange={handleChangeInputs}>
                    <option value="">Choisir un jeu :</option>
                    <option value="Yu-gi-oh">Yu-gi-oh</option>
                    <option value="Magic">Magic</option>
                    <option value="Pokemon">Pokemon</option>
                </select>

                <input type="submit" value="register to local storage" onClick={handleChangeInputs} />
                {errorMsg && <p>{errorMsg}</p>}
            </form>


            <hr />
            {
                dataLS.length ? (
                    <>
                        <h2>Liste :</h2>
                        <dl>
                            {
                                dataLS.map(data =>
                                    <Fragment key={Math.random()}>
                                        <dt>Message de : <FontAwesomeIcon icon={faUser} /> {data.alias} le {data.date} à {data.time}</dt>
                                        <dd>dans la catégorie {data.category}</dd>
                                        <dd>{data.msg}</dd>
                                        <div className="divider"></div>
                                    </Fragment>
                                )
                            }
                        </dl>
                        <hr />
                    </>
                )
                    : <p>rien dans le LS</p>
            }
        
        </>
    )
}

export default Form;