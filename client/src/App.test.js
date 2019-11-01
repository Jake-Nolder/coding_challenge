import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const milliseconds = (new Date).getTime();
const payslip_data = {
  "pay_date": milliseconds,
  "employee": {
      "first_name": `Foo`,
      "last_name": "Bar",
      "pay_frequency": "annual"
  },
  "pay_range": {
      "start_date": 1362056400000,
      "end_date": 1364734799999
  },
  "pay_frequency": "monthly",
  "annual_income": 60050,
  "gross_income": 5004,
  "income_tax": 922,
  "net_income": 4082,
  "super": 450,
  "pay": 3632
};

it('Does the REACT DOM render without crashing?', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('Is server up and running?', () => {
  return sendPayslip();
});

test('Will payslip save?', () => {
  return sendPayslip(payslip_data)
    .then((parsed) => {
      if (parsed.status === "success") {
        return Promise.resolve();
      } else {
        return Promise.reject("The call did not response with the correct infomration. Failed unsuccessfully.");
      }
    });
});

test('Does payslip exist?', () => {
  return sendPayslip(payslip_data)
    .then((parsed) => {
      if(parsed.status === "exists") {
        return Promise.resolve();
      } else {
        return Promise.reject("The call did not response with the correct infomration. Failed unsuccessfully.");
      }
    });
});

test('Can I inject data? (No is good)', () => {
  let inject = Object.assign({}, payslip_data, {
    "pay_date": () => {
      console.log(global);
    }
  });

  return sendPayslip(inject)
    .then((parsed) => {
      if(parsed.status === "failed") {
        return Promise.resolve();
      } else {
        return Promise.reject("The call did not response with the correct infomration. Failed unsuccessfully.");
      }
    });
});

function sendPayslip(data) {
  return fetch("http://localhost:3254/payslip/save", {
      "method": "POST",
      "headers": {
          'Content-Type': 'application/json'
      },
      "body": JSON.stringify(data)
  }).then((response) => {
    return response.json();
  }).catch(() => {
    return Promise.reject('The server is not running or something is wrong. Please try starting the server.');
  });
}