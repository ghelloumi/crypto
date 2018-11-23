export const tableToLink =(tbl)=>{
    return tbl.join('%2C')
};

export const getCryptoTab = (obj, currency) => {
    let cryptoTab =[];
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            obj[property][currency]['CURRENCY'] = currency;
            obj[property][currency]['CRYPTO_CURRENCY'] = property;
            cryptoTab.push(obj[property][currency])
        }
    }
    return cryptoTab
};

export const  sortByKey =(array, key, dir, c)=> {
    return array.sort((a, b) => {
        const x = c?a[key]:parseFloat(a[key].replace(/\$|,/g,""));
        const y = c?b[key]:parseFloat(b[key].replace(/\$|,/g,""));

        return (dir === 1 ? (x < y) ? -1 : ((x > y) ? 1 : 0):dir === 2?(x > y) ? -1 : ((x < y) ? 1 : 0):array);
    });
};

export const filterTableByValue = (tab, searchValue) => {
    return tab.filter(e => {
        for (let key in e) {
            if (e[key].toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
                return e
            }
        }
    })
};
