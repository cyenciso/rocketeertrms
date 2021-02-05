import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/header';
import { useDispatch } from 'react-redux';
import { getEmployee } from './redux/actions';
import employeeService from './services/employee.service';
import { RouterComponent } from './components/router';

function App() {
  // get state
  const dispatch = useDispatch();

  // checks back end if there is a user logged in
  useEffect(() => {
      employeeService.getLogin().then((employeeReturned) => {
          console.log('employee returned', employeeReturned);
          dispatch(getEmployee(employeeReturned));
      }).catch(() => {
        console.log('User not found!');
      });
  }, [dispatch]);

  return (
    <React.Fragment>
      <BrowserRouter>
        <Header />
        <RouterComponent />
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
