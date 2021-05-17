import { Refined, Reclaimed, Scrap, Zero, Key } from '../lib/Currency';

test("1 refined metal is created correctly", () => {
    let refined = Refined(1);
    expect(refined._scraps).toBe(9);
    expect(refined._keyPrice).toBe(null);
});

test("multiple refined metal are created correctly", () => {
    
    let refineds = Refined(3);
    expect(refineds._scraps).toBe(27);
    expect(refineds._keyPrice).toBe(null);
});

test("1 reclaimed metal is created correctly", () => {
    let reclaimed = Reclaimed(1);
    expect(reclaimed._scraps).toBe(3);
    expect(reclaimed._keyPrice).toBe(null);
});

test("multiple reclaimed metal are created correctly", () => {
    let reclaimeds = Reclaimed(4);
    expect(reclaimeds._scraps).toBe(12);
    expect(reclaimeds._keyPrice).toBe(null);
});

test("1 scrap metal is created correctly", () => {
    let scrap = Scrap(1);
    expect(scrap._scraps).toBe(1);
    expect(scrap._keyPrice).toBe(null);
});

test("multiple scrap metals are created correctly", () => {
    let scraps = Scrap(4);
    expect(scraps._scraps).toBe(4);
    expect(scraps._keyPrice).toBe(null);
});

test("1 key is created correctly", () => {
    let key = Key(1);
    expect(key._keys).toBe(1);
    expect(key._scraps).toBe(0);
    expect(key._keyPrice).toBe(null);
});

test("multiple keys are created correctly", () => {
    let keys = Key(4);
    expect(keys._keys).toBe(4);
    expect(keys._scraps).toBe(0);
    expect(keys._keyPrice).toBe(null);
});

test("zero is zero", () => {
    let zero = Zero();
    expect(zero._scraps).toBe(0);
    expect(zero._keyPrice).toBe(null);
});