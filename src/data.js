// Initial data for the application
export const INITIAL_LISTINGS = [
  { id: 1, name: "IT Park Lot A", address: "Cebu IT Park, Apas", owner: "Maria Santos", price: 50, slots: 8, available: 5, status: "active" },
  { id: 2, name: "Capitol Site Garage", address: "Capitol Site, Cebu City", owner: "Juan dela Cruz", price: 40, slots: 12, available: 0, status: "inactive" },
  { id: 3, name: "Ayala Overflow", address: "Cebu Business Park", owner: "Ana Reyes", price: 60, slots: 4, available: 2, status: "active" },
  { id: 4, name: "Lahug Driveway", address: "Lahug, Cebu City", owner: "Pedro Bautista", price: 35, slots: 2, available: 2, status: "active" },
  { id: 5, name: "Banilad Compound", address: "Banilad, Cebu City", owner: "Lucia Torres", price: 45, slots: 6, available: 3, status: "pending" },
];

export const INITIAL_BOOKINGS = [
  { id: 1, listing: "IT Park Lot A - Space 12", renter: "John Smith", date: "2026-03-14", time: "8:00 AM - 5:00 PM", duration: "9 hrs", amount: 150, status: "confirmed" },
  { id: 2, listing: "Capitol Site Driveway", renter: "Jane Lee", date: "2026-03-15", time: "8:00 AM - 5:00 PM", duration: "9 hrs", amount: 120, status: "pending" },
  { id: 3, listing: "Lahug Residential Lot", renter: "Carlos Go", date: "2026-03-13", time: "8:00 AM - 5:00 PM", duration: "9 hrs", amount: 100, status: "completed" },
];

export const TEAM_MEMBERS = [
  { name: "Jac Gary F. Canete", title: "Director of Technology", email: "jacgary.canete@cit.edu" },
  { name: "Keith Charven S. Canada", title: "Director of Technology", email: "keithcharven.canada@cit.edu" },
  { name: "Gerad Emeka T. Macopia", title: "Director of Technology", email: "gerademeka.macopia@cit.edu" },
];

export const EMPTY_LISTING = { name: "", address: "", owner: "", price: "", slots: "", available: "", status: "active" };
export const EMPTY_BOOKING = { listing: "", renter: "", date: "", time: "", duration: "", amount: "", status: "pending" };