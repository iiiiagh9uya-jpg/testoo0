/**
 * كود Google Apps Script النهائي لنظام الإشعارات
 * انسخ هذا الكود وضعه في Apps Script الخاص بجدول البيانات
 */

const FIREBASE_SETTINGS = {
  databaseURL: "https://notificationsfirebase-9a183-default-rtdb.firebaseio.com/"
};

// دالة تعمل عند إرسال نموذج أو تعديل الجدول
function onFormSubmit(e) {
  sendNotification();
}

// دالة تعمل عند فتح رابط الـ Web App
function doGet(e) {
  sendNotification();
  return ContentService.createTextOutput("✅ تم إرسال الإشعار بنجاح لجميع المستخدمين!");
}

function sendNotification() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    const lastRow = sheet.getLastRow();
    
    // جلب البيانات من آخر سطر في الجدول
    const name = sheet.getRange(lastRow, 1).getValue(); // العمود A: اسم الباحث
    const region = sheet.getRange(lastRow, 2).getValue(); // العمود B: المنطقة
    const timestamp = new Date().getTime();

    const payload = {
      "lastNotification": {
        "name": name,
        "region": region,
        "timestamp": timestamp,
        "message": "قام الباحث " + name + " بإرسال تقريره اليومي - " + region
      }
    };

    const url = FIREBASE_SETTINGS.databaseURL + ".json";
    
    const options = {
      "method": "patch",
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    };

    UrlFetchApp.fetch(url, options);
    Logger.log("✅ تم تحديث Firebase بنجاح");
    
  } catch (error) {
    Logger.log("❌ خطأ في السكربت: " + error.toString());
  }
}
