# monetare

Metal-pegged: 376;m000
Key-pegged: 376;k2:001


Global functions:
    parseCurrencyString: string -> Currency
    Zero
    Refined Metal
    Reclaimed Metal
    Scrap Metal
    Key
        
Currency
    constructor: null -> Currency

    toString - returns key, metal string
    toPureMetalString - returns metal string

    keyPrice - returns key price
    withKeyPrice - sets key price, returns new Currency

    keyPegged - returns key pegged price 
    metalPegged - returns metal pegged price

    -- operations
    add: Currency -> Currency
    minus: Currency -> Currency
    multiply: Currency -> Currency
    isGreaterThan: Currency -> boolean
    isGreaterThanOrEqualTo: Currency -> boolean
    isLessThan: Currency -> boolean
    isLessThanOrEqualTo: Currency -> boolean
    isEqualTo: Currency -> boolean

    _metalHash: () -> integer. Returns number of scraps. Makes it easy to add and convert things together