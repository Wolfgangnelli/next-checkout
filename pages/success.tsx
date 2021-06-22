import axios from 'axios';
import { useRouter } from 'next/router';
import React, {useEffect} from 'react'
import Layout from '../layout/layout'
import constants from '../constants';

declare var Stripe;

const Success = () => {
    const router = useRouter();
    const {source} = router.query;

    useEffect(() => {
      if(source !== undefined) {
        (
            async () => {
              const {data} = await axios.post(`${constants.endpoint}/orders/confirm`, {
                    source
                })
                console.log(data);
            }
        )();
      }
    }, [source])
    return (
        <Layout>
            <div className="min-h-screen text-center">
                <h2 className="text-6xl font-bold">
                Success
                </h2>
                <p>Your process has been completed!</p>
            </div>
        </Layout>
    )
}

export default Success
