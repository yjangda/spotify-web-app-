import React, { Component } from 'react';
import { useRoutes, useParams, Link } from 'react-router-dom';
import {Typography, Button, Grid} from '@material-ui/core'
import { useNavigate } from 'react-router-dom';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

class RoomComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {}
        };

        this.roomCode = props.roomCode; // Assign the prop value to this.roomCode
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this); 
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();

    }

    componentDidMount() {
        this.interval = setInterval(this.getCurrentSong, 1000);
    }
    
    componentWillUnmount() {
        clearInterval(this.interval);
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
            if (this.state.isHost){
                this.authenticateSpotify()
            }
          });
      }

    

    getCurrentSong() {
        fetch("/spotify/current-song")
          .then((response) => {
            if (!response.ok) {
              return {};
            } else {
              return response.json();
            }
          })
          .then((data) => {
            this.setState({ song: data });
            console.log(data);
          });
      }

    authenticateSpotify() {
        fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                this.setState({ spotifyAuthenticated: data.status });
                console.log(data.status);
                if (!data.status) {
                fetch("/spotify/get-auth-url")
                    .then((response) => response.json())
                    .then((data) => {
                        window.location.replace(data.url);
                    });
                }
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

    updateShowSettings(value){
        this.setState({
            showSettings: value,
        });
    }

    renderSettingsButton(){
        return (
            <Grid item xs = {12} align = 'center'>
                <Button 
                variant = 'contained'
                color = 'primary' 
                onClick={() => this.updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    renderSettings(){
        return (
            <Grid container spacing={1} align = 'center'>
                <Grid item xs = {12} align = "center">
                    <CreateRoomPage 
                        update = {true} 
                        votesToSkip = {this.state.votesToSkip} 
                        guestCanPause = {this.state.guestCanPause} 
                        roomCode = {this.roomCode}
                        updateCallBack = {this.getRoomDetails()}
                    />
                </Grid>
                <Grid item xs = {12} align = "center">
                    <Button color="secondary" variant="contained" onClick={() => this.updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }


    render() {
        const { roomCode } = this.props; // Access roomCode prop passed from parent component
        console.log(this.props);
        if (this.state.showSettings){
            return this.renderSettings();
        }
        return (
            <div>
                <Grid container spacing={1} align = 'center'>
                    <Grid item xs = {12}>
                        <Typography variant='h4' component='h4'>
                            Code: {roomCode}
                        </Typography>
                    </Grid>
                    <MusicPlayer {...this.state.song} />
                    {this.state.isHost ? this.renderSettingsButton(): null}
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