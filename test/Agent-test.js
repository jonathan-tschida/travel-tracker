import { expect } from 'chai';

import Agent from '../src/Agent.js';

describe('Agent', function() {
  let user;

  before(function() {
    user = new Agent();
  });

  it('should be a function', function() {
    expect(Agent).to.be.a('function');
  });

  it('should be an instance of Destination', function() {
    expect(user).to.be.an.instanceof(Agent);
  });

  describe('Instantiation', function() {
    it('should be named agent', function() {
      expect(user.name).to.equal('agent');
    });
  });
});
