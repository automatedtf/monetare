import MetalPeggedCurrency from './MetalPeggedCurrency';
import { Currency, Zero } from './Currency';

export default class KeyPeggedCurrency implements Currency {
    _keys: number;
    _scraps: number;
    _keyPrice: number;

    constructor() {
        this._keys = 0;
        this._scraps = 0;
        this._keyPrice = null;
    }

    toString(): string {
        return `${this._keyPrice || ""};k${this._keys}:${this._scraps}`;
    }

    toHumanReadable(): string {
        return `${this._keys} key${this._keys == 1 ? "" : "s"}${this._scraps == 0 ? "" : `, ${Math.round(this._scraps * 0.11).toFixed(2)} refined`}`;
    }

    keyPrice(): number {
        return this._keyPrice;
    }
    withKeyPrice(keyPrice: number): KeyPeggedCurrency {
        let currency = new KeyPeggedCurrency();
        currency._keyPrice = keyPrice;
        currency._scraps = this._scraps;
        currency._keys = this._keys;
        return currency;
    }

    isKeyPegged(): boolean {
        return true;
    }

    isMetalPegged(): boolean {
        return false;
    }

    toKeyPegged(): KeyPeggedCurrency {
        return this;
    }

    toMetalPegged(): MetalPeggedCurrency {
        let metalPeggedCurrency = new MetalPeggedCurrency();
        if(this._keyPrice == null) throw "Please set key price first";
        metalPeggedCurrency.withKeyPrice(this._keyPrice);
        metalPeggedCurrency._scraps = this._metalHash();
        return metalPeggedCurrency;
    }

    add(otherCurrency: Currency): Currency {
        let resultantKeyPeggedCurrency = new KeyPeggedCurrency();
        resultantKeyPeggedCurrency._keys = this._keys + ((otherCurrency.isKeyPegged()) ? (otherCurrency as KeyPeggedCurrency)._keys : 0);
        resultantKeyPeggedCurrency._scraps = this._scraps + ((otherCurrency.isKeyPegged()) ? (otherCurrency as KeyPeggedCurrency)._scraps : (otherCurrency as MetalPeggedCurrency)._scraps);
        return resultantKeyPeggedCurrency.withKeyPrice(this._keyPrice);
    }

    minus(otherCurrency: Currency): Currency {
        let invertedCurrency: Currency;

        if (otherCurrency.isKeyPegged()) {
            let otherKeyPeggedCurrency = (otherCurrency as KeyPeggedCurrency);
            let invertedKeyPeggedCurrency = new KeyPeggedCurrency();
            invertedKeyPeggedCurrency._keys = -otherKeyPeggedCurrency._keys;
            invertedKeyPeggedCurrency._scraps = -otherKeyPeggedCurrency._scraps;
            invertedCurrency = invertedKeyPeggedCurrency.withKeyPrice(otherCurrency._keyPrice);
        } else {
            // metal pegged
            let otherMetalPeggedCurrency = (otherCurrency as MetalPeggedCurrency)
            let invertedMetalPeggedCurrency = new MetalPeggedCurrency();
            invertedMetalPeggedCurrency._scraps = -otherMetalPeggedCurrency._scraps;
            invertedCurrency = invertedMetalPeggedCurrency.withKeyPrice(otherCurrency._keyPrice);
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

    _metalHash(): number {
        return this._keys * this._keyPrice + this._scraps;
    }
}