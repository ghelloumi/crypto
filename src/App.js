import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from "react-redux";

import Home from "./containers/home/Home";
import Login from "./containers/login/Login";
import Dashboard from "./containers/dashboard/Dashboard";

import './App.css';
import './assets/fonts/cryptoCoinsFont/cryptocoins.css'
import 'font-awesome/css/font-awesome.min.css'
import {fetch_user_data, tokenVerify} from "./redux/actions";

class App extends Component {
    async componentDidMount() {
        try {
            await this.props.tokenVerify();
            if(this.props.data.verifyToken) {
                localStorage.setItem('redirect', '1');
                await this.props.fetch_user_data()
            } else localStorage.setItem('redirect', '')
        } catch (e) {
            console.error(e);
            localStorage.setItem('redirect', '');
        }
    }

    render() {
        return (
            <div>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/dashboard" exact component={Dashboard}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    data: state.data,
});

const mapDispatchToProps = dispatch => ({
    tokenVerify: () => dispatch(tokenVerify()),
    fetch_user_data: () => dispatch(fetch_user_data())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App));

