# Monetare 💱

### 📖 Table of Contents
- [👋 Introduction](#-introduction)
- [🔌 Getting Started](#-getting-started)
    - [Installation](#installation)
    - [Currencies within Team Fortress 2](#the-currencies-within-team-fortress-2)
    - [Currency Naming Conventions and Jargon](#currency-naming-conventions-and-jargon)
    - [Currency Pegging](#currency-pegging)
- [💴 Currency Methods](#-currency-methods)
    - [Interface Implementations](#interface-implementations)
        - [toString](#tostring)
- [🧰 Utility Functions](#-utility-functions)
- [📚 Helpful Resources](#-helpful-resources)

## 👋 Introduction
Monetare provides a standardisation to represent, operate and manage the currency system within Team Fortress 2. The in-game trading economy relies on a set of two currencies: keys and metal, which define the pricing basis of all items. Keys are themselves tradable items that can be priced in metal, however, as there is no consistent conversion rate, this value floats over time. As such, systems require calculations to be pegged to a single currency, which this library facilitates.

## 🔌 Getting Started

This library provides a large number of functions to help you work with the currency system. It is recommended that you read through this document before using the library to ensure you understand how it works.

##### Installation
You can install the module via npm:
```typescript
npm install @automatedtf/monetare
```
This will add the library to your project's `package.json` file.

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

## 💴 Currency Methods

`🚧 TODO 🚧` Describe Currency Interface

### Interface Implementations
`🚧 TODO 🚧` Describe Currency Interface Method Implementations

##### toString
`Currency.toString()` returns an internal representation of the currency.

## 🧰 Utility Functions
`🚧 TODO 🚧`

## 📚 Helpful Resources
`🚧 TODO 🚧`