# Monetare 💱

### 📖 Table of Contents
- [👋 Introduction](#-introduction)
- [ℹ️ Prerequisite Knowledge](#-prerequisite-knowledge)
    - [Currencies within Team Fortress 2](#the-currencies-within-team-fortress-2)
    - [Currency Naming Conventions and Jargon](#currency-naming-conventions-and-jargon)
    - [Currency Pegging](#currency-pegging)
- [🔌 General Usage](#-general-usage)
    - [Installation](#installation)
    - [Approach to Using the Library](#approach-to-using-the-library)
    - [Example: Setting the price of an item](#example-setting-the-price-of-an-item)
    - [Example: Find the amount of change to provide](#example-find-the-amount-of-change-to-provide)
- [🧰 Methods and Functions](#-methods-and-functions)
    - [Interface Implementations](#interface-implementations)
        - [toString](#tostring)
        - [toHumanReadeable](#tohumanreadable)
        - [keyPrice](#keyprice)
        - [withKeyPrice](#withkeyprice)
        - [isKeyPegged](#iskeypegged)
        - [isMetalPegged](#ismetalpegged)
        - [toKeyPegged](#tokeypegged)
        - [toMetalPegged](#tometalpegged)
        - [add](#add)
        - [minus](#minus)
        - [multiply](#multiply)
        - [isGreaterThan](#isgreaterthan)
        - [isGreaterThanOrEqualTo](#isgreaterthanorequalto)
        - [isEqualTo](#isequalto)
        - [isLessThanOrEqualTo](#islessthanorequalto)
        - [isLessThan](#islessthan)
        - [normalise](#normalise)
    - [Utility Functions](#-utility-functions)
        - [parseCurrencyString](#parsecurrencystring)
        - [Zero](#zero)
        - [Key](#key)
        - [Refined](#refined)
        - [Reclaimed](#reclaimed)
        - [Scrap](#scrap)
- [📚 Helpful Resources](#-helpful-resources)

## 👋 Introduction
Monetare provides a standardisation to represent, operate and manage the currency system within Team Fortress 2. The in-game trading economy relies on a set of two currencies: keys and metal, which define the pricing basis of all items. Keys are themselves tradable items that can be priced in metal, however, as there is no consistent conversion rate, this value floats over time. As such, systems require calculations to be pegged to a single currency, which this library facilitates.

## ℹ️ Prerequisite Knowledge

This library provides a large number of functions to help you work with the currency system. It is recommended that you read through this section before using the library to ensure you understand how it works.

##### Currencies within Team Fortress 2
The Team Fortress 2 economy utilises two main currencies: the `Mann Co. Supply Crate Key` and metal.

Metal is the base currency provided within the game, being generated from the crafting of items. 2 weapons can be crafted to create 1 `Scrap Metal`. 3 `Scrap Metal` can be used to craft 1 `Reclaimed Metal`. 3 ``Reclaimed Metal`` can be used to craft 1 `Refined Metal`.

These each can then be used to craft other items. Given that there is an in-game drop system that continuously provides weapons to players, there is ultimately no limit to the number of metal (`Scrap`, `Reclaimed`, or `Refined`).

[🔗 Details on Metal Crafting](https://wiki.teamfortress.com/wiki/Crafting#Metal)

Over time, traders within the Team Fortress 2 affixed their own currency item, the [`Mann Co. Supply Crate Key`](https://wiki.teamfortress.com/wiki/Mann_Co._Supply_Crate_Key) to price other items due to its stable conversion to real cash dollars (`~$2.50 ea.`). For items less than `~$2.50 ea.`, metal has been used to price these items.

[🔗 Conversion Rate of Metal to Keys over time](https://backpack.tf/stats/Unique/Mann%20Co.%20Supply%20Crate%20Key/Tradable/Craftable)

##### Currency Naming Conventions and Jargon
Traders use a set of short-hand naming conventions to represent the currencies within Team Fortress 2. Below is a list of common jargon used within the community:

- `keys` - `Mann Co. Supply Crate Key`
- `ref` - `Refined Metal`
- `rec` - `Reclaimed Metal`
- `scrap` - `Scrap Metal`
- `metal` - `Refined Metal`, `Reclaimed Metal`, and `Scrap Metal`
- `0.33 refined` - 1 `Reclaimed Metal`
- `0.11 refined` - 1 `Scrap Metal`
- `1.55 refined` - 1 `Refined Metal`, 1 `Reclaimed Metal`, and 2 `Scrap Metal`

##### Currency Pegging
This library uses the concept of currency pegging to convert between keys and metal. When representing currencies as strings, there are two internal systems used: `Metal-pegged` and `Key-pegged`.

    Metal-pegged: 376;m000  - <Scrap To Key Rate>;m<Scraps>
    Key-pegged: 376;k2:001 - <Scrap To Keys Rate>;k<Keys>:<Scraps>

The affixing of the `Scrap To Keys Rate` to the internal representation of these systems is to allow for a user to switch between the two systems at any given time. This can also be used to index the value of an item over time in any of these systems.

For example, if an item is to represented using a key-pegged value such as `100;k2:001`, then currently, the item is worth `2 keys, 1 scrap` or `201 scraps`. If the scrap-to-key ratio rises from `100:1` to `200:1`, then the item is still worth `2 keys, 1 scrap` but in terms of metal-value, it is now worth `401 scraps`.

Generally, items worth more than `$2.50` use key-pegged values whilst items worth less than `$2.50` use metal-pegging to fix their values.

## 🔌 General Usage
##### Installation
You can install the module via npm:
```typescript
npm install @automatedtf/monetare
```
This will add the library to your project's `package.json` file.

##### Approach to Using the Library
You will find yourself using the library in parallel to your logic.

You should attempt to represent currency values by either applying consequent operations to a `Key`, `Refined`, `Reclaimed`, or `Scrap` Currency object when first deriving the value for an item, or by using `parseCurrencyString` to parse a cached string representation of a currency back into a `Currency` object.

##### Example: Setting the price of an item
Consider the example of a user wishing to set the price of their item listed on a website to `1 key, 5.33 refined` as `POST`ed to the server from submitting an input form.
```typescript
import { Key, Refined, Scrap } from "@automatedtf/monetare"; 

// Parse request body data
const { key, metal, itemid }: { key: string, metal: string, itemid: string } = req.body;

console.log(key); // 1
console.log(metal); // 5.33

// Get item from database
const item = await getItemFromDatabase(itemid);

// Get amounts of each currency unit
// Note: Very simple, buggy extractor function
const metalComponents = metal.split(".");
const refined = parseInt(metalComponents[0]);
const scrap = (metalComponents.length == 2) ? Math.floor(parseFloat(metalComponents[1]) / 0.11) : 0;

// Get total of currency units
const itemPrice: Currency = Key(key).add(Refined(refined)).add(Scrap(scrap));

// Set price of item
item.price = itemPrice.toString();

await saveItemToDatabase(item);
```

##### Example: Find the amount of change to provide
Consider the example of a user buying an item from a website. We need to check that the price of the item is lower than the amount that the user's credit on the website and then take the amount from the user's balance.

```typescript
import { parseCurrencyString } from "@automatedtf/monetare"; 

// Assume we already have the user object from the database
const user: { balance: string; ... } = ...;
const userBalance: Currency = parseCurrencyString(user.balance);

// Assume we already have the item object from the database
const item : { price: string; ... } = ...;
const itemPrice: Currency = parseCurrencyString(item.price);

// Check that item is worth more than the user's balance
if (userBalance.isLessThan(itemPrice)) {
    return res.status(400).send("Insufficient funds");
}

// Find change
const change = itemPrice.minus(userBalance);
user.balance = change.toString();

// Save user object
await saveUserToDatabase(user);

return res.status(200).send("Success");
```

## 🧰  Methods and Functions

The Currency interface forms the main base of the library. It provides a set of methods to help you work with either currency system (`Metal-pegged` or `Key-pegged`).

```typescript
interface Currency {
    
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

    /* Inequalities */
    isGreaterThan(otherCurrency: Currency): boolean;
    isGreaterThanOrEqualTo(otherCurrency: Currency): boolean;
    isEqualTo(otherCurrency: Currency): boolean;
    isLessThanOrEqualTo(otherCurrency: Currency): boolean;
    isLessThan(otherCurrency: Currency): boolean;

    /* Utility */
    normalise(): Currency;
}
```

### Interface Implementations

##### toString
`Currency.toString()` returns an internal representation of the currency.
- `Metal-pegged` - `<Scrap To Key Rate>;m<Scraps>` e.g `376;m000`
- `Key-pegged` - `<Scrap To Keys Rate>;k<Keys>:<Scraps>` e.g `376;k2:001`

##### toHumanReadable
`Currency.toHumanReadable()` returns a human readable representation of the currency.
- `Metal-pegged` - e.g `0.11 refined`, `5.00 refined`
- `Key-pegged` - e.g `1 key, 0.11 refined`, `0 keys, 15.11 refined` 

##### keyPrice
`Currency.keyPrice()` returns the price of a `Key` in scraps as captured in the Currency object.
- `Metal-pegged` - e.g `376` from `376;m000`
- `Key-pegged` - e.g `376` from `376;k3:001`

##### withKeyPrice
`Currency.withKeyPrice(keyPrice: number)` returns a new Currency object with the key price set to the provided value.
- `Metal-pegged` - returns `Metal-pegged` object
- `Key-pegged` - returns `Key-pegged` object

##### isKeyPegged
`Currency.isKeyPegged()` returns a boolean indicating whether the currency is key-pegged.
- `Metal-pegged` - returns `false`
- `Key-pegged` - returns `true`

##### isMetalPegged
`Currency.isMetalPegged()` returns a boolean indicating whether the currency is metal-pegged.
- `Metal-pegged` - returns `true`
- `Key-pegged` - returns `false`

##### toKeyPegged
`Currency.toKeyPegged()` returns a new `Key-pegged` Currency object.
- `Metal-pegged` - converts to a `Key-pegged` object
- `Key-pegged` - returns this

##### toMetalPegged
`Currency.toMetalPegged()` returns a new `Metal-pegged` Currency object.
- `Metal-pegged` - returns this
- `Key-pegged` - converts to a `Metal-pegged` object

##### add
`Currency.add(otherCurrency: Currency)` returns a new `Currency` object with the values of the current object and the other object added together.

##### minus
`Currency.minus(otherCurrency: Currency)` returns a new `Currency` object with the values of the current object and the other object subtracted from it.

##### multiply
`Currency.multiply(times: number)` returns a new `Currency` object with the values of the current object multiplied by the provided value.

##### isGreaterThan
`Currency.isGreaterThan(otherCurrency: Currency)` returns a boolean indicating whether the current object is greater than the other object.

##### isGreaterThanOrEqualTo
`Currency.isGreaterThanOrEqualTo(otherCurrency: Currency)` returns a boolean indicating whether the current object is greater than or equal to the other object.

##### isEqualTo
`Currency.isEqualTo(otherCurrency: Currency)` returns a boolean indicating whether the current object is equal to the other object.
`🚧 TODO 🚧 - Expand on how isEqualTo is done`

##### isLessThanOrEqualTo
`Currency.isLessThanOrEqualTo(otherCurrency: Currency)` returns a boolean indicating whether the current object is less than or equal to the other object.

##### isLessThan
`Currency.isLessThan(otherCurrency: Currency)` returns a boolean indicating whether the current object is less than the other object.

##### normalise
`Currency.normalise()` returns a new `Currency` object with the values of the current object normalised.

`🚧 TODO 🚧 - Expand on how normalise works`

### Utility Functions
##### parseCurrencyString
`parseCurrencyString(currencyString: string)` returns a new `Currency` object from the provided string.

This should be a string of the form `<Scrap To Key Rate>;m<Scraps>` or `<Scrap To Keys Rate>;k<Keys>:<Scraps>` as given by the `toString` method.

##### Zero
`Zero` is a `Key-pegged` object representing zero value.
##### Key
`Key` creates a new `Key-pegged` Currency object that represents 1 key.

##### Refined
`Refined` creates a new `Metal-pegged` Currency object that represents 1 refined.

##### Reclaimed
`Reclaimed` creates a new `Metal-pegged` Currency object that represents 1 reclaimed or 0.33 refined.

##### Scrap
`Scrap` creates a new `Metal-pegged` Currency object that represents 1 scrap or 0.11 refined.


## 📚 Helpful Resources
`🚧 TODO 🚧`