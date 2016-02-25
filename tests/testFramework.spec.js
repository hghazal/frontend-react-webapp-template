/* eslint no-unused-vars:0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { renderIntoDocument } from 'react-addons-test-utils';
import { expect, assert } from 'chai';
import sinon from 'sinon';

import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';

import Root from 'src/containers/root.jsx';

function once(fn) {
  let returnValue, called = false;
  return () => {
    if (!called) {
      called = true;
      returnValue = fn.apply(this, arguments);
    }
    return returnValue;
  };
}

describe('Check testing framework', () => {
  it('should correctly import Chai', () =>   {
    return expect(1).to.equal(1);
  });
  
  it('should correctly import Sinon', () =>   {
    const spy = sinon.spy();
    const proxy = once(spy);
    proxy();
    assert(spy.called);
  });
});
