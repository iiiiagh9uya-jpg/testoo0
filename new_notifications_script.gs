/**
 * سكريبت إشعارات الدليل الإرشادي - نسخة منفصلة
 * يتم وضعه في Google Apps Script المرتبط بجدول الإشعارات الجديد
 */

// إعدادات Firebase (سيتم استبدالها ببيانات مشروعك)
const FIREBASE_CONFIG = {
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com/",
  secret: "YOUR_FIREBASE_SECRET"
};

/**
 * دالة تعمل تلقائياً عند تعديل الجدول أو إضافة بيانات
 * تقوم بإرسال إشعار لحظي إلى Firebase
 */
function onFormSubmit(e) {
  sendNotificationToFirebase();
}

/**
 * دالة يدوية لإرسال إشعار (يمكن استدعاؤها من زر في الجدول)
 */
function sendNotificationToFirebase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0];
  const lastRow = sheet.getLastRow();
  
  // جلب بيانات آخر إشعار (نفترض أن الاسم في العمود A والمنطقة في B)
  const name = sheet.getRange(lastRow, 1).getValue();
  const region = sheet.getRange(lastRow, 2).getValue();
  const timestamp = new Date().getTime();

  const data = {
    "lastNotification": {
      "name": name,
      "region": region,
      "timestamp": timestamp,
      "message": "قام الباحث " + name + " بإرسال تقريره اليومي - " + region
    }
  };

  const options = {
    "method": "patch",
    "contentType": "application/json",
    "payload": JSON.stringify(data)
  };

  try {
    const url = FIREBASE_CONFIG.databaseURL + ".json?auth=" + FIREBASE_CONFIG.secret;
    UrlFetchApp.fetch(url, options);
    Logger.log("✅ تم إرسال الإشعار لـ Firebase بنجاح");
  } catch (e) {
    Logger.log("❌ خطأ في الإرسال: " + e.toString());
  }
}

/**
 * دالة لاستقبال طلبات الويب (إذا أردت إرسال إشعار عبر رابط)
 */
function doGet(e) {
  sendNotificationToFirebase();
  return ContentService.createTextOutput("Notification Sent!");
}
