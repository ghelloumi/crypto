import React, {Component} from 'react';
import PropTypes from "prop-types";

import './Dashboard.css';
import View from "../../components/view/View";
import {getUseremail, images} from "../../constants";
import {fetch_user_data, tokenVerify, update_user_balance, user_exchange} from "../../redux/actions";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {exchange, getBalanceUSD, withdraw} from "../../services/currencies.api";
import Modal from "../../components/modal/Modal";

const WalletCurrency = ({img, value, getBtn, sendBtn, handleClick}) => <div className="WalletCurrency">
    <div>
        <img src={img} alt="currencyLogo"/>
        <p>{value}</p>
    </div>
    {getBtn &&
    <div>
        <button onClick={() => handleClick()}>GET</button>
    </div>
    }
    {sendBtn &&
    <div>
        <button className="BtnMod" onClick={() => handleClick()}>
            <div>SEND to</div>
            <div><i className="fa fa-angle-right"/></div>
        </button>
    </div>
    }
</div>;
WalletCurrency.prototype = {
    value: PropTypes.string.isRequired,
    img: PropTypes.object.isRequired,
};

const DashBoardHeaderBtn = ({tab, setState, name, wallet, icon}) => <div onClick={() => setState()}
                                                                         style={tab ? {
                                                                             background: '#303b5f',
                                                                             boxShadow: 'unset'
                                                                         } : {}}>
    {wallet ? <img src={images.wallet} alt="wallet"/> : <i className={icon}/>}
    <label>{name}</label>
</div>;
DashBoardHeaderBtn.prototype = {
    tab: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
};

const Balance = ({value}) => <div className="Balance">
    Balance: <span> {value}</span>
</div>;
Balance.prototype = {
    value: PropTypes.string.isRequired
};

class Dashboard extends Component {
    state = {
        tab: 0,
        sendToModal: false,
        balances: null,
        sentToModal: false,
        amount: '',
        address: '',
        loading: false,
        error: false,
        hash: '',
        getCurrency: '',
        getCurrencyModal: false,
        amountGet: '',
        password: '',
        loadingGet: false
    };

    async componentDidMount() {
        try {
            const balances = await getBalanceUSD();
            this.setState({balances});
        } catch (e) {
            console.error(e)
        }
    }

    handleUpdateBalance = async (e) => {
        e.preventDefault();
        try {
            await this.props.update_user_balance()
        } catch (e) {
            console.error(e)
        }
    };

    toggleModal = (ch) => {
        this.setState({getCurrency: ch, getCurrencyModal: true})
    };

    handleSendTo = async (e) => {
        e.preventDefault();
        this.setState({loading: true});
        try {
            const res = await withdraw({amount: this.state.amount, to: this.state.address});
            this.setState({hash: res})
        } catch (e) {
            console.error(e);
            this.setState({error: true})
        } finally {
            this.setState({loading: false})
        }
    };

    handleGet = async (e) => {
        e.preventDefault();
        this.setState({loadingGet: true});
        try {
            await this.props.user_exchange({
                email: getUseremail(),
                password: this.state.password,
                coin1: 'eth',
                coin2: this.state.getCurrency,
                amount: this.state.amountGet
            })
            this.setState({getCurrencyModal:false})
        } catch (e) {
            console.error(e)
        } finally {
            this.setState({loadingGet: false})
        }
    };

