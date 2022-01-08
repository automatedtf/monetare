import KeyPeggedCurrency from './KeyPeggedCurrency';
import MetalPeggedCurrency from './MetalPeggedCurrency';

export interface Currency {

    /* Attributes */
    _keyPrice: number;
    
    /* Conversions */
    toString(): string;
    toHumanReadable(): string;
    
    keyPrice(): number;
    withKeyPrice(keyPrice: number): Currency;
    
    isKeyPegged(): boolean;
    isMetalPegged(): boolean;
    toKeyPegged(): KeyPeggedCurrency;
    toMetalPegged(): MetalPeggedCurrency;

    /* Operations */
    add(otherCurrency: Currency): Currency;
    minus(otherCurrency: Currency): Currency;
    multiply(times: number): Currency;

    normalise(): Currency;

    isGreaterThan(otherCurrency: Currency): boolean;
    isGreaterThanOrEqualTo(otherCurrency: Currency): boolean;
    isEqualTo(otherCurrency: Currency): boolean;
    isLessThanOrEqualTo(otherCurrency: Currency): boolean;
    isLessThan(otherCurrency: Currency): boolean;

    /* Helpers */
    _metalHash(): number;
}

export function parseCurrencyString(currencyString: string):  Currency {
    let keyPrice = currencyString.includes(";") ? (parseInt(currencyString) || null) : null;
    let currencyAmountString = currencyString.includes(";") ? currencyString.split(";")[1] : currencyString;

    let keys = 0;
    let scraps = 0;

    const isKeyPegged = currencyAmountString[0] == "k";
    if (isKeyPegged) {
        keys = parseInt(currencyAmountString.substring(1));
        currencyAmountString = `m${currencyAmountString.split(":")[1] || 0}`;
    }

    const isMetalPegged = currencyAmountString[0] == "m";
    if (isMetalPegged) scraps = parseInt(currencyAmountString.substring(1));

    // Set up currency object
    if (isKeyPegged) {
        let keyPeggedCurrency = new KeyPeggedCurrency();
        keyPeggedCurrency._keys = keys;
        keyPeggedCurrency._scraps = scraps;
        return keyPeggedCurrency.withKeyPrice(keyPrice);
    }

    return Scrap(scraps).withKeyPrice(keyPrice);
}

export function parseMetalDecimal(metalDecimal: string): Currency {
    const [whole, fraction] = metalDecimal.split(".");
    const sign = whole[0] == "-" ? -1 : 1;
    return Refined( sign * parseInt(whole)).add(Scrap(sign * parseInt(fraction?.substring(0, 2) || "0") / 11 ));
}

export function Zero(): MetalPeggedCurrency {
    return Scrap(0);
}

export function Refined(amount: number = 1): MetalPeggedCurrency {
    return Scrap(amount * 9);
}

export function Reclaimed(amount: number = 1): MetalPeggedCurrency {
    return Scrap(amount * 3);
}

export function Scrap(amount: number = 1): MetalPeggedCurrency {
    let metalPeggedCurrency = new MetalPeggedCurrency();
    metalPeggedCurrency._scraps = amount;
    return metalPeggedCurrency;
}

export function Key(amount: number = 1): KeyPeggedCurrency {
    let keyPeggedCurrency = new KeyPeggedCurrency();
    keyPeggedCurrency._keys = amount;
    return keyPeggedCurrency;
}