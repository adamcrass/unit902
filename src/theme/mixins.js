// src/theme/mixins.js

import fonts from './fonts';

const mixins = {
  flexColCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textH1: {
    fontFamily: fonts.primary,
    fontSize: 'clamp(4.2rem, 4vw, 6rem)',
    fontWeight: '400',
    lineHeight: '1.2em',
    letterSpacing: '-0.02em',
  },
  textH2: {
    fontFamily: fonts.primary,
    fontSize: 'clamp(3.2rem, 3vw, 4.5rem)',
    fontWeight: '400',
    lineHeight: '1.2em',
    letterSpacing: '-0.01em',
  },
  textH3: {
    fontFamily: fonts.primary,
    fontSize: 'clamp(2.4rem, 2.5vw, 3.6rem)',
    fontWeight: '400',
    lineHeight: '1.3em',
    letterSpacing: '0em',
  },
  textH4: {
    fontFamily: fonts.primary,
    fontSize: 'clamp(2rem, 1.5vw, 2.8rem)',
    fontWeight: '400',
    lineHeight: '1.3em',
    letterSpacing: '0em',
  },
  textH5: {
    fontFamily: fonts.primary,
    fontSize: 'clamp(1.8rem, 1.5vw, 2rem)',
    fontWeight: '400',
    lineHeight: '1.3em',
    letterSpacing: '0em',
  },
  textP0: {
    fontFamily: fonts.secondary,
    fontSize: 'clamp(1.8rem, 1.2vw, 2rem)',
    fontWeight: '400',
    lineHeight: '1.6em',
    letterSpacing: '0em',
  },
  textP1: {
    fontFamily: fonts.secondary,
    fontSize: 'clamp(1.6rem, 1.1vw, 1.8rem)',
    fontWeight: '400',
    lineHeight: '1.3em',
    letterSpacing: '0em',
  },
  textP2: {
    fontFamily: fonts.secondary,
    fontSize: 'clamp(1.4rem, 1vw, 1.6rem)',
    fontWeight: '400',
    lineHeight: '1.3em',
    letterSpacing: '0em',
  },
  textP3: {
    fontFamily: fonts.secondary,
    fontSize: 'clamp(1.3rem, 0.9vw, 1.4rem)',
    fontWeight: '400',
    lineHeight: '1.3em',
    letterSpacing: '0em',
  },
  textP4: {
    fontFamily: fonts.secondary,
    fontSize: 'clamp(1.2rem, 0.8vw, 1.3rem)',
    fontWeight: '400',
    lineHeight: '1.3em',
    letterSpacing: '0em',
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
};

export default mixins;
