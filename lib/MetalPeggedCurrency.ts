import { Currency } from './Currency';
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
        return `${this._scraps == 0 ? "" : `${Math.round(this._scraps * 0.11).toFixed(2)} refined`}`;
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
        let metalPeggedCurrency = new MetalPeggedCurrency();
        metalPeggedCurrency._scraps = this._scraps + otherCurrency._metalHash();
        metalPeggedCurrency.withKeyPrice(this._keyPrice);
        return metalPeggedCurrency;
    }

    minus(otherCurrency: Currency): Currency {
        let negativeOtherCurrency = new MetalPeggedCurrency();
        negativeOtherCurrency._scraps = - otherCurrency._metalHash();
        return this.add(negativeOtherCurrency);
    }

    multiply(times: number): Currency {
        let metalPeggedCurrency = new MetalPeggedCurrency();
        metalPeggedCurrency._scraps = this._scraps * times;
        metalPeggedCurrency.withKeyPrice(this._keyPrice);
        return metalPeggedCurrency;
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