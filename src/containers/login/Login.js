import React, {Component} from 'react';
import _ from 'lodash';
import QRCode from 'qrcode'
import ReactCodeInput from 'react-code-input'

import './Login.css';
import View from "../../components/view/View";
import {userCreate, userLogin, userLogin2} from "../../services/currencies.api";
import Modal from "../../components/modal/Modal";
import {ACCESS_TOKEN, images, USER_EMAIL} from "../../constants";
import {update_user_balance} from "../../redux/actions";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";

class Login extends Component {
    state = {
        login: {
            email: '',
            password: ''
        },
        signin: {
            email: '',
            password: '',
            repassword: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: ''
        },
        loadingLogin: false,
        loading: false,
        pwdMatch: true,
        qrCodeLink: '',
        speakeasyCodeVerifLogin: null,
        speakeasyCodeVerif: null,
        tokenIsValid: false,
        tokenIsValidColor: true,
        qrCodeModal: false,
        loginModal: false,
        errorLogin: '',
        error: ''
    };

    componentDidMount() {
        if (this.props.history.location.state) {
            const email = this.props.history.location.state.getStartingEmail;
            this.inputElement.focus();
            this.setState({login: {...this.state.login, email}});
        }
    }

    componentWillMount() {
        if (localStorage.getItem('redirect') === '1') {
            this.props.history.push('/dashboard')
        }
    }

    handleChange = (e, num) => {
        if (num === 0) {
            const login = _.assign({}, this.state.login);
            login[e.target.name] = e.target.value;
            this.setState({login})
        } else {
            const signin = _.assign({}, this.state.signin);
            signin[e.target.name] = e.target.value;
            this.setState({signin})
        }
    };

    handleSubmitLogin = async (e) => {
        e.preventDefault();
        this.setState({loadingLogin: true});
        try {
            await userLogin(this.state.login);
            this.setState({speakeasyCodeVerifLogin: {...this.state.login, userToken: null}, loginModal: true})
        } catch (e) {
            console.error(e);
            this.setState({errorLogin: 'An error was occurred signing in'})
            setTimeout(() => this.setState({errorLogin: ''}), 1500)
        } finally {
            this.setState({loadingLogin: false});
        }
    };

    handleSubmitSignIn = async (e) => {
        e.preventDefault();
        this.setState({loading: true});
        if (this.state.signin.password !== this.state.signin.repassword) {
            this.setState({loading: false, pwdMatch: false});
            setTimeout(() => this.setState({pwdMatch: true}), 1500)
        } else {
            try {
                const res = await userCreate(this.state.signin);
                QRCode.toDataURL(res.user.secret.otpauth_url, (err, data_url) => {
                    if (!err) {
                        this.setState({
                            qrCodeLink: data_url, qrCodeModal: true, speakeasyCodeVerif: {
                                email: this.state.signin.email, password: this.state.signin.password,
                                userToken: null
                            }
                        })
                    } else {
                        this.setState({loading: false, error: 'An error was occurred generating QrCode'})
                        setTimeout(() => this.setState({error: ''}), 1500)
                    }
                });
            } catch (e) {
                console.error(e);
                this.setState({error: 'An error was occurred creating new account'});
                setTimeout(() => this.setState({error: ''}), 1500)
            } finally {
                this.setState({loading: false})
            }
        }
    };

    handleChangeCode = async (userToken, num) => {
        try {
            let res;
            if (num === 0) {
                res = await userLogin2({...this.state.speakeasyCodeVerifLogin, userToken});
            } else {
                res = await userLogin2({...this.state.speakeasyCodeVerif, userToken});
            }
            localStorage.setItem(ACCESS_TOKEN, res.token)
            localStorage.setItem(USER_EMAIL, res.user.email)
            this.setState({tokenIsValidColor: true, tokenIsValid: true});
        } catch (e) {
            this.setState({tokenIsValidColor: userToken.length !== 6, tokenIsValid: false})
        }
    };

