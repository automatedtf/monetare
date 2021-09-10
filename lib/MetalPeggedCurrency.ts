import { Currency, Zero } from './Currency';
import KeyPeggedCurrency from './KeyPeggedCurrency';
export default class MetalPeggedCurrency implements Currency {
    _scraps: number;
    _keyPrice: number;

    constructor() {
        this._scraps = 0;
        this._keyPrice = null;
    }

    toString(): string {
        return `${this._keyPrice || ""};m${this._scraps}`;
    }

    toHumanReadable(): string {
        let refs = Math.floor(this._scraps / 9);
        let refRemainder = (this._scraps % 9) * 0.11;
        return this._scraps == 0 ? "" : `${refRemainder == 0 ? refs : (refRemainder + refs)} refined`;
    }

    keyPrice(): number {
        return this._keyPrice;
    }

    withKeyPrice(keyPrice: number): Currency {
        let currency = new MetalPeggedCurrency();
        currency._keyPrice = keyPrice;
        currency._scraps = this._scraps;
        return currency;
    }

    isKeyPegged(): boolean {
        return false;
    }

    isMetalPegged(): boolean {
        return true;
    }

    toKeyPegged(): KeyPeggedCurrency {
        let keyPeggedCurrency = new KeyPeggedCurrency();
        if (this._keyPrice == null) throw "Please set key price first";
        keyPeggedCurrency._keys = Math.floor(this._scraps / this._keyPrice);
        keyPeggedCurrency._scraps = this._scraps % this._keyPrice;
        keyPeggedCurrency.withKeyPrice(this._keyPrice);
        return keyPeggedCurrency;
    }

    toMetalPegged(): MetalPeggedCurrency {
        return this;
    }

    add(otherCurrency: Currency): Currency {
        
        let resultantCurrency: Currency;
        if (otherCurrency.isMetalPegged()) {
            // if also metal, add currencies
            let resultantMetalPeggedCurrency = new MetalPeggedCurrency();
            resultantMetalPeggedCurrency._scraps = (otherCurrency as MetalPeggedCurrency)._scraps + this._scraps;
            resultantCurrency = resultantMetalPeggedCurrency.withKeyPrice(this._keyPrice);
        } else {
            // other currency is keypegged
            let resultantKeyPeggedCurrency = new KeyPeggedCurrency();
            resultantKeyPeggedCurrency._keys = (otherCurrency as KeyPeggedCurrency)._keys;
            resultantKeyPeggedCurrency._scraps = (otherCurrency as KeyPeggedCurrency)._scraps + this._scraps;
            resultantCurrency = resultantKeyPeggedCurrency.withKeyPrice(this._keyPrice);
        }

        return resultantCurrency;
    }

    minus(otherCurrency: Currency): Currency {
        // invert otherCurrency then add
        let invertedCurrency: Currency;

        if (otherCurrency.isMetalPegged()) {
            let invertedMetalPeggedCurrency = new MetalPeggedCurrency();
            invertedMetalPeggedCurrency._scraps = -(otherCurrency as MetalPeggedCurrency)._scraps;
            invertedCurrency = invertedMetalPeggedCurrency.withKeyPrice(this._keyPrice);
        } else {
            let invertedKeyPeggedCurrency = new KeyPeggedCurrency();
            invertedKeyPeggedCurrency._keys = -(otherCurrency as KeyPeggedCurrency)._keys;
            invertedKeyPeggedCurrency._scraps = -(otherCurrency as KeyPeggedCurrency)._scraps;
            invertedCurrency = invertedKeyPeggedCurrency.withKeyPrice(this._keyPrice);
        }

        return this.add(invertedCurrency);
    }

    multiply(times: number): Currency {
        let runningTotal: Currency = (times == 0) ? Zero() : this;
        for (let i = 1; i < Math.abs(times); i++) {
            runningTotal = (times >= 0) ? runningTotal.add(this) : runningTotal.minus(this);
        }
        return runningTotal;
    }

    isGreaterThan(otherCurrency: Currency): boolean {
        return this._metalHash() > otherCurrency._metalHash();
    }
    isGreaterThanOrEqualTo(otherCurrency: Currency): boolean {
        return this._metalHash() >= otherCurrency._metalHash();
    }
    isEqualTo(otherCurrency: Currency): boolean {
        return this._metalHash() == otherCurrency._metalHash();
    }
    isLessThanOrEqualTo(otherCurrency: Currency): boolean {
        return this._metalHash() <= otherCurrency._metalHash();
    }
    isLessThan(otherCurrency: Currency): boolean {
        return this._metalHash() < otherCurrency._metalHash();
    }

    normalise(): Currency {
        return this;
    }

    _metalHash(): number {
        return this._scraps;
    }   
}