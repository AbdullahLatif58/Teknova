import Head from 'next/head';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import Checkout1 from '../components/checkout/variation-1';
import Checkout2 from '../components/checkout/variation-2';
import Checkout3 from '../components/checkout/variation-3';

const checkouts = { 1: Checkout1, 2: Checkout2, 3: Checkout3 };

export default function CheckoutPage() {
  const { variation } = useTheme();
  const Checkout = checkouts[variation] || Checkout1;
  return (
    <>
      <Head><title>Checkout — Teknova</title></Head>
      <Layout>
        <div className="pt-20"><Checkout /></div>
      </Layout>
    </>
  );
}
