import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './Modal.css';

import {images} from '../../constants';

const backdropStyle = {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
};
const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: '2em',
    position: 'relative',
    color: '#5f5f5f',
};
const closeActionStyle = {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
};

class OutsideClick extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (document.getElementsByClassName('modal')[0])
            if (this.wrapperRef && !document.getElementsByClassName('modal')[0].contains(event.target)) {
                this.props.onClickedOut();
            }
    }

    render() {
        return (
            <div ref={this.setWrapperRef}>
                {this.props.children}
            </div>
        );
    }
}

OutsideClick.propTypes = {
    'children': PropTypes.element.isRequired,
    'onClickedOut': PropTypes.func
};

class Modal extends Component {
    render() {
        return (
            <OutsideClick onClickedOut={this.props.onClose}>
                <div>
                    {
                        this.props.show ?
                            <div className="backdrop" style={backdropStyle}>
                                <div className="modal" style={{...modalStyle, ...this.props.style}}>
                                    {this.props.children}
                                    <div style={closeActionStyle} onClick={this.props.onClose}>
                                        <img src={images.iconClose} alt="Close" height="20"/>
                                    </div>
                                </div>
                            </div> :
                            null
                    }
                </div>
            </OutsideClick>
        );
    }
}

Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default Modal;
