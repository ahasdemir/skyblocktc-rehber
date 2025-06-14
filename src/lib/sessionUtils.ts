/**
 * Benzersiz bir session ID oluşturur veya mevcut olanı döndürür
 */
export function getSessionId(): string {
  // Tarayıcı ortamında olup olmadığımızı kontrol et
  if (typeof window === 'undefined') {
    return 'server-side';
  }
  
  // localStorage'da var mı kontrol et
  let sessionId = localStorage.getItem('skyblock_session_id');
  
  // Yoksa yeni oluştur
  if (!sessionId) {
    sessionId = generateUniqueId();
    localStorage.setItem('skyblock_session_id', sessionId);
  }
  
  return sessionId;
}

/**
 * Benzersiz bir tarayıcı parmak izi oluşturur
 */
function getBrowserFingerprint(): string {
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages = navigator.languages ? navigator.languages.join(',') : navigator.language;
  
  // Tarayıcı bilgilerinden bir parmak izi oluştur
  return btoa(`${userAgent}-${screenWidth}x${screenHeight}-${timeZone}-${languages}`).substring(0, 32);
}

/**
 * Rastgele benzersiz bir ID oluşturur
 */
function generateUniqueId(): string {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 8);
  const browserData = typeof window !== 'undefined' ? getBrowserFingerprint().substring(0, 8) : 'server';
  
  return `${timestamp}-${browserData}-${randomChars}`;
}

/**
 * Tarayıcı ve işletim sistemi bilgilerini elde et
 */
export function getBrowserInfo(): string {
  if (typeof window === 'undefined') {
    return 'Sunucu';
  }
  
  const ua = navigator.userAgent;
  let browserName = "Bilinmeyen Tarayıcı";
  let osName = "Bilinmeyen İşletim Sistemi";
  
  // Tarayıcı tespiti
  if (ua.indexOf("Firefox") > -1) {
    browserName = "Firefox";
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    browserName = "Opera";
  } else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) {
    browserName = "Edge";
  } else if (ua.indexOf("Chrome") > -1) {
    browserName = "Chrome";
  } else if (ua.indexOf("Safari") > -1) {
    browserName = "Safari";
  }
  
  // İşletim sistemi tespiti
  if (ua.indexOf("Windows") > -1) {
    osName = "Windows";
  } else if (ua.indexOf("Mac") > -1) {
    osName = "MacOS";
  } else if (ua.indexOf("Linux") > -1) {
    osName = "Linux";
  } else if (ua.indexOf("Android") > -1) {
    osName = "Android";
  } else if (ua.indexOf("iOS") > -1 || ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) {
    osName = "iOS";
  }
  
  return `${browserName} - ${osName}`;
}