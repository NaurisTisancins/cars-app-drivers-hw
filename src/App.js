// import logo from "./logo.svg";
import "./App.css";

import {
   BrowserRouter as Router,
   Route,
   // Redirect,
   Switch,
} from "react-router-dom";

import { ToastProvider } from "react-toast-notifications";
import { CarsProvider } from "./contexts/CarsContext";
import { DriversProvider } from './contexts/DriversContext';

import Home from "./pages/Home/Home";
import Spectators from "./pages/Spectators/Spectators";
import AddCar from "./pages/AddCar/AddCar";
import UpdateCar from "./pages/UpdateCar/UpdateCar";
import NotFound from "./pages/NotFound/NotFound";
import DriverList from "./components/DriverList/DriverList";
import AddDriver from './pages/AddDriver/AddDriver';
import UpdateDriver from './pages/UpdateDriver/UpdateDriver';

function App() {
   return (
      <Router>
         <ToastProvider autoDismiss={true}>
            <CarsProvider>
               <DriversProvider>
                  <Switch>
                     <Route exact path="/" component={Home} />
                     <Route path={`/cars/add`} component={AddCar} />
                     <Route path={`/cars/update/:id`} component={UpdateCar} />
                     <Route path="/spectators" component={Spectators} />
                     <Route exact path="/drivers" component={DriverList} />
                     <Route exact path="/drivers/add" component={AddDriver} />
                     <Route exact path={`/drivers/update/:id`} component={UpdateDriver} />
                     <Route path="*" component={NotFound} />
                  </Switch>
               </DriversProvider>
            </CarsProvider>
         </ToastProvider>
      </Router >
   );
}

export default App;
