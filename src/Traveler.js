class Traveler {
  constructor({id, name, travelerType}, trips) {
    this.id = id;
    this.name = name;
    this.type = travelerType;
    this.trips = this.sortTrips(trips);
  }

  sortTrips(trips) {
    return trips.sort((tripA, tripB) => {
      let dateA = new Date(tripA.date);
      let dateB = new Date(tripB.date);
      return dateB - dateA;
    });
  }

  calculateYearlyCost() {
    let thisYearsTrips = this.trips.filter(trip => {
      let thisYear = new Date(Date.now()).getFullYear();
      let tripYear = Number(trip.date.slice(0, 4));
      return thisYear === tripYear;
    })
    let yearlyCost = thisYearsTrips.reduce((totalCost, trip) => {
      let cost = trip.estimateCost();
      let parsedCost = Number(cost.replace(/,/g, ''));
      return totalCost + parsedCost;
    }, 0);
    return (yearlyCost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  addTrip(trip) {
    this.trips = this.sortTrips(this.trips.concat(trip));
  }
}

export default Traveler;
