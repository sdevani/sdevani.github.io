// Copyright 2013 Google Inc. All Rights Reserved.
// You may study, modify, and use this example for any purpose.
// Note that this example is provided "as is", WITHOUT WARRANTY
// of any kind either expressed or implied.

var adsManager_2;
var adsLoader_2;
var adDisplayContainer_2;
var intervalTimer_2;
var playButton_2;
var videoContent_2;

function init() {
  videoContent_2 = document.getElementById('contentElement_2');
  playButton_2 = document.getElementById('playButton_2');
  playButton_2.addEventListener('click', playAds_2);
  setUpIMA();
}

function setUpIMA() {
  // Create the ad display container.
  createAdDisplayContainer_2();
  // Create ads loader.
  adsLoader_2 = new google.ima.AdsLoader(adDisplayContainer_2);
  // Listen and respond to ads loaded and error events.
  adsLoader_2.addEventListener(
      google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
      onAdsManagerLoaded_2,
      false);
  adsLoader_2.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError_2,
      false);

  // Request video ads.
  var adsRequest = new google.ima.AdsRequest();
  adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=';

  // Specify the linear and nonlinear slot sizes. This helps the SDK to
  // select the correct creative if multiple are returned.
  adsRequest.linearAdSlotWidth = 640;
  adsRequest.linearAdSlotHeight = 400;

  adsRequest.nonLinearAdSlotWidth = 640;
  adsRequest.nonLinearAdSlotHeight = 150;

  adsLoader_2.requestAds(adsRequest);
}


function createAdDisplayContainer_2() {
  // We assume the adContainer is the DOM id of the element that will house
  // the ads.
  adDisplayContainer_2 = new google.ima.AdDisplayContainer(
      document.getElementById('adContainer_2'), videoContent_2);
}

function playAds_2() {
  // Initialize the container. Must be done via a user action on mobile devices.
  videoContent_2.load();
  adDisplayContainer_2.initialize();

  try {
    // Initialize the ads manager. Ad rules playlist will start at this time.
    adsManager_2.init(640, 360, google.ima.ViewMode.NORMAL);
    // Call play to start showing the ad. Single video and overlay ads will
    // start at this time; the call will be ignored for ad rules.
    adsManager_2.start();
  } catch (adError) {
    // An error may be thrown if there was a problem with the VAST response.
    videoContent_2.play();
  }
}

function onAdsManagerLoaded_2(adsManagerLoadedEvent) {
  // Get the ads manager.
  var adsRenderingSettings = new google.ima.AdsRenderingSettings();
  adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
  // videoContent should be set to the content video element.
  adsManager_2 = adsManagerLoadedEvent.getAdsManager(
      videoContent_2, adsRenderingSettings);

  // Add listeners to the required events.
  adsManager_2.addEventListener(
      google.ima.AdErrorEvent.Type.AD_ERROR,
      onAdError_2);
  adsManager_2.addEventListener(
      google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
      onContentPauseRequested_2);
  adsManager_2.addEventListener(
      google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
      onContentResumeRequested_2);
  adsManager_2.addEventListener(
      google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
      onAdEvent_2);

  // Listen to any additional events, if necessary.
  adsManager_2.addEventListener(
      google.ima.AdEvent.Type.LOADED,
      onAdEvent_2);
  adsManager_2.addEventListener(
      google.ima.AdEvent.Type.STARTED,
      onAdEvent_2);
  adsManager_2.addEventListener(
      google.ima.AdEvent.Type.COMPLETE,
      onAdEvent_2);
}

function onAdEvent_2(adEvent) {
  // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
  // don't have ad object associated.
  var ad = adEvent.getAd();
  switch (adEvent.type) {
    case google.ima.AdEvent.Type.LOADED:
      // This is the first event sent for an ad - it is possible to
      // determine whether the ad is a video ad or an overlay.
      if (!ad.isLinear()) {
        // Position AdDisplayContainer correctly for overlay.
        // Use ad.width and ad.height.
        videoContent_2.play();
      }
      break;
    case google.ima.AdEvent.Type.STARTED:
      // This event indicates the ad has started - the video player
      // can adjust the UI, for example display a pause button and
      // remaining time.
      if (ad.isLinear()) {
        // For a linear ad, a timer can be started to poll for
        // the remaining time.
        intervalTimer = setInterval(
            function() {
              var remainingTime = adsManager.getRemainingTime();
            },
            300); // every 300ms
      }
      break;
    case google.ima.AdEvent.Type.COMPLETE:
      // This event indicates the ad has finished - the video player
      // can perform appropriate UI actions, such as removing the timer for
      // remaining time detection.
      if (ad.isLinear()) {
        clearInterval(intervalTimer);
      }
      break;
  }
}

function onAdError_2(adErrorEvent) {
  // Handle the error logging.
  console.log(adErrorEvent.getError());
  adsManager.destroy();
}

function onContentPauseRequested_2() {
  videoContent_2.pause();
  // This function is where you should setup UI for showing ads (e.g.
  // display ad timer countdown, disable seeking etc.)
  // setupUIForAds();
}

function onContentResumeRequested_2() {
  videoContent_2.play();
  // This function is where you should ensure that your UI is ready
  // to play content. It is the responsibility of the Publisher to
  // implement this function when necessary.
  // setupUIForContent();

}

// Wire UI element references and UI event listeners.
init();
