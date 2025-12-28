// Service Worker Registration
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available
                  console.log('New content available; please refresh.');
                  
                  // Show update notification
                  if (window.confirm('New version available! Refresh to update?')) {
                    window.location.reload();
                  }
                } else {
                  // Content cached for offline use
                  console.log('Content cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    return Notification.requestPermission();
  }
  return Promise.reject('Notifications not supported');
}

// Subscribe to push notifications
export async function subscribeToPushNotifications() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      });
      
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      throw error;
    }
  }
  throw new Error('Push notifications not supported');
}

// Helper function
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
