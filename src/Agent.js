class Agent {
  constructor(trips) {
    this.name = 'Agent';
    this.trips = trips;
  }

  filterTrips(tripStatus) {
    return this.trips.filter(trip => trip.status === tripStatus);
  }

  calculateYearlyIncome() {
    let paidTripsThisYear = this.filterTrips('approved').filter(trip => {
      let thisYear = new Date().getFullYear();
      let tripYear = Number(trip.date.slice(0, 4));
      return thisYear === tripYear;
    });
    let yearlyIncome =  paidTripsThisYear.reduce((income, trip) => {
      let tripCost = trip.estimateCost();
      let parsedCost = Number(tripCost.replace(/,/g, ''));
      let fee = parsedCost * (1 / 11);
      return income + fee;
    }, 0);
    return yearlyIncome.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  getTodaysTravelers() {
    return this.trips.reduce((todaysTravelers, trip) => {
      let isOnTrip = trip.travelerOnTrip();
      return isOnTrip ?
        todaysTravelers + trip.travelers :
        todaysTravelers;
    }, 0);
  }

  approveTrip(id) {
    let tripIndex = this.trips.findIndex(trip => trip.id === id);
    this.trips[tripIndex].status = 'approved';
  }

  removeTrip(id) {
    let tripIndex = this.trips.findIndex(trip => trip.id === id);
    this.trips.splice(tripIndex, 1);
  }
}

export default Agent;
