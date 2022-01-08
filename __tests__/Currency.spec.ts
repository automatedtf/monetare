import { parseCurrencyString, parseMetalDecimal } from '../lib/Currency';

describe("parseCurrencyString", () => {
    it("MetalPeggedCurrency - General Case", () => {

        // 376;m000 - key price is 41.77, 0 currency

        let currency = parseCurrencyString("376;m000");
        expect(currency.keyPrice()).toBe(376);
        expect(currency._metalHash()).toBe(0);

        currency = currency.withKeyPrice(40);
        expect(currency.keyPrice()).toBe(40);
    });

    it("MetalPeggedCurrency - Float Key Price", () => {
        let currency3 = parseCurrencyString("9.0;m6");
        expect(currency3.keyPrice()).toBe(9);
        expect(currency3._metalHash()).toBe(6);
    });

    it("MetalPeggedCurrency - No Key Price", () => { 

        let currency = parseCurrencyString(";m000");
        expect(currency.keyPrice()).toBe(null);
        expect(currency._metalHash()).toBe(0);

        let currency2 = parseCurrencyString(";m003");
        expect(currency2.keyPrice()).toBe(null);
        expect(currency2._metalHash()).toBe(3);
    });

    it("MetalPeggedCurrency - Null Key Price", () => {
        let currency5 = parseCurrencyString("null;m000");
        expect(currency5.keyPrice()).toBe(null);
    });

    it("KeyPeggedCurrency - General Case", () => {
        let currency = parseCurrencyString("376;k0:3");
        expect(currency.keyPrice()).toBe(376);
        expect(currency._metalHash()).toBe(3);

        currency = currency.withKeyPrice(40);
        expect(currency.keyPrice()).toBe(40);
    });

    it("KeyPeggedCurrency - Float Key Price", () => {
        let currency = parseCurrencyString("9.0;k1:3");
        expect(currency.keyPrice()).toBe(9);
        expect(currency._metalHash()).toBe(12);

        currency = currency.withKeyPrice(40);
        expect(currency.keyPrice()).toBe(40);
        expect(currency._metalHash()).toBe(43);
    });

    it("KeyPeggedCurrency - No Key Price", () => {
        let currency = parseCurrencyString(";k0:0");
        expect(currency.keyPrice()).toBe(null);
        expect(currency._metalHash()).toBe(0);

        let currency2 = parseCurrencyString(";k0:003");
        expect(currency2.keyPrice()).toBe(null);
        expect(currency2._metalHash()).toBe(3);

        let currency3 = parseCurrencyString(";k0");
        expect(currency3.keyPrice()).toBe(null);
        expect(currency3._metalHash()).toBe(0);
    });

    it("KeyPeggedCurrency - Null Key Price", () => {
        let currency5 = parseCurrencyString("null;m000");
        expect(currency5.keyPrice()).toBe(null);
        expect(currency5._metalHash()).toBe(0);
    });
});

describe("parseMetalDecimal", () => {
    it("1.11 - General Case", () => {
        let currency = parseMetalDecimal("1.11");
        expect(currency.keyPrice()).toBe(null);
        expect(currency._metalHash()).toBe(10);
    });

    it("0.11 - Edge Case: no whole parts", () => {
        let currency = parseMetalDecimal("0.11");
        expect(currency.keyPrice()).toBe(null);
        expect(currency._metalHash()).toBe(1);
    })

    it("1.00 - Edge Case: no remainder", () => {
        let currency = parseMetalDecimal("1.00");
        expect(currency.keyPrice()).toBe(null);
        expect(currency._metalHash()).toBe(9);
    })

    it("-0.11 - Negative Case", () => {
        let currency = parseMetalDecimal("-0.11");
        expect(currency.keyPrice()).toBe(null);
        expect(currency._metalHash()).toBe(-1);
    })

    it("0.002 - Case: only 2 d.p counts", () => {
        let currency = parseMetalDecimal("0.002");
        expect(currency.keyPrice()).toBe(null);
        expect(currency._metalHash()).toBe(0);
    })
});