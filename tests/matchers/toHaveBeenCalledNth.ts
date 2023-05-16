import type { MatcherFunction } from 'expect';
import { isMock } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const spyInvocationOrder = (functions: Array<any>) => {
  const cachedInvocationCallOrder: number[] = [];
  functions.forEach((f) => {
    if (!isMock(f)) {
      throw new Error('Functions passed to spyInvocationOrder must be Jest mock functions');
    }
    f.cachedInvocationCallOrder = cachedInvocationCallOrder;
    const originalMockImplementation = f.getMockImplementation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    f.mockImplementation((...args: any) => {
      let safeImplementation = originalMockImplementation;
      if (typeof safeImplementation !== 'function')safeImplementation = () => {};
      const result = safeImplementation(args);
      cachedInvocationCallOrder.push(f.mock.invocationCallOrder[0]);
      return result;
    });
  });
};

// eslint-disable-next-line operator-linebreak
export const toHaveBeenCalledNth: MatcherFunction<[number]> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function customMatcher(received: any, nth) {
    if (!isMock(received)) {
      throw new Error('received must be a mock function');
    }

    if (!received.cachedInvocationCallOrder) {
      throw new Error('spyIncovationOrder must be called with received function as an argument prior to using this matcher');
    }

    if (
      typeof nth !== 'number'
      || Number.isNaN(nth) !== false
      || (Infinity / nth) !== Infinity
      || Number.isInteger(nth) !== true
      || nth < 1
    ) {
      throw new Error('Expected value must be a non-negative integer');
    }

    const calls = received.cachedInvocationCallOrder;
    const { length } = calls;
    const iNth = nth - 1;

    const pass = iNth < length && (calls[iNth] === received.mock.invocationCallOrder[0]);

    if (pass) {
      return {
        message: () => `n: ${nth}\nexpected ${this.utils.printReceived(
          calls.indexOf(received.mock.invocationCallOrder[0]),
        )} not to have been called Nth ${this.utils.printExpected(
          `n: ${nth}`,
        )}`,
        pass: true,
      };
    // eslint-disable-next-line no-else-return
    } else {
      return {
        message: () => `n: ${nth}\nexpected ${this.utils.printReceived(
          calls.indexOf(received.mock.invocationCallOrder[0]),
        )} to have been called Nth ${this.utils.printExpected(
          `n: ${nth}`,
        )}`,
        pass: false,
      };
    }
  };

expect.extend({
  toHaveBeenCalledNth,
});

declare module 'expect' {
  interface AsymmetricMatchers {
    toHaveBeenCalledNth(nth: number): void;
  }
  interface Matchers<R> {
    toHaveBeenCalledNth(nth: number): R;
  }
}
