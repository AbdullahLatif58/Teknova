import Head from 'next/head';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import CartPage1 from '../components/cartpage/variation-1';
import CartPage2 from '../components/cartpage/variation-2';
import CartPage3 from '../components/cartpage/variation-3';

const carts = { 1: CartPage1, 2: CartPage2, 3: CartPage3 };

export default function CartPageRoute() {
  const { variation } = useTheme();
  const CartPage = carts[variation] || CartPage1;
  return (
    <>
      <Head><title>Cart — Teknova</title></Head>
      <Layout>
        <div className="pt-20"><CartPage /></div>
      </Layout>
    </>
  );
}
