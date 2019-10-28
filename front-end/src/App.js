import React from 'react';
import './App.css';

// Import Bootstrap Theme Components
import { Container, Row, Col } from 'react-bootstrap'; // import the grid structre in 1 line.

// Import Custom Components
import Header from './components/Header';
import EnterPaySlip from './screens/EnterPayslip';
import GeneratePaySlip from './screens/GeneratePayslip';

// Import Custom Libraries
import calcPayslip from './libraries/payslip_calculation.js';

// Import CSS Styles
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        // Set state
        this.state = {
            "isGenerating": false,
            "isGenerated": false,
            "payslip_details": {}
        };

        // Identify Custom Functions
        this.generatePayslip = this.generatePayslip.bind(this);
        this.savePayslip = this.savePayslip.bind(this);
        this.backButton = this.backButton.bind(this);
    }

    generatePayslip(data) {
        let self = this;
        self.setState({
            "isGenerating": true
        });
        return calcPayslip(data)
            .then((payslip) => {
                console.log(payslip);
                self.setState({
                    "isGenerating": false,
                    "isGenerated": true,
                    "payslip_details": payslip
                });
            });
    }

    savePayslip(data) {
        console.log(data);
        return fetch("http://localhost:3254/payslip/save", {
            "method": "POST",
            "headers": {
                'Content-Type': 'application/json'
            },
            "body": JSON.stringify(data)
        }).then((response) => {
            let data = response.json();
            return data;
        }).then((response) => {
            if(response.status === "success") {
                return Promise.resolve(response);
            } else {
                return Promise.reject(response);
            }
        });
    }

    backButton() {
        console.log("Back pressed");
        this.setState({
            "isGenerated": false
        });
    }

    render() {
        let screen = <EnterPaySlip generatePayslip={this.generatePayslip} />;
        if(this.state.isGenerated) {
            screen = <GeneratePaySlip payslip={this.state.payslip_details} savePayslip={this.savePayslip} back_navigation={this.backButton} />;
        }

        return (
            <Container>
                <Row>
                    <Col>
                        <Header />
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ span: 6, offset: 3 }}>
                        { screen }
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
