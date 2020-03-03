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
}

export default Trip;
