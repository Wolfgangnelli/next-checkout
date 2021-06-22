import React from 'react'
import Layout from '../layout/layout'

const error = () => {
    return (
        <Layout>
        <div className="min-h-screen text-center">
            <h2 className="text-6xl font-bold">
            Error
            </h2>
            <p>Couldn't process payment!</p>
        </div>
    </Layout>
    )
}

export default error
