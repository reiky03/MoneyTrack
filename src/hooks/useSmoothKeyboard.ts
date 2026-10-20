import { useEffect } from 'react';
import { Keyboard, Platform, UIManager, LayoutAnimation } from 'react-native';

// Enable layout animation on Android if available
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  try {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  } catch {
    // Ignore if not supported in current environment
  }
}

/**
 * Hook to provide butter-smooth ease-in-out layout transitions
 * whenever the mobile soft keyboard opens or closes.
 */
export function useSmoothKeyboard() {
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      try {
        LayoutAnimation.configureNext({
          duration: 250,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
      } catch {
        // Fallback gracefully
      }
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      try {
        LayoutAnimation.configureNext({
          duration: 220,
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
          },
        });
      } catch {
        // Fallback gracefully
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
}
