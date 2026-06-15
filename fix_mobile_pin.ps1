# Fix mobileServer.ts PIN keypad and page blocking issues
$file = 'c:\Users\user\Desktop\sys-kodify\electron\mobileServer.ts'
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

Write-Host "Original length: $($content.Length)"

# ---------------------------------------------------------------
# FIX 1: Add async to CDN scripts so they never block the page.
# On a local-network-only device (no internet) these scripts
# would hang the browser indefinitely without async/defer.
# ---------------------------------------------------------------
$content = $content.Replace(
    '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/chart.js" async></script>'
)
$content = $content.Replace(
    '<script src="https://cdn.jsdelivr.net/npm/@zxing/library@latest/umd/index.min.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/@zxing/library@latest/umd/index.min.js" async></script>'
)

Write-Host "Fix 1 applied (async CDN)"

# ---------------------------------------------------------------
# FIX 2: Add touch-action: manipulation to .keypad and .key CSS
# This removes the 300ms tap delay on mobile browsers.
# Also increase min tap target size to 56px and add user-select.
# ---------------------------------------------------------------
$content = $content.Replace(
    '      direction: ltr;
    }

    .key {
      aspect-ratio: 1;
      border-radius: 50%;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
      cursor: pointer;
      font-family: ''Outfit'', sans-serif;
      min-height: 48px;
      min-width: 48px;
    }',
    '      direction: ltr;
      touch-action: manipulation;
    }

    .key {
      aspect-ratio: 1;
      border-radius: 50%;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
      cursor: pointer;
      font-family: ''Outfit'', sans-serif;
      min-height: 56px;
      min-width: 56px;
      touch-action: manipulation;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }'
)

Write-Host "Fix 2 applied (touch CSS)"

# ---------------------------------------------------------------
# FIX 3: Replace onclick with ontouchstart+onclick on key buttons.
# ontouchstart fires immediately with no delay on iOS/Android.
# We also stringify the value to avoid number vs string issues.
# ---------------------------------------------------------------
$content = $content.Replace(
    '<div class="keypad">
      <div class="key" onclick="pressKey(1)">1</div>
      <div class="key" onclick="pressKey(2)">2</div>
      <div class="key" onclick="pressKey(3)">3</div>
      <div class="key" onclick="pressKey(4)">4</div>
      <div class="key" onclick="pressKey(5)">5</div>
      <div class="key" onclick="pressKey(6)">6</div>
      <div class="key" onclick="pressKey(7)">7</div>
      <div class="key" onclick="pressKey(8)">8</div>
      <div class="key" onclick="pressKey(9)">9</div>
      <div class="key empty"></div>
      <div class="key" onclick="pressKey(0)">0</div>',
    '<div class="keypad" id="pinKeypad">
      <div class="key" ontouchstart="event.preventDefault();pressKey(''1'')" onclick="pressKey(''1'')">1</div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''2'')" onclick="pressKey(''2'')">2</div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''3'')" onclick="pressKey(''3'')">3</div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''4'')" onclick="pressKey(''4'')">4</div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''5'')" onclick="pressKey(''5'')">5</div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''6'')" onclick="pressKey(''6'')">6</div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''7'')" onclick="pressKey(''7'')">7</div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''8'')" onclick="pressKey(''8'')">8</div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''9'')" onclick="pressKey(''9'')">9</div>
      <div class="key empty"></div>
      <div class="key" ontouchstart="event.preventDefault();pressKey(''0'')" onclick="pressKey(''0'')">0</div>'
)

Write-Host "Fix 3 applied (ontouchstart on keys)"

# Also fix the back button
$content = $content.Replace(
    "<div class=`"key`" onclick=`"pressKey('back')`">",
    "<div class=`"key`" ontouchstart=`"event.preventDefault();pressKey('back')`" onclick=`"pressKey('back')`">"
)

Write-Host "Fix 3b applied (back button)"

