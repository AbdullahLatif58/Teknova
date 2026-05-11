import axios from "axios";

const BASE_URL = "http://localhost:4000";

const endpoints = [
  { method: "GET", path: "/auth/users" },
  { method: "GET", path: "/categories" },
  { method: "GET", path: "/products" },
  { method: "GET", path: "/products/featured" },
  { method: "GET", path: "/products/new" },
  { method: "GET", path: "/orders" },
];

async function checkApis() {
  console.log("Checking live APIs to see what is broken...");
  let broken = 0;

  for (const { method, path } of endpoints) {
    try {
      const res = await axios({ method, url: `${BASE_URL}${path}`, timeout: 3000 });
      console.log(`✅ [SUCCESS] ${method} ${path} (Status: ${res.status})`);
    } catch (err: any) {
      broken++;
      if (err.response) {
        console.log(`❌ [FAILED] ${method} ${path} -> Status: ${err.response.status}, Data:`, err.response.data);
      } else {
        console.log(`❌ [FAILED] ${method} ${path} -> Error: ${err.message}`);
      }
    }
  }

  if (broken === 0) {
    console.log(`\nAll ${endpoints.length} test endpoints responded successfully!`);
  } else {
    console.log(`\nFound ${broken} failing endpoints.`);
  }
}

checkApis();