    render() {
        const {loginModal, signin, login, pwdMatch, qrCodeLink, qrCodeModal, error, tokenIsValid, tokenIsValidColor, loading, loadingLogin, errorLogin} = this.state;
        return (
            <View changeLocation={(num) => this.props.history.push('/#section' + num)}>
                <section className="LoginContainer">
                    <div className="LoginSection">
                        <div className="LoginSectionForm">
                            <div className="LoginSectionFormHeader">
                                <div>
                                    <h4>Login to our site</h4>
                                    <p>Enter username and password to log on:</p>
                                </div>
                                <div>
                                    <i className="fa fa-lock"/>
                                </div>
                            </div>
                            <form className="LoginSectionFormContent" onSubmit={this.handleSubmitLogin}>
                                <div className="SignInCred">
                                    <input type="email" placeholder="email" name="email" value={login.email}
                                           onChange={(e) => this.handleChange(e, 0)} required/>
                                </div>
                                <div className="SignInCred">
                                    <input type="password" placeholder="password" name="password"
                                           value={login.password} ref={el => this.inputElement = el}
                                           onChange={(e) => this.handleChange(e, 0)} required/>
                                </div>
                                <div className="SignInBtn">
                                    {loadingLogin ?
                                        <img src={images.loading1} alt='loading'
                                             style={{height: 45, margin: '6px 0'}}/> :
                                        !errorLogin ? <button type="submit">Sign In</button> :
                                            <p>{errorLogin}</p>
                                    }
                                </div>
                                <Modal
                                    show={loginModal}
                                    onClose={() => this.setState({loginModal: false})}
                                    style={{height: 180}}
                                >
                                    <p>Double authentication required<br/>
                                        Please enter your code from
                                        <span> Google Authenticator</span>.
                                        Please click Done when finished.
                                    </p>
                                    <ReactCodeInput type='number' fields={6}
                                                    onChange={(e) => this.handleChangeCode(e, 0)}
                                                    isValid={tokenIsValidColor}/>
                                    <button type='button' style={tokenIsValid ? {} : {
                                        color: '#a09d9d',
                                        background: '#dadada',
                                        cursor: 'not-allowed'
                                    }}
                                            disabled={!tokenIsValid} onClick={async () => {
                                        this.setState({qrCodeModal: false});
                                        try {
                                            await this.props.update_user_balance();
                                            this.props.history.push('/dashboard')
                                        } catch (e) {
                                            console.error(e)
                                        }
                                    }}
                                    >Done
                                    </button>
                                </Modal>
                            </form>
                        </div>
                        <div className="LoginSectionSocial">
                            <p>Or login with</p>
                            <div>
                                <a>
                                    <i className="fa fa-facebook"/>
                                    <span>Facebook</span>
                                </a>
                                <a>
                                    <i className="fa fa-twitter"/>
                                    <span>Twitter</span>
                                </a>
                                <a>
                                    <i className="fa fa-google-plus"/>
                                    <span>Google</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="VerticalSeparator">
                    </div>
                    <div className="LoginSection">
                        <div className="LoginSectionForm">
                            <div className="LoginSectionFormHeader">
                                <div>
                                    <h4>Login to our site</h4>
                                    <p>Enter username and password to log on:</p>
                                </div>
                                <div>
                                    <i className="fa fa-pencil"/>
                                </div>
                            </div>
                            <form className="LoginSectionFormContent" onSubmit={this.handleSubmitSignIn}>
                                <div className="SignInCred">
                                    <input type="email" placeholder="email" name="email" value={signin.email}
                                           onChange={(e) => this.handleChange(e, 1)} required/>
                                </div>
                                <div className="SignInCred">
                                    <input type="password" placeholder="password" name="password"
                                           value={signin.password}
                                           onChange={(e) => this.handleChange(e, 1)} required/>
                                </div>
                                <div className="SignInCred">
                                    <input type="password" placeholder="password" name="repassword"
                                           value={signin.repassword} onChange={(e) => this.handleChange(e, 1)}
                                           required/>
                                </div>
                                <div className="SignInCred">
                                    <input type="text" placeholder="Firstname" name="firstName"
                                           value={signin.firstName}
                                           onChange={(e) => this.handleChange(e, 1)} required/>
                                </div>
                                <div className="SignInCred">
                                    <input type="text" placeholder="Lastname" name="lastName"
                                           value={signin.lastName}
                                           onChange={(e) => this.handleChange(e, 1)} required/>
                                </div>
                                <div className="SignInCred">
                                    <input type="number" placeholder="Phone number" name="phoneNumber"
                                           value={signin.phoneNumber} onChange={(e) => this.handleChange(e, 1)}
                                           required/>
                                </div>
                                <div className="SignInCred">
                                    <input type="text" placeholder="Address" name="address"
                                           value={signin.address}
                                           onChange={(e) => this.handleChange(e, 1)} required/>
                                </div>
                                <div className="SignInBtn">
                                    {loading ?
                                        <img src={images.loading1} alt='loading'
                                             style={{height: 45, margin: '6px 0'}}/> :
                                        !error ?
                                            pwdMatch ? <button type="submit">Sign Up</button> :
                                                <p>Passwords do not match</p> :
                                            <p>{error}</p>
                                    }
                                </div>
                                <Modal
                                    show={qrCodeModal}
                                    onClose={() => this.setState({qrCodeModal: false})}
                                >
                                    <img src={qrCodeLink} alt='qrCode' className="QrCode"/>
                                    <p>Double authentication required<br/>
                                        Please scan this QrCode using
                                        <span> Google Authenticator</span>.
                                        Please click Done when finished.
                                    </p>
                                    <ReactCodeInput type='number' fields={6}
                                                    onChange={(e) => this.handleChangeCode(e, 1)}
                                                    isValid={tokenIsValidColor}/>
                                    <button style={tokenIsValid ? {} : {
                                        color: '#a09d9d',
                                        background: '#dadada',
                                        cursor: 'not-allowed'
                                    }}
                                            disabled={!tokenIsValid} onClick={async () => {
                                        this.setState({qrCodeModal: false});
                                        try {
                                            await this.props.update_user_balance()
                                            this.props.history.push('/dashboard')
                                        } catch (e) {
                                            console.error(e)
                                        }
                                    }}
                                    >Done
                                    </button>
                                </Modal>
                            </form>
                        </div>
                    </div>
                </section>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    data: state.data,
});

const mapDispatchToProps = dispatch => ({
    update_user_balance: () => dispatch(update_user_balance())
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login));

