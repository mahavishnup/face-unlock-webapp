import React from 'react';
// import { Route, Router } from "react-router-dom";
// import createHistory from "history/createBrowserHistory";

// import Home from "../../views/Home";
// import VideoInput from "../../views/VideoInput";

import FaceUnlock from "../../views/VideoInput";
class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: "",
      signInPassword: "",
      signInFaceUnlock: "",
    };
  }


  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  onFaceUnlockChange = (event) => {
    this.setState({ signInFaceUnlock: event.target.value });
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

  onSubmitunlock = () => {
    fetch("/api/signin/unlock", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.signInEmail,
        faceunlock: this.state.signInFaceUnlock,
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

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--white-10 mv4 w-100 w-50-m w-25-l mw6 shadow-1 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0 ttu">Sign In</legend>

              <div className="">
                <FaceUnlock/>
                {/* <input
                  onClick={this.onSubmitunlock}
                  className="b ph4 pv3 input-reset ba b--black bg-transparent grow pointer f6 dib"
                  type="submit"
                  value="Face Unlock"
                /> */}
                {/* <Router
                  history={createHistory({ basename: process.env.PUBLIC_URL })}
                >
                  <div className="route">
                    <Route exact path="/" component={Home} />
                    <Route exact path="/camera" component={VideoInput} />
                  </div>
                </Router> */}
              </div>

              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent  hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
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