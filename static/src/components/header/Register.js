import React, { Component } from 'react'
import { Modal, Button, FormGroup, FormControl, HelpBlock, ControlLabel, Alert } from 'react-bootstrap'
import Select from 'react-select'
class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lname: '',
            fname: '',
            email: '',
            validEmail: null,
            pw: '',
            role: '',
            button: false,
            answer: null,
            alert: ''
        }
        this.validateEmail = this.validateEmail.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
        this.cleanState = this.cleanState.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidUpdate() {
        this.validateButton()
    }

    /*
     * validateEmail check if the string in the email field is 
     * in the form *@*.*
     * Input: mail
     * Output: a string either "success" or "error"
     * @author Kerry Gougeon
     */
    validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            this.setState({
                validEmail: "success"
            })
        } else {
            this.setState({
                validEmail: "error"
            })
        }
    }
    /*
    * validateButton check if all the field are ok 
    * Output: change the state of button to either T/F
    * @author Kerry Gougeon
    */
    validateButton() {
        let result;
        if (this.state.lname !== ''
            && this.state.pw !== ''
            && this.state.role !== ''
            && this.state.fname !== ''
            && this.state.validEmail == 'success') {
            result = false;
        } else {
            result = true;
        }
        if (this.state.button === result) { } else {
            this.setState({
                button: result
            })
        }
    }

    handleClick() {
        this.saveUser();
        this.handleAlert();
        this.cleanState(true);
    }

    async saveUser() {
        try {
            let data = {
                fname: this.state.fname,
                lname: this.state.lname,
                email: this.state.email,
                password: this.state.pw,
                engineer: this.state.role,
                display_image: "/public/images/avatar/1.png"
            }
            console.log(data)
            let myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            let myInit = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: myHeaders
            };

            let req = new Request("/api/users/", myInit)
            fetch(req).then(res => res.json())
                .catch(e => console.error('Error:', e))
                .then(response => {
                    if (response) {
                        this.setState({ answer: response.message })
                    }
                })
        } catch (e) { console.error("Error:", e) }
    }
    handleAlert() {
        if (this.state.alert) {
            if (this.state.answer.success) {
                this.setState({
                    alert: "success"
                })
            } else {
                this.setState({
                    alert: "danger"
                })
            }
        } else {
            this.setState({
                alert: "warning",
                answer: { message: 'The query failed' }
            })
        }
    }

    handleClose() {
        this.props.handleClose();
        this.cleanState(false);
    }
    /*
    * cleanState reset the state of the component
    * Input: a Boolean bool
    * Output: if T, reset but keep the alert. If F, reset everything
    * @author Kerry Gougeon
    */
    cleanState(bool) {
        if (bool) {
            this.setState({
                lname: '',
                fname: '',
                email: '',
                validEmail: null,
                pw: '',
                role: '',
                button: false,
            })
        } else {
            this.setState({
                lname: '',
                fname: '',
                email: '',
                validEmail: null,
                pw: '',
                role: '',
                button: false,
                answer: null,
                alert: ''
            })
        }
    }

    render() {
        let options = [
            { value: 'software', label: 'software' },
            { value: 'mechanical', label: 'mechanical' },
            { value: 'computer', label: 'computer' },
            { value: 'electrical', label: 'electrical' },
            { value: 'civil', label: 'civil' }
        ];
        let alert
        if (this.state.answer != null) {
            alert = <Alert bsStyle={this.state.alert}>{this.state.answer.message}</Alert>
        }
        return (
            <div className="static-modal">
                <Modal show={this.props.show} onHide={this.handleClose}>
                    <Modal.Header>
                        <Modal.Title>Register</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {alert}
                        <FieldGroup
                            type="text"
                            label="E-mail"
                            placeholder="E-mail"
                            valid={this.state.validEmail}
                            onChange={(e) => {
                                this.validateEmail(e.target.value)
                                this.setState({ email: e.target.value })
                            }}
                        />
                        <FieldGroup
                            label="Password"
                            type="password"
                            onChange={(e) => this.setState({ pw: e.target.value })}
                        />
                        <FieldGroup
                            type="text"
                            label="First name"
                            placeholder="John"
                            onChange={(e) => {
                                this.setState({ fname: e.target.value })
                            }}
                        />
                        <FieldGroup
                            type="text"
                            label="Last name"
                            placeholder="McQueen"
                            onChange={(e) => {
                                this.setState({ lname: e.target.value })
                            }}
                        />
                        <ControlLabel>Engineering field</ControlLabel>
                        <Select
                            name="form-field-name"
                            value={this.state.role}
                            options={options}
                            onChange={(e) => {
                                if (e !== null) {
                                    this.setState({ role: e.value })
                                } else {
                                    this.setState({ role: '' })
                                }
                            }}
                        />

                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                        <Button
                            bsStyle="primary"
                            disabled={this.state.button}
                            onClick={this.handleClick}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </div >
        );
    }
}

function FieldGroup({ id, label, help, valid, ...props }) {
    return (
        <FormGroup controlId={id} validationState={valid}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            <FormControl.Feedback />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}


export default Register;