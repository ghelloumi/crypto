import React, {Component} from 'react';
import PropTypes from "prop-types";

import './Section2.css';
import {images} from "../../../constants";
import {NavLink as Link} from "react-router-dom";

const Option = ({icon, title, desc}) =>
    <div className="HomeSection2Option">
        <div className="HomeSection2OptionIcon">
            <i className={icon}/>
        </div>
        <div className="HomeSection2OptionInfo">
            <h4>{title}</h4>
            <p>{desc}</p>
        </div>
    </div>;

Option.prototype = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired
};

export default class Section2 extends Component {
    render() {
        const {options} = this.props;
        return (
            <section className="HomeSection2" id="section2">
                <h1>Get your Inscrypt card Today</h1>
                <div>
                    <div className="HomeSection2Options">
                        {options.map((e, i) => {
                            return (<Option key={i} icon={e.icon} title={e.title} desc={e.desc}/>)
                        })}
                    </div>
                    <div className="HomeSection2Card">
                        <img src={images.card} alt="card"/>
                        <div className="HomeSection2CardOptions">
                            <i className="cc BTC-alt" title="BTC"/>
                            <i className="cc ETC-alt" title="ETC"/>
                            <i className="cc LTC-alt" title="LTC"/>
                            <i className="cc EOS-alt" title="EOS"/>
                            <i className="cc XVG-alt" title="XVG"/>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
