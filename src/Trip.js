class Trip {
  constructor({id, userID, destinationID, travelers, date, duration, status}, destination) {
    this.id = Number(id) || Number(new Date());
    this.userID = Number(userID) || user.id;
    this.destination = destination;
    this.destinationID = destinationID || this.destination.id;
    this.travelers = Number(travelers) || 1;
    this.date = this.formatDate(date);
    this.duration = Number(duration) || 1;
    this.status = status || 'pending';
    this.suggestedActivities = [];
  }

  formatDate(date) {
    return date.replace(/-/g, '/');
  }

  printDate() {
    return new Date(this.date).toDateString();
  }

  estimateCost() {
    let airfareCost = this.travelers * this.destination.estimatedFlightCostPerPerson;
    let lodgingCost = this.travelers * this.duration * this.destination.estimatedLodgingCostPerDay;
    let costWithFee = 1.1 * (airfareCost + lodgingCost);
    return (costWithFee).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  travelerOnTrip() {
    let startDate = new Date(this.date);
    let tripLength = this.duration * 24 * 60 * 60 * 1000;
    let endDate = new Date(startDate.getTime() + tripLength);
    let afterStart = new Date() >= startDate;
    let beforeEnd = new Date() <= endDate;
    return afterStart && beforeEnd;
  }
}

export default Trip;
