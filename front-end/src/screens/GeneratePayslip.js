import React from 'react';

// Import Boostrap Theme Components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

// Import custom libraries
import { Formik } from 'formik';

// Import Custom CSS styles
import './GeneratePayslip.css';

// Set libraries from CDN added to index.html
let moment = window.moment;

class GeneratePaySlip extends React.Component {
    constructor(props) {
        super(props);

        // Identify Custom Functions
        this.handleSubmit = this.handleSubmit.bind(this);
        this.savePayslip = this.props.savePayslip;
        this.handleClick = this.handleClick;

        // Identify global variables
        this.payslip = this.props.payslip;
    }

    handleSubmit(values, actions) {
        this.savePayslip(this.payslip)
            .then((response) => {
                actions.setValues({
                    "save_file": response.details
                });
            })
            .catch((err) => {
                if(err.details) {
                    actions.setErrors({
                        "save_file": err.details
                    });
                } else {
                    actions.setErrors({
                        "save_file": "A server issue has occured. Please try again later."
                    });
                    console.log(err);
                }
            });
    }

    handleClick(e) {
        console.log(e.currentTarget.id);
        if((e.currentTarget.id) === "back_button") {
            this.props.back_navigation();
        }
    }

    render() {
        let payslip = this.payslip;
        let self = this;

        return (
            <React.Fragment>
                <h2>Payslip</h2>
                <h4>{payslip.employee.first_name + " " + payslip.employee.last_name}</h4>
                <Table striped={true} bordered={true}>
                    <tbody>
                        <tr>
                            <td>Pay Date</td>
                            <td>{moment(payslip.pay_date).format("D MMMM YYYY")}</td>
                        </tr>
                        <tr>
                            <td>Pay Frequency</td>
                            <td>{payslip.pay_frequency[0].toUpperCase() + payslip.pay_frequency.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Annual Income</td>
                            <td>$ {payslip.annual_income.toLocaleString()}.00</td>
                        </tr>
                        <tr>
                            <td>Gross Income</td>
                            <td>$ {payslip.gross_income.toLocaleString()}.00</td>
                        </tr>
                        <tr>
                            <td>Income Tax</td>
                            <td>$ {payslip.income_tax.toLocaleString()}.00</td>
                        </tr>
                        <tr>
                            <td>Net Income</td>
                            <td>$ {payslip.net_income.toLocaleString()}.00</td>
                        </tr>
                        <tr>
                            <td>Super</td>
                            <td>$ {payslip.super.toLocaleString()}.00</td>
                        </tr>
                        <tr>
                            <td>Pay</td>
                            <td>$ {payslip.pay.toLocaleString()}.00</td>
                        </tr>
                    </tbody>
                </Table>
                <Formik onSubmit={this.handleSubmit} >
                    {({
                        handleSubmit,
                        values,
                        isValid,
                        isSubmitting,
                        submitCount,
                        errors
                    }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group>
                                <Button className="float-right" disabled={!(errors.save_file) && submitCount > 0} type="submit" variant="primary">Pay</Button>
                                <Button className="float-right mr-2" id="back_button" onClick={self.handleClick.bind(this)} variant="outline-secondary">Back</Button>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    name="save_file"
                                    type="hidden"
                                    isValid={!errors.save_file}
                                    isInvalid={errors.save_file}
                                ></Form.Control>
                                <Form.Control.Feedback type="valid">
                                    {values.save_file}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {errors.save_file}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    )}
                </Formik>
            </React.Fragment>
        );
    };
}

export default GeneratePaySlip;