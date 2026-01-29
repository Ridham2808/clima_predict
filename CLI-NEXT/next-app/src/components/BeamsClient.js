'use client';

import { useEffect } from 'react';

export default function BeamsClient() {
    useEffect(() => {
        let isMounted = true;
        let scriptElement = null;

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            // Load Beams SDK dynamically
            scriptElement = document.createElement('script');
            scriptElement.src = "https://js.pusher.com/beams/2.1.0/push-notifications-cdn.js";
            scriptElement.async = true;
            scriptElement.onload = () => {
                if (isMounted && window.PusherPushNotifications) {
                    const beamsClient = new window.PusherPushNotifications.Client({
                        instanceId: '09dfb88d-7da8-48bc-8fd8-07d267383a1c',
                    });

                    beamsClient.start()
                        .then(() => {
                            if (isMounted) console.log('PWA: Beams SDK started.');
                            return beamsClient.addDeviceInterest('hello');
                        })
                        .then(() => {
                            if (isMounted) console.log('PWA: Successfully subscribed to Beams!');
                        })
                        .catch((error) => {
                            if (isMounted) {
                                console.error('PWA: Beams Registration Error:', error);
                                if (error.message.includes('push service error')) {
                                    console.warn('PWA: Push service is unavailable.');
                                }
                            }
                        });
                }
            };
            document.head.appendChild(scriptElement);
        }

        return () => {
            isMounted = false;
            // Optional: document.head.removeChild(scriptElement) might be too aggressive for dev reloads
        };
    }, []);

    return null;
}
