import React, {Component} from 'react';
import PropTypes from "prop-types";

import {getCryptoCompare} from "../../../services/currencies.api";
import {images} from "../../../constants";
import {filterTableByValue, getCryptoTab, sortByKey} from "../../../utils";

import './Section1.css';

const TabHead = ({title, sort, name, handleSort}) =>
    <th onClick={() => handleSort(title)}>
        <span
            style={{marginRight: sort.dir !== 0 && sort.col === title ? 0 : 10}}>{name}</span>
        {sort.dir !== 0 && sort.col === title &&
        <i className={sort.dir === 1 ? "fa fa-caret-up" : "fa fa-caret-down"}/>}
    </th>;

TabHead.prototype = {
    title: PropTypes.string.isRequired,
    sort: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    handleSort: PropTypes.func.isRequired,
};

class Section1 extends Component {
    state = {
        loading: true,
        crypto: [],
        filteredCrypto: [],
        sort: {col: '', dir: 0}, //0:none, 1:inc, 2: desc
        searchValue: '',
        getStartingEmail: ''
    };

    loadData = async (currency) => {
        try {
            const crypto = await getCryptoCompare(this.props.cryptoCompareTab, currency);
            const criptoDisplay = getCryptoTab(crypto.DISPLAY, currency);
            this.setState({crypto: criptoDisplay, filteredCrypto: criptoDisplay});
        } catch (e) {
            console.error(e);
        } finally {
            this.setState({loading: false})
        }
    };

    componentDidMount() {
        this.inputElement.focus();
        this.loadData(this.props.currency)
    }

    handleChangeCurrency = async (e, currency) => {
        e.preventDefault();
        this.setState({loading: true});
        this.loadData(currency)
    };

    handleSort = (col) => {
        const {dir} = this.state.sort;
        const addToState = (num) => {
            this.setState({sort: {col, dir: num}});
            const criptoSorted = sortByKey(this.state.crypto, col, num, col === 'CRYPTO_CURRENCY');
            this.setState({crypto: criptoSorted, filteredCrypto: criptoSorted});
        };
        this.state.sort.col === col ? dir === 0 ? addToState(1) : dir === 1 ? addToState(2) : dir === 2 ? addToState(0) : null : addToState(1)
    };

    handleSearch = (e) => {
        const searchValue = e.target.value;
        this.setState({searchValue, filteredCrypto: filterTableByValue(this.state.crypto, searchValue)});
    };

    render() {
        const {currencies, cryptoCompareDataTabHeader} = this.props;

        const {loading, sort, searchValue, filteredCrypto, getStartingEmail} = this.state;
        return (
            <section className="HomeSection1" id="section1">
                <div>
                    <h1>Your ideal payment solution</h1>
                    <p>A disruptive technology that enables you to manage and spend your digital
                        currencies <span>Whenever</span> and <span>Wherever</span> you want in the
                        most <span>optimized</span> way.</p>
                    <div className="HomeSection1Email">
                        <input placeholder="Email address" ref={el => this.inputElement = el} value={getStartingEmail} onChange={(e) => this.setState({getStartingEmail:e.target.value})}/>
                        <button onClick={() => this.props.history.push({pathname:'/login',state:{getStartingEmail}})}>Get Started</button>
                    </div>
                </div>
                <div className="HomeSection1Currencies">
                    <div className="HomeSection1CurrenciesBorder">
                        <div className="HomeSection1CurrenciesContent">
                            <div className="HomeSection1CurrenciesContentHeader">
                                <div className="HomeSection1CurrenciesContentHeaderCurrency">
                                    {currencies.map((e, i) => {
                                        return (
                                            <a key={i} onClick={(event) => this.handleChangeCurrency(event, e)}>{e}</a>
                                        )
                                    })}
                                </div>
                                <div className="HomeSection1CurrenciesContentHeaderSearch">
                                    <input placeholder="Search" onChange={this.handleSearch} value={searchValue}/>
                                    <button><i className="fa fa-search"/></button>
                                </div>
                            </div>
                            {loading ?
                                <div className="Loading"><img src={images.loading} alt="loading"/></div> :
                                <table className="HomeSection1CurrenciesContentTable">
                                    <thead>
                                    <tr>
                                        {cryptoCompareDataTabHeader.map((e, i) => {
                                            return (
                                                <TabHead key={i} title={e.title} sort={sort} name={e.name}
                                                         handleSort={this.handleSort}/>
                                            )
                                        })}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        filteredCrypto.map((e, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{e.CRYPTO_CURRENCY + e.CURRENCY}</td>
                                                    <td>{e.PRICE}</td>
                                                    <td style={{color: parseFloat(e.CHANGEPCT24HOUR) > 0 ? "green" : "red"}}>{e.CHANGEPCT24HOUR}%</td>
                                                    <td>{e.HIGH24HOUR}</td>
                                                    <td>{e.LOW24HOUR}</td>
                                                    <td>{e.VOLUME24HOURTO} {e.CURRENCY}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

Section1.propTypes = {
    currency: PropTypes.string.isRequired,
    currencies: PropTypes.array.isRequired,
    cryptoCompareTab: PropTypes.array.isRequired,
    cryptoCompareDataTabHeader: PropTypes.array.isRequired
};

export default Section1