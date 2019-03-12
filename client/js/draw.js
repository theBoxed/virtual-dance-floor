const draw = (() => {
  //Skeleton Variables
  const color = 'blue';
  const lineWidth = 4;

  function toTuple({y,x}) {
   return [y, x];
  } 

  function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function drawSkeleton(keypoints, minPartConfidence, ctx, scale = 1) {
    const adjacentKeyPoints =
      posenet.getAdjacentKeyPoints(keypoints, minPartConfidence);
console.log(adjacentKeyPoints);
    adjacentKeyPoints.forEach((keypoints) => {
      drawSegment(
        toTuple(keypoints[0].position), toTuple(keypoints[1].position), color,
        scale, ctx);
    });
  }

  function drawKeypoints(keypoints, minPartConfidence, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];

      if(keypoint.score < minPartConfidence) continue;

      const { y, x } = keypoint.position;
      drawPoint(ctx, y * scale, x * scale, 3, color);
    }
  }

  return {
    drawKeypoints,
    drawSkeleton
  }
})();