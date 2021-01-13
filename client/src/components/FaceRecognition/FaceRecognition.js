import * as faceapi from 'face-api.js';

const maxDescriptorDistance = 0.5;

export async function loadModels() {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

export async function getFullFaceDescription(blob, inputSize = 512) {
    // tiny_face_detector options
    let scoreThreshold = 0.5;
    const OPTION = new faceapi.TinyFaceDetectorOptions({
        inputSize,
        scoreThreshold
    });
    const useTinyModel = true;

    // fetch image to api
    let img = await faceapi.fetchImage(blob);

    // detect all faces and generate full description from image
    // including landmark and descriptor of each face
    let fullDesc = await faceapi
        .detectAllFaces(img, OPTION)
        .withFaceLandmarks(useTinyModel)
        .withFaceDescriptors();
    return fullDesc;
}

export async function createMatcher(faceProfile) {
    // Create labeled descriptors of member from profile
    let members = Object.keys(faceProfile);
    let labeledDescriptors = members.map(
        member =>
            new faceapi.LabeledFaceDescriptors(
                faceProfile[member].name,
                faceProfile[member].descriptors.map(
                    descriptor => new Float32Array(descriptor)
                )
            )
    );

    // Create face matcher (maximum descriptor distance is 0.5)
    let faceMatcher = new faceapi.FaceMatcher(
        labeledDescriptors,
        maxDescriptorDistance
    );
    return faceMatcher;
}

export function isFaceDetectionModelLoaded() {
    return !!faceapi.nets.tinyFaceDetector.params;
}




// <video id="video" width="720" height="560" autoPlay muted></video>

// <input type="file" id="imageUpload">

// body {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//     width: 100vw;
//     height: 100vh;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }
//
// canvas {
//     position: absolute;
// }

// const video = document.getElementById("video");
// let predictedAges = [];
//
// Promise.all([
//     faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//     faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//     faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//     faceapi.nets.faceExpressionNet.loadFromUri("/models"),
//     faceapi.nets.ageGenderNet.loadFromUri("/models")
// ]).then(startVideo);
//
// function startVideo() {
//     navigator.getUserMedia(
//         { video: {} },
//         stream => (video.srcObject = stream),
//         err => console.error(err)
//     );
// }
//
// video.addEventListener("playing", () => {
//     const canvas = faceapi.createCanvasFromMedia(video);
//     document.body.append(canvas);
//
//     const displaySize = { width: video.width, height: video.height };
//     faceapi.matchDimensions(canvas, displaySize);
//
//     setInterval(async () => {
//         const detections = await faceapi
//             .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//             .withFaceLandmarks()
//             .withFaceExpressions()
//             .withAgeAndGender();
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
//
//         canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//
//         faceapi.draw.drawDetections(canvas, resizedDetections);
//         faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//         faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//
//         const age = resizedDetections[0].age;
//         const interpolatedAge = interpolateAgePredictions(age);
//         const bottomRight = {
//             x: resizedDetections[0].detection.box.bottomRight.x - 50,
//             y: resizedDetections[0].detection.box.bottomRight.y
//         };
//
//         new faceapi.draw.DrawTextField(
//             [`${faceapi.utils.round(interpolatedAge, 0)} years`],
//             bottomRight
//         ).draw(canvas);
//     }, 100);
// });
//
// function interpolateAgePredictions(age) {
//     predictedAges = [age].concat(predictedAges).slice(0, 30);
//     const avgPredictedAge =
//         predictedAges.reduce((total, a) => total + a) / predictedAges.length;
//     return avgPredictedAge;
// }


// const imageUpload = document.getElementById('imageUpload')
//
// Promise.all([
//     faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//     faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
// ]).then(start)
//
// async function start() {
//     const container = document.createElement('div')
//     container.style.position = 'relative'
//     document.body.append(container)
//     const labeledFaceDescriptors = await loadLabeledImages()
//     const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
//     let image
//     let canvas
//     document.body.append('Loaded')
//     imageUpload.addEventListener('change', async () => {
//         if (image) image.remove()
//         if (canvas) canvas.remove()
//         image = await faceapi.bufferToImage(imageUpload.files[0])
//         container.append(image)
//         canvas = faceapi.createCanvasFromMedia(image)
//         container.append(canvas)
//         const displaySize = { width: image.width, height: image.height }
//         faceapi.matchDimensions(canvas, displaySize)
//         const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
//         const resizedDetections = faceapi.resizeResults(detections, displaySize)
//         const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
//         results.forEach((result, i) => {
//             const box = resizedDetections[i].detection.box
//             const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
//             drawBox.draw(canvas)
//         })
//     })
// }
//
// function loadLabeledImages() {
//     const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
//     return Promise.all(
//         labels.map(async label => {
//             const descriptions = []
//             for (let i = 1; i <= 2; i++) {
//                 const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
//                 const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//                 descriptions.push(detections.descriptor)
//             }
//
//             return new faceapi.LabeledFaceDescriptors(label, descriptions)
//         })
//     )
// }