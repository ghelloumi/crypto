import React, {Component} from 'react';

import View from "../../components/view/View";
import Section2 from "../../components/homeComponents/section2/Section2";
import Section3 from "../../components/homeComponents/section3/Section3";
import Section1 from "../../components/homeComponents/section1/Section1";

import './Home.css';

const cryptoCompareTabFrom = ['BTC', 'ETH', 'LTC', 'EOS', 'XVG'];
const cryptoCompareTabTo = ['USD', 'EUR', 'GBP', 'JPY', 'BTC'];
const defaultCcurrency = 'USD';
const cryptoCompareDataTabHeader = [
    {title: "CRYPTO_CURRENCY", name: "Symbole"},
    {title: "PRICE", name: "Last price"},
    {title: "CHANGEPCT24HOUR", name: "24H Change"},
    {title: "HIGH24HOUR", name: "24H High"},
    {title: "LOW24HOUR", name: "24H Low"},
    {title: "VOLUME24HOURTO", name: "24H Volume"}
];

const options = [
    {
        icon: "fa fa-balance-scale",
        title: "Create account",
        desc: "Buy and sell popular digital currencies, keep track of them in the one place."
    },
    {
        icon: "fa fa-balance-scale",
        title: "Deposit",
        desc: "Invest in digital currency slowly over time by scheduling buys daily, weekly, or\n" +
            "                                    monthly."
    },
    {
        icon: "fa fa-balance-scale",
        title: "Exchange",
        desc: "For added security, store your funds in a vault with time delayed\n" +
            "                                    withdrawals."
    },
    {
        icon: "fa fa-balance-scale",
        title: "Pay",
        desc: "Stay on top of the markets with the Coinbase app for Android or iOS."
    }
];

export default class Home extends Component {
    render() {
        return (
            <View>
                <Section1 currency={defaultCcurrency} currencies={cryptoCompareTabTo}
                          cryptoCompareTab={cryptoCompareTabFrom}
                          cryptoCompareDataTabHeader={cryptoCompareDataTabHeader}
                          history={this.props.history}/>
                <Section2 options={options}/>
                <Section3/>
            </View>
        );
    }
}
