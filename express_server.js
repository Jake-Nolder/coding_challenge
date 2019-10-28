// Import custom libraries
let dataType = require('./libraries/check_data_types.js');

// Require node packages
const express = require('express');
const app = express();
const port = 3254;

const fs = require('fs');
const fse = require('fs-extra');

// Setup JSON body parsing
app.use(express.json());

// Setup CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/payslip/save', (req, res) => {
    let payslip = req.body;
    let expected_structure = {
        pay_date: "isNumber",
        employee: {
            "first_name": "isString",
            "last_name": "isString",
            "pay_frequency": "isString"
        },
        pay_range: {
            "start_date": "isNumber",
            "end_date": "isNumber"
        },
        pay_frequency: "isString",
        annual_income: "isNumber",
        gross_income: "isNumber",
        income_tax: "isNumber",
        net_income: "isNumber",
        super: "isNumber",
        pay: "isNumber"
    }

    let check = verifyData(expected_structure, payslip);
    if( check === true ) {
        let file = 'payslips/' + payslip.employee.first_name + "_" + payslip.employee.last_name + "/" + payslip.pay_date + '.json';
        writePayslip(file, payslip)
            .then((response) => {
                res.json(response);
            });
    } else {
        console.log(check); // Leave for errors
        res.json({
            "status": "failed",
            "details": "The payslip information did not match the expected data structure. Please check with site administrator."
        })
    }
});

app.listen(port, () => {
    console.log(`Backend service running at http://localhost:${port}/`);
});

async function writePayslip(file, data) {
    return fse.outputFile(file, JSON.stringify(data, null, 4), {"flag": 'wx'})
        .then(() => {
            return {
                "status": "success",
                "details": "Payslip was saved successfully"
            };
        })
        .catch((err) => {
            if(err.code === "EEXIST") {
                return {
                    "status": "exists",
                    "details": "Payslip was not saved. The payslip already exists.",
                };
            } else {
                console.log(err); // Leave for errors
                return {
                    "status": "failed",
                    "details": "Payslip was not saved. Please check with site administrator.",
                };
            }
        });
}


/* 
    Short cutting and copying over the verifyData functions 
    from payslips_calculation to save time on this challenge
    I typically wouldn't do this. I would rather create a module and import it.
*/
function verifyData(verify_obj, data_obj) {
    if(Object.keys(verify_obj).length !== Object.keys(data_obj).length) {
        return {
            "error": "data_length_mismatch",
            "details": "The 'data_obj' provided does not match the expected input."
        };
    }

    Object.keys(verify_obj).forEach((key) => {
        if(dataType.getType(verify_obj[key]) === dataType.getType(data_obj[key])) { // Make sure both exist and are the same data type.
            if(dataType.getType(verify_obj[key]) === "object") {
                let check = verifyData(verify_obj[key], data_obj[key]);
                if( check === false ) {
                    return check;
                }
            } else {
                if(!( dataType[ verify_obj[key] ](data_obj[key]) )) {
                    return {
                        "error": "data_type_mismatch",
                        "details": `The 'data_obj' key '${key}' and the 'verify_obj' key '${key}' exist but do not match.`,
                        "expected": verify_obj[key],
                        "received": dataType.getType(data_obj[key])
                    };
                }
            }
        } else {
            return {
                "error": "data_type_mismatch",
                "details": `The 'data_obj' key '${key}' data type and the 'verify_obj' key '${key}' datatype do not match or may not exist.`,
                "expected": verify_obj[key],
                "received": dataType.getType(data_obj[key])
            };
        }
    });

    return true;
}