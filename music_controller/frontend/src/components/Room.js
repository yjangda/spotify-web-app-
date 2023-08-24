import React, { Component } from 'react';
import { useRoutes, useParams, Link } from 'react-router-dom';
import {Typography, Button, Grid} from '@material-ui/core'
import { useNavigate } from 'react-router-dom';


class RoomComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        };
        this.roomCode = props.roomCode; // Assign the prop value to this.roomCode
        this.getRoomDetails();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    }

    getRoomDetails() {
        return fetch("/api/get-room" + "?code=" + this.roomCode)
          .then((response) => {
            if (!response.ok) {
                this.props.leaveRoomCallback;            
                this.props.navigate("/");
            }
            return response.json();
          })
          .then((data) => {
            this.setState({
              votesToSkip: data.votes_to_skip,
              guestCanPause: data.guest_can_pause,
              isHost: data.is_host,
            });
          });
      }

      leaveButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };

        fetch('/api/leave-room', requestOptions).then((_response) => {
            this.props.leaveRoomCallback;
            this.props.navigate("/");
        });

      }

    render() {
        const { roomCode } = this.props; // Access roomCode prop passed from parent component
        console.log(this.props);

        return (
            <div>
                <Grid container spacing={1} align = 'center'>
                    <Grid item xs = {12}>
                        <Typography variant='h4' component='h4'>
                            Code: {roomCode}
                        </Typography>
                    </Grid>
                    <Grid item xs = {12}>
                        <Typography variant='h6' component='h6'>
                            Votes: {this.state.votesToSkip}
                        </Typography>
                    </Grid>
                    <Grid item xs = {12}>
                        <Typography variant='h6' component='h6'>
                            Guest Can Pause: {this.state.guestCanPause.toString()}
                        </Typography>
                    </Grid>
                    <Grid item xs = {12}>
                        <Typography variant='h6' component='h6'>
                            Host: {this.state.isHost.toString()}
                        </Typography>
                    </Grid>
                    <Grid item xs ={12}>
                        <Button variant = 'contained' color = 'secondary' onClick={ this.leaveButtonPressed }>
                            Leave Room
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

function Room(props) {
    const { roomCode } = useParams(); // Access route parameter using useParams
    const navigate = useNavigate();

    return <RoomComponent roomCode={roomCode} navigate = {navigate} />;
}

export default Room;

/*<h3>{roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
                <p>Host: {this.state.isHost.toString()}</p>*/