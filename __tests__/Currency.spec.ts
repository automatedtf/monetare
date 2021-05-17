import { parseCurrencyString } from '../lib/Currency';

test("Key price is correctly parsed", () => {
    // 376;m000 - key price is 41.77, 0 currency

    let currency = parseCurrencyString("376;m000");
    expect(currency.keyPrice()).toBe(376);

    let currency2 = parseCurrencyString("1;m000");
    expect(currency2.keyPrice()).toBe(1);

    let currency3 = parseCurrencyString("9.0;m000");
    expect(currency3.keyPrice()).toBe(9);

    let currency4 = parseCurrencyString(";m000");
    expect(currency4.keyPrice()).toBe(null);

    let currency5 = parseCurrencyString("null;m000");
    expect(currency5.keyPrice()).toBe(null);
});

test("withKeyPrice", () => {
    // 376;m000 - key price is 41.77, 0 currency

    let currency = parseCurrencyString("376;m000");
    currency = currency.withKeyPrice(40);
    expect(currency.keyPrice()).toBe(40);

    let currency2 = parseCurrencyString("1;m000");
    currency2 = currency2.withKeyPrice(1);
    expect(currency2.keyPrice()).toBe(1);

    let currency3 = parseCurrencyString("9.0;m000");
    currency3 = currency3.withKeyPrice(0);
    expect(currency3.keyPrice()).toBe(0);

    let currency4 = parseCurrencyString(";m000");
    currency4 = currency4.withKeyPrice(1.0);
    expect(currency4.keyPrice()).toBe(1);
});
