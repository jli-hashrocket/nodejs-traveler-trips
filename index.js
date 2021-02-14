'use strict';


var profile_service = require('./api/profiles.service.js');
var airline_service = require('./api/airlines.service.js');
var trip_service = require('./api/trip.service.js');

// TODO Import what you need

function getTravelersFlightInfo() {

  profile_service.get().then(function(profiles) {
    airline_service.get().then(function(airlines) {
      trip_service.get().then(function(trips) {
        var travelerObj = {}
        var reformatted_profile = profiles.profiles.map(function(profile){
            var obj = {}
            obj.id = profile.personId
            obj.name = profile.name
            obj.rewardPrograms = profile.rewardPrograms
            return obj;
        });

        travelerObj.travelers = reformatted_profile;

        travelerObj.travelers.forEach(function(traveler){
          traveler.flights = [];

          trips.trip.flights.forEach(function(flight){
            if(flight.travelerIds.includes(traveler.id)){
              traveler.flights.push( {legs: flight.legs} );
            }
          });

          traveler.flights = traveler.flights.map(function(flight){
            var reFlight = {}
            reFlight.legs = flight.legs
            reFlight.legs = reFlight.legs.map(function(leg){
              var reLeg = {}
              reLeg.airlineCode = leg.airlineCode
              reLeg.flightNumber = leg.flightNumber
            

              airlines.airlines.forEach(function(airline){
                if(airline.code == leg.airlineCode){
                  reLeg.airlineName = airline.name
                }
              });

              if(Object.keys(traveler.rewardPrograms.air).includes(reLeg.airlineCode)){
                reLeg.frequencyFlyer = traveler.rewardPrograms.air[reLeg.airlineCode]
              }
              return reLeg
            })
            return reFlight
          })
          
          delete(traveler.rewardPrograms)
          
        });

        console.log(travelerObj);
        return travelerObj
      });
    });
  });

}
module.exports = getTravelersFlightInfo;

getTravelersFlightInfo();
