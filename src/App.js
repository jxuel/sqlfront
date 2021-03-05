import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Store from './components/store/Store'
import Header from './components/header/Header';
import SignIn from './components/sign_in/SignIn'
import Dashboard from './components/dashboard/Dashboard';
function App(props) {
  return (
    <Store>
      <BrowserRouter>
        <div>
        <Header/>
          <Switch>
            {localStorage.getItem('user') != null ? <Redirect exact from="/" to="dashboard" />:<Redirect exact from="/" to="signin" />}
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </Store>
  );
}

export default App;
