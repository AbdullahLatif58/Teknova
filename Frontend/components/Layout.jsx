import { useTheme } from '../context/ThemeContext';
import HeaderV1 from './header/variation-1';
import HeaderV2 from './header/variation-2';
import HeaderV3 from './header/variation-3';
import FooterV1 from './footer/variation-1';
import FooterV2 from './footer/variation-2';
import FooterV3 from './footer/variation-3';

const headers = { 1: HeaderV1, 2: HeaderV2, 3: HeaderV3 };
const footers = { 1: FooterV1, 2: FooterV2, 3: FooterV3 };

export default function Layout({ children }) {
  const { variation } = useTheme();
  const Header = headers[variation] || HeaderV1;
  const Footer = footers[variation] || FooterV1;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
