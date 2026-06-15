import re

print("Starting patching process...")

# 1. Read mobileServer.ts
with open(r'electron\mobileServer.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 2. Replace submitProductForm validation check
old_validation = """      if (!nameAr || !nameEn) {
        alert(lang === 'ar' ? 'الرجاء إدخال الاسم بالعربية والإنجليزية' : 'Please input product name in Arabic and English');
        return;
      }"""

new_validation = """      if (!nameAr && !nameEn && !nameKu) {
        alert(lang === 'ar' ? 'الرجاء إدخال اسم واحد على الأقل للمنتج' : (lang === 'ku' ? 'تکایە لانی کەم ناوێکی بابەتەکە بنووسە' : 'Please enter at least one name for the product'));
        return;
      }"""

if old_validation in content:
    content = content.replace(old_validation, new_validation)
    print("Validation replaced successfully in mobileServer.ts")
else:
    # Check if already replaced
    if new_validation in content:
        print("Validation already replaced in mobileServer.ts")
    else:
        print("Warning: old_validation not found in mobileServer.ts")

# 3. Add JS functions before setLanguage(lang)
old_js = """    // Auto load / Lockscreen control check
    setLanguage(lang);"""

new_js = """    let codeReader = null;

    function showToast(message) {
      const toast = $('toast');
      toast.textContent = message;
      toast.classList.remove('hidden');
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
      }, 3000);
    }

    async function startCameraScan() {
      const errorMsg = $('cameraErrorMsg');
      errorMsg.classList.add('hidden');
      errorMsg.textContent = '';
      toggleModal('cameraModal', true);

      try {
        if (typeof ZXing === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          errorMsg.textContent = lang === 'ar' 
            ? 'المتصفح لا يدعم ميزة مسح الباركود عبر الكاميرا' 
            : (lang === 'ku' ? 'وێبگەڕەکە پشتگیری سکانی بارکۆد ناکات بە کامێرا' : 'Browser does not support camera barcode scanning.');
          errorMsg.classList.remove('hidden');
          return;
        }

        if (!codeReader) {
          codeReader = new ZXing.BrowserMultiFormatReader();
        }
        
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          throw new Error(lang === 'ar' ? 'لم يتم العثور على كاميرات متصلة بالجهاز' : (lang === 'ku' ? 'هیچ کامێرایەک نەدۆزرایەوە لەسەر ئامێرەکە' : 'No camera devices found.'));
        }

        let selectedDeviceId = videoInputDevices[0].deviceId;
        const rearCamera = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear') || 
          device.label.toLowerCase().includes('environment')
        );
        if (rearCamera) {
          selectedDeviceId = rearCamera.deviceId;
        }

        codeReader.decodeFromVideoDevice(selectedDeviceId, 'videoScan', (result, err) => {
          if (result) {
            $('prodBarcode').value = result.text;
            stopCameraScan();
            showToast(lang === 'ar' ? 'تم قراءة الباركود بنجاح!' : (lang === 'ku' ? 'بارکۆدەکە بە سەرکەوتوویی خوێندرایەوە!' : 'Barcode scanned successfully!'));
          }
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error('Scan error:', err);
          }
        });
      } catch (err) {
        console.error('Camera initialization failed:', err);
        errorMsg.textContent = err.message || (lang === 'ar' ? 'فشل الوصول إلى الكاميرا. يرجى التحقق من الأذونات.' : (lang === 'ku' ? 'گەیشتن بە کامێرا سەرکەوتوو نەبوو. تکایە مۆڵەتەکان بپشکنە.' : 'Failed to access camera. Please check permissions.'));
        errorMsg.classList.remove('hidden');
      }
    }

    function stopCameraScan() {
      if (codeReader) {
        codeReader.reset();
      }
      toggleModal('cameraModal', false);
    }

    // Auto load / Lockscreen control check
    setLanguage(lang);"""

if old_js in content:
    content = content.replace(old_js, new_js)
    print("JS camera functions added successfully in mobileServer.ts")
else:
    if "let codeReader = null;" in content:
        print("JS camera functions already added in mobileServer.ts")
    else:
        print("Warning: old_js marker not found in mobileServer.ts")

# Save updated mobileServer.ts
with open(r'electron\mobileServer.ts', 'w', encoding='utf-8') as f:
    f.write(content)

# 4. Extract HTML and write to scratch_mobile.html
match = re.search(r'function getMobileDashboardHtml\(\)\s*\{\s*return\s*`([\s\S]+?)`;\s*\}', content)
if match:
    html_content = match.group(1)
    # Unescape escaped template syntax for static offline html compatibility
    html_content = html_content.replace('\\${', '${').replace('\\`', '`')
    
    with open('scratch_mobile.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("scratch_mobile.html synchronized successfully from mobileServer.ts")
else:
    print("Error: Could not extract getMobileDashboardHtml content using regex!")
