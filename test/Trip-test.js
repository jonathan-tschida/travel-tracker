import { expect } from 'chai';

import Trip from '../src/Trip.js';
import Destination from '../src/Destination.js';

describe('Trip', function() {
  let tripData = {
    id: 666,
    userID: 49,
    destinationID: 1,
    travelers: 2,
    date: '2020-03-01',
    duration: 7,
    status: 'approved'
  };
  let destinationData = {
    id: 1,
    destination: 'Denver, Colorado',
    estimatedLodgingCostPerDay: 50,
    estimatedFlightCostPerPerson: 100,
    image: 'website.com/image',
    alt: 'a good picture'
  };
  let emptyTrip = {
    userID: 1,
    date: '2020-03-01',
  };
  let destination;
  let tripA;
  let tripB;

  before(function() {
    destination = new Destination(destinationData);
    tripA = new Trip(tripData, destination);
    tripB = new Trip(emptyTrip, destination);
  });

  it('should be a function', function() {
    expect(Trip).to.be.a('function');
  });

  it('should be an instance of Trip', function() {
    expect(tripA).to.be.an.instanceof(Trip);
    expect(tripB).to.be.an.instanceof(Trip);
  });

  describe('Instantiation', function() {
    it('should have a default id', function() {
      expect(tripB.id).to.be.a('number');
    });

    it('should inherit an id from a passed object', function() {
      expect(tripA.id).to.equal(666);
    });

    it('should inherit a user id from a passed object', function() {
      expect(tripA.userID).to.equal(49);
    });

    it('should instantiate with a Destination', function() {
      expect(tripB.destination).to.be.an.instanceof(Destination);
    });

    it('should have a default destinationID based on the destination', function() {
      expect(tripB.destinationID).to.equal(destination.id);
    });

    it('can inherit a destinationID from a passed object', function() {
      expect(tripA.destinationID).to.equal(1);
    });

    it('should have a default number of travelers', function() {
      expect(tripB.travelers).to.equal(1);
    });

    it('can inherit a number of travelers from a passed object', function() {
      expect(tripA.travelers).to.equal(2);
    });

    it('should have a correctly formatted date', function() {
      expect(tripB.date).to.equal('2020/03/01');
    });

    it('should have a default duration', function() {
      expect(tripB.duration).to.equal(1);
    });

    it('can inherit a trip duration from a passed object', function() {
      expect(tripA.duration).to.equal(7);
    });

    it('should have a default status of pending', function() {
      expect(tripB.status).to.equal('pending');
    });

    it('can be passed a different status', function() {
      expect(tripA.status).to.equal('approved');
    });

    it('should start with no suggested activities', function() {
      expect(tripB.suggestedActivities).to.deep.equal([]);
    });
  });

  it('should be able to make a human readable version of the date', function() {
    expect(tripA.printDate()).to.equal('Sun Mar 01 2020');
  });

  it('should be able to give a cost estimate', function() {
    expect(tripA.estimateCost()).to.equal('990.00');
  });
});
