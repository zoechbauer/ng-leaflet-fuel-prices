export interface IGasStation {
  contact: {
    fax: 'string';
    mail: 'string';
    telephone: 'string';
    website: 'string';
  };
  distance: 'number';
  id: 'number';
  location: {
    address: 'string';
    city: 'string';
    latitude: 'number';
    longitude: 'number';
    postalCode: 'string';
  };
  name: 'string';
  offerInformation: {
    selfService: 'boolean';
    service: 'boolean';
    unattended: 'boolean';
  };
  open: 'boolean';
  openingHours: [
    {
      day: 'string';
      from: 'string';
      to: 'string';
    }
  ];
  otherServiceOffers: 'string';
  paymentArrangements: {
    accessMod: 'string';
    clubCard: 'boolean';
    clubCardText: 'string';
    cooperative: 'boolean';
  };
  paymentMethods: {
    cash: 'boolean';
    creditCard: 'boolean';
    debitCard: 'boolean';
    others: 'string';
  };
  position: 'number';
  prices: [
    {
      amount: 'number';
      fuelType: 'string';
      label: 'string';
    }
  ];
}