# ---------------------------------------------------------------
# FIX 4: Guard the Chart constructor call so it doesn't throw
# when chart.js hasn't loaded yet (async / no internet).
# ---------------------------------------------------------------
$content = $content.Replace(
    '      paymentChartInstance = new Chart(ctx, {',
    '      if (typeof Chart === ''undefined'') return;
      paymentChartInstance = new Chart(ctx, {'
)

Write-Host "Fix 4 applied (Chart guard)"

# ---------------------------------------------------------------
# FIX 5: Add missing startCameraScan / stopCameraScan stubs.
# These are called from onclick but never defined, which would
# throw a ReferenceError and could abort the script in some
# browsers / strict mode contexts.
# ---------------------------------------------------------------
$oldPressKey = '    function pressKey(val) {'
$newPressKey = '    // Camera scan stubs (ZXing loaded async, may not be ready)
    let cameraStream = null;
    function startCameraScan() {
      var modal = $(''cameraModal'');
      if (modal) modal.classList.add(''active'');
      var errEl = $(''cameraErrorMsg'');
      if (errEl) errEl.textContent = '''';
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (errEl) errEl.textContent = ''Camera not supported'';
        return;
      }
      var video = $(''cameraPreview'');
      navigator.mediaDevices.getUserMedia({ video: { facingMode: ''environment'' } })
        .then(function(stream) {
          cameraStream = stream;
          if (video) { video.srcObject = stream; video.play(); }
          if (typeof ZXing !== ''undefined'') {
            var hints = new Map();
            var formats = [ZXing.BarcodeFormat.QR_CODE, ZXing.BarcodeFormat.EAN_13, ZXing.BarcodeFormat.EAN_8, ZXing.BarcodeFormat.CODE_128];
            hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
            var reader = new ZXing.MultiFormatReader();
            reader.setHints(hints);
            (function scan() {
              if (!cameraStream) return;
              try {
                if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
                  var canvas = document.createElement(''canvas'');
                  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
                  canvas.getContext(''2d'').drawImage(video, 0, 0);
                  var lum = ZXing.HTMLCanvasElementLuminanceSource ? new ZXing.HTMLCanvasElementLuminanceSource(canvas) : null;
                  if (lum) {
                    try {
                      var result = reader.decode(new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(lum)));
                      if (result) { stopCameraScan(); $(''prodBarcode'').value = result.getText(); return; }
                    } catch(e) {}
                  }
                }
              } catch(e) {}
              requestAnimationFrame(scan);
            })();
          }
        })
        .catch(function(err) {
          if (errEl) errEl.textContent = ''Camera access denied: '' + err.message;
        });
    }
    function stopCameraScan() {
      if (cameraStream) { cameraStream.getTracks().forEach(function(t){ t.stop(); }); cameraStream = null; }
      var modal = $(''cameraModal'');
      if (modal) modal.classList.remove(''active'');
    }

    function pressKey(val) {'

$content = $content.Replace($oldPressKey, $newPressKey)
Write-Host "Fix 5 applied (camera stubs)"

# ---------------------------------------------------------------
# FIX 6: Rewrite pressKey to use string digits and show a clear
# inline error instead of just changing subtitle color/text.
# ---------------------------------------------------------------
$oldSubmitPin = '    async function submitPin() {
      pin = pinBuffer;
      const success = await syncData();
      const dots = document.querySelectorAll(''.pin-dot'');
      const translations = t[lang];

      if (success) {
        localStorage.setItem(''kodifyManagerPin'', pin);
        $(''lockscreen'').classList.add(''slide-up'');
      } else {
        pinBuffer = '''';
        dots.forEach(d => {
          d.classList.remove(''active'');
          d.classList.add(''error'');
          setTimeout(() => d.classList.remove(''error''), 300);
        });
        $(''lockSubtitle'').textContent = translations.lockError;
        $(''lockSubtitle'').style.color = ''var(--rose)'';
      }
    }'

$newSubmitPin = '    async function submitPin() {
      pin = pinBuffer;
      const success = await syncData();
      const dots = document.querySelectorAll(''.pin-dot'');
      const translations = t[lang];

      if (success) {
        localStorage.setItem(''kodifyManagerPin'', pin);
        $(''lockscreen'').classList.add(''slide-up'');
        $(''lockSubtitle'').style.color = '''';
      } else {
        pinBuffer = '''';
        dots.forEach(d => {
          d.classList.remove(''active'');
          d.classList.add(''error'');
          setTimeout(() => d.classList.remove(''error''), 400);
        });
        const errText = translations.lockError || ''\u0631\u0645\u0632 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d'';
        $(''lockSubtitle'').textContent = errText;
        $(''lockSubtitle'').style.color = ''var(--rose)'';
        setTimeout(() => {
          $(''lockSubtitle'').textContent = translations.lockSubtitle;
          $(''lockSubtitle'').style.color = '''';
        }, 2000);
      }
    }'

$content = $content.Replace($oldSubmitPin, $newSubmitPin)
Write-Host "Fix 6 applied (submitPin improved error)"

# Save
[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done. File saved. Length: $($content.Length)"
