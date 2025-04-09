'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "8289ebaea398d8fc2393cd386be46b20",
"version.json": "2fdf886a82ccb9e04631f2d7e975fe3d",
"index.html": "beabb7ca16b889149771399354cce574",
"/": "beabb7ca16b889149771399354cce574",
"main.dart.js": "bc7d44844274746c3f93a187d594d9e4",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"favicon.png": "a69a8e2e795de7521ecc8c2553289ce9",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "71780ea0625ee2b03f714752062c14a1",
"assets/AssetManifest.json": "061681defb5fd43b8dcabb684a6a235c",
"assets/NOTICES": "e6436515832c5fa225a2da74f7f60d94",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "73c7cb1da7cdf1124570cddd90689436",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "4718589802ae6563ed4a21fb2feab499",
"assets/fonts/MaterialIcons-Regular.otf": "7e8d2f3f03b55fdff7a207bf867a7261",
"assets/assets/gear.png": "0aa91eb61d516eb43343ad45afd2ccc1",
"assets/assets/support.png": "7b95fb42beb31c4912686d54c34d7245",
"assets/assets/preset.png": "5a112450861886286521e3b6d9d7fd46",
"assets/assets/volume_normal.png": "cf9f30c2d6f35fba1de6a210eeb54dd6",
"assets/assets/volume.png": "01c9fae15e3c711861ebbcb45208a579",
"assets/assets/map.png": "8ad00da2ee711acc04665d6b61fedef0",
"assets/assets/home.png": "fa05fe449522f98e69888024d708c9b4",
"assets/assets/volume_up.png": "5367276d2e5b2f79c56eeeaacf6449d9",
"assets/assets/volume_active.png": "e1d461649c439cf8e3dd8779da7b3d06",
"assets/assets/volumn_off.png": "8be7221e3be3bbf5dcc5272243375931",
"assets/assets/use.png": "1441064793b243f3a3fa8f5d87acf34f",
"assets/assets/volumn_on.png": "d44e4fee4fb7b31949ac4e2a8a249cc8",
"assets/assets/volume_active2.png": "5d77828e96ec82d3dcb07127036274e7",
"assets/assets/bg4.png": "157e7aa8c571a729e377293d4ae03d0c",
"assets/assets/bookmark.png": "0e0e7e25f377c0527958dbee6dc5a2df",
"assets/assets/logo.png": "0c948e6b83b49f844efb45edb740eb3f",
"assets/assets/bg1.png": "c676fea495f167ead7228a8d965f6656",
"assets/assets/volume_fix.png": "57b81059bd6482a9d46cadc78ccf930d",
"assets/assets/bg3.png": "2ef690f099868c2fd41ba272798c91b1",
"assets/assets/bg2.png": "39a7d7df67a07bbc13fde9711b7f8cae",
"assets/assets/floor.png": "27887bf6d8099d9e0d3bbbbaef944197",
"assets/assets/delete.png": "3e1f142f72435a6ab4da4f0b87db287a",
"assets/assets/zone.png": "bdda3d21626821e9de2431c0b02203f8",
"assets/assets/edit.png": "0b924971c10d7a1439d6c23e15503a0e",
"assets/assets/font/Montserrat-Regular.ttf": "5e077c15f6e1d334dd4e9be62b28ac75",
"assets/assets/volume_fix2.png": "75acb898280a05ef6b079e80c1380851",
"assets/assets/map_volume.png": "ad6cc77d6957a9f39fbbb6536d617f65",
"assets/assets/volume_normal2.png": "5c45b25359755a5760b87da476bcdc03",
"assets/assets/save.png": "0ca0382c59a7e09999a8737d6e855e20",
"assets/assets/bg.jpg": "f5ab0821660e4d4e532d759e5265b5c9",
"canvaskit/skwasm.js": "f17a293d422e2c0b3a04962e68236cc2",
"canvaskit/skwasm.js.symbols": "c4ccfde2b701d591395ceb7a62c86304",
"canvaskit/canvaskit.js.symbols": "003797afc47f3c6539a71f06f06e6349",
"canvaskit/skwasm.wasm": "f188a1bd2adcc3934ec096de7939f484",
"canvaskit/chromium/canvaskit.js.symbols": "295a1fdaf7a86a9f9bd6186781f44ece",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "ae464726be5743e1dbee1f86ccd7e96b",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "b3ab261ffaef884b7c1c58bf9790d054",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
