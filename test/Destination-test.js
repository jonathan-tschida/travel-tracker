import { expect } from 'chai';

import Destination from '../src/Destination.js';

describe('Destination', function() {
  let destinationData = {
    id: 1,
    destination: 'Denver, Colorado',
    estimatedLodgingCostPerDay: 50,
    estimatedFlightCostPerPerson: 100,
    image: 'website.com/image',
    alt: 'a good picture'
  };
  let destination;

  before(function() {
    destination = new Destination(destinationData);
  });

  it('should be a function', function() {
    expect(Destination).to.be.a('function');
  });

  it('should be an instance of Destination', function() {
    expect(destination).to.be.an.instanceof(Destination);
  });

  describe('Instantiation', function() {
    it('should inherit an id from a passed object', function() {
      expect(destination.id).to.equal(1);
    });

    it('should inherit a destination from a passed object', function() {
      expect(destination.destination).to.equal('Denver, Colorado');
    });

    it('should have a city property based on the destination', function() {
      expect(destination.city).to.equal('Denver');
    });

    it('should have a country property based on the destination', function() {
      expect(destination.country).to.equal('Colorado');
    });

    it('should inherit an estimated lodging cost from a passed object', function() {
      expect(destination.estimatedLodgingCostPerDay).to.equal(50);
    });

    it('should inherit an estimated flight cost from a passed object', function() {
      expect(destination.estimatedFlightCostPerPerson).to.equal(100);
    });

    it('should inherit an image url from a passed object', function() {
      expect(destination.image).to.equal('website.com/image');
    });

    it('should inherit alt text from a passed object', function() {
      expect(destination.alt).to.equal('a good picture');
    });
  });
});
