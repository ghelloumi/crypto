import React, {Component} from 'react';import './Footer.css';export default class Footer extends Component {    render() {        return (            <div className="Footer">                <div>                    <h3>About Us</h3>                    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum                        deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non                        provident</p>                    <p>2018 &copy; ColorLib</p>                </div>                <div>                    <h3>Newsletter</h3>                    <p>Stay update with our latest</p>                    <div>                    <input placeholder="Enter Email"/>                    <button><i className="fa fa-long-arrow-right"/></button>                    </div>                </div>                <div>                    <h3>Follow Us</h3>                    <p>Let us be social</p>                    <div className="FooterContentSocial">                        <a href="">                            <i className="fa fa-facebook"/>                        </a>                        <a href="">                            <i className="fa fa-twitter"/>                        </a>                        <a href="">                            <i className="fa fa-linkedin"/>                        </a>                        <a href="">                            <i className="fa fa-medium"/>                        </a>                    </div>                </div>            </div>        );    }}