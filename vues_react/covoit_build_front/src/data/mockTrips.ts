export type Trip = {
  id: string;
  from: string;
  to: string;
  dateTime: string; // ISO
  priceXof: number;
  driverName: string;
  driverRating: number;
  seatsLeft: number;
  meetingPoint: string;
  dropPoint: string;
  car: string;
};

export const MOCK_TRIPS: Trip[] = [
  {
    id: "t1",
    from: "Porto-Novo",
    to: "Cotonou",
    dateTime: "2026-01-23T14:30:00",
    priceXof: 1500,
    driverName: "Kossi",
    driverRating: 4.7,
    seatsLeft: 2,
    meetingPoint: "Gare routière de Porto-Novo",
    dropPoint: "Dantokpa (Cotonou)",
    car: "Toyota Corolla",
  },
  {
    id: "t2",
    from: "Cotonou",
    to: "Ouidah",
    dateTime: "2026-01-24T09:00:00",
    priceXof: 1200,
    driverName: "Awa",
    driverRating: 4.9,
    seatsLeft: 3,
    meetingPoint: "Akpakpa (Cotonou)",
    dropPoint: "Temple des Pythons (Ouidah)",
    car: "Hyundai i10",
  },
  {
    id: "t3",
    from: "Abomey-Calavi",
    to: "Cotonou",
    dateTime: "2026-01-23T07:15:00",
    priceXof: 800,
    driverName: "Franck",
    driverRating: 4.5,
    seatsLeft: 1,
    meetingPoint: "Carrefour IITA",
    dropPoint: "Cadjèhoun",
    car: "Kia Picanto",
  },
  {
    id: "t4",
    from: "Parakou",
    to: "Bohicon",
    dateTime: "2026-01-25T06:00:00",
    priceXof: 6000,
    driverName: "Mariama",
    driverRating: 4.6,
    seatsLeft: 2,
    meetingPoint: "Gare routière de Parakou",
    dropPoint: "Carrefour Bohicon",
    car: "Toyota Avensis",
  },
];
