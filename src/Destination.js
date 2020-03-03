class Destination {
  constructor({id, destination, estimatedLodgingCostPerDay, estimatedFlightCostPerPerson, image, alt}) {
    this.id = id || 0;
    this.destination = destination || 'Nowhere, Nowhere';
    this.city = this.destination.split(', ')[0];
    this.country = this.destination.split(', ')[1];
    this.estimatedLodgingCostPerDay = estimatedLodgingCostPerDay || 0;
    this.estimatedFlightCostPerPerson = estimatedFlightCostPerPerson || 0;
    this.image = image;
    this.alt = alt;
  }
}

export default Destination;
