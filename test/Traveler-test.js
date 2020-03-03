import { expect } from 'chai';

import Traveler from '../src/Traveler.js';
import Trip from '../src/Trip.js';
import Destination from '../src/Destination.js';

describe('Traveler', function() {
  let userData = {
    id: 49,
    name: 'Guthry Tute',
    travelerType: 'thrill-seeker'
  }
  let tripData = [
    {
      id: 666,
      userID: 49,
      destinationID: 1,
      travelers: 2,
      date: '2020-03-01',
      duration: 7
    },
    {
      id: 777,
      userID: 49,
      destinationID: 1,
      travelers: 2,
      date: '2019-03-07',
      duration: 7
    }
  ];
  let destinationData = {
    id: 1,
    destination: 'Denver, Colorado',
    estimatedLodgingCostPerDay: 50,
    estimatedFlightCostPerPerson: 100,
    image: 'website.com/image',
    alt: 'a good picture'
  };
  let destination;
  let trips;
  let user;

  before(function() {
    destination = new Destination(destinationData);
    trips = tripData.map(trip => new Trip(trip, destination))
    user = new Traveler(userData, trips)
  });

  it('should be a function', function() {
    expect(Traveler).to.be.a('function');
  });

  it('should be an instance of Traveler', function() {
    expect(user).to.be.an.instanceof(Traveler);
  });

  describe('Instantiation', function() {
    it('should inherit an id from a passed object', function() {
      expect(user.id).to.equal(49);
    });

    it('should inherit a name from a passed object', function() {
      expect(user.name).to.equal('Guthry Tute');
    });

    it('should inherit a traveler type from a passed object', function() {
      expect(user.type).to.equal('thrill-seeker');
    });

    it('should have trips be sorted chronologically', function() {
      expect(user.trips[0].id).to.equal(666);
      expect(user.trips[1].id).to.equal(777);
    });
  });

  it('should be able to calculate cost of this year\'s trips', function() {
    expect(user.calculateYearlyCost()).to.equal('990.00');
  });
});
