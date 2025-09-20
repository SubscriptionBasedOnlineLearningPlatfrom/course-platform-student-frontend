import React from 'react'
import { useNavigate } from 'react-router-dom';


const Subscription = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#0173d1] to-[#85c1f3] bg-clip-text text-transparent">
              Choose your plan
            </h1>
            <p className="text-gray-600 mt-1">
              Get unlimited learning with a membership, or upgrade when you need more.
            </p>
          </div>

          
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900">Basic</h3>
              <p className="text-sm text-gray-600 mt-1">Great for trying things out</p>
            </div>

            <div className="mb-4">
              <span className="text-4xl font-extrabold text-gray-900">lkr 9</span>
              <span className="ml-1 text-sm text-gray-500">/mo</span>
            </div>

            <div className="h-px bg-gray-200/70 my-2" />

            <ul className="mt-3 space-y-2 text-sm text-gray-700 flex-1">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7" />
                </svg>
                Access to selected courses
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7" />
                </svg>
                Community forum
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7" />
                </svg>
                Email support
              </li>
            </ul>

            <div className="mt-6">
                {/* /courses/:courseId/content */}
              <button onClick={() => navigate('/courses/2/content')} className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow cursor-pointer">
                Choose Basic
              </button>
              
            </div>
          </div>

          {/* Pro (Popular) */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-white/50 p-6 flex flex-col ring-2 ring-blue-200">
            <span className="absolute -top-3 left-6 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow">
              Popular
            </span>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900">Pro</h3>
              <p className="text-sm text-gray-600 mt-1">Everything you need to learn fast</p>
            </div>

            <div className="mb-4">
              <span className="text-4xl font-extrabold text-gray-900">lkr 19</span>
              <span className="ml-1 text-sm text-gray-500">/mo</span>
            </div>

            <div className="h-px bg-gray-200/70 my-2" />

            <ul className="mt-3 space-y-2 text-sm text-gray-700 flex-1">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7" />
                </svg>
                All current courses
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7" />
                </svg>
                Quizzes & assignments
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7" />
                </svg>
                Certificate on completion
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7" />
                </svg>
                Priority support
              </li>
            </ul>

            <div className="mt-6">
              {/* Example of current plan (visual state only)  original /courses/:courseId/content */}
              <button onClick={() => navigate('/courses/2/content')} className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow cursor-pointer"> 
                Choose Pro  
              </button>
            </div>
          </div>

        </div> 

        {/* Info blocks */}
        <div className="mt-10 grid md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white/70 rounded-2xl p-5 border border-white/30">
            <p className="font-semibold text-gray-800">What’s included?</p>
            <p className="text-gray-600 mt-1">
              Subscriptions grant access while active. You can switch plans or cancel before renewal.
            </p>
          </div>
          <div className="bg-white/70 rounded-2xl p-5 border border-white/30">
            <p className="font-semibold text-gray-800">Billing</p>
            <p className="text-gray-600 mt-1">
              Yearly plans are billed upfront at a discount. Prices shown are totals for the selected cycle.
            </p>
          </div>
          <div className="bg-white/70 rounded-2xl p-5 border border-white/30">
            <p className="font-semibold text-gray-800">Invoices & tax</p>
            <p className="text-gray-600 mt-1">
              We provide invoices after checkout. Taxes may apply based on your location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription