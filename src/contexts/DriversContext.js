import React, { createContext, useState } from 'react';
import { useToasts } from 'react-toast-notifications';

export const DriversContext = createContext({
   fetchDrivers: () => [],
   addDriver: () => { },
   updateDriver: () => { },
   deleteDriver: () => { },
   loaded: false,
   loading: false,
   error: null,
   drivers: [],
});

// const DRIVERS_ENDPOINT = 'http://localhost:3000/staff';

export const DriversProvider = (props) => {
   const [drivers, setDrivers] = useState(() => {
      return JSON.parse(localStorage.getItem('drivers')) || [];
   });
   const [loading, setLoading] = useState(false);
   const [loaded, setLoaded] = useState(false);
   const [error, setError] = useState(null);

   const { addToast } = useToasts();

   const DRIVERS_ENDPOINT = 'http://localhost:3000/staff/';

   const fetchDrivers = async () => {
      if (loading || loaded || error) {
         return;
      } else {
         setLoading(true);
      }

      try {
         const response = await fetch(DRIVERS_ENDPOINT);
         if (response.status !== 200) {
            throw response;
         }
         const data = await response.json();
         localStorage.setItem('drivers', JSON.stringify(data));
         setDrivers(data);
      } catch (err) {
         setError(err.message || err.statusText);
      } finally {
         setLoading(false);
         setLoaded(false);
      }

   } //endofFetchDrivers

   const addDriver = async (formData) => {
      try {
         const response = await fetch(DRIVERS_ENDPOINT, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
         });
         if (response.status !== 201) {
            throw response;
         }
         const savedDriver = await response.json();
         console.log('got data', savedDriver);
         //todo
      } catch (err) {
         console.log('add driver', err);
      }
   };//endofAddDriver

   const updateDriver = async (id, formData) => {
      console.log('updating', id, formData);
      let updatedDriver = null;
      //get index
      const index = drivers.findIndex((driver) => driver.id === id);
      if (index === -1) throw new Error(`Driver with index ${id} not found`);
      //get actual driver
      const oldDriver = drivers[index];
      // send the differences not the whole object
      const updates = {};

      for (const key of Object.keys(oldDriver)) {
         if (key === 'id') continue;
         if (oldDriver[key] !== formData[key]) {
            updates[key] = formData[key];
         }
      }

      try {
         const response = await fetch(`${DRIVERS_ENDPOINT}${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
         });

         if (response.status !== 200) {
            throw response;
         }

         //merge with formData
         updatedDriver = {
            ...oldDriver,
            ...formData,
         };
         console.log("updatedDriver", updatedDriver);
         const updatedDrivers = [
            ...drivers.slice(0, index),
            updatedDriver,
            ...drivers.slice(index + 1),
         ];
         localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
         setDrivers(updatedDrivers);

      } catch (err) {
         console.log(err);
         addToast(`Error: Failed to update ${oldDriver ? oldDriver?.name : id}`, {
            appearance: "error",
         });
      }
   };//endofUpdateDriver

   const deleteDriver = async (id) => {
      let deletedDriver = null;
      try {
         const response = await fetch(`${DRIVERS_ENDPOINT}${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
         });
         if (response.status !== 204) {
            throw response;
         }
         //get index
         const index = drivers.findIndex((driver) => driver.id === id);
         deletedDriver = drivers[index];
         //recreate the drivers array without the deletedDriver
         const updatedDrivers = [...drivers.slice(0, index), ...drivers.slice(index + 1)];
         localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
         setDrivers(updatedDrivers);
         console.log(`Deleted ${deletedDriver}`);
      } catch (err) {
         console.log(err);
         addToast(`Error: Failed to delete ${deletedDriver}`, {
            appearance: "error",
         });
      }
   }

   return (
      <DriversContext.Provider
         value={{
            drivers,
            loading,
            error,
            fetchDrivers,
            addDriver,
            updateDriver,
            deleteDriver,
         }}
      >
         {props.children}
      </DriversContext.Provider>
   );
}