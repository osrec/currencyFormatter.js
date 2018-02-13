const chai = require('chai');
const currencyFormatter = require('./currencyFormatter');

chai.should();

const checkCurrency = ([countryCode, expected, expectedNegative = null]) => {
  it(`should format ${countryCode} correctly`, () => {
    currencyFormatter
      .format(1234, { currency: countryCode })
      .replace(/\s/g, ' ')
      .replace(/\./g, '.')
      .should.equal(expected);
    currencyFormatter
      .format(-1234, { currency: countryCode })
      .replace(/\s/g, ' ')
      .should.equal(expectedNegative ? expectedNegative : `-${expected}`);
  });
};

const checkForThreeDecimals = countryCode => {
  it(`should format ${countryCode} with three decimals`, () => {
    /.*[.,]000.*/.test(
      currencyFormatter.format(1234, { currency: countryCode })
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
  ['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND'].map(checkForThreeDecimals);
});
