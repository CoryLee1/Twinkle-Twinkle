// Copyright (c) 2023 ml5
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
let starImage; // Variable to hold the star image
let facemesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let lefteyeWidth;
let righteyeWidth;
let lrecth;
let rrecth;
let eyeOpenThreshold = 5; // 眼睛开合的阈值，需要根据实际情况调整
let blinkDetected = false; // 是否检测到眨眼
let notes = [1, 1, 1.5, 1.5, 1.667, 1.667,1.5, 1.333, 1.333,1.25,1.25,1.125,1.125,1];//1155665 4433221 Twinkle
let sound;
let currentNote = 0; // 当前音符的索引
let isPlaying = false;
let faceHeight;
// 脸部区域高度计算
let faceTop;
let faceBottom;
faceHeight = faceBottom - faceTop;
console.log(faceHeight);
// 眼睛区域与脸部区域的比例
let eyeRatio;
console.log(eyeRatio);




function preload() {
  // Load the facemesh model
  facemesh = ml5.facemesh(options);
  starImage = loadImage('star.png');
  sound = loadSound("gong.mp3");
  
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // Start detecting faces from the webcam video
  facemesh.detectStart(video, gotFaces);
  sound.playMode("restart"); // 设置播放模式
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);
    // Check for left eye
        // 眼睛区域与脸部区域的比例
        eyeRatio = lrecth / faceHeight;
        console.log("Ratio is"+eyeRatio);
    if (eyeRatio <0.049) {
      drawRandomStar();
    }
  drawPartsKeypoints();
  drawPartsBoundingBox();

}

// Draw keypoints for eyes
function drawPartsKeypoints() {
  if (faces.length > 0) {
    // Draw keypoints for the left eye
    for (let i = 0; i < faces[0].leftEye.length; i++) {
      let leftEye = faces[0].leftEye[i];
      fill('white'); // Red color for left eye
      circle(leftEye.x, leftEye.y, 5);
    }
    
    // Draw keypoints for the right eye
    /*for (let i = 0; i < faces[0].rightEye.length; i++) {
      let rightEye = faces[0].rightEye[i];
      fill('white'); // Blue color for right eye
      circle(rightEye.x, rightEye.y, 5);
    }*/
    faceTop = min(faces[0].keypoints.map(p => p.y));
    faceBottom = max(faces[0].keypoints.map(p => p.y));
    faceHeight = faceBottom - faceTop;
    console.log("!!!"+faceHeight);
  }
}

// Draw bounding box for eyes
function drawPartsBoundingBox() {
  if (faces.length > 0) {
    // Bounding box for the left eye
    let leftEyeX = faces[0].leftEye.map(point => point.x);
    let leftEyeY = faces[0].leftEye.map(point => point.y);

    noFill();
    stroke(255, 0, 0); // Red color for left eye box
    rect(
      min(leftEyeX),
      min(leftEyeY),
      max(leftEyeX) - min(leftEyeX),
      max(leftEyeY) - min(leftEyeY)
    );
    console.log("min(leftEyeY):"+(max(leftEyeY) - min(leftEyeY)));
    lrecth=max(leftEyeY) - min(leftEyeY);
    console.log("lrecth"+lrecth);

    // Bounding box for the right eye
    /*let rightEyeX = faces[0].rightEye.map(point => point.x);
    let rightEyeY = faces[0].rightEye.map(point => point.y);
    stroke(0, 0, 255); // Blue color for right eye box

    rect(
      min(rightEyeX),
      min(rightEyeY),
      max(rightEyeX) - min(rightEyeX),
      max(rightEyeY) - min(rightEyeY)
    );
    console.log("min(rightEyeY):"+(max(rightEyeY) - min(rightEyeY)));
    rrecth=max(rightEyeY) - min(rightEyeY);
    console.log("rrecth:"+rrecth);*/
  }
}
function drawRandomStar() {
  let x = random(width);
  let y = random(height);
  image(starImage, x, y, 50, 50); // Draw the star image at random position
  if (!isPlaying) {

    sound.rate(notes[currentNote]); // 设置音符频率
    sound.play(); // 播放音符
    isPlaying = true;

    sound.onended(() => {
      isPlaying = false;
      currentNote = (currentNote + 1) % notes.length; // 移至下一个音符
    });
  }
}

// Callback function for when facemesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
  //console.log(faces);
}
