import { useState } from 'react';
import Layout from '../components/Layout';

export default function TestHooks() {
  const [count, setCount] = useState(0);
  return (
    <Layout>
      <div className="pt-40 text-center">
        <h1 className="text-2xl font-bold">Hook Test Page</h1>
        <p className="mt-4">Count: {count}</p>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Increment
        </button>
      </div>
    </Layout>
  );
}
