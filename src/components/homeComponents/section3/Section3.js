import React, {Component} from 'react';

import './Section3.css';
import {images} from "../../../constants";


export default class Section3 extends Component {
    render() {
        return (
            <section className="HomeSection3" id="section3">
                <div className="HomeSection3Content">
                    <div className="HomeSection3ContentInfo">
                        <p>Tutorial for beginner</p>
                        <h2>Watch tutorial Video of SaaS to start</h2>
                        <p>We are here to listen from you deliver exellence</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    <img src={images.image1} alt="homeImage1"/>
                </div>
                <div className="HomeSection3Content">
                    <img src={images.image2} alt="homeImage2"/>
                    <div className="HomeSection3ContentInfo">
                        <p>Tutorial for beginner</p>
                        <h2>Watch tutorial Video of SaaS to start</h2>
                        <p>We are here to listen from you deliver exellence</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                </div>
            </section>
        );
    }
}
