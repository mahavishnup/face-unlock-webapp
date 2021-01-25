import React, { Component } from 'react';

class FaceValue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptors: null,
      detections: null,
      match: null
    };
  }

  componentDidMount() {
    this.getDescription();
  }

  componentWillReceiveProps(newProps) {
    this.getDescription(newProps);
  }

  getDescription = async (props = this.props) => {
    const { fullDesc, faceMatcher } = props;
    if (!!fullDesc) {
      await this.setState({
        descriptors: fullDesc.map(fd => fd.descriptor),
        detections: fullDesc.map(fd => fd.detection)
      });
      if (!!this.state.descriptors && !!faceMatcher) {
        let match = await this.state.descriptors.map(descriptor =>
            faceMatcher.findBestMatch(descriptor)
        );
        this.setState({ match });
      }
    }
  };

  render() {
    const { detections, match } = this.state;
    let faceValue = null;

    if (!!detections) {
      faceValue = detections.map((detection, i) => {
        return (
            <div key={i}>
              <div>
                {!!match && match[i] && match[i]._label !== 'unknown' ? (
                    <p>
                      {match[i]._label}
                    </p>
                ) : null}
              </div>
            </div>
        );
      });
    }

    return <div>{faceValue}</div>;
  }
}

export default FaceValue;
