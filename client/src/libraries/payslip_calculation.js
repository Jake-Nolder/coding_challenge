// Import custom libraries
import dataType from './check_data_types.js';

// Set libraries from CDN added to index.html
let moment = window.moment;

function calcPayslip(form_data) {
  if (!(dataType.isObject(form_data))) {
    output_error({
      "error": "data_type_mismatch",
      "details": "The 'form_data' that was passed to calcPayslip was not the correct data type.",
      "expected": "object",
      "received": dataType.getType(form_data)
    });
    return Promise.reject();
  }

  let expected_structure = {
    "first_name": "isString",
    "last_name": "isString",
    "salary_amount": "isNumber",
    "salary_frequency": "isString",
    "superannuation_rate": "isNumber",
    "current_year": "isNumber",
    "payroll_month": "isNumber",
    "pay_frequency": "isString"
  };

  let check = verifyData(expected_structure, form_data);
  if (check === false) {
    output_error(check);
    return Promise.reject();
  } else {
    // Set variables for next calculations
    let start_date, end_date;
    let current_year = form_data.current_year;

    if (form_data.pay_frequency === "monthly") {
      if (form_data.payroll_month >= 6 && form_data.payroll_month <= 11) {
        // Update current year to current_year -1 year if month is July (inc) to Dec (inc)
        current_year = current_year + 1;
      }

      start_date = moment().month(form_data.payroll_month).year(form_data.current_year).startOf('month').valueOf();
      end_date = moment().month(form_data.payroll_month).year(form_data.current_year).endOf('month').valueOf();
    }

    return calcTax(form_data.salary_amount, current_year) // Calc tax on gross pay
      .then((tax) => {
        let payslip_obj = () => {
          let self = {};

          self.pay_date = end_date;
          self.employee = {
            "first_name": form_data.first_name,
            "last_name": form_data.last_name,
            "pay_frequency": form_data.salary_frequency
          };
          self.pay_range = { // Output in milliseconds since epoch since calcuations are easier to do in that format.
            "start_date": start_date,
            "end_date": end_date
          };
          self.pay_frequency = form_data.pay_frequency;
          self.annual_income = form_data.salary_amount;
          self.gross_income = Math.round(form_data.salary_amount / 12);
          self.income_tax = Math.round(tax / 12);
          self.net_income = self.gross_income - self.income_tax;
          self.super = Math.round((self.gross_income / 100) * form_data.superannuation_rate);
          self.pay = self.net_income - self.super;

          return self;
        };

        return Promise.resolve(payslip_obj());
      });
  }
}

function calcTax(amount, year) {
  return getTaxTables(year)
    .then((response) => {
      // Verify the response array structure

      //["Nil", "plus", "for each", "over", "\n"] for rules array
      let tax = 0.00;
      response.forEach(threshold_rule => {
        if (threshold_rule.threshold === undefined) {
          return false;
        }

        let min = threshold_rule.threshold[0];
        let max = threshold_rule.threshold[1];
        if (max === undefined) {
          max = Infinity;
        }

        if (amount < min || amount > max) {
          return false;
        }

        if (amount >= min) {
          if (threshold_rule.rules[1] !== 0) { // plus
            tax = tax + threshold_rule.rules[1];
          }

          if (threshold_rule.rules[2] !== 0 && threshold_rule.rules[3] !== 0 && threshold_rule.rules[4] !== 0) {
            let rule_start = threshold_rule.rules[4];
            let salary_component = amount - rule_start;
            let amount_to_tax = salary_component / threshold_rule.rules[3];
            tax = tax + (amount_to_tax * threshold_rule.rules[2]);
          }
        }
      });

      return tax;
    });
}

function getTaxTables(year) {
  let filename = ['' + (year - 1), ('' + (year)).substring(2)];
  filename = filename.join('-');

  return fetch('/tax_tables/' + filename + '.json')
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return Promise.reject({
        "error": "fetch_response_error",
        "details": 'There was an error while trying to fetch the requested tax table. Please download the tables again or make sure they exist. Then refresh the page.',
        "response": err
      });
    });
}

function verifyData(verify_obj, data_obj) {
  if (Object.keys(verify_obj).length !== Object.keys(data_obj).length) {
    output_error({
      error: 'data_length_mismatch',
      details: 'The "data_obj" provided does not match the expected input.',
    });
    return false;
  }

  let isSame = true;

  Object.keys(verify_obj).forEach((key) => {
    // (Above) Make sure both exist and are the same data type.

    if (dataType.getType(verify_obj[key]) === 'isObject') {
      const check = verifyData(verify_obj[key], data_obj[key]);
      if (check === false) {
        isSame = false;
      }
    } else if (!(dataType[verify_obj[key]](data_obj[key]))) {
      output_error({
        error: 'data_type_mismatch',
        details: `The 'data_obj' key '${key}' and the 'verify_obj' key '${key}' exist but do not match.`,
        expected: verify_obj[key],
        received: dataType.getType(data_obj[key]),
      });
      isSame = false;
    }

    return isSame;
  });

  return isSame;
}

function output_error(err) {
  console.error(JSON.stringify(err, null, 4));
  return false;
}

export default calcPayslip;