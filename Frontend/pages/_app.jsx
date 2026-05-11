import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { CartProvider } from '../context/CartContext';
import CartSidebar from '../components/cartsidebar/variation-1';
import VoiceAssistant from '../components/voiceassistant/index';
import ThemeSwitcher from '../components/themeswitcher/index';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <Component {...pageProps} />
        <CartSidebar />
        <VoiceAssistant />
        <ThemeSwitcher />
      </CartProvider>
    </ThemeProvider>
  );
}
