import React, {Component} from 'react';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription, createMatcher } from '../FaceRecognition/FaceRecognition';
import DrawBox from '../drawBox';
import { JSON_PROFILE } from '../common/profile';
import ShowDescriptors from "../showDescriptors";

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

class FaceCamera extends Component  {
    constructor(props) {
        super(props);
        this.webcam = React.createRef();
        this.state = {
            fullDesc: null,
            faceMatcher: null,
            showDescriptors: false,
            facingMode: null,
            faceValue: null,
        };
    }

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
        }, 15500);
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

            this.setState({ faceValue: 1 });
        }
    };

    handleDescriptorsCheck = (event) => {
        this.setState({ showDescriptors: event.target.checked });
    };

    render() {
        const { fullDesc, faceMatcher, showDescriptors, facingMode } = this.state;
        let videoConstraints = null;
        let camera = "";
        if (!!facingMode) {
            videoConstraints = {
                width: WIDTH,
                height: HEIGHT,
                facingMode: facingMode,
            };
            if (facingMode === faceValue) {
                camera = "Registered Successfully!";
            } else {
                camera = "Processing";
            }
        }

        return <div className="Camera" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p>Camera: {camera}</p>
            <div style={{ width: WIDTH, height: HEIGHT }}>
                <div style={{ position: "relative", width: WIDTH }}>
                    {!!videoConstraints ? <div style={{ position: "absolute" }}>
                        <Webcam audio={false} width={WIDTH} height={HEIGHT} ref={this.webcam} screenshotFormat="image/jpeg" videoConstraints={videoConstraints} />
                    </div> : null}
                    {!!fullDesc ? <DrawBox fullDesc={fullDesc} faceMatcher={faceMatcher} imageWidth={WIDTH} boxColor={"blue"} /> : null}
                </div>
            </div>
            <div>
                <input name="descriptors" type="checkbox" checked={this.state.showDescriptors} onChange={this.handleDescriptorsCheck} />
                <label>Show Descriptors</label>
            </div>
            {!!showDescriptors ? <ShowDescriptors fullDesc={fullDesc} /> : null}
        </div>;
    }
}

export default FaceCamera;
