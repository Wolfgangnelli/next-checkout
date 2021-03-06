import Layout from '../layout/layout'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import axios from 'axios'
import constants from '../constants';


declare var Stripe;


export default function Home() {
  const router = useRouter();
  const {code} = router.query;
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");


  useEffect(() => {
    setFirst_name("");
    setLast_name("");
    setEmail("");
    setAddress("");
    setCountry("");
    setCity("");
    setZip("");
    setQuantities([]);
  }, [])


  useEffect(() => {
   if(code !== undefined) {
     (
        async () => {
          const {data} = await axios.get(`${constants.endpoint}/links/${code}`);
           console.log(data);
          setUser(data.user);
          setProducts(data.products);
          setQuantities(data.products.map(p => (
            {
              product_id: p.id,
              quantity: 1
            }
          )))
        }
     )();
   }
  }, [code])

  const handleChange = (quantity: number, id: number) => {
     setQuantities(quantities.map(q => {
        if(q.product_id === id) {
          return {
            ...q,
            quantity
          }
        }
        return q;
      }))
  }

  const total = () => {

    return quantities.reduce((s, q) => {
      const product = products.find(p => p.id === q.product_id);
      return s + q.quantity * product.price;
       
    }, 0)
  }

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
  
     const {data} = await axios.post(`${constants.endpoint}/orders`, {
        code,
        first_name,
        last_name,
        email,
        address,
        city,
        country,
        zip,
        products: quantities
      })

      const stripe = new Stripe(constants.stripe_key);

      //ridireziono al checkout
      stripe.redirectToCheckout({
        sessionId: data.id
      });
  }


  return (
    <Layout>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-10 text-center">
        <div>
        <h1 className="text-6xl font-bold">
          Welcome
        </h1>
          <p>{user?.first_name} {user?.last_name}, has invited you to buy these products!</p>
        </div>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 m-4 mx-auto p-10 rounded shadow-xl bg-white">
        <div className="md:row-start-1 md:row-end-2 md:col-start-2 md:col-end-3 md:ml-4 mb-8 md:mb-0 bg-white">
          <p className="text-gray-800 font-medium">Products</p>
            <div className="rounded shadow-xl">
              {products.map(product => {
                return (
              <div key={product.id} className="p-2">
                <div className="flex justify-between items-center">
                  <div className="p-1 flex flex-col items-start text-left">
                  <h6 className="font-medium">{product.title}</h6>
                <span><small>{product.description}</small></span>
                  </div>
                <p className="p-1">${product.price}</p>
                </div>
                <div className="flex p-1 justify-between items-center">
                  <h6 className="font-medium mr-1">Change quantity: </h6>
                  <input onChange={(e) => handleChange(+e.target.value, product.id)} className="w-16 px-1 py-1 text-gray-700 bg-gray-200 rounded" type="number" name="quantity" id="quantity" min="1" defaultValue="1" />
                </div>
                <div className="border-b bg-gray-200"></div>
              </div>
                )
              })}           
              <div className="flex justify-between p-2">
                <p>Total (USD)</p>
              <p className="font-semibold">${total()}</p>
              </div>
            </div>
          </div>
   
          <div className="md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-2 bg-white">
              <p className="text-gray-800 font-medium">Customer information</p>
            <div>
            <form className="max-w-xl m-4 p-8 bg-white rounded shadow-xl" onSubmit={submit}>
              <div className="">
                <label className="block text-sm text-gray-00" htmlFor="first_name">First name</label>
                <input onChange={(e) => setFirst_name(e.target.value)} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="first_name" name="first_name" type="text" placeholder="Your Name" aria-label="FirstName" required />
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-00" htmlFor="last_name">Last name</label>
                <input onChange={(e) => setLast_name(e.target.value)} className="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" id="last_name" name="last_name" type="text" placeholder="Your Surname" aria-label="LastName" required />
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-600" htmlFor="email">Email</label>
                <input onChange={(e) => setEmail(e.target.value)} className="w-full px-5  py-4 text-gray-700 bg-gray-200 rounded" id="email" name="email" type="text" placeholder="you@example.com" aria-label="Email" required />
              </div>
              <div className="mt-2">
                <label className=" block text-sm text-gray-600" htmlFor="address">Address</label>
                <input onChange={(e) => setAddress(e.target.value)} className="w-full px-2 py-2 text-gray-700 bg-gray-200 rounded" id="address" name="address" type="text" placeholder="Street" aria-label="Address" required />
              </div>
              <div className="mt-2">
                <label className="text-sm block text-gray-600" htmlFor="city">City</label>
                <input onChange={(e) => setCity(e.target.value)} className="w-full px-2 py-2 text-gray-700 bg-gray-200 rounded" id="city" name="city" type="text" placeholder="City" aria-label="City" required />
              </div>
              <div className="inline-block mt-2 w-1/2 pr-1">
                <label className="block text-sm text-gray-600" htmlFor="country">Country</label>
                <input onChange={(e) => setCountry(e.target.value)} className="w-full px-2 py-2 text-gray-700 bg-gray-200 rounded" id="country" name="country" type="text" placeholder="Country" aria-label="Country" required />
              </div>
              <div className="inline-block mt-2 -mx-1 pl-1 w-1/2">
                <label className="block text-sm text-gray-600" htmlFor="zip">Zip</label>
                <input onChange={(e) => setZip(e.target.value)} className="w-full px-2 py-2 text-gray-700 bg-gray-200 rounded" id="zip"  name="zip" type="text"  placeholder="Zip" aria-label="Zip" required />
              </div>
{/*               <p className="mt-4 text-gray-800 font-medium">Payment information</p>
              <div className="">
                <label className="block text-sm text-gray-600" htmlFor="credit_card">Card</label>
                <input className="w-full px-2 py-2 text-gray-700 bg-gray-200 rounded" id="credit_card" name="credit_card" type="text" placeholder="Card Number MM/YY CVC" aria-label="Name" required />
              </div> */}
              <div className="mt-4">
                <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded" type="submit">Checkout</button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </main>
      </Layout>
  )
}
