import React from 'react';

// Import Boostrap Theme Components
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Import custom libraries
import { Formik } from 'formik';
import * as yup from 'yup';

// Import Custom CSS styles
import './EnterPayslip.css';

// Set libraries from CDN added to index.html
let moment = window.moment;

class EnterPaySlip extends React.Component {
    constructor(props) {
        super(props);

        this.schema = yup.object().shape({
            first_name: yup.string().matches(/^[A-z]+$/, 'Only letters from A to Z are allowed').required(),
            last_name: yup.string().matches(/^[A-z]+$/, 'Only letters from A to Z are allowed').required(),
            salary: yup.number().integer('Please enter $ only').required(),
            superannuation: yup.number().min(0, 'Enter a value between 0 - +Infinity').required('Please enter a number')
        });

        this.initial_values = {
            first_name: "",
            last_name: "",
            salary: "",
            superannuation: ""
        };

        // this.initial_values = {
        //     first_name: "John",
        //     last_name: "Smith",
        //     salary: 60050,
        //     superannuation: 9
        // };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values, actions) {

        this.props.generatePayslip({
            "first_name": values.first_name,
            "last_name": values.last_name,
            "salary_amount": values.salary,
            "salary_frequency": "annual",
            "superannuation_rate": values.superannuation,
            "current_year": moment().year(),
            "payroll_month": moment().month(), // 0 index baced
            "pay_frequency": "monthly"
        }).catch((err) => {
            console.log(err.details);
            actions.setErrors({
                "generate": err.details
            });
        });

        actions.setSubmitting(false);
    }

    render() {
        return (
            <Formik initialValues={this.initial_values} validationSchema={this.schema} onSubmit={this.handleSubmit} >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    submitCount,
                    isValid,
                    isSubmitting,
                    errors,
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Row>
                            <h2>Employee Info</h2>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    name="first_name"
                                    placeholder="Firstname"
                                    value={values.first_name}
                                    onChange={handleChange}
                                    isInvalid={errors.first_name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.first_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Control
                                    autoComplete="off"
                                    type="text"
                                    name="last_name"
                                    placeholder="Lastname"
                                    value={values.last_name}
                                    onChange={handleChange}
                                    isInvalid={errors.last_name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.last_name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>$</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        autoComplete="off"
                                        type="number"
                                        name="salary"
                                        placeholder="Annual Salary"
                                        value={values.salary}
                                        onChange={handleChange}
                                        isInvalid={errors.salary}
                                    />
                                    <InputGroup.Append>
                                        <InputGroup.Text>.00</InputGroup.Text>
                                    </InputGroup.Append>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.salary}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>%</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        autoComplete="off"
                                        type="number"
                                        name="superannuation"
                                        step="0.5"
                                        placeholder="Super Rate"
                                        value={values.superannuation}
                                        onChange={handleChange}
                                        isInvalid={errors.superannuation}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.superannuation}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group>
                            <Button 
                                className={"float-right"}
                                disabled={!(Object.keys(errors).length === 0) || isSubmitting}
                                type="submit"
                                variant="primary"
                            >Generate Payslip</Button>
                        </Form.Group>
                        <Form.Group>
                                <Form.Control
                                    name="generate"
                                    type="hidden"
                                    isValid={!errors.generate}
                                    isInvalid={errors.generate}
                                ></Form.Control>
                                <Form.Control.Feedback type="valid">
                                    {values.generate}
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    {errors.generate}
                                </Form.Control.Feedback>
                            </Form.Group>
                    </Form>
                )}
            </Formik>
        );
    };
}

export default EnterPaySlip;