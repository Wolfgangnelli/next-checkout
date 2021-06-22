import React from 'react'
import Head from 'next/head'


const layout = (props: any) => {
    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>Checkout</title>
                <link rel="icon" href="/favicon.ico" />
                <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"></link>
                <script src="https://js.stripe.com/v3/"></script>
            </Head>
            <div className="container bg-gray-50">
                {props.children}
            </div>
                <footer className="flex items-center justify-center w-full h-24 border-t">
                    <p>Footer</p>
                </footer>
    </div>
    )
}

export default layout
