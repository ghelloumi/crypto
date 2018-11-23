import React, {Component} from 'react';

import './View.css'
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default class View extends Component {
    render() {
        return (
            <div className="ViewClass">
                <div className="ViewContent">
                    <Header changeLocation={this.props.changeLocation}/>
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        )
    }
}

