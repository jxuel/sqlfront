import { useState, useRef } from "react"
import "./ScreenForm.css"


function ScreenForm(props) {
    const [form, setForm] = useState({})
    const selfContainer = useRef(null)
    const handleForm = (event)=>{
        event.preventDefault();
        props.handleForm(form)
    }
    const changeValue = (event)=>{
        const fieldName = event.target.id
        setForm({...form, [fieldName] : event.target.value})
    }
    const closeForm = () => {
        props.ctl()
    }
    const field = (name)=>{
        return (
            <div key = {name}>
                <label htmlFor={name}>{name}</label><br/>
                <input type="text" id={name} name={name} value={form.name} onChange={changeValue} /><br/>
            </div> 
        )
    }



    let fields = props.field.map(f=>field(f))
    return (
        <div ref={selfContainer} className="screen-container">
            <div className="screen-form-container">
            <form onSubmit={handleForm}>
                    {fields}
                    <input type="submit" value="Submit"/>
                    <input type="button" onClick={closeForm} value="Cancel"/>            
                </form> 
            </div>

        </div>
    )
}

export default ScreenForm