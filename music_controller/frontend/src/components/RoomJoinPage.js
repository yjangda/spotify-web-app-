import React, {Component} from 'react';
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import {Link, useNavigate} from "react-router-dom";

const withRouter = WrappedComponent => props => {
    const navigate = useNavigate();
    // etc... other react-router-dom v6 hooks
  
    return (
        <WrappedComponent
            {...props}
            navigate={navigate}
        // etc...
        />
    );
};

class RoomJoinPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            roomCode: "",
            error: false,
            errorMessage: ""
        }
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.roomButtonPressed = this.roomButtonPressed.bind(this);
    }

    render(){
        return(
            <Grid container spacing = {1} align='center'>
                <Grid item xs = {12}>
                    <Typography variant = 'h4' component='h4'>
                        Join A Room
                    </Typography>
                </Grid>
                <Grid item xs = {12}>
                    <TextField
                        error = {this.state.error}
                        label = "Code"
                        placeholder = "Enter a Room Code"
                        value = {this.state.roomCode}
                        helperText = {this.state.error}
                        variant="outlined"
                        onChange = {this.handleTextFieldChange}
                        />
                </Grid>
                <Grid item xs = {12}>
                    <Button variant='contained' color='secondary' onClick = {this.roomButtonPressed}>
                        Enter Room
                    </Button>
                </Grid>
                <Grid item xs = {12}>
                    <Button variant='contained' color = 'primary' to = "/" component = {Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    }

    handleTextFieldChange(e){
        this.setState({
            roomCode: e.target.value,
        });
    }

    roomButtonPressed(){
        const requestOptions = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code:this.state.roomCode
            })
        };
        fetch('/api/join-room', requestOptions).then((response) => {
            if(response.ok){
                this.props.navigate(`/room/${this.state.roomCode}`);
            }
            else{
                this.setState({error: "Room not found."});
            }
        }).catch((error) => {
            console.log(error);
        });
    }
}
export default withRouter(RoomJoinPage);
