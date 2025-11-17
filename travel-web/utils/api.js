// utils/api.js atau di component
async function getHello() {
  const res = await fetch('https://projecttripgo-production.up.railway.app/api/hello');
  const data = await res.json(); // ubah response jadi JSON
  console.log(data.message); // Output: "Hello from Laravel"
}

getHello();
