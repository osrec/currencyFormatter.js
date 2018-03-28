const chai = require('chai');
const currencyFormatter = require('./currencyFormatter');

chai.should();

const checkCurrency = (
  [countryCode, expected, expectedNegative = null, locale = undefined]
) => {
  it(`should format ${countryCode} correctly${locale ? ` with locale ${locale}` : ''}`, () => {
    currencyFormatter
      .format(1234, { currency: countryCode, locale })
      .replace(/\s/g, ' ')
      .replace(/\./g, '.')
      .should.equal(expected);

    currencyFormatter
      .format(-1234, { currency: countryCode, locale })
      .replace(/\s/g, ' ')
      .should.equal(expectedNegative ? expectedNegative : `-${expected}`);
  });
};

const checkForThreeDecimals = ([countryCode, locale = undefined]) => {
  it(`should format ${countryCode} with three decimals${locale ? ` with locale ${locale}` : ''}`, () => {
    /.*[.,]000.*/.test(
      currencyFormatter.format(1234, { currency: countryCode, locale })
    ).should.be.true;
  });
};

// sanity check
describe('sanity check', () => {
  it('should format USD correctly', () => {
    currencyFormatter
      .format(1000, { currency: 'USD' })
      .should.equal('$1,000.00');
  });
});

// ignored CVE because its decimal status is confusing (https://en.wikipedia.org/wiki/Cape_Verdean_escudo) ,
// ignored KMF because it uses default arabic locale
// ignored XAF because it uses default french locale
describe('currencies with 0 digits after decimal separator', () => {
  [
    ['BIF', '1.234 FBu'],
    ['CLP', '$1.234', '$-1.234'],
    ['DJF', 'Fdj 1 234', 'Fdj-1 234'],
    ['GNF', 'FG 1 234', 'FG-1 234'],
    ['ISK', '1.234 kr'],
    ['JPY', '¥1,234'],
    ['KRW', '₩1,234'],
    ['PYG', '₲ 1.234', '₲ -1.234'],
    ['RWF', 'RF1.234'],
    ['UGX', 'USh1,234'],
    ['VND', '₫ 1.234'],
    ['VUV', 'VT1,234'],
    ['XPF', '1 234 CFP'],
  ].map(checkCurrency);
});

// string matching with dinars was weird so I am just asserting the number of decimal places
describe('currencies with 3 digits after decimal separator', () => {
  [['BHD'],['IQD'], ['JOD'], ['KWD'], ['LYD'], ['OMR'], ['TND']].map(
    checkForThreeDecimals
  );
});

describe('mantissa should respect currency code, overriding the locale', () => {
  [
    ['USD', '$1,234.00', null, 'ja'],
    ['USD', '$1,234.00', null, 'en_US'],
    ['USD', '$ 1,234.00', null, 'ar_BH'],
    ['USD', '1.234,00 $', null, 'eu_ES'],

    ['JPY', '¥1,234', null, 'ja'],
    ['JPY', '¥1,234', null, 'en_US'],
    ['JPY', '¥ 1,234', null, 'ar_BH'],
    ['JPY', '1.234 ¥', null, 'eu_ES'],
  ].map(checkCurrency);

  [['BHD', 'ja'], ['BHD', 'en_US'], ['BHD', 'ar_BH'], ['BHD', 'eu_ES']].map(
    checkForThreeDecimals
  );
});