    render() {
        const {tab, balances, sentToModal, loading, hash, error, getCurrencyModal, loadingGet} = this.state;
        const userData = this.props.data.userData;

        const showUpdateBtns = () => {
            return (
                <div className="DashboardInfoTableContentBtns">
                    <button onClick={() => this.setState({tab: 1})}>Show Address</button>
                    <button onClick={this.handleUpdateBalance}>Update balance</button>
                </div>
            )
        }

        let balance = 0;
        let currencies = ['BTC', 'EOS', 'ETH', 'LTC', 'XVG']
        if (userData && balances) {
            currencies.map(e => {
                if (userData.wallets[e.toLowerCase()])
                    balance += userData.wallets[e.toLowerCase()].balance * balances[e]['USD']
            });
            balance = balance.toFixed(2);
        }

        return (
            <View changeLocation={(num) => this.props.history.push('/#section' + num)}>
                <section className="DashboardContainer">
                    <div className="DashboardTitle">
                        <div>
                            <h1>Welcome to your <span>dashboard</span>, John Doe</h1>
                            <p>Deposit <span>now</span>, and start <span>spending</span></p>
                        </div>
                    </div>
                    <div className="DashboardInfo">
                        <div className="DashboardInfoTableBackground">
                            <div className="DashboardInfoTable">
                                <div className="DashboardInfoTableHeader">
                                    <DashBoardHeaderBtn tab={tab === 0} setState={() => this.setState({tab: 0})}
                                                        name="Wallet" wallet/>
                                    <DashBoardHeaderBtn tab={tab === 1} setState={() => this.setState({tab: 1})}
                                                        name="Deposit" icon="fa fa-arrow-down"/>
                                    <DashBoardHeaderBtn tab={tab === 2} setState={() => this.setState({tab: 2})}
                                                        name="Withdraw" icon="fa fa-arrow-up"/>
                                </div>
                                {userData ? <div className="DashboardInfoTableContent">
                                        {tab === 0 && <div className="DashboardInfoTableContent1">
                                            <Balance value={balance + " USD"}/>
                                            <div className="WalletCurrencies">
                                                {userData.wallets.btc && <WalletCurrency img={images.btc}
                                                                                         value={userData.wallets.btc.balance + " BTC"}
                                                                                         getBtn
                                                                                         handleClick={() => this.toggleModal('btc')}/>}
                                                {userData.wallets.eth && <WalletCurrency img={images.eth}
                                                                                         value={userData.wallets.eth.balance + " ETH"}
                                                                                         getBtn
                                                                                         handleClick={() => this.toggleModal('eth')}/>}
                                                {userData.wallets.ltc && <WalletCurrency img={images.ltc}
                                                                                         value={userData.wallets.ltc.balance + " LTC"}
                                                                                         getBtn
                                                                                         handleClick={() => this.toggleModal('ltc')}/>}
                                                {userData.wallets.eos && <WalletCurrency img={images.eos}
                                                                                         value={userData.wallets.eos.balance + " EOS"}
                                                                                         getBtn
                                                                                         handleClick={() => this.toggleModal('eos')}/>}
                                                {userData.wallets.xvg && <WalletCurrency img={images.xvg}
                                                                                         value={userData.wallets.xvg.balance + " XVG"}
                                                                                         getBtn
                                                                                         handleClick={() => this.toggleModal('xvg')}/>}
                                            </div>
                                            {showUpdateBtns()}
                                        </div>}
                                        {tab === 1 && <div className="DashboardInfoTableContent1">
                                            <Balance value={balance + " USD"}/>
                                            <div className="Deposit">
                                                <div className="WalletCurrencies">
                                                    {userData.wallets.btc && <WalletCurrency img={images.btc}
                                                                                             value={userData.wallets.btc.publicKey}/>}
                                                    {userData.wallets.eth && <WalletCurrency img={images.eth}
                                                                                             value={userData.wallets.eth.publicKey}/>}
                                                    {userData.wallets.ltc && <WalletCurrency img={images.ltc}
                                                                                             value={userData.wallets.ltc.publicKey}/>}
                                                    {userData.wallets.eos && <WalletCurrency img={images.eos}
                                                                                             value={userData.wallets.eos.publicKey}/>}
                                                    {userData.wallets.xvg && <WalletCurrency img={images.xvg}
                                                                                             value={userData.wallets.xvg.publicKey}/>}
                                                </div>
                                                {showUpdateBtns()}
                                            </div>
                                        </div>}
                                        {tab === 2 && <div className="DashboardInfoTableContent1">
                                            <Balance value={balance + " USD"}/>
                                            <div className="WalletCurrencies">
                                                {userData.wallets.btc && <WalletCurrency img={images.btc}
                                                                                         value={userData.wallets.btc.balance + " BTC"}
                                                                                         sendBtn
                                                                                         handleClick={() => this.toggleModal('btc')}/>}
                                                {userData.wallets.eth && <WalletCurrency img={images.eth}
                                                                                         value={userData.wallets.eth.balance + " ETH"}
                                                                                         sendBtn
                                                                                         handleClick={() => this.setState({sentToModal: true})}/>}
                                                {userData.wallets.ltc && <WalletCurrency img={images.ltc}
                                                                                         value={userData.wallets.ltc.balance + " LTC"}
                                                                                         sendBtn
                                                                                         handleClick={() => this.toggleModal('ltc')}/>}
                                                {userData.wallets.eos && <WalletCurrency img={images.eos}
                                                                                         value={userData.wallets.eos.balance + " EOS"}
                                                                                         sendBtn
                                                                                         handleClick={() => this.toggleModal('eos')}/>}
                                                {userData.wallets.xvg && <WalletCurrency img={images.xvg}
                                                                                         value={userData.wallets.xvg.balance + " XVG"}
                                                                                         sendBtn
                                                                                         handleClick={() => this.toggleModal('xvg')}/>}
                                            </div>
                                            {showUpdateBtns()}
                                        </div>}
                                    </div> :
                                    <div className="LoadingUserInfo"><img src={images.loading1} alt="loading"/></div>}
                            </div>
                        </div>
                    </div>
                    <Modal show={sentToModal}
                           onClose={() => this.setState({sentToModal: false, error: false, hash: ''})}>
                        {error ?
                            <div className="SendToFormError">
                                <p>An error was occurred. Please try again</p>
                                <button onClick={() => this.setState({error: false})}>Try again</button>
                            </div>
                            : hash ?
                                <div className="SendToFormHash">
                                    <p>Transaction Hash</p>
                                    <a href={"https://ropsten.etherscan.io/tx/" + hash}>https://ropsten.etherscan.io/tx/{hash}</a>
                                </div> :
                                <form onSubmit={this.handleSendTo} className="SendToForm">
                                    <input name="amount" value={this.state.amount}
                                           placeholder="Amount"
                                           required
                                           onChange={(e) => this.setState({amount: e.target.value})}/>
                                    <input name="address" value={this.state.address}
                                           placeholder="Address"
                                           required
                                           onChange={(e) => this.setState({address: e.target.value})}/>
                                    {loading ? <img src={images.loading1} alt="loading"/> :
                                        <button type="submit">Send</button>}
                                </form>
                        }
                    </Modal>
                    <Modal show={getCurrencyModal}
                           onClose={() => this.setState({getCurrencyModal: false, getCurrency: ''})}
                           style={{width: 240}}>
                        <form onSubmit={this.handleGet} className="SendToForm">
                            <input name="password" value={this.state.password}
                                   placeholder="Your account password"
                                   required
                                   type='password'
                                   onChange={(e) => this.setState({password: e.target.value})}/>
                            <input name="amount" value={this.state.amountGet}
                                   placeholder="Amount"
                                   required
                                   onChange={(e) => this.setState({amountGet: e.target.value})}/>
                            {loadingGet ? <img src={images.loading1} alt="loading"/> :
                                <button type="submit">Exchange</button>}
                        </form>
                    </Modal>
                </section>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    data: state.data,
});

const mapDispatchToProps = dispatch => ({
    tokenVerify: () => dispatch(tokenVerify()),
    fetch_user_data: () => dispatch(fetch_user_data()),
    update_user_balance: () => dispatch(update_user_balance()),
    user_exchange: (credentials) => dispatch(user_exchange(credentials))
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Dashboard));