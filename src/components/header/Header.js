import { useContext } from "react";
import {
    Link, NavLink, useHistory
  } from "react-router-dom";
  import {Context} from "../store/Store"

import './Header.css'


const pages = [{name:'Sign In', public:true}, {name:"Dashboard", public:false}, ]
var login = false

function Header (props) { 
    const [state, dispatch] = useContext(Context)
    login = state.user != null
    const history = useHistory()
    const router = pages.filter(page=>page.public || login).map(page=>{
        const routeName = page.name.replace(/\s+/g, '').toLowerCase();
        if(login && page.name === 'Sign In')
            return null
        return (
            <li key={routeName}>
                <NavLink activeClassName='is-active' to={routeName}>{page.name}</NavLink>
            </li>
        ) 
    })
    const logOut= () => {
        history.replace("/signin")
        dispatch({type:"LOG_OUT"})
    }

    if(login) {
        router.unshift((<li> <Link to="signin" onClick={logOut}>Log Out</Link></li>))
    }
    return (
        <div>
            <nav>
                <ul className="header-list">
                    {router}
                </ul>
            </nav>
        </div>
    )

}




export default Header;