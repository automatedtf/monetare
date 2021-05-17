import { Zero, Refined, Key, parseCurrencyString, Reclaimed } from '../lib/Currency';

test("string outputting", () => {
    let zero = Zero();
    expect(zero.toString()).toBe(";m0");

    let refined = Refined();
    expect(refined.toString()).toBe(";m9");

    let key = Key();
    expect(key.toString()).toBe(";k1:0");
    
    let generalCase = parseCurrencyString("376;m000");
    expect(generalCase.toString()).toBe("376;k0:0");
});

test("adding", () => {
    let refined = Refined();
    let reclaimed = Reclaimed();
    expect(refined.add(reclaimed)._metalHash()).toBe(12);
    expect(refined._scraps).toBe(9); // refined object shouldn't have changed. Immutable
    expect(reclaimed._scraps).toBe(3);

    expect(Key().add(Refined()).toString()).toBe(";k1:9");
});

test("minus", () => {
    let refined = Refined();
    let reclaimed = Reclaimed();
    expect(refined.minus(reclaimed)._metalHash()).toBe(6);
    expect(refined._metalHash()).toBe(9);
    expect(reclaimed._metalHash()).toBe(3);
});

test("multiplying", () => {
    let refined = Refined();
    let refinedHash = refined._metalHash();
    expect(refined.multiply(8)._metalHash()).toBe(refinedHash * 8);

    let key = Key();
    expect(key.multiply(3).toHumanReadable()).toBe("3 keys");
});