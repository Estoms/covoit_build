export type Role = "PASSENGER" | "DRIVER" | "PASSENGER_DRIVER" | "ADMIN" | "SUPPORT";

export type DriverVerification = {
  status: "PENDING" | "APPROVED" | "REJECTED";
  criminalRecordDueAt: string;
  criminalRecordSubmitted: boolean;
};

export type PublicUser = {
  id: string;
  phone: string;
  phoneVerified: boolean;
  email?: string | null;
  fullName: string;
  npi?: string | null;
  idCardDocumentId?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  roles: Role[];
  driverVerification?: DriverVerification;
  createdAt: string;
};

export type Trip = {
  id: string;
  fromCity: string;
  fromPoint: string;
  toCity: string;
  toPoint: string;
  departAt: string;
  pricePerSeatXof: number;
  seatsAvailable: number;
  seatsTotal?: number;
  vehicleLabel?: string | null;
  status?: string;
  driver: { id: string; fullName: string; avgRating?: number };
  priorityScore?: number;
};

export type BookingStatus = "PENDING_PAYMENT" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type Booking = {
  id: string;
  tripId: string;
  seats: number;
  pricePerSeatXof: number;
  tripAmountXof: number;
  cashoutFeeEstimateXof: number;
  passengerFeeShareXof: number;
  totalChargedXof: number;
  status: BookingStatus;
  createdAt: string;
  trip?: Trip & { driver?: { id: string; fullName: string } };
  review?: { rating: number; comment?: string } | null;
};

export type WalletTransaction = {
  id: string;
  type: string;
  amountXof: number;
  status: string;
  createdAt: string;
  bookingId?: string | null;
};

export type Notification = {
  id: string;
  kind: string;
  title: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
};

export type Conversation = {
  id: string;
  passengerId: string;
  driverId: string;
  passenger: { id: string; fullName: string };
  driver: { id: string; fullName: string };
  trip?: Trip | null;
  messages: { body: string; createdAt: string }[];
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type Review = {
  id: string;
  bookingId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
};

export type TicketMessage = {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdByUserId: string;
  createdBy?: { id: string; fullName: string };
  assignedTo?: { id: string; fullName: string } | null;
  messages: TicketMessage[];
  createdAt: string;
};

export type DriverProfileDTO = {
  id: string;
  userId: string;
  vehicleType?: string | null;
  vehiclePlate?: string | null;
  licenseDocumentId?: string | null;
  nip?: string | null;
  criminalRecordDocumentId?: string | null;
  criminalRecordDueAt: string;
  criminalRecordSubmittedAt?: string | null;
  payoutModePreference: "ADVANCE_THEN_FINAL" | "FULL_AT_END";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  user?: { id: string; fullName: string; phone: string };
};

export type AdminTrip = Omit<Trip, "status" | "seatsTotal"> & { status: string; seatsTotal: number; bookings: Booking[] };
