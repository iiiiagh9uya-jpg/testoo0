/**
 * سكريبت إشعارات الدليل الإرشادي - نسخة احترافية (Service Account)
 * يتم وضعه في Google Apps Script المرتبط بجدول الإشعارات
 */

const FIREBASE_SETTINGS = {
  databaseURL: "https://notificationsfirebase-9a183-default-rtdb.firebaseio.com/",
  // بيانات المفتاح الخاص الذي أرسلته
  serviceAccount: {
    "project_id": "notificationsfirebase-9a183",
    "client_email": "firebase-adminsdk-fbsvc@notificationsfirebase-9a183.iam.gserviceaccount.com",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCgoNUkS25R3HYF\nPh57KIUKFSZz3I7dI19CDfShlJTYwTcDaVPsld0eGq+q6doLACFXV5/EENcM/PDA\nAVpX924eYhZbqExss8gR4PyP+/iRio57zx9SFlup7w8RPKpXYaTUWvSKsYnU+E+l\nXDK08Rm1WcOCLXkIIViu2T46cT900Ytwmo2EmFTfdaXHwtWkRwpBV6FmcL6jU5u/\nss1mDS6d0a3NRji4dZqCKb+U6Gf/JrDXnTSIfqDEPa9AH1Ym1624uL/KCnFQwJTe\nuVKUsHO0pPHmeN3JS6RYI8QfCEvjdC4Pv4QafLGJZaEJ/0OJBcbFAhawdKTq0Cq9\nLo4bhvaDAgMBAAECggEAFIWX1aRBevn0piTSlh+OJ8Sd/g1+vygGwpSv3XjzL2I4\nGhp5228mKfN04BwyfFdO6y7Jva39G66xP4asuTJmgkE75Afzg6vQcuBQxECH+GhA\nXfcPZFhw65wcS7J5fOJ/wZXBSnr2RhxXaKQH4nAvPakzPk16+hvwjZ45whO37L+o\nzYl136p4JSvnFzPARs5hx60qMwo84uM0S9U0czP+ywwjOxSago2kb33i4XuPWaXE\n2Mkj56nL/sBKe46BojDBj648JploPe/+17fpX8MNIJvqwLZ2f30Vl2TPBtClqj4h\ndu5bq60DMEqzeMCjXBeYMx03Qh4aQGLejv/P/LRVWQKBgQDeOTOwfmWByjFmptoX\nsSdH+ygTQLh8jbsdjjg9/l0a3+2/YdCo6IRb1pXvYby8FkRvAvlF+XpXRdRGipYK\ndMRhUV/JNDscI2FdLd9d24qS1KfF51WS8VMPEeJNBfdrCD/qqmtgWrsRCSKPt0Fm\nr3PGkwBrmeasffw4nVCW+NlilwKBgQC5CvBAocgQdP5oEIasz5tiVGeSTJjcRH5/\nwF5Uz9dlX9CZidMh1MS6jcm8OTX68DfR6T95QBz4m4pcdBOjqui3P4PlGgcDgJag\nDNuDLf2VrBJ4oKf6pfbG2gKHths6eTBMKzZH02zoxQ7SuTF97KZyN2fOZDPjAg7l\nImS1HADE9QKBgQCJCGMMedTkZSdzcn5YT8C2TXUX8jgRbmCtSA78g4csVFvKQWon\nTkKYU0nf9Lgqj9yhTAclFENR39iXq0v8pKaYkFJtw0yT/GlEyU3NFd1sz7+pdQ66\n7x9V0qRm9L/ue4bWkUJnh2uFhMmQL+Qfix/smqeOsrehNIs86h1RC6EZfwKBgHwN\neUPbMeTWijf53E++Xs1tCIJsF46T3LqInLT/Icg0lARbAdCMc9cdd0FYmXfB06pG\nVOdUtBd3LysMJp5y1dEEI8hTyp/udQyXkhI/ouHUmg2EpxjCas6lGU0iKN7qoBZw\nYdOFSl5Cvc1HmoZxQKURv+X+B0sI9jNm+1zviRSBAoGBALBiPOq6WhREDx8wvzYa\nNiYNFTQ5hF59W1zu2INEwyAl0oWYplxxn4ujwL6ipP7Pz54iWBJnpggD+4vYv9VV\ndkberVjQd54lTqsN06MdBL0EqRfAi5Yg0n8ugG0ZxwfCP1VLLNWnCgfF1HF61jRU\nVyKc1le5EbM5Yvdx/QAdeSPb\n-----END PRIVATE KEY-----\n"
  }
};

/**
 * دالة لإرسال الإشعار فور إضافة بيانات للجدول
 */
function onFormSubmit(e) {
  sendNotification();
}

function sendNotification() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    const lastRow = sheet.getLastRow();
    
    // جلب البيانات من آخر سطر
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

    // استخدام مكتبة FirebaseApp (يجب إضافتها للمشروع) أو REST API مباشرة
    // هنا سنستخدم REST API مع التوثيق اليدوي لتبسيط الأمر
    
    const url = FIREBASE_SETTINGS.databaseURL + ".json";
    
    const options = {
      "method": "patch",
      "contentType": "application/json",
      "payload": JSON.stringify(payload)
    };

    // ملاحظة: بما أنك في وضع الاختبار حالياً، سيعمل هذا الكود مباشرة.
    // إذا قمت بتفعيل الحماية، ستحتاج لاستخدام OAuth2 للتوثيق.
    UrlFetchApp.fetch(url, options);
    
    Logger.log("✅ تم إرسال الإشعار بنجاح لـ Firebase");
  } catch (error) {
    Logger.log("❌ خطأ: " + error.toString());
  }
}
