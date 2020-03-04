import { expect } from 'chai';

import Agent from '../src/Agent.js';
import Traveler from '../src/Traveler.js';
import Trip from '../src/Trip.js';
import Destination from '../src/Destination.js';

describe('Agent', function() {
  let today = new Date();
  let yesterday = new Date(today - 86400000);
  let tripData = [
    {
      id: 666,
      userID: 49,
      destinationID: 1,
      travelers: 2,
      date: yesterday.toISOString().slice(0, 10),
      duration: 7,
      status: 'approved'
    },
    {
      id: 777,
      userID: 49,
      destinationID: 1,
      travelers: 1,
      date: '2019-03-07',
      duration: 6
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

  beforeEach(function() {
    destination = new Destination(destinationData);
    trips = tripData.map(trip => new Trip(trip, destination))
    user = new Agent(trips);
  });

  it('should be a function', function() {
    expect(Agent).to.be.a('function');
  });

  it('should be an instance of Destination', function() {
    expect(user).to.be.an.instanceof(Agent);
  });

  describe('Instantiation', function() {
    it('should be named agent', function() {
      expect(user.name).to.equal('Agent');
    });

    it('should have an array of trips passed in', function() {
      expect(user.trips[1]).to.be.an.instanceof(Trip);
    });
  });

  it('should be able to filter trips by their status', function() {
    expect(user.filterTrips('pending')).to.deep.equal([user.trips[1]]);
  });

  it('should be able to calculate income from approved trips for a year', function() {
    expect(user.calculateYearlyIncome()).to.equal('90.00');
  });

  it('should be able to tell how many travelers are on a trip today', function() {
    expect(user.getTodaysTravelers()).to.equal(2);
  });

  it('should be able to approve a trip', function() {
    user.approveTrip(777)
    expect(user.trips[1].status).to.equal('approved');
  });

  it('should be able to approve a trip', function() {
    user.removeTrip(777);
    expect(user.trips.length).to.equal(1);
    expect(user.trips[0].id).to.equal(666);
  });
});
