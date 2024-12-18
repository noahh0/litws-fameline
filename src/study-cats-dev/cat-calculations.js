let niceCatCount = 0;
let meanCatCount = 0;
let progress = 0;
let niceCatIsChosen = false;
let meanCatIsChosen = false;
let countHasIncreased = false;
let niceCatsArray = ["img/cat1.jpg", "img/cat4.jpg", "img/cat6.jpg", "img/cat8.jpg", "img/cat10.jpg"];
let meanCatsArray = ["img/cat2.jpg", "img/cat3.jpg", "img/cat5.jpg", "img/cat7.jpg", "img/cat9.jpg"];

function initPractice() {
  progress = 9;
  const niceCat = document.getElementById("cat1");
  const meanCat = document.getElementById("cat2");

  const finishPractice = () => {
    viewNextButton();
    document.onkeydown = null;
  }
  niceCat.addEventListener("click", finishPractice);
  meanCat.addEventListener("click", finishPractice);
  document.onkeydown = function(e) {
    if (e.key === '1' || e.key === '2')
      finishPractice();
  }
}

function viewNextButton() {
  $('#btn-next-page').attr('style', 'display:block;');
  $('#btn-next-page')[0].scrollIntoView();
}

function initTrial() {
  niceCatCount = 0;
  meanCatCount = 0;
  progress = 0;
  chooseRandomCatImages();
  let niceCat = document.getElementById("cat1");
  let meanCat = document.getElementById("cat2");
  niceCat.addEventListener("click", incrementNiceCatCount);
  meanCat.addEventListener("click", incrementMeanCatCount);
  document.onkeydown = function(e) {
    if (e.key === '1')
      incrementNiceCatCount();
    else if(e.key === '2')
      incrementMeanCatCount();
  }
}

function incrementNiceCatCount() {
  let counter = document.getElementById("counter");
  counter.textContent = progress + 1 + "/10";
  niceCatCount++;
  console.log("mean:" + meanCatCount);
  console.log("nice:" + niceCatCount);
  console.log("progress:" + progress);
  let container = document.getElementById("cat-container");
  let niceCat = document.getElementById("cat1");
  let meanCat = document.getElementById("cat2");
  container.removeChild(niceCat);
  container.removeChild(meanCat);
  chooseRandomCatImages();
}

function incrementMeanCatCount() {
  let counter = document.getElementById("counter");
  counter.textContent = progress + 1 + "/10";
  meanCatCount++;
  console.log("mean:" + meanCatCount);
  console.log("nice:" +niceCatCount);
  console.log("progress:" + progress);
  let container = document.getElementById("cat-container");
  let niceCat = document.getElementById("cat1");
  let meanCat = document.getElementById("cat2");
  container.removeChild(niceCat);
  container.removeChild(meanCat);
  chooseRandomCatImages();
}

function checkProgress() {
  progress++;
  if (progress >= 10) {
    let niceCat = document.getElementById("cat1");
    let meanCat = document.getElementById("cat2");
    document.onkeydown = null;
    niceCat.removeEventListener("click", incrementNiceCatCount);
    meanCat.removeEventListener("click", incrementMeanCatCount);
    viewNextButton();
  }
}

function chooseRandomCatImages() {
  setNiceCatImage();
  setMeanCatImage();
  checkProgress();
}

function selectRandomNiceCat() {
  let randomNum = Math.floor(Math.random() * 5);
  return niceCatsArray[randomNum];
}

function selectRandomMeanCat() {
  let randomNum = Math.floor(Math.random() * 5);
  return meanCatsArray[randomNum];
}

function setNiceCatImage() {
  let container = document.getElementById("cat-container");
  let image = document.createElement("img");
  image.setAttribute("id", "cat1");
  image.src = selectRandomNiceCat();
  image.alt = "a nice cat";
  image.addEventListener("click", incrementNiceCatCount);
  container.appendChild(image);
}

function setMeanCatImage() {
  let container = document.getElementById("cat-container");
  let image = document.createElement("img");
  image.setAttribute("id", "cat2");
  image.src = selectRandomMeanCat();
  image.alt = "a mean cat";
  image.addEventListener("click", incrementMeanCatCount);
  container.appendChild(image);
}

// function calculateResults() {
//   /*if (niceCatCount > meanCatCount) {
//     setNiceCatImage();
//   } else {
//     setMeanCatImage();
//   }*/
// }

function calcResults() {
  if (niceCatCount > meanCatCount) {
    setNiceCatImage();
  } else {
    setMeanCatImage();
  }
}