import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CarsList/CarsList.css';
//css
import { DriversContext } from '../../contexts/DriversContext';

function DriverList() {
   const {
      fetchDrivers,
      deleteDriver,
      loading,
      error,
      drivers
   } = useContext(DriversContext);

   useEffect(() => {
      fetchDrivers();
   }, []);

   return (
      <section className='drivers-list-section'>
         <div className="container">
            <h1 className="section-heading">
               Drivers List
            </h1>
            {loading && <p>Loading ...</p>}
            {error && <p>{error}</p>}
            {drivers?.length ? (
               <ul className="cars-list">
                  {drivers.map(({ id, firstName, lastName, email }) => (
                     <li key={id} className="drivers-list-item">
                        
                        <p>
                           {firstName} - {lastName}
                        </p>
                        <Link
                           to={`/drivers/update/${id}`}
                           className="update-link">
                           Update
                        </Link>
                        <button
                           onClick={() => deleteDriver(id)}
                           className="delete-btn"
                        >
                           Delete
                        </button>
                     </li>
                  ))}
               </ul>
            ) : <p>No drivers to display</p>}
         </div>
      </section>
   )
}

export default DriverList;