import React from 'react';
import Webcam from "react-webcam";
import DrawBox from "../drawBox";
import {createMatcher, getFullFaceDescription, loadModels} from "../FaceRecognition/FaceRecognition";
import {JSON_PROFILE} from "../common/profile";
import FaceValue from "../faceValue";

const WIDTH = 320;
const HEIGHT = 240;
const inputSize = 160;

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      signInEmail: "",
      signInPassword: "",
      fullDesc: null,
      faceMatcher: null,
      showDescriptors: false,
      facingMode: null,
      faceValue: null,
    };
  }

  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  onSubmitSignIn = () => {
    fetch("/api/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        password: this.state.signInPassword,
      }),
    })
        .then((response) => response.json())
        .then((user) => {
          if (user.id) {
            this.props.loadUser(user);
            this.props.onRouteChange("home");
          }
        });
  };

  componentWillMount() {
    loadModels();
    this.setInputDevice();
    this.matcher();
  }

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
          (device) => device.kind === "videoinput"
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 1,
        });
      } else {
        await this.setState({
          facingMode: { exact: "environment" },
        });
      }
      this.startCapture();
    });
  };

  matcher = async () => {
    const faceMatcher = await createMatcher(JSON_PROFILE);
    this.setState({ faceMatcher });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
          this.webcam.current.getScreenshot(),
          inputSize
      ).then((fullDesc) => this.setState({ fullDesc }));

      // let faceToken = !!this.state.fullDesc ? <FaceValue fullDesc={this.state.fullDesc} faceMatcher={this.state.faceMatcher} /> : null ;
      //
      // if( faceToken === 'AJITH KUMAR.A' ){
      //   this.setState({ faceValue: 1 });
      //   this.setState({ signInEmail: 'ajith18anbu@gmail.com' });
      //   this.setState({ signInPassword: 'ajith@1234' });
      // }
      // if( faceToken === 'BHARATH HARISH KUMAR.A' ){
      //   this.setState({ faceValue: 1 });
      //   this.setState({ signInEmail: 'crownbharath007@gmail.com' });
      //   this.setState({ signInPassword: 'bharath@1234' });
      // }
      // if( faceToken === 'DINESH RAM SHANKAR.K' ){
      //   this.setState({ faceValue: 1 });
      //   this.setState({ signInEmail: 'dineshramk1999@gmail.com' });
      //   this.setState({ signInPassword: 'dinesh@1234' });
      // }
      // if( faceToken === 'Test' ){
      //   this.setState({ faceValue: 1 });
      //   this.setState({ signInEmail: 'test@gmail.com' });
      //   this.setState({ signInPassword: 'test@1234' });
      // }
    }
  };

  render() {
    const { onRouteChange } = this.props;
    const { fullDesc, faceMatcher, facingMode, faceValue, signInEmail, signInPassword } = this.state;
    let videoConstraints = null;
    let camera = "";
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode,
      };
      if (facingMode === faceValue ) {
        camera = "Access Granted"  + !!fullDesc ? <FaceValue fullDesc={fullDesc} faceMatcher={faceMatcher} /> : null + "!";
      } else {
        camera = "Processing";
      }
    }

    let faceToken = !!fullDesc ? <FaceValue fullDesc={fullDesc} faceMatcher={faceMatcher} /> : null ;
    console.log(faceToken);
    if( faceToken === 'AJITH KUMAR.A' ){
      this.setState({ faceValue: 1 });
      this.setState({ signInEmail: 'ajith18anbu@gmail.com' });
      this.setState({ signInPassword: 'ajith@1234' });
    }
    if( faceToken === 'BHARATH HARISH KUMAR.A' ){
      this.setState({ faceValue: 1 });
      this.setState({ signInEmail: 'crownbharath007@gmail.com' });
      this.setState({ signInPassword: 'bharath@1234' });
    }
    if( faceToken === 'DINESH RAM SHANKAR.K' ){
      this.setState({ faceValue: 1 });
      this.setState({ signInEmail: 'dineshramk1999@gmail.com' });
      this.setState({ signInPassword: 'dinesh@1234' });
    }
    if( faceToken === 'Test' ){
      this.setState({ faceValue: 1 });
      this.setState({ signInEmail: 'test@gmail.com' });
      this.setState({ signInPassword: 'test@1234' });
    }
    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
          <main className="pa4 black-80">
            <div className="measure">
              <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f1 fw6 ph0 mh0 ttu">Sign In</legend>

                <div className="Camera" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p>Camera: {camera}</p>
                  <div style={{ width: WIDTH, height: HEIGHT }}>
                    <div style={{ position: "relative", width: WIDTH }}>
                      {!!videoConstraints ? <div style={{ position: "absolute" }}>
                        <Webcam audio={false} width={WIDTH} height={HEIGHT} ref={this.webcam} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} />
                      </div> : null}
                      {!!fullDesc ? <DrawBox fullDesc={fullDesc} faceMatcher={faceMatcher} imageWidth={WIDTH} boxColor={"blue"} /> : null}
                    </div>
                  </div>
                </div>
                <div className="mt3">
                  <label className="db fw6 lh-copy f6" htmlFor="email-address">
                    Email
                  </label>
                  <input
                      className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                      type="email"
                      name="email-address"
                      id="email-address"
                      onChange={this.onEmailChange}
                      value={signInEmail}
                  />
                </div>
                <div className="mv3">
                  <label className="db fw6 lh-copy f6" htmlFor="password">
                    Password
                  </label>
                  <input
                      className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                      type="password"
                      name="password"
                      id="password"
                      onChange={this.onPasswordChange}
                      value={signInPassword}
                  />
                </div>
              </fieldset>
              <div className="">
                <input
                    onClick={this.onSubmitSignIn}
                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                    type="submit"
                    value="Sign in"
                />
              </div>
              <div className="lh-copy mt3">
                <p
                    onClick={() => onRouteChange("register")}
                    className="f6 link dim black db pointer"
                >
                  Register
                </p>
              </div>
            </div>
          </main>
        </article>
    );
  }
}

export default Signin;