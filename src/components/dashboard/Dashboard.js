import { useContext, useEffect, useMemo, useState } from "react"
import {Context} from "../store/Store"
import ScreenForm from "../screen_form/ScreenForm"
import "./Dashboard.css"
const cssSelected = (target)=>{
    target.parentNode.childNodes.forEach(node=>{
                    if(node.getAttribute("selected") == "true" && node != target) {
                        node.removeAttribute("selected")
                    }
                })
                target.setAttribute("selected","true")
}

function QuestionSet (props) {
    const [state, dispatch] = useContext(Context)
    
    const setQuestionSet = (event)=>{
        cssSelected(event.target)
        if(event.target.id != state.questionSetSelected)
            dispatch({type:"SELECT_QUESTIONSET",payload:event.target.id})
    }
    const lists = state.questionSet.map(qs=>(
        <li key ={qs.id} id={qs.id} onClick={setQuestionSet}>{qs.name}</li>
    ))
    console.log(lists)
    return (
        <div className="dashboard-question-set">
            Question Set

            <ul>
                {lists}
                <li name="setCreation" onClick={props.formCtl}>+</li>
            </ul>
           
        </div>
    )
}

function QuestionList (props) {
    const [state, dispatch] = useContext(Context)

    useEffect(()=>{
        if(state.questionSetSelected != null) {
            fetch(`https://www.plusoperation.ga/question?setId=${state.questionSetSelected}`)
            .then(res=>{
                if(res.ok) {
                    return res.json()
                }
                throw new Error(res.status);
            })
            .then(jsonObj=>{
                dispatch({type:"SET_QUESTIONLIST", payload:jsonObj})
            })
            .catch(error=>console.log(error))
            
        }
    },[dispatch, state.questionSetSelected])
    
    const lists = useMemo(()=>{
        
        const setQuestion = (event)=>{
            cssSelected(event.target)
            if(event.target.id != state.questionSelected)
                dispatch({type:"SELECT_QUESTION",payload:event.target.id})
        }
        return state.questionList.map(qs=>(
            <li key={qs.id} id={qs.id} onClick={setQuestion}>{qs.question}</li>
        ))
    }, [dispatch, state.questionList])

    return (
        <div className="dashboard-question-list">
            Question List
            <ul>
                {lists}
                {state.questionSetSelected != null &&<li name="questionCreation" onClick={props.formCtl} >+</li>}
            </ul>
        </div>
    )
}

function Question(props) {
    const [state, dispatch] = useContext(Context)
    const [question, setQuestion] = useState(null)
    useEffect(()=>{
        if(state.questionSelected != null) {
            console.log(state.questionSelected)
            let obj = state.questionList.filter(qs=>qs.id == state.questionSelected)[0]
            setQuestion(obj)
            /*
            fetch(`https://www.plusoperation.ga/question/${state.questionSelected}`)
            .then(res=>{
                if(res.ok) {
                    return res.json()
                }
                throw new Error(res.status);
            })
            .then(jsonObj=>{
                setQuestion(JSON.stringify(jsonObj))
            })
            .catch(error=>console.log(error)) */
        }

    },[state.questionList, state.questionSelected])
      let content = () => {
            if(question == null)
                return null
            var checkAnswer = (event) => {
                let data = {
                    "questionId": question.id,
                    "answers":[]
                }
                document.getElementById("option-list").childNodes
                .forEach(node=>{
                    if(node.getAttribute("selected")=="true") {
                        data.answers.push(node.getAttribute("value"))
                    }
                })
            
                if(data.answers.length === 0) {
                    return
                } 

                fetch(`https://www.plusoperation.ga/question/check?mode=${event.target.getAttribute("value").toLowerCase()}`,{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                    body:JSON.stringify(data)
                })
                .then(res=>{
                    if(res.ok) {
                        return res.json()
                    }
                    throw new Error(res.status);
                }).then(jsonObj=>{
                    jsonObj["repeatAt"] = new Date(jsonObj["repeatAt"]).toLocaleString()
                    jsonObj["reviewedAt"] = new Date(jsonObj["reviewedAt"]).toLocaleString()
                    alert(JSON.stringify(jsonObj))
                })
                .catch(error=>console.log(error))
            }
            let handleSelect = (event)=>{
                let selected = event.target.getAttribute("selected") != null
                if(selected) {
                    event.target.removeAttribute("selected")
                } else {
                    event.target.setAttribute("selected", true)
                }
            }

            let options = question.options.map(op=>{
                return (
                    <li value={op} key={op+question.id} onClick={handleSelect}>
                        {op}
                    </li>
                )
            })

            

            return (
                <div>
                    Question : {question.question}
                    <div>
                        <ul id="option-list">
                            {options}
                        </ul>
                    </div>
                    <input onClick={checkAnswer} value="Check" type="button"/>
                    <input onClick={checkAnswer} value="Test" type="button"/>
                </div>
            )
            
        }
    return (
        <div className="dashboard-question">
            {content()}
        </div>
    )
}
const formFields = new Map();
formFields.set('setCreation', ['name'])
formFields.set('questionCreation', ['question', 'options', 'answers' ])

function Dashboard (props) {
    const [state, dispatch] = useContext(Context)
    const [showForm, setShowForm] = useState(false)
    const [formType, setFormType] = useState('')
    useEffect(()=> {
        if(state.userToken == null || state.user == null) {
            return
        }
        fetch(`https://www.plusoperation.ga/learnList?ownerId=${state.userToken}`)
        .then(res => {
            if(res.ok) {
                return res.json();
            }
            throw new Error(res.status);
        })
        .then(jsonObj => {
            console.log(jsonObj)
            dispatch({type:"SET_QUESTIONSET", payload:jsonObj})
        })
        .catch(error=>alert(error))
    },[dispatch, state.userToken])

    const ctl = (event)=>{
        console.log(formType)
        setFormType(event?.target.getAttribute('name'))
        setShowForm(!showForm)
    }

    const addNewSet = (jsonData)=>{
        jsonData["ownerId"] = state.userToken
        fetch("https://www.plusoperation.ga/learnList",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify(jsonData)
        }).then(res=>{
            if(res.ok) {
                return res.json()
            }
            throw new Error(res.status);
        }).then(jsonObj=>{
            setShowForm(!showForm)
            dispatch({type:"SET_QUESTIONSET",payload:[...state.questionSet, jsonObj]})
        }).catch(error=>alert(error))
    }

    const addNewQuestion = (jsonData)=>{
        jsonData['setId'] = state.questionSetSelected
        jsonData["ownerId"] = state.userToken
        jsonData["options"] = jsonData.options.split(";")
        jsonData["answers"] = jsonData.answers.split(";")
        fetch("https://www.plusoperation.ga/question",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body:JSON.stringify(jsonData)
        }).then(res=>{
            if(res.ok) {
                return res.json()
            }
            throw new Error(res.status);
        }).then(jsonObj=>{
            setShowForm(!showForm)
            dispatch({type:"SET_QUESTIONLIST",payload:[...state.questionList, jsonObj]})
        }).catch(error=>alert(error))
    }
    
    return (
        <div className="dashboard-container">
            {showForm ? <ScreenForm ctl={ctl} field={formFields.get(formType)} handleForm={formType == "setCreation" ? addNewSet: addNewQuestion}></ScreenForm> : null}

            <QuestionSet formCtl ={ctl}/>
            <QuestionList formCtl ={ctl}/>
            <Question/>
        </div>
        
    )
}

export default Dashboard;