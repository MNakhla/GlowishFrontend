export default class FreelancerDate {
  constructor() {
    this.freelancerId = null; //_id= string
    this.date = null; //Date
    this.bHasPassed = null; //Boolean
    this.bIsToday = null; //Boolean
    this.bDefault = null; //Boolean
    this.specificDateAvailabilityId = null; //string
    this.bOffDay = null; //Boolean
    this.locationStatus = null; // "OnTheMove"/"AtSalon"
    this.centerLocation = {
      address: null,
      longitude: null,
      latitude: null,
    };
    this.areaRadius = null; //Number
    this.bHasAppointments = null; //Boolean
    this.bFullyBooked = null; //Boolean
    this.defaultWorkingHours = { startTime: null, endTime: null };
    this.defaultLunchBreak = { startTime: null, endTime: null };
    this.activeAppointments = null; //[{_id=null; startTime=null; endTime}]
    this.schedule = null; //[["disabled"/"available"/"booked"]]
  }
}
